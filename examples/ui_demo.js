"use strict";
const goome = require("..");

const FRUITS = ["Mango", "Banana", "Cherry", "Kiwi", "Apple", "Lemon", "Grape", "Fig", "Dragonfruit", "Pear"];
const TABS = ["Widgets", "Images", "Theme", "About"];

function makeGradient() {
  const px = new Uint32Array(128 * 128);
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const r = 0x2a + Math.floor((x * (0x6f - 0x2a)) / 127);
      const g = 0x40 + Math.floor((y * (0xdc - 0x40)) / 127);
      const b = 0x9a - Math.floor(((x + y) * 0x50) / 254);
      px[y * 128 + x] = (0xff000000 | (r << 16) | (g << 8) | b) >>> 0;
    }
  }
  return goome.Bitmap.fromArgb(px, 128, 128);
}

const plural = (n, none, one, many) => (n === 0 ? none : n === 1 ? one : many.replace("%d", n));

class Demo {
  constructor(g, u) {
    this.g = g;
    this.u = u;
    const m = g.monitors();
    const a = m.length ? m[0].area : { x: 0, y: 0, w: 1280, h: 720 };
    this.logo = makeGradient();
    this.main = { x: a.x + 40, y: a.y + 40, w: 440, h: 620 };
    this.stats = { x: a.x + 500, y: a.y + 40, w: 280, h: 0 };
    Object.assign(this, { tab: 0, clicks: 0, grid: true, wifi: true, notify: false, mode: 1, count: 42, fruit: 2, picked: -1, more: true });
    Object.assign(this, { light: 0, ownAccent: false, solid: false, always: false, imgClicks: 0, volume: 0.65, radius: 10, anim: 120 });
    Object.assign(this, { highlight: 0xff4fa3ff, accent: 0xff6fdc5f, name: "goome", search: "", fps: 0, frameMs: 0, running: true });
  }

  setTheme() {
    const t = this.u.theme;
    if (this.light) t.light();
    else t.dark();
    if (this.ownAccent) t.accent = this.accent;
    t.radius = this.radius;
    t.animMs = this.anim;
    if (this.solid) t.panel = (t.panel | 0xff000000) >>> 0;
  }

  widgets() {
    const u = this.u;
    u.heading("Buttons");
    u.row(3);
    if (u.button("Click me")) this.clicks++;
    if (u.button("Reset")) this.clicks = 0;
    u.button("Hover me");
    u.tooltip("hi :)");
    u.label(plural(this.clicks, "not clicked yet", "clicked once", "clicked %d times"));
    u.separator();
    u.heading("Switches");
    this.grid = u.checkbox("Show grid", this.grid);
    u.sameLine();
    this.notify = u.checkbox("Notifications", this.notify);
    this.wifi = u.toggle("Wi-Fi", this.wifi);
    ["Small", "Medium", "Large"].forEach((name, i) => {
      if (i) u.sameLine();
      this.mode = u.radio(name, this.mode, i);
    });
    u.separator();
    u.heading("Values");
    this.volume = u.slider("Volume", this.volume, 0, 1, "%.2f");
    this.count = u.sliderInt("Count", this.count, 0, 100);
    u.progress(this.volume, Math.round(this.volume * 100) + "%");
    u.progress(-1);
    u.row(2);
    this.name = u.input("Name", this.name, 64);
    this.search = u.input("Search", this.search, 64);
    this.fruit = u.combo("Fruit", this.fruit, FRUITS);
    this.highlight = u.color("Highlight", this.highlight);
    this.more = u.collapsing("More stuff", this.more);
    if (this.more) {
      u.wrapped("a long list so theres something to scroll. pick one, it shows up under it.");
      u.scroll("list", 150, () => {
        for (let i = 0; i < 30; i++) if (u.selectable("Item " + (i + 1), this.picked === i)) this.picked = i;
      });
      u.label(this.picked >= 0 ? "picked item " + (this.picked + 1) : "nothing picked");
    }
  }

  images() {
    const u = this.u;
    u.heading("Generated gradient");
    [18, 60, 0].forEach((r, i) => {
      if (i) u.sameLine();
      u.image(this.logo, 120, 120, r);
    });
    u.label("image buttons");
    for (let i = 0; i < 4; i++) {
      if (i) u.sameLine();
      if (u.imageButton("img" + i, this.logo, 56, 56)) this.imgClicks++;
    }
    u.label(plural(this.imgClicks, "no image clicks yet", "one image click", "%d image clicks"));
    u.image(this.logo, 0, 90, 10);
  }

