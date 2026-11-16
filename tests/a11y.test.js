"use strict";
const test = require("node:test");
const assert = require("node:assert");
const goome = require("..");

function scene() {
  const g = goome.open({ backend: "test", mode: "window", width: 420, height: 700, testScript: "end 100000" });
  const u = g.ui();
  u.theme.update({ font: null });
  const s = { ok: 0, dark: false, mode: 0, fruit: 0, tab: 0, open: { value: false }, knob: 0, vol: 2, name: "Bo", note: "", tree: [] };
  s.frame = () => {
    for (const ev of g.events(0)) u.feed(ev);
    u.frame(() => {
      u.app("Demo", goome.APP_TITLEBAR | goome.APP_STATUSBAR, () => {
        u.label("Hello there");
        if (u.button("OK")) s.ok++;
        s.dark = u.checkbox("Dark", s.dark);
        s.mode = u.radio("Big", s.mode, 1);
        s.vol = u.slider("Volume", s.vol, 0, 10, "%.1f");
        s.name = u.input("Name", s.name, 64);
        s.fruit = u.combo("Fruit", s.fruit, ["Mango", "Kiwi", "Fig"]);
        s.tab = u.tabs("tabs", ["One", "Two"], s.tab);
        u.tree("Folder", s.open, () => u.label("inside"));
        u.progress(0.25);
        s.note = u.textEdit("Notes", s.note, 60, 0, 256);
        u.a11yRole("button", "Knob");
        u.a11yValue("11");
        if (u.custom("knob", 40, 40).clicked) s.knob++;
        u.statusbar("ready");
      });
    });
    s.tree = u.a11yTree();
  };
  s.find = (role, label) => s.tree.findIndex((n) => n.roleName === role && n.label === label);
  s.send = (verb, i, text) => g.push(goome.CONTROL, { msg: `a11y ${verb} ${s.tree[i].id}${text == null ? "" : " " + text}` });
  return { g, u, s };
}

test("a11y tree and actions", () => {
  const { g, u, s } = scene();
  s.frame();
  assert.ok(s.tree.length > 15);
  const app = s.find("window", "Demo"), ok = s.find("button", "OK"), dark = s.find("checkbox", "Dark");
  const vol = s.find("slider", "Volume"), name = s.find("input", "Name"), fruit = s.find("combo", "Fruit");
  const tree = s.find("tree", "Folder"), knob = s.find("button", "Knob"), tab2 = s.find("tab", "Two");
  const big = s.find("radio", "Big"), notes = s.find("input", "Notes");
  assert.deepStrictEqual([app, s.tree[app].parent], [0, null]);
  assert.ok(ok > 0 && s.tree[ok].parent === app && s.tree[ok].w > 0 && s.tree[ok].h > 0);
  assert.ok(s.find("text", "Hello there") > 0 && s.find("text", "ready") > 0);
  assert.ok(s.find("button", "Close") > 0 && s.find("button", "Minimize") > 0);
  assert.ok(!s.tree[dark].checked && !s.tree[big].checked);
  assert.deepStrictEqual([s.tree[vol].num, s.tree[vol].min, s.tree[vol].max, s.tree[vol].value], [2, 0, 10, "2.0"]);
  assert.strictEqual(s.tree[name].value, "Bo");
  assert.ok(s.tree[fruit].value === "Mango" && !s.tree[fruit].expanded);
  assert.strictEqual(s.tree[s.tree[tab2].parent].role, goome.ROLE_GROUP);
  assert.ok(!s.tree[tab2].selected && s.tree[s.find("tab", "One")].selected);
  assert.ok(!s.tree[tree].expanded && s.find("text", "inside") < 0);
  assert.strictEqual(s.tree[knob].value, "11");
  const pr = s.tree.findIndex((n) => n.role === goome.ROLE_PROGRESS);
  assert.deepStrictEqual([s.tree[pr].num, s.tree[pr].value], [0.25, "25%"]);
  const ids = s.tree.map((n) => n.id);
  s.frame();
  assert.deepStrictEqual(s.tree.map((n) => n.id), ids);
  assert.strictEqual(new Set(ids).size, ids.length);

  s.send("press", ok);
  s.send("press", dark);
  s.send("press", big);
  s.send("set", vol, "7.5");
  s.send("set", name, "hello there");
  s.send("press", knob);
  s.send("expand", tree);
  s.send("press", tab2);
  s.send("set", notes, "line one");
  s.frame();
  assert.deepStrictEqual([s.ok, s.dark, s.mode, s.vol, s.knob, s.open.value, s.tab, s.name, s.note], [1, true, 1, 7.5, 1, true, 1, "hello there", "line one"]);
  s.frame();
  assert.ok(s.tree[s.find("checkbox", "Dark")].checked);
  assert.strictEqual(s.tree[s.find("slider", "Volume")].value, "7.5");
  const t2 = s.find("tree", "Folder");
  assert.ok(s.tree[t2].expanded && s.tree[s.find("text", "inside")].parent === t2);

  s.send("focus", s.find("input", "Name"));
  s.frame();
  s.frame();
  const n = s.tree[s.find("input", "Name")];
  assert.ok(n.focused && n.caret === 11);
  assert.strictEqual(s.tree.filter((x) => x.focused).length, 1);

  s.send("expand", s.find("combo", "Fruit"));
  s.frame();
  s.frame();
  const fr = s.find("combo", "Fruit"), fig = s.find("item", "Fig");
  const list = s.tree[fig].parent;
  assert.ok(s.tree[fr].expanded && s.tree[list].roleName === "list" && s.tree[list].parent === fr);
  s.send("press", fig);
  s.frame();
  s.frame();
  assert.ok(s.fruit === 2 && s.find("item", "Fig") < 0);

  u.a11y(false);
  s.frame();
  assert.deepStrictEqual(s.tree, []);
  g.close();
});

test("offscreen a11y starts off", () => {
  const g = goome.openOffscreen(200, 100);
  const u = g.ui();
  u.theme.update({ font: null });
  for (let pass = 0; pass < 2; pass++) {
    u.frame(() => u.button("Hi"));
    assert.strictEqual(u.a11yTree().length, pass);
    u.a11y(true);
  }
  u.frame(() => u.button("Hi"));
  const t = u.a11yTree();
  assert.ok(t.length === 1 && t[0].roleName === "button" && t[0].label === "Hi");
  assert.throws(() => u.a11yRole("spaceship", "x"), RangeError);
  g.close();
});
