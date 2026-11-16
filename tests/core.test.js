"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { ROOT, tmpdir } = require("./util");
const goome = require("..");

test("combos", () => {
  assert.deepStrictEqual(goome.parseCombo("alt+h"), { key: 104, mods: goome.ALT });
  assert.deepStrictEqual(goome.parseCombo("Ctrl+Shift+F5"), { key: goome.K_F1 + 4, mods: goome.CTRL | goome.SHIFT });
  assert.deepStrictEqual(goome.parseCombo("alt+?"), { key: 47, mods: goome.ALT | goome.SHIFT });
  assert.deepStrictEqual(goome.parseCombo("super+space"), { key: 32, mods: goome.SUPER });
  assert.deepStrictEqual(goome.parseCombo("cmd+left"), { key: goome.K_LEFT, mods: goome.SUPER });
  assert.deepStrictEqual(goome.parseCombo("H"), { key: 104, mods: goome.SHIFT });
  for (const c of ["alt+", "alt+f13", ""]) assert.throws(() => goome.parseCombo(c), goome.GoomeError);
});

test("pacer and clock", () => {
  const p = new goome.Pacer(50);
  assert.strictEqual(p.wait(), 0);
  const w = p.wait();
  assert.ok(w > 0 && w <= 20, String(w));
  const t = goome.nowMs();
  assert.ok(t >= 0 && goome.nowMs() >= t);
});

const SCRIPT = "screen 640x360 2; 1 click 20,20; 1 click 300,300; 2 hotkey alt+j; 3 key Hi\\b; 4 send ping; 5 scroll 30,30 -1; 6 hold 25,25 8; end 10";

test("scripted run on the test backend", () => {
  const g = goome.open({ title: "t", backend: "test", testScript: SCRIPT });
  assert.strictEqual(g.backendName.split(" ")[0], "test");
  const mons = g.monitors();
  assert.strictEqual(mons.length, 1);
  assert.deepStrictEqual([mons[0].area.w, mons[0].scale, mons[0].pw], [640, 2, 1280]);
  g.hotkey("alt+j", 7);
  g.keyboard(true);
  const n = { down: 0, up: 0, hot: 0, keys: 0, ctl: 0, scroll: 0, held: 0 };
  let text = "", quit = false, frames = 0;
  while (!quit && frames < 100) {
    const c = g.begin(0);
    assert.ok(c);
    assert.deepStrictEqual([c.scale, c.w], [2, 1280]);
    c.rect(10, 10, 40, 40, 0xff336699).hit(10, 10, 40, 40);
    g.end(c);
    assert.ok(!c.valid);
    frames++;
    const p = g.pointer();
    if (p && p.buttons) n.held++;
    for (const ev of g.events(1)) {
      if (ev.type === goome.DOWN) n.down++;
      else if (ev.type === goome.UP) n.up++;
      else if (ev.type === goome.HOTKEY && ev.id === 7) n.hot++;
      else if (ev.type === goome.KEY) n.keys++, (text += ev.text);
      else if (ev.type === goome.CONTROL && ev.msg === "ping") n.ctl++;
      else if (ev.type === goome.SCROLL && ev.dy === -1) n.scroll++;
      else if (ev.type === goome.QUIT) quit = true;
      assert.ok(ev.name);
    }
  }
  assert.deepStrictEqual([n.down, n.up, n.hot, n.keys, text, n.ctl, n.scroll], [2, 2, 1, 3, "Hi", 1, 1]);
  assert.ok(quit);
  assert.ok(n.held >= 1);

  const img = g.capture(0, [10, 10, 40, 40]);
  assert.deepStrictEqual([img.w, img.h, img.hasSelf], [80, 80, true]);
  assert.strictEqual(img.pixel(0, 0), 0xff336699);
  assert.strictEqual(img.pixels[0], 0xff336699);
  assert.strictEqual(img.row(79)[79], img.pixel(79, 79));
  const kept = img.copy();
  assert.strictEqual(kept.length, 80 * 80);
  assert.strictEqual(kept[0], 0xff336699);
  assert.strictEqual(g.alphaAt(20, 20), 255);
  assert.strictEqual(g.alphaAt(200, 200), 0);
  const again = g.capture(0);
  assert.ok(!img.fresh);
  assert.throws(() => img.pixels, goome.Gone);
  assert.deepStrictEqual([again.w, again.h], [1280, 720]);
  const d = tmpdir();
  const p = path.join(d, "grab.ppm");
  again.savePpm(p);
  assert.strictEqual(fs.readFileSync(p).subarray(0, 2).toString(), "P6");
  fs.rmSync(d, { recursive: true, force: true });
  g.close();
  assert.ok(g.closed);
  assert.throws(() => g.monitors(), goome.Gone);
  assert.ok(!again.fresh);
});

test("errors", () => {
  assert.throws(() => goome.open({ backend: "nope" }), RangeError);
  assert.throws(() => goome.open({ backend: "test", testFrames: path.join(ROOT, "no", "such", "frames") }), (e) => e instanceof goome.NoDisplay && e.code === goome.ENODISPLAY);
  assert.ok(goome.strerror(goome.ENOTSUP));
  assert.ok(new goome.Again(goome.EAGAIN) instanceof goome.GoomeError);
});

test("close twice", () => {
  const g = goome.open({ backend: "test", testScript: "end 3" });
  const c = g.begin(0);
  g.close();
  g.close();
  assert.ok(!c.valid);
  assert.throws(() => c.rect(0, 0, 1, 1, 0xffffffff), goome.Gone);
  assert.throws(() => g.poll(), goome.Gone);
});

test("frame helper and no state dir", () => {
  const g = goome.open({ backend: "test", testScript: "end 3" });
  assert.strictEqual(g.controlPath, null);
  let kept;
  g.frame(0, (c) => {
    kept = c;
    c.rect(0, 0, 10, 10, 0xffff0000).hit(0, 0, 10, 10);
  });
  assert.ok(!kept.valid);
  assert.strictEqual(g.alphaAt(5, 5), 255);
  g[Symbol.dispose || Symbol.for("nodejs.dispose")]();
  assert.ok(g.closed);
});

test("control fifo", (t) => {
  const d = tmpdir();
  let g;
  try {
    g = goome.open({ backend: "test", stateDir: d, testScript: "end 50" });
  } catch (e) {
    fs.rmSync(d, { recursive: true, force: true });
    return t.skip("no state dir here");
  }
  try {
    if (!g.controlPath) return t.skip("no control fifo on this os");
    goome.send(d, "hello there");
    let got = null;
    for (let i = 0; i < 40 && !got; i++) {
      g.frame(0, () => {});
      for (const ev of g.events(5)) if (ev.type === goome.CONTROL) got = ev.msg;
    }
    assert.strictEqual(got, "hello there");
  } finally {
    g.close();
    fs.rmSync(d, { recursive: true, force: true });
  }
});