  theme() {
    const u = this.u;
    u.heading("Theme");
    const was = this.light;
    this.light = u.radio("Dark", this.light, 0);
    u.sameLine();
    this.light = u.radio("Light", this.light, 1);
    let ch = this.light !== was;
    this.accent = u.color("Accent", this.accent);
    if (u.changed) this.ownAccent = ch = true;
    this.radius = u.slider("Corner radius", this.radius, 0, 20, "%.0f px");
    ch = ch || u.changed;
    this.anim = u.slider("Animation", this.anim, 0, 400, "%.0f ms");
    ch = ch || u.changed;
    this.solid = u.toggle("Solid panels", this.solid);
    ch = ch || u.changed;
    if (u.button("Reset theme")) {
      Object.assign(this, { light: 0, ownAccent: false, radius: 10, anim: 120, solid: false, accent: 0xff6fdc5f });
      ch = true;
    }
    if (ch) this.setTheme();
    if (!this.ownAccent) this.accent = u.theme.accent;
  }

  about() {
    const u = this.u;
    u.heading("About");
    u.wrapped("made with goome. try clicking next to this window, your desktop still gets it.");
    u.label(`goome ${goome.VERSION} on ${this.g.backendName}`);
    u.label(`${this.fps.toFixed(0)} fps, ${this.frameMs.toFixed(2)} ms a frame`);
    if (!this.stats.open && u.button("Show stats")) this.stats.open = true;
  }

  draw() {
    const u = this.u;
    const flags = goome.WIN_MOVE | goome.WIN_RESIZE | goome.WIN_COLLAPSE;
    u.window("goome ui", this.main, flags, () => {
      this.tab = u.tabs("tabs", TABS, this.tab);
      u.id(TABS[this.tab], () => u.scroll("page", 0, () => [this.widgets, this.images, this.theme, this.about][this.tab].call(this)));
    });
    u.window("Stats", this.stats, flags | goome.WIN_CLOSE, () => {
      u.label(this.fps.toFixed(0) + " fps");
      u.label(this.frameMs.toFixed(2) + " ms a frame");
      u.progress(this.frameMs / 16.7, Math.round((this.frameMs * 100) / 16.7) + "% of a 60 fps frame");
      this.always = u.toggle("Redraw every frame", this.always);
      if (u.button("Quit")) this.running = false;
    });
  }

  run() {
    const { g, u } = this;
    const test = g.backendName.split(" ")[0] === "test";
    let spent = 0, frames = 0, accMs = 0, accN = 0, fpsN = 0, fpsT = goome.nowMs(), dirty = true;
    const pace = new goome.Pacer(60);
    while (this.running) {
      const busy = dirty || this.always || test || u.animating;
      for (const ev of g.events(busy ? pace.wait() : 500)) {
        if (ev.type === goome.QUIT) this.running = false;
        u.feed(ev);
        dirty = true;
      }
      if (!this.running) break;
      if (!(dirty || this.always || test || u.animating)) continue;
      dirty = false;
      const t0 = goome.nowMs();
      if (!u.begin(0)) continue;
      this.draw();
      u.end();
      const t1 = goome.nowMs();
      spent += t1 - t0;
      frames++;
      accMs += t1 - t0;
      accN++;
      fpsN++;
      if (t1 - fpsT >= 500) {
        this.fps = (fpsN * 1000) / (t1 - fpsT);
        this.frameMs = accMs / accN;
        fpsT = t1;
        fpsN = accMs = accN = 0;
      }
    }
    if (frames) console.log(`${frames} frames, ${(spent / frames).toFixed(2)} ms a frame`);
    this.logo.close();
  }
}

function main() {
  let g;
  try {
    g = goome.open({ title: "goome ui", noCapture: true });
  } catch (e) {
    console.error("cant open an overlay: " + e.message);
    return 1;
  }
  const u = g.ui();
  try {
    new Demo(g, u).run();
  } finally {
    u.close();
    g.close();
  }
  return 0;
}

process.exitCode = main();
