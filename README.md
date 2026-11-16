<p align="center">
  <img src="https://raw.githubusercontent.com/goome-ui/.github/main/profile/logo.png" alt="goome" width="150">
</p>

<h1 align="center">🟩 node-goome 🟩</h1>

<p align="center">
<b>Overlays on top of everything, normal desktop apps, or ui inside your game, straight from Node.</b>
</p>

<p align="center">
  <img src="https://goome-ui.github.io/docs/assets/badges/node-18.svg" alt="Node 18+">
  <img src="https://goome-ui.github.io/docs/assets/badges/napi-prebuilt.svg" alt="N-API, prebuilt">
  <img src="https://goome-ui.github.io/docs/assets/badges/typescript-types.svg" alt="TypeScript types included">
  <img src="https://img.shields.io/badge/Linux-X11%20%2B%20Wayland-1b1d22?style=flat-square&logo=linux&logoColor=white" alt="Linux">
  <img src="https://img.shields.io/badge/Windows-10%20%2F%2011-1b1d22?style=flat-square&logo=windows11&logoColor=white" alt="Windows">
  <img src="https://img.shields.io/badge/macOS-14%2B-1b1d22?style=flat-square&logo=apple&logoColor=white" alt="macOS">
  <img src="https://goome-ui.github.io/docs/assets/badges/license-gpl-3.svg" alt="GPL-3.0">
</p>

<p align="center">
  <a href="https://goome-ui.github.io/docs/">Docs</a> &nbsp;·&nbsp;
  <a href="https://goome-ui.github.io/docs/builder/">Builder</a> &nbsp;·&nbsp;
  <a href="https://github.com/goome-ui/examples">Examples</a> &nbsp;·&nbsp;
  <a href="https://github.com/goome-ui/c-goome">C</a> &nbsp;·&nbsp;
  <a href="https://github.com/goome-ui/python-goome">Python</a> &nbsp;·&nbsp;
  <a href="https://github.com/goome-ui/csharp-goome">C#</a> &nbsp;·&nbsp;
  <a href="https://github.com/goome-ui/rust-goome">Rust</a>
</p>

<p align="center">
  This is <a href="https://github.com/goome-ui/c-goome">goome</a> for Node. Draw over the whole screen and clicks only stop where you drew something.<br>
  It does app windows and offscreen frames for your own engine too. The whole C library gets built right into the addon, so theres nothing else to install.<br>
  Questions go in <a href="https://github.com/goome-ui/c-goome/discussions">Discussions</a>.<br> <br>
  Do you like this project? If so, please let me know!
  <a href="https://sevvy-wevvy.com/discord">Discord</a>
</p>

<h3 align="center">🫥 An overlay on top of everything 🫥</h3>

```js
const goome = require("goome");

const g = goome.open("my overlay");
let running = true;
while (running) {
  for (const ev of g.events(16)) if (ev.type === goome.QUIT) running = false;
  g.frame(0, (c) => {
    c.roundRect(100, 100, 220, 60, 12, 0xe0202838);
    c.text(118, 120, "im on top of everything", 0xffffffff);
    c.hit(100, 100, 220, 60);
  });
}
g.close();
```

<h3 align="center">🪟 A normal app 🪟</h3>

```js
const goome = require("goome");

const app = new goome.App({ title: "My app", width: 960, height: 640 });
let name = "";

app.run((ui) => {
  name = ui.input("Name", name);
  if (ui.button("Say hi")) ui.toast("hi " + name);
});
```

<h3 align="center">🎮 Inside a game engine 🎮</h3>

```js
const goome = require("goome");

const g = goome.openOffscreen(800, 600);
const ui = g.ui();
const win = { x: 20, y: 20, w: 260 };
let volume = 0.5;

function tick(mouseX, mouseY) {
  g.push(goome.MOTION, { x: mouseX, y: mouseY });   // your engines input goes in
  for (const ev of g.events(0)) ui.feed(ev);
  ui.frame(0, () => {
    ui.window("Settings", win, goome.WIN_MOVE, () => {
      volume = ui.slider("Volume", volume);
    });
  });
  const frame = g.lastFrame();                      // premultiplied BGRA pixels come out
  uploadTexture(frame.pixels, frame.w, frame.h);
}
```

