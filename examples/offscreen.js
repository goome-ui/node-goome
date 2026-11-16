"use strict";
const fs = require("fs");
const zlib = require("zlib");
const goome = require("..");

const SCRIPT = {
  2: [[goome.DOWN, 40, 109], [goome.UP, 40, 109]],
  3: [[goome.DOWN, 60, 163]],
  4: [[goome.MOTION, 250, 163]],
  5: [[goome.UP, 250, 163]],
  6: [[goome.DOWN, 150, 223], [goome.UP, 150, 223]],
  7: [["type", " from an engine"]],
  8: [[goome.MOTION, 80, 279]],
};

const CRC = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function crc32(buf) {
  let c = -1;
  for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(kind, data) {
  const head = Buffer.alloc(4);
  head.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(kind), data]);
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(body));
  return Buffer.concat([head, body, tail]);
}

function writePng(path, frame) {
  const { w, h } = frame;
  const rows = Buffer.alloc(h * (w * 3 + 1));
  let o = 0;
  for (let y = 0; y < h; y++) {
    rows[o++] = 0;
    const row = frame.row(y);
    for (let x = 0; x < w; x++) {
      const s = row[x];
      const bg = ((x >> 4) + (y >> 4)) & 1 ? 0xff3a4a5a : 0xff2e3c4a;
      const a = s >>> 24;
      for (const k of [16, 8, 0]) rows[o++] = ((s >>> k) & 255) + Math.floor((((bg >>> k) & 255) * (255 - a)) / 255);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  fs.writeFileSync(path, Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(rows, { level: 9 })), chunk("IEND", Buffer.alloc(0))]));
}

const CURSORS = ["arrow", "ibeam", "hand", "move", "resize_ew", "resize_ns", "resize_nwse", "resize_nesw", "wait", "no", "hidden"];

function main() {
  const path = process.argv[2] || "offscreen.png";
  const g = goome.openOffscreen(360, 330, 2);
  const ui = g.ui();
  ui.theme.animMs = 0;
  const win = { x: 20, y: 20, w: 320, h: 0 };
  let check = false, volume = 0.25, name = "goome";
  for (let frame = 0; frame < 10; frame++) {
    for (const step of SCRIPT[frame] || []) {
      if (step[0] === "type") g.pushText(step[1]);
      else g.push(step[0], { x: step[1], y: step[2], button: 1 });
    }
    for (const ev of g.events(0)) ui.feed(ev);
    ui.frame(0, () => {
      ui.window("offscreen", win, goome.WIN_MOVE, () => {
        ui.label("no window, the engine owns the screen");
        check = ui.checkbox("Pushed a click", check);
        volume = ui.slider("Volume", volume, 0, 1, "%.2f");
        name = ui.input("Name", name, 64);
        ui.progress(volume);
        ui.button("Hover me");
      });
    });
  }
  writePng(path, g.lastFrame());
  console.log(`check ${check ? 1 : 0} volume ${volume.toFixed(2)} name '${name}' cursor ${CURSORS[g.cursor]} -> ${path}`);
  ui.close();
  g.close();
  return 0;
}

process.exitCode = main();
