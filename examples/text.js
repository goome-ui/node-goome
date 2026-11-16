"use strict";
const goome = require("..");

const LINES = [
  "emoji \u{1f600} \u{1f44d}\u{1f3fd} \u{1f408}‍⬛ ❤️",
  "שלום עולם (123)",
  "مرحبا بالعالم",
  "mixed: goome זה קל 42 ok",
  "\u{1f1ef}\u{1f1f5} \u{1f468}‍\u{1f469}‍\u{1f467} ☺️",
];

const font = goome.Font.system();
if (font && process.argv[2]) font.fallback(goome.Font.load(process.argv[2]));
if (!font) console.log("theres no system font here, using the built in one (no emoji or rtl with it)");
let dir = goome.DIR_AUTO, note = "type here, the ime works too \u{1f60e}";

new goome.App({ title: "Text", width: 640, height: 460 })
  .onStart((app) => { if (font) app.ui.theme.font = font; })
  .run((ui) => {
    ui.heading("emoji and rtl");
    dir = ui.radio("Auto", dir, goome.DIR_AUTO);
    ui.sameLine();
    dir = ui.radio("Left to right", dir, goome.DIR_LTR);
    ui.sameLine();
    dir = ui.radio("Right to left", dir, goome.DIR_RTL);
    goome.textDir(dir);
    ui.separator();
    for (const l of LINES) ui.label(l);
    ui.separator();
    note = ui.input("Note", note);
    note = ui.textEdit("more", note, 90, goome.EDIT_WRAP);
  });
