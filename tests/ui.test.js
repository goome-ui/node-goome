"use strict";
const test = require("node:test");
const assert = require("node:assert");
const { fnv, hex } = require("./util");
const goome = require("..");

const SCRIPT =
  "screen 400x360 1; 1 click 35,71; 2 click 29,106; 3 hold 40,157 6; 4 hover 120,157; " +
  "7 click 100,213; 8 key ab; 9 key \\n; 10 key zz; 11 click 120,273; 13 click 120,206; " +
  "15 click 300,20; 16 hold 100,20 20; 18 hover 150,40; end 22";

test("scripted ui run hashes the same as C", () => {
  const g = goome.open({ backend: goome.TEST, testScript: SCRIPT });
  const u = new goome.Ui(g);
  u.theme.font = null;
  u.theme.fontSize = 14;
  const win = { x: 10, y: 10, w: 220, h: 0 };
  let val = 0, check = false, pick = 0, text = "";
  let quit = false, frames = 0, clicks = 0, downs = 0, keysOff = 0, kbSeen = false;
  const hs = {};
  while (!quit && frames < 100) {
    for (const ev of g.events(0)) {
      if (ev.type === goome.QUIT) quit = true;
      if (ev.type === goome.DOWN) downs++;
      if (ev.type === goome.KEY && frames > 10) keysOff++;
      u.feed(ev);
    }
    const c = u.begin(0);
    assert.ok(c);
    const raw = c.raw;
    if (u.window("test", win, goome.WIN_MOVE)) {
      if (u.button("Go")) clicks++;
      check = u.checkbox("Check", check);
      val = u.slider("Val", val, 0, 1);
      text = u.input("Text", text, 16);
      pick = u.combo("Pick", pick, ["one", "two", "three"]);
    }
    u.windowEnd();
    u.end();
    assert.ok(!c.valid);
    if (frames === 8) kbSeen = text !== "";
    if ([0, 12, 21].includes(frames)) hs[frames] = hex(fnv(goome.pixelView(raw.px, raw.h * raw.stride), raw.w, raw.h, raw.stride));
    frames++;
  }
  assert.strictEqual(clicks, 1);
  assert.ok(check);
  assert.ok(val > 0.45 && val < 0.55, String(val));
  assert.ok(kbSeen);
  assert.strictEqual(text, "ab");
  assert.strictEqual(keysOff, 0);
  assert.strictEqual(pick, 1);
  assert.deepStrictEqual([win.x, win.y], [60, 30]);
  assert.strictEqual(downs, 7);
  assert.deepStrictEqual(hs, { 0: "51713294", 12: "b52f16c5", 21: "ea01692c" });
  u.close();
  g.close();
});