<p align="center">
Overlay is still the default, nothing changes unless you ask for an app or offscreen.
</p>

<details>
<summary align="center"><b>⬇️ Install ⬇️</b></summary>

<br>

```sh
npm install https://github.com/goome-ui/node-goome/releases/download/v0.5.0/goome-0.5.0.tgz
```

<p align="center">
It isnt on npm, so it comes from the <a href="https://github.com/goome-ui/node-goome/releases">releases page</a>. That package already has the addon built for linux x64, windows x64 and both macs, so nobody has to compile anything. For another version swap <code>0.5.0</code> in both spots.<br> <br>
Or straight from git, that builds the addon with node-gyp, which needs a C compiler and Python. It takes a few seconds and only happens once:
</p>

```sh
npm install github:goome-ui/node-goome#v0.5.0
```

<p align="center">
On Debian/Ubuntu thats <code>sudo apt install build-essential python3</code>, on Mac <code>xcode-select --install</code>, on Windows the "Desktop development with C++" part of Visual Studio.
</p>

<p align="center">
Working from a clone:
</p>

```sh
git clone https://github.com/goome-ui/node-goome
cd node-goome
npm install
npm run build      # node-gyp rebuild
npm test
```
</details>

<details>
<summary align="center"><b>🤔 Why N-API 🤔</b></summary>

<br>

<p align="center">
I went with a plain N-API addon instead of koffi or ffi-napi. goome.h is one C file, so node-gyp compiles it straight into <code>goome.node</code> and theres no separate libgoome to find and load at runtime.<br>
koffi would still need that library built for every OS, and it ships its own native binaries on top. With N-API the only dependency is <code>node-gyp-build</code>.<br> <br>
N-API is ABI stable, so one prebuild per OS and arch works on every Node from 18 up, and prebuildify makes those in CI.<br>
Pixels come back as typed arrays straight over goomes memory, nothing gets copied. Electron doesnt allow that, so there the pixels get copied instead (<code>goome.zeroCopy</code> tells you which one you got).
</p>
</details>

<details>
<summary align="center"><b>🚀 Quick Start 🚀</b></summary>

<br>

<p align="center">
A whole overlay that draws a box and prints clicks on it:
</p>

```js
const goome = require("goome");

const g = goome.open("my overlay");
const pace = new goome.Pacer(60);
let running = true;
while (running) {
  for (const ev of g.events(pace.wait())) {
    if (ev.type === goome.QUIT) running = false;
    if (ev.type === goome.DOWN) console.log(`clicked at ${ev.x},${ev.y}`);
  }
  const c = g.begin(0);       // monitor 0, null when theres nothing to draw on
  if (!c) continue;
  c.roundRect(100, 100, 200, 80, 12, 0xe0202838);
  c.text(116, 128, "click me", 0xffffffff, true);
  c.hit(100, 100, 200, 80);   // only this part takes clicks
  g.end(c);
}
g.close();
```

<p align="center">
Colors are plain <code>0xAARRGGBB</code> numbers and every position is in logical desktop coords, same as in C.<br>
goome runs on your thread and never starts one, so the loop is yours. Keep it on the main thread on Mac.
</p>
</details>

<details>
<summary align="center"><b>🎛️ UI Kit 🎛️</b></summary>

<br>

<p align="center">
The immediate mode ui works like in C, except widgets dont take pointers, they hand you the new value back. You keep your own variables and call the widgets every frame.
</p>

