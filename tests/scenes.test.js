"use strict";
const test = require("node:test");
const assert = require("node:assert");
const path = require("path");
const { DATA, data, fnv, hex, runC, needC } = require("./util");
const goome = require("..");

const ANIM = ["0226f2f5", "906d3ce5", "db5848ad", "12bea72d"];
const EMOJI = ["3bab3875", "85fe883a", "d3add387", "b79518dd", "49a72d7d", "469719e1"];
const IME = { 1: "2e20540f", 2: "ceafcbad", 4: "c9c1add5" };

let cOut = null;
function fromC() {
  if (cOut == null) {
    const out = runC(path.join(__dirname, "scenes.c"), [], [DATA]);
    cOut = {};
    for (const line of out.trim().split(/\r?\n/)) {
      const [k, ...rest] = line.trim().split(" ");
      cOut[k] = rest;
    }
  }
  return cOut;
}

const frameHash = (g) => {
  const f = g.lastFrame();
  return hex(fnv(f.pixels, f.w, f.h, f.stride));
};

const testWindow = (script, w = 300, h = 200) => goome.open({ backend: "test", mode: "window", width: w, height: h, testScript: script });

function animScene() {
  const g = testWindow("end 100000");
  const u = g.ui();
  const k = { on: false, dropped: false, pos: 0, spring: 0, last: 0, col: 0, hash: "" };
  const frame = () => {
    for (const ev of g.events(0)) u.feed(ev);
    u.frame(() => {
      k.pos = u.anim("box", k.on ? 200 : 10, 160, goome.EASE_OUT);
      k.spring = u.anim("spring", k.on ? 1 : 0, 320, "spring");
      k.col = u.animColor("col", k.on ? 0xff20d060 : 0, 200, goome.EASE_LINEAR);
      if (!k.dropped) k.last = u.anim("gone", k.on ? 5 : 0, 100, "linear");
      const c = u.canvas;
      if (c) {
        c.rect(k.pos, 20, 60, 40, 0xffe0a030);
        c.rrect(20 + k.spring * 180, 90, 50, 30, 15, 0xff4fb3f7);
        c.rect(20, 140, 260, 40, k.col);
      }
    });
    k.hash = frameHash(g);
  };
  return { g, u, k, frame };
}

test("ease curves", () => {
  assert.strictEqual(goome.ease(goome.EASE_LINEAR, 0.25), 0.25);
  assert.strictEqual(goome.ease("in", 0.5), 0.125);
  assert.strictEqual(goome.ease("out", 0.5), 0.875);
  assert.strictEqual(goome.ease("in out", 0.25), 0.0625);
  assert.strictEqual(goome.ease(goome.EASE_IN_OUT, 0.75), 0.9375);
  assert.strictEqual(goome.ease("bounce", 0.25), 0.47265625);
  assert.strictEqual(goome.ease("out", -3), 0);
  assert.throws(() => goome.ease("wobble", 0.5), RangeError);
  let peak = 0;
  for (let i = 1; i < 100; i++) peak = Math.max(peak, goome.ease(goome.EASE_SPRING, i / 100));
  assert.ok(peak > 1.1 && peak < 1.25, String(peak));
});

test("anim frames match C", (t) => {
  if (!needC(t)) return;
  const c = fromC().anim;
  assert.deepStrictEqual(c, [...ANIM, "1"]);
  const { g, u, k, frame } = animScene();
  frame();
  assert.deepStrictEqual([k.pos, k.spring, k.col, k.last], [10, 0, 0, 0]);
  frame();
  assert.ok(!u.animating);
  k.on = true;
  const hs = [];
  let prev = k.pos, over = 0, moving = 0;
  for (let i = 0; i < 60; i++) {
    frame();
    if (i === 1 || i === 4 || i === 8) hs.push(k.hash);
    assert.ok(k.pos >= prev);
    prev = k.pos;
    over = Math.max(over, k.spring);
    if (u.animating) moving = i + 1;
  }
  hs.push(k.hash);
  assert.deepStrictEqual([k.pos, k.spring, k.col, k.last], [200, 1, 0xff20d060, 5]);
  assert.ok(over > 1.05 && moving >= 19 && moving <= 22);
  assert.deepStrictEqual(hs, ANIM);
  k.on = false;
  frame();
  frame();
  assert.ok(k.pos < 200 && k.pos > 10);
  k.dropped = true;
  for (let i = 0; i < 1600; i++) frame();
  k.dropped = false;
  frame();
  assert.strictEqual(k.last, 0);
  g.close();
});

