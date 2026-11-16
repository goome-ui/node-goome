"use strict";
const goome = require("..");

function main() {
  let g;
  try {
    g = goome.open("goome hello");
  } catch (e) {
    console.error("cant open an overlay: " + e.message);
    return 1;
  }
  const mons = g.monitors();
  console.log("backend: " + g.backendName);
  mons.forEach((m, i) => {
    const a = m.area;
    console.log(`monitor ${i}: ${m.name} ${a.w}x${a.h} at ${a.x},${a.y} scale ${m.scale.toFixed(2)}`);
  });
  try {
    g.hotkey("alt+h", 1);
  } catch (e) {
    console.log("no global hotkeys here: " + g.error);
  }

  const bx = mons[0].area.x + 80;
  let by = mons[0].area.y + 80;
  let clicks = 0, hidden = false, typing = false, running = true, typed = "";
  const pace = new goome.Pacer(30);
  while (running) {
    for (const ev of g.events(pace.wait())) {
      if (ev.type === goome.QUIT) running = false;
      if (ev.type === goome.DOWN) {
        console.log(`click ${ev.x.toFixed(0)},${ev.y.toFixed(0)}`);
        if (ev.x > bx + 250 && ev.y < by + 30) running = false;
        else if (ev.y > by + 80) {
          typing = !typing;
          g.keyboard(typing);
        } else clicks++;
      }
      if (ev.type === goome.KEY) {
        console.log(`key ${ev.key} mods ${ev.mods.toString(16)} text '${ev.text}'`);
        if (ev.key === goome.K_ESC) running = false;
        else if (ev.key === goome.K_BACKSPACE && typed) typed = typed.slice(0, -1);
        else if (ev.text && Buffer.byteLength(typed + ev.text) < 40) typed += ev.text;
      }
      if (ev.type === goome.HOTKEY || (ev.type === goome.CONTROL && ev.msg === "hide")) hidden = !hidden;
      if (ev.type === goome.SCROLL) by += ev.dy * 10;
    }
    const c = g.begin(0);
    if (!c) continue;
    if (!hidden) {
      c.roundRect(bx, by, 280, 120, 14, 0xe0202838);
      c.frame(bx, by, 280, 120, 2, clicks & 1 ? 0xff6fdc5f : 0xff8090a0);
      c.text(bx + 16, by + 12, "hello from goome", 0xffffffff, true);
      c.line(bx + 256, by + 10, bx + 268, by + 22, 2, 0xffff6b8b);
      c.line(bx + 268, by + 10, bx + 256, by + 22, 2, 0xffff6b8b);
      c.text(bx + 16, by + 46, "clicks: " + clicks, 0xffc0c8d0);
      c.roundRect(bx + 12, by + 80, 256, 28, 8, typing ? 0xff2e4a30 : 0xff303848);
      c.text(bx + 22, by + 86, typing ? typed || "type something..." : "click here to type", 0xffffffff);
      c.hit(bx, by, 280, 120);
    }
    g.end(c);
  }
  g.close();
  return 0;
}

process.exitCode = main();