```js
const g = goome.open({ title: "settings", noCapture: true });
const ui = g.ui();
const win = { x: 40, y: 40, w: 300 };     // h 0 = fit the content
const logo = goome.Bitmap.load("logo.png");
let volume = 0.5, muted = false, name = "goome";

for (;;) {
  for (const ev of g.events(16)) ui.feed(ev);
  ui.frame(0, () => {
    ui.window("Settings", win, goome.WIN_MOVE | goome.WIN_COLLAPSE, () => {
      ui.image(logo, 64, 64, 12);
      if (ui.button("Say hi")) console.log("hi");
      volume = ui.slider("Volume", volume, 0, 1, "%.2f");
      muted = ui.toggle("Muted", muted);
      name = ui.input("Name", name);
    });
  });
}
```

<p align="center">
<code>ui.changed</code> tells you if the last widget changed its value this frame, like the int the C functions return.<br>
A window keeps its spot, size and <code>open</code> in the plain object you pass it. Set <code>win.open = false</code> to hide it, <code>WIN_CLOSE</code> gives it an x that does the same.<br> <br>
Everything with a begin and an end works two ways. Pass a function last and it calls the end for you, even if your code throws, and only runs the function when theres something to draw. Or skip the function, check what it returns and call the end yourself: <code>window</code>, <code>scroll</code>, <code>app</code>, <code>table</code> and <code>split</code> always want their end, <code>menubar</code>, <code>menu</code>, <code>context</code>, <code>popup</code>, <code>modal</code> and <code>tree</code> only when they returned true.<br>
Things C flips for you (a modal being open, a checked menu item, a tree node) take a <code>goome.Flag</code>, and <code>goome.Split(0.3)</code> keeps where a split bar is.
</p>

```js
ui.table("files", 3, 200, goome.TABLE_SORTABLE | goome.TABLE_STRIPES, () => {
  ui.tableColumn("Name");
  ui.tableColumn("Size", 80);
  ui.tableColumn("Kind");
  const { col, desc } = ui.tableSort();
  for (const f of sortFiles(files, col, desc)) {
    ui.tableRow();
    ui.label(f.name);
    ui.tableNext();
    ui.label(f.size);
    ui.tableNext();
    ui.label(f.kind);
  }
});

ui.split("main", side, () => {
  ui.label("left");
  ui.splitNext();
  text = ui.textEdit("body", text, 0, goome.EDIT_LINE_NUMBERS | goome.EDIT_WRAP);
});

ui.scroll("log", 200, () => {
  const { first, last } = ui.listClip(lines.length);   // only the rows you can see
  for (let i = first; i < last; i++) ui.label(lines[i]);
});

if (ui.menu("File")) {
  if (ui.menuItem("Quit", "ctrl+q")) quit();
  ui.menuEnd();
}
```
</details>

<details>
<summary align="center"><b>🎨 Your Own Look 🎨</b></summary>

<br>

<p align="center">
Pick a preset, or hand <code>ui.theme.make</code> one accent color and it works out the rest. For a few widgets wrap them in <code>ui.style(...)</code>, it takes any theme field by name and puts it back after.
</p>

```js
ui.theme.preset("midnight");
ui.scale(1.25);
ui.theme.accent = 0xff6fdc5f;
ui.theme.setIcon("check", goome.Bitmap.load("check.png"));

ui.style({ radius: 99, accent: 0xfff59e0b }, () => {
  if (ui.button("Save")) save();
});

const item = ui.custom("knob", 48, 48, goome.ITEM_DRAG_Y);   // your own widget
ui.canvas.circle(item.x + 24, item.y + 24, 20, item.held ? 0xff6fdc5f : 0xff8090a0);
```

<p align="center">
<code>ui.config</code> has the timing and key binds (<code>ui.bind("copy", ["ctrl+c", "ctrl+insert"])</code>), and <code>ui.config.ease</code> takes your own easing function.<br>
Swapping skins and icons and drawing whole new widgets is in the <a href="https://goome-ui.github.io/docs/">docs</a>.
</p>
</details>

<details>
<summary align="center"><b>🎮 Engines And Offscreen 🎮</b></summary>

<br>