function txt(f, size, s, argb, dir, w, h) {
  const c = goome.Canvas.new(w, h, { stride: 400 });
  goome.textDir(dir);
  c.fontText(f, size, 4, 4, s, argb);
  goome.textDir("auto");
  const px = new Uint32Array(400 * 120);
  px.set(c.pixels.subarray(0, 400 * h));
  return hex(fnv(px, 400, 120, 400));
}

const near = (a, b) => Math.abs(a - b) < 0.01;
const HEB = "ab אבג (12) c";

test("emoji and rtl text match C", (t) => {
  if (!needC(t)) return;
  assert.deepStrictEqual(fromC().emoji, EMOJI);
  const f = goome.Font.fromBytes(data("colr.ttf")), cb = goome.Font.fromBytes(data("cbdt.ttf"));
  const sb = goome.Font.fromBytes(data("sbix.ttf")), d = goome.Font.fromBytes(data("dejavu-sub.ttf"));
  assert.ok(near(f.width("\u{1f600}\u{1f3fb}", 30), 24));
  assert.ok(near(f.width("\u{1f600}‍\u{1f600}", 30), 24));
  assert.ok(near(f.width("❤", 30), 18) && near(f.width("❤️", 30), 24));
  const got = [];
  got.push(txt(f, 30, "ab \u{1f600} \u{1f600}\u{1f3fb} \u{1f600}‍\u{1f600} ❤ ❤️", 0xff2040a0, 0, 400, 60));
  const c = goome.Canvas.new(400, 120);
  c.fontText(cb, 16, 4, 4, "\u{1f431}", 0xffffffff);
  c.fontText(cb, 64, 30, 4, "\u{1f431}", 0xffffffff);
  c.fontText(sb, 40, 120, 4, "\u{1f431}\u{1f431}", 0x80ffffff);
  got.push(hex(fnv(c.pixels, 400, 120, 400)));
  d.fallback(f).fallback(d).fallback(f);
  assert.strictEqual(d.fallbacks.length, 1);
  assert.ok(near(d.width("goome! \u{1f600}", 20), d.width("goome! ", 20) + 16));
  got.push(txt(d, 20, "goome! \u{1f600} Hi", 0xffffffff, 0, 400, 40));
  got.push(txt(f, 24, HEB, 0xffffffff, 0, 400, 40));
  assert.strictEqual(got[3], txt(f, 24, HEB, 0xffffffff, "ltr", 400, 40));
  got.push(txt(f, 24, HEB, 0xffffffff, goome.DIR_RTL, 400, 40));
  assert.ok(near(f.width("بلام ببب لم", 20), 93.2));
  got.push(txt(f, 30, "بلام ببب لم بَب", 0xffffffff, 0, 400, 50));
  assert.deepStrictEqual(got, EMOJI);
  assert.throws(() => goome.textDir("sideways"), RangeError);
  f.close();
  assert.ok(f.closed);
  assert.ok(near(d.width("goome! \u{1f600}", 20), d.width("goome! ", 20) + 16));
  d.close();
  for (const x of [cb, sb]) x.close();
});