test("every widget runs", () => {
  const g = goome.open({ backend: "test", testScript: "screen 800x600 1; 2 click 60,80; end 8" });
  const u = g.ui();
  u.theme.font = null;
  const t = u.theme;
  t.light();
  assert.ok(t.text >>> 24 > 0);
  t.dark();
  t.accent = 0xff6fdc5f;
  assert.strictEqual(t.accent, 0xff6fdc5f);
  t.update({ radius: 4, pad: 8, animMs: 0, align: "center" });
  assert.deepStrictEqual([t.radius, t.pad, t.animMs, t.align], [4, 8, 0, goome.ALIGN_CENTER]);
  assert.throws(() => t.update({ nope: 1 }), RangeError);
  assert.ok("panel" in t.toJSON());
  const logo = goome.Bitmap.fromArgb(new Array(64).fill(0xff2a409a), 8, 8);
  t.setIcon("check", logo);
  assert.strictEqual(t.icon(goome.ICON_CHECK), logo);
  t.skinButton = [logo, 2];
  assert.strictEqual(t.skinButton.bitmap, logo);
  t.skinButton = null;
  t.setIcon("check", null);
  const preset = goome.Theme.preset("mint");
  const made = goome.Theme.make(0xffff4080, false, 6);
  const copy = t.copy();
  copy.accent = 0xff123456;
  assert.strictEqual(t.accent, 0xff6fdc5f);

  const cfg = u.config;
  cfg.tipDelayMs = 100;
  assert.strictEqual(cfg.tipDelayMs, 100);
  cfg.escCloses = false;
  assert.strictEqual(cfg.escCloses, false);
  cfg.setCursor("link", goome.CURSOR_HAND);
  assert.strictEqual(cfg.cursor(goome.CUR_LINK), goome.CURSOR_HAND);
  u.bind("copy", ["ctrl+c", "ctrl+insert"]);
  assert.deepStrictEqual(cfg.keys("copy"), [{ key: 99, mods: goome.CTRL }, { key: goome.K_INSERT, mods: goome.CTRL }]);
  cfg.mask = "#";
  assert.strictEqual(cfg.mask, "#");
  let eased = 0;
  cfg.ease = (x) => (eased++, x);
  cfg.reset();
  assert.strictEqual(cfg.ease, null);

  const win = { x: 20, y: 20, w: 400, h: 0 };
  const side = { frac: 0.3 };
  const modal = new goome.Flag(true);
  const node = new goome.Flag(true);
  const checked = new goome.Flag(false);
  let s = { text: "", body: "line one\nline two", v: 0.5, n: 3, on: false, tab: 0, color: 0xff336699, drag: 1.5, num: 2, sel: 0, sortCol: 0 };
  let frames = 0, quit = false, stored, item;
  while (!quit && frames < 30) {
    for (const ev of g.events(0)) {
      if (ev.type === goome.QUIT) quit = true;
      u.feed(ev);
    }
    u.frame(0, () => {
      u.menubar(() => {
        u.menu("File", () => {
          u.menuItem("Check me", "ctrl+k", checked);
          u.menuSeparator();
          u.menuItem("Quit");
        });
      });
      u.window("all", win, goome.WIN_MOVE | goome.WIN_RESIZE | goome.WIN_CLOSE, () => {
        u.heading("hi");
        u.label("plain");
        u.wrapped("a long line that wraps around a bunch");
        u.button("Go");
        u.tooltip("tip");
        u.hovered;
        u.imageButton("img", logo, 16, 16);
        u.image(logo, 16, 16, 4);
        s.on = u.checkbox("Check", s.on);
        s.on = u.toggle("Toggle", s.on);
        s.sel = u.radio("A", s.sel, 0);
        s.sel = u.radio("B", s.sel, 1);
        s.v = u.slider("Val", s.v, 0, 1, "%.2f");
        s.n = u.sliderInt("N", s.n, 0, 10);
        s.text = u.input("Name", s.text);
        s.text = u.password("Pw", s.text, "hint");
        s.sel = u.combo("Pick", s.sel, ["a", "b"]);
        u.selectable("sel", true);
        s.tab = u.tabs("tabs", ["one", "two"], s.tab);
        if (u.collapsing("more")) u.label("inside");
        u.progress(0.5, "half");
        s.color = u.color("Color", s.color);
        u.row(2);
        u.label("a");
        u.label("b");
        u.sameLine();
        u.space(4);
        u.separator();
        u.width(100);
        s.drag = u.dragFloat("Drag", s.drag, 0.1, 0, 10);
        s.n = u.dragInt("DragI", s.n, 1, 0, 10);
        s.num = u.number("Num", s.num, 0.5, "%.1f");
        u.plotLines("lines", [1, 3, 2, 5]);
        u.plotBars("bars", new Float32Array([1, 2, 3]), 0, 4, 30);
        u.scroll("list", 80, () => {
          const r = u.listClip(100, 18);
          for (let i = r.first; i < r.last; i++) u.id(i, () => u.label("row " + i));
        });
        u.split("main", side, () => {
          u.label("left");
          u.splitNext();
          s.body = u.textEdit("body", s.body, 60, goome.EDIT_LINE_NUMBERS);
        });
        u.table("t", 2, 80, goome.TABLE_SORTABLE, () => {
          u.tableColumn("Name");
          u.tableColumn("Size", 60);
          const so = u.tableSort(s.sortCol);
          s.sortCol = so.col;
          for (const r of [["a", 1], ["b", 2]]) {
            u.tableRow();
            u.label(r[0]);
            u.tableNext();
            u.label(r[1]);
          }
        });
        u.tree("root", node, () => {
          u.label("leaf");
        });
        u.dragSource("txt", "hello");
        u.dropTarget("txt");
        u.spinner(12);
        u.link("a link");
        u.badge("3");
        u.style({ accent: 0xffff0000, radius: 2 }, () => u.button("red"));
        const n = u.style({ textDim: 0xff888888, font: null });
        u.label("styled");
        u.pop(n);
        u.pushRadii([1, 2, 3, 4]);
        u.pushSkin("button", [logo, 2]);
        u.pushIcon("close", logo);
        u.pushTheme(preset);
        u.button("skinned");
        u.pop(4);
        u.pos(0, 0);
        u.size(40, 20);
        item = u.custom("knob", 40, 20, goome.ITEM_DRAG_X | goome.ITEM_FOCUSABLE);
        const c = u.canvas;
        if (c) c.circle(item.x + 10, item.y + 10, 8, 0xffffffff);
        stored = u.store("knob", 3);
        stored[0] += 1;
        u.context("ctx", () => u.menuItem("ctx item"));
        u.popupOpen("pop");
        u.popup("pop", () => {
          u.label("popup");
          u.popupClose();
        });
        u.modal("Sure?", modal, () => {
          u.label("modal");
          if (frames > 3) u.popupClose();
        });
        u.setFocus();
        u.focused;
        u.toast("hi", 100);
      });
    });
    frames++;
  }
  assert.ok(quit);
  assert.ok(stored[0] >= 1);
  assert.ok(typeof item.hovered === "boolean" && item.w === 40);
  assert.ok(win.w >= 400);
  assert.ok(u.wants >= 0);
  assert.ok(typeof u.animating === "boolean");
  u.autoGrab = 0;
  assert.strictEqual(u.autoGrab, 0);
  u.scale(1);
  logo.close();
  preset.close();
  made.close();
  copy.close();
  u.close();
  u.close();
  assert.throws(() => u.button("x"), goome.Gone);
  g.close();
});

test("closing goome closes its ui", () => {
  const g = goome.openOffscreen(100, 100);
  const u = g.ui();
  g.close();
  assert.ok(u.closed);
  assert.throws(() => u.begin(0), goome.Gone);
});

test("callbacks always end what they began", () => {
  const g = goome.openOffscreen(200, 200);
  const u = g.ui();
  u.theme.update({ animMs: 0, font: null });
  const win = { x: 0, y: 0, w: 100, h: 100 };
  assert.throws(() => u.frame(0, () => u.window("w", win, 0, () => { throw new Error("boom"); })), /boom/);
  u.frame(0, () => u.window("w", win, 0, () => u.label("fine")));
  assert.ok(g.lastFrame().w > 0);
  u.close();
  g.close();
});

test("app runs on the test backend", () => {
  const app = new goome.App({ title: "My app", width: 300, height: 200, backend: "test", testScript: "screen 1x1 1; 3 resize 700x500; 5 close; end 10" });
  let frames = 0, closed = 0;
  app.onClose(() => (closed++, true));
  app.run((ui) => {
    frames++;
    ui.label("hi");
    if (ui.button("Go")) ui.toast("go");
  });
  assert.ok(frames > 0);
  assert.strictEqual(closed, 1);
  assert.strictEqual(app.g, null);
});