<p align="center">
<code>goome.openOffscreen(w, h, scale)</code> never opens a window. You push your engines input in, goome draws into a buffer it owns, and you copy that onto a texture. It never blocks and never starts a thread.
</p>

| | |
|:--|:--|
| `g.push(goome.DOWN, { x, y, button: 1 })` / `g.push(event)` | feed it input, any mode. `pushClick(x, y)` and `pushText("hi")` are shortcuts |
| `g.lastFrame()` | the frame from the last end, with `.pixels` (a `Uint32Array`), `.row(y)` and `.copy()`. Good until the next begin |
| `g.frameDirty()` | the rect (real px) that changed since you last asked, `null` if nothing did. The first one is the whole frame |
| `g.frameCopy(buf, { stride, format, rect })` | copies that part of the frame into your buffer. `format` is `FMT_BGRA_PREMUL`, `FMT_RGBA_PREMUL`, `FMT_BGRA` or `FMT_RGBA` (the last two unpremultiply). No `buf` gives you a new `Uint8Array` |
| `g.resize(w, h, scale)` | new size, sends `MONITORS` |
| `g.hit(x, y)` | true when that spot is on the ui. Only send clicks to goome when its true and your game gets the rest |
| `g.cursor` | what cursor the ui wants, copy it to your engine |
| `g.clipboard` / `g.setClipboard(text)` | goome keeps its own, sync it with your engines |

<p align="center">
<code>ui.wantsMouse</code> and <code>ui.wantsKeyboard</code> say when the ui is using the input, so your camera doesnt spin while someone drags a slider.<br>
<code>examples/offscreen.js</code> writes a frame to a PNG with nothing but Node.
</p>
</details>

<details>
<summary align="center"><b>🎞️ Animations 🎞️</b></summary>

<br>

<p align="center">
<code>ui.anim(id, target, ms, ease)</code> gives you a number that slides toward <code>target</code>. Call it every frame with whatever the target is right now, goome keeps the state per id and keeps redrawing until its there (<code>ui.animating</code>). <code>ui.animColor</code> does the same for colors.<br>
The ease can be a constant like <code>goome.EASE_SPRING</code> or just its name: <code>"smooth"</code>, <code>"linear"</code>, <code>"in"</code>, <code>"out"</code>, <code>"in out"</code>, <code>"back"</code>, <code>"spring"</code> or <code>"bounce"</code>. <code>goome.ease(kind, t)</code> gives you the raw curve.
</p>

```js
const x = ui.anim("drawer", open ? 1 : 0, 300, "spring");
const tint = ui.animColor("drawer tint", open ? 0xff6fdc5f : 0xff404858, 200, "linear");
```
</details>

<details>
<summary align="center"><b>🌍 Emoji, RTL, IME And Screen Readers 🌍</b></summary>

<br>

<p align="center">
<code>goome.Font.system()</code> already pulls in the system emoji font. For your own fonts, <code>font.fallback(other)</code> adds one to try for missing chars. Closing a font thats still somebodys fallback is fine, it only really goes away once nothing uses it.<br>
Hebrew and Arabic just work. <code>goome.textDir("rtl")</code> forces the direction for all text, <code>"auto"</code> (the default) goes by the first strong letter of each line.<br> <br>
Inputs and text edits turn the IME on by themselves while focused and draw what youre composing at the caret. If you do your own text box, <code>g.textInput(true, caret)</code> starts it, then you get <code>TEXT</code> events with the finished text in <code>ev.msg</code> (the whole thing, not cut at 63 bytes) and <code>PREEDIT</code> ones while composing, with the caret in <code>ev.id</code>. From an engine you push them with <code>g.pushCommit("日本")</code> and <code>g.pushPreedit("にほ", 3)</code>.<br> <br>
The ui kit builds an accessibility tree every frame and goome hands it to the screen reader in window mode. Its off in overlay and offscreen mode, <code>ui.a11y(true)</code> turns it on. <code>ui.a11yTree()</code> gives you an array of nodes with <code>roleName</code>, <code>label</code>, <code>value</code>, the box, <code>parent</code> as an index and <code>focused</code> / <code>checked</code> and friends, so an engine can bridge it to its own. For a <code>ui.custom</code> widget call <code>ui.a11yRole("button", "Knob")</code> and <code>ui.a11yValue("11")</code> right before it.
</p>
</details>