function imScene(script, input, edit, focus) {
  const g = testWindow(script);
  const u = g.ui();
  u.theme.update({ font: null, fontSize: 14, animMs: 0 });
  u.config.blinkMs = 0;
  const k = { g, u, input, edit, flags: 0, ctl: "", hash: "" };
  k.frame = (fc = 0) => {
    for (const ev of g.events(0)) {
      if (ev.type === goome.CONTROL && ev.msg.startsWith("ime ")) k.ctl = ev.msg;
      u.feed(ev);
    }
    u.frame(() => {
      if (fc === 1) u.setFocus();
      k.input = u.inputEx("in", k.input, goome.INPUT_NO_SELECT_ON_FOCUS | k.flags, null, 64);
      if (fc === 2) u.setFocus();
      k.edit = u.textEdit("ed", k.edit, 80, 0, 96);
    });
    k.hash = frameHash(g);
  };
  k.commit = (s) => (g.pushCommit(s), k.frame());
  k.preedit = (s, cur) => (g.pushPreedit(s, cur), k.frame());
  k.key = (ch, mods = 0) => (g.push(goome.KEY, { key: ch.charCodeAt(0), mods, text: mods & goome.CTRL ? "" : ch }), k.frame());
  k.frame(focus);
  k.frame();
  return k;
}

test("ime events on the test backend", () => {
  const long = "q".repeat(80);
  const g = testWindow(`1 text ${long};2 preedit にほん 3;3 preedit abc;4 preedit;end 10`, 100, 100);
  g.pushCommit("hi");
  const e = g.poll();
  assert.deepStrictEqual([e.name, e.msg, g.eventText], ["text", "hi", "hi"]);
  g.textInput(true, { x: 10, y: 20, w: 1, h: 16 });
  g.textInput(false);
  let got = 0, quit = false;
  for (let f = 0; f < 20 && !quit; f++) {
    for (const ev of g.events(0)) {
      if (ev.type === goome.QUIT) quit = true;
      if (ev.type === goome.TEXT) {
        got |= 1;
        assert.strictEqual(ev.msg, long);
      }
      if (ev.type === goome.PREEDIT && ev.msg === "にほん") {
        got |= 2;
        assert.deepStrictEqual([ev.id, g.preeditCursor], [3, 3]);
      }
      if (ev.type === goome.PREEDIT && ev.msg === "abc") got |= 4;
      if (ev.type === goome.PREEDIT && ev.msg === "") {
        got |= 8;
        assert.strictEqual(g.preeditCursor, 0);
      }
    }
    g.frame(() => {});
  }
  assert.strictEqual(got, 15);
  g.close();
});

test("preedit render and commits match C", (t) => {
  if (!needC(t)) return;
  const c = fromC().ime;
  for (const [i, v] of Object.entries(IME)) assert.strictEqual(c[i], v);
  assert.strictEqual(c[5], "ab日本");
  let k = imScene("end 100000", "ab", "", 1);
  const h = [k.hash];
  k.preedit("xyz", 1);
  h.push(k.hash);
  k.preedit("xyz", 3);
  h.push(k.hash);
  assert.strictEqual(k.input, "ab");
  k.preedit("", 0);
  assert.strictEqual(k.hash, h[0]);
  k.commit("日本");
  assert.strictEqual(k.input, c[5]);
  k.key("c");
  assert.strictEqual(k.input, "ab日本c");
  k.key("z", goome.CTRL);
  assert.strictEqual(k.input, "ab日本");
  k.g.close();

  k = imScene("end 100000", "", "line", 2);
  h.push(k.hash);
  k.preedit("kana", 2);
  h.push(k.hash);
  k.preedit("", 0);
  k.commit("かな\n");
  assert.deepStrictEqual([k.edit, k.input], ["かな\nline", ""]);
  k.g.close();
  assert.deepStrictEqual(h, c.slice(0, 5));

  k = imScene("end 100000", "", "", 1);
  k.flags = goome.INPUT_NUMBER;
  k.commit("1a2.5");
  assert.strictEqual(k.input, "12.5");
  k.g.close();
});

test("long commits and the ime caret", () => {
  const long = "w".repeat(90);
  const k = imScene(`4 text ${long};6 ime;end 100000`, "", "", 1);
  for (let i = 0; i < 8; i++) k.frame();
  assert.strictEqual(k.input, long.slice(0, 63));
  const m = /^ime (\d+) (-?\d+),(-?\d+) (\d+)x(\d+)/.exec(k.ctl);
  assert.ok(m && m[1] === "1" && +m[2] > 0 && +m[3] > 0 && +m[5] >= 14, k.ctl);
  k.g.close();
});
