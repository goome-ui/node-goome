"use strict";
const test = require("node:test");
const assert = require("node:assert");
const path = require("path");
const { fnv, hex, runC, needC } = require("./util");
const goome = require("..");

const DRAW_HASH = "5858302d";

const frameHash = (f) => hex(fnv(f.pixels, f.w, f.h, f.stride));

function draw(g) {
  const c = g.begin(0);
  c.rect(10, 10, 20, 20, 0x80ff0000);
  c.circle(120, 50, 30, 0xff3a7afe);
  c.rrect(40, 60, 70, 30, 8, 0xcc20c060);
  c.text(44, 66, "offscreen", 0xffffffff);
  c.hit(10, 10, 20, 20);
  g.end(c);
}

function uiRun(g) {
  const u = g.ui();
  u.theme.update({ animMs: 0, font: null, fontSize: 14 });
  const win = { x: 6, y: 6, w: 180, h: 0 };
  let check = false, val = 0.25, name = "hi";
  for (let frame = 0; frame < 6; frame++) {
    if (frame === 1) g.pushClick(25, 64);
    if (frame === 2) {
      g.push(goome.DOWN, { x: 90, y: 168, button: 1 });
      g.push(goome.UP, { x: 90, y: 168, button: 1 });
    }
    if (frame === 3) g.pushText("z");
    for (const ev of g.events(0)) u.feed(ev);
    u.frame(0, () => {
      u.window("engine", win, goome.WIN_MOVE, () => {
        check = u.checkbox("Check", check);
        val = u.slider("Val", val, 0, 1, "%.2f");
        name = u.input("Name", name, 32);
      });
    });
  }
  u.close();
  return { check, name };
}

const open = () => goome.openOffscreen(200, 200, 2, { title: "engine" });

test("offscreen basics", () => {
  const g = open();
  assert.strictEqual(g.backendName, "offscreen");
  assert.strictEqual(g.mode, goome.MODE_OFFSCREEN);
  assert.ok(g.can(goome.CAP_CLIPBOARD) && g.can(goome.CAP_CURSOR) && !g.can(goome.CAP_WINDOW));
  const m = g.monitors()[0];
  assert.deepStrictEqual([m.area.w, m.area.h, m.scale, m.pw, m.name], [200, 200, 2, 400, "engine"]);
  assert.throws(() => g.lastFrame(), goome.Again);
  draw(g);
  const f = g.lastFrame();
  assert.deepStrictEqual([f.w, f.h, f.stride, f.area.w], [400, 400, 400, 200]);
  assert.strictEqual(f.pixel(25, 25), 0x80800000);
  assert.strictEqual(f.pixels[0], 0);
  assert.strictEqual(g.alphaAt(15, 15), 0x80);
  const kept = f.copy();
  g.begin(0);
  assert.ok(!f.fresh);
  assert.throws(() => f.pixels, goome.Gone);
  assert.strictEqual(kept[25 * 400 + 25], 0x80800000);
  g.close();
});

test("offscreen frames hash the same as C", (t) => {
  const g = open();
  draw(g);
  const got = frameHash(g.lastFrame());
  const { check, name } = uiRun(g);
  const ui = frameHash(g.lastFrame());
  const hit = g.hit(10, 10);
  g.close();
  assert.strictEqual(got, DRAW_HASH);
  assert.deepStrictEqual([check, name, hit], [true, "hiz", true]);
  if (!needC(t)) return;
  const out = runC(path.join(__dirname, "frame.c"));
  const lines = Object.fromEntries(out.trim().split(/\r?\n/).map((l) => [l.slice(0, l.indexOf(" ")), l.slice(l.indexOf(" ") + 1)]));
  assert.strictEqual(lines.draw, got);
  assert.strictEqual(lines.ui, `${ui} 1 hiz 1`);
});

test("hit rects", () => {
  const g = open();
  draw(g);
  assert.ok(g.hit(15, 15) && g.hit(10, 10));
  assert.ok(!g.hit(9.5, 15) && !g.hit(30, 30));
  const c = g.begin(0);
  c.hit(0, 0, 4, 4);
  g.end(c, [[100, 100, 5, 5]]);
  assert.ok(g.hit(102, 102) && g.hit(1, 1));
  assert.ok(!g.hit(15, 15));
  g.close();
});

test("push and poll", () => {
  const g = open();
  g.push(goome.DOWN, { x: 12, y: 13, button: 1 });
  g.push(new goome.Event({ type: goome.KEY, key: 113, text: "q" }));
  const evs = [...g.events(0)];
  assert.deepStrictEqual(evs.map((e) => e.type), [goome.DOWN, goome.KEY]);
  assert.deepStrictEqual([evs[0].x, evs[0].y, evs[1].text], [12, 13, "q"]);
  const t = goome.nowMs();
  assert.strictEqual(g.poll(200), null);
  assert.ok(goome.nowMs() - t < 100);
  g.close();
});

test("frame copy, dirty and resize", () => {
  const g = open();
  draw(g);
  const d = g.frameDirty();
  assert.deepStrictEqual(d, { x: 0, y: 0, w: 400, h: 400 });
  assert.strictEqual(g.frameDirty(), null);
  const f = g.lastFrame();
  const rgba = g.frameCopy(null, { format: goome.FMT_RGBA });
  assert.strictEqual(rgba.length, 400 * 400 * 4);
  const bgra = g.frameCopy(null, { rect: [20, 20, 4, 4] });
  assert.strictEqual(new Uint32Array(bgra.buffer)[0], f.pixel(20, 20));
  const p = 25 * 400 + 25;
  assert.deepStrictEqual([...rgba.subarray(p * 4, p * 4 + 4)], [255, 0, 0, 128]);
  assert.throws(() => g.frameCopy(new Uint8Array(10)), RangeError);
  g.resize(100, 50, 1);
  assert.deepStrictEqual([g.monitors()[0].area.w, g.monitors()[0].area.h], [100, 50]);
  g.close();
});