<details>
<summary align="center"><b>📚 The API 📚</b></summary>

<br>

<p align="center">
Everything from <a href="https://github.com/goome-ui/c-goome/blob/main/include/goome.h">goome.h</a> is in here, just camelCase. <a href="https://goome-ui.github.io/docs/">The docs</a> explain every part of it, the names there are the C ones. <code>index.d.ts</code> has the types.<br>
Errors throw <code>goome.GoomeError</code> (or a subclass like <code>goome.Again</code> or <code>goome.NotSupported</code>) with the C error code on <code>.code</code>.
</p>

```js
const g = goome.open({ title: "title", backend: "test" });   // or openApp / openOffscreen
g.monitors();                                    // areas, scale, real px
g.events(16);                                    // Event objects, waits up to 16 ms
g.hotkey("alt+h", 1);                            // comes back as a HOTKEY event
const img = g.capture(0, [0, 0, 200, 100]);      // an Image, .pixels / .copy()
const bmp = goome.Bitmap.load("logo.png");       // close() it when youre done
const font = goome.Font.system();                // measure(text, size) gives { w, h }
```

<p align="center">
Anything that holds native memory has <code>close()</code> (closing twice is fine) and works with <code>using</code> where your Node has it. Closing a goome closes its ui too.<br>
The raw C functions are all on <code>goome.native.fn</code> too, without the <code>goome_</code> part, if you ever need one the nice API doesnt cover.
</p>
</details>

<details>
<summary align="center"><b>🎨 Drawing 🎨</b></summary>

<br>

<p align="center">
The canvas methods are the C draw functions without the <code>goome_draw_</code> part, and they chain:
</p>

```js
c.rect(x, y, w, h, color);
c.rrect(x, y, w, h, 12, color);                 // one radius
c.rrect(x, y, w, h, [4, 20, 0, 33], color);     // tl tr br bl
c.rrectGrad(x, y, w, h, 12, top, bottom, false);
c.shadow(x, y, w, h, radius, blur, color);
c.circle(cx, cy, r, color).ring(cx, cy, r, width, color).arc(cx, cy, r, width, a0, a1, color);
c.poly([[80, 5], [98, 85], [40, 35]], color);
c.bitmap(bmp, x, y, w, h, radius, tint);
c.text(x, y, "built in font", color, true);
c.fontText(font, 20, x, y, "real font", color);
c.clip(20, 15, 80, 50, () => c.circle(60, 40, 30, color));
```

<p align="center">
<code>c.pixels</code> is a <code>Uint32Array</code> straight over goomes buffer (premultiplied ARGB, <code>c.stride</code> per row). Write into it and call <code>c.damage(rect)</code>. Same for <code>image.pixels</code> and <code>bitmap.pixels</code>.<br>
A grab stays good until you grab that monitor again. After that reading its pixels throws, call <code>image.copy()</code> if you want to keep them.
</p>
</details>

<details>
<summary align="center"><b>🧩 Examples 🧩</b></summary>

<br>

- `examples/hello.js` - a box you can click and type into, alt+h hides it, esc or the x quits
- `examples/ui_demo.js` - the ui kit demo with every widget, a theme editor and a stats window
- `examples/app.js` - a small notes app in a normal window with menus, a split pane, a text editor, right click menus and a dialog
- `examples/offscreen.js` - draws the ui with no window and saves it as a PNG
- `examples/anim.js` - a ball that slides over with whatever ease you pick, plus the curve
- `examples/text.js` - emoji, hebrew and arabic with a switch for the text direction. Give it a font file to add as a fallback
- `examples/a11y.js` - prints the accessibility tree of a small settings window

