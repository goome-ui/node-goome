import * as goome from "../../index";

declare function show(...v: unknown[]): void;

const g: goome.Goome = goome.openOffscreen(200, 120, 1);
const ui = g.ui();
const win: goome.WindowState = { x: 10, y: 10, w: 180 };
const flag = new goome.Flag(true);
let volume = 0.5;
let name = "hi";
let on = false;

for (const ev of g.events(0)) {
  if (ev.type === goome.KEY) show(ev.text);
  ui.feed(ev);
}

ui.frame(0, (u, c) => {
  c.rect(0, 0, 10, 10, 0xff00ff00).circle(5, 5, 2, 0xffffffff);
  u.window("types", win, goome.WIN_MOVE, () => {
    volume = u.slider("Volume", volume, 0, 1, "%.2f");
    name = u.input("Name", name);
    on = u.checkbox("On", on);
    u.menuItem("Check", null, flag);
    const it: goome.Item = u.custom("knob", 20, 20, goome.ITEM_DRAG_X);
    if (it.held) u.label(it.dragX);
    const store: Float64Array = u.store("s", 2);
    store[0] = 1;
  });
});

const frame: goome.Image = g.lastFrame();
const px: Uint32Array = frame.pixels;
const rgba: Uint8Array = g.frameCopy(null, { format: goome.FMT_RGBA });
const t: goome.Theme = goome.Theme.preset("mint");
ui.theme.accent = 0xff6fdc5f;
ui.config.ease = (x) => x * x;
const app = new goome.App({ title: "x", fps: 30 });
app.frame((u) => u.label("hi"));
const slide: number = ui.anim("slide", 1, 300, "spring");
const tint: number = ui.animColor("tint", 0xff6fdc5f, 200, goome.EASE_LINEAR);
ui.a11y(true);
ui.a11yRole("button", "Knob");
ui.a11yValue("11");
const nodes: goome.A11yNode[] = ui.a11yTree();
const parent: number | null = nodes.length ? nodes[0].parent : null;
goome.textDir("rtl");
g.textInput(true, { x: 10, y: 20, w: 1, h: 16 });
g.pushPreedit("kana", 2);
g.pushCommit("\u65e5\u672c");
const ime: string = g.eventText;
const f2 = goome.Font.system();
if (f2) f2.fallback(f2);
show(px.length, rgba.length, t.radius, slide, tint, parent, ime, goome.ease("bounce", 0.5));
t.close();
ui.close();
g.close();
