"use strict";
const goome = require("..");

const EASES = ["out", "in", "in_out", "smooth", "linear", "spring", "bounce"];
const NAMES = ["Out", "In", "In out", "Smooth", "Linear", "Spring", "Bounce"];
let open = false, pick = 5, ms = 450;

new goome.App({ title: "Animations", width: 560, height: 520 }).run((ui) => {
  ui.heading("goome animations");
  ui.label("click the box or the button, the ui keeps redrawing until its done moving");
  if (ui.button(open ? "Send it back" : "Send it over")) open = !open;
  pick = ui.combo("Ease", pick, NAMES);
  ms = ui.slider("Time", ms, 50, 2000, "%.0f ms");
  const ease = EASES[pick];
  const x = ui.anim("slide", open ? 1 : 0, ms, ease);
  const size = ui.anim("size", open ? 70 : 40, ms, ease);
  const col = ui.animColor("tint", open ? 0xff6fdc5f : 0xff4fb3f7, ms, "linear");
  const it = ui.custom("stage", 500, 140);
  if (it.clicked) open = !open;
  const c = ui.canvas;
  if (c) {
    c.rrect(it.x, it.y, it.w, it.h, 12, 0xff262c36);
    c.rrect(it.x + 20 + x * (it.w - 40 - size), it.y + (it.h - size) / 2, size, size, size / 2, col);
  }
  ui.label(`value ${x.toFixed(3)}`);
  ui.plotLines("curve", Array.from({ length: 40 }, (_, i) => goome.ease(ease, i / 39)), -0.2, 1.3, 60);
});