```sh
node examples/ui_demo.js
```

<p align="center">
Theyre ports of the C and Python examples. The offscreen one comes out pixel for pixel the same as <code>examples/offscreen.py</code> in python-goome.<br>
More small projects live in <a href="https://github.com/goome-ui/examples">goome-ui/examples</a>.
</p>
</details>

<details>
<summary align="center"><b>🖥️ Where It Works 🖥️</b></summary>

<br>

<p align="center">
Linux (X11 and Wayland), Windows 10 / 11 and macOS 14+, same as goome. Not every desktop can do everything, the <a href="https://github.com/goome-ui/c-goome#readme">c-goome README</a> has the table and <code>g.can(goome.CAP_HOTKEYS)</code> tells you at runtime.<br>
Node 18 and up, 64 bit.
</p>
</details>

<details>
<summary align="center"><b>🧪 Testing Without A Screen 🧪</b></summary>

<br>

<p align="center">
goome has a <b>test</b> backend that fakes a screen and plays a script of what the "user" does. All the tests here run on it, no display needed:
</p>

```sh
npm test
```

<p align="center">
You can test your own app the same way, with env vars and no code changes:
</p>

```sh
GOOME_BACKEND=test GOOME_TEST_SCRIPT="1 click 400,300; 2 key hi\n; end 10" node myapp.js
```

<p align="center">
or straight from JS:
</p>

```js
const g = goome.open({ backend: "test", testScript: "screen 800x600 1; 1 click 120,90; end 5" });
```

<p align="center">
The script format is in the <a href="https://github.com/goome-ui/c-goome#readme">c-goome README</a>. The drawing tests check the exact same pixel hashes as the tests in c-goome, on every OS.
</p>
</details>

<details>
<summary align="center"><b>🔧 Updating goome 🔧</b></summary>

<br>

```sh
tools/update_native.sh ../c-goome      # or a path to any goome.h, or nothing to clone main
npm run build && npm test
```

<p align="center">
<code>native/VERSION</code> keeps the commit it came from. The script also runs <code>tools/gen-api.js</code>, which makes the C wrappers in <code>src/api.c</code> and the constants from goome.h. If the layout test fails after that, a struct changed and <code>lib/layout.js</code> needs the same change.
</p>
</details>

<details>
<summary align="center"><b>🛠 Pull Requests 🛠</b></summary>

<br>

<p align="center">
Want to help with node-goome? Make A pull request to <b>dev</b>!<br>
Small fixes are the easiest to merge, for anything bigger open an issue first so we can talk about it. Bugs in the C side go to <a href="https://github.com/goome-ui/c-goome">c-goome</a>.<br> <br>
As long as it works and doesn't add a dependency its very likely to get accepted!<br>
Read <a href="CONTRIBUTING.md">CONTRIBUTING.md</a> before you send one.
</p>
</details>

<details>
<summary align="center"><b>⚖️ License ⚖️</b></summary>

<br>

<p align="center">
node-goome is under the <a href="LICENSE">GPL-3.0</a>.<br> <br>
<sub>
• You can use it, change it and share it<br>
• If you share something made with it, you have to share your source too, under the same license<br>
• Keep the credits
</sub><br> <br>
In short: play fair, keep it open, and give credit where it's due.
</p>
</details>

<details>
<summary align="center"><b>🩷 Donate 🩷</b></summary>

<br>

<p align="center">
<a href="https://sevvy-wevvy.com/kofi">Ko-fi</a> (Preferred)<br>
<a href="https://sevvy-wevvy.com/patreon">Patreon</a><br>
<a href="https://sevvy-wevvy.com/throne">Throne</a>
</p>
</details>

<p align="center">
<b>🫶 Contributors 🫶</b><br>
Thanks to everyone who helped out!<br> <br>
<a href="https://github.com/goome-ui/node-goome/graphs/contributors"><img src="https://contrib.rocks/image?repo=goome-ui/node-goome" alt="contributors"></a>
</p>
