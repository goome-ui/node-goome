"use strict";
const goome = require("..");

const g = goome.openOffscreen(420, 360);
const ui = g.ui();
ui.a11y(true);
let dark = true, vol = 4, name = "sev", fruit = 1;
for (let i = 0; i < 2; i++) {
  ui.frame(() => {
    ui.app("Settings", goome.APP_TITLEBAR, () => {
      ui.label("this is what a screen reader gets");
      dark = ui.checkbox("Dark mode", dark);
      vol = ui.slider("Volume", vol, 0, 10, "%.0f");
      name = ui.input("Name", name);
      fruit = ui.combo("Fruit", fruit, ["Mango", "Kiwi", "Fig"]);
      ui.a11yRole("button", "Big red button");
      ui.a11yValue("dont press it");
      ui.custom("red", 80, 40);
      ui.button("Save");
    });
  });
}
const tree = ui.a11yTree();
for (const n of tree) {
  let depth = 0;
  for (let p = n.parent; p != null; p = tree[p].parent) depth++;
  let line = `${"  ".repeat(depth)}${n.roleName} "${n.label}"`;
  if (n.value) line += ` = ${n.value}`;
  if (n.checked) line += " (checked)";
  console.log(`${line} at ${n.x.toFixed(0)},${n.y.toFixed(0)} ${n.w.toFixed(0)}x${n.h.toFixed(0)}`);
}
g.close();
