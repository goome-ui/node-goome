export * from "./lib/consts";

export declare const VERSION: string;
export declare const zeroCopy: boolean;

export type Color = number;
export type RectLike = Rect | [number, number, number, number];
export type Radii = number | [number, number, number, number] | { tl?: number; tr?: number; br?: number; bl?: number };

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export declare class GoomeError extends Error {
  constructor(code: number, message?: string);
  code: number;
}
export declare class NotSupported extends GoomeError {}
export declare class Denied extends GoomeError {}
export declare class NoDisplay extends GoomeError {}
export declare class Gone extends GoomeError {}
export declare class Again extends GoomeError {}
export declare class NoMemory extends GoomeError {}
export declare class BadArg extends GoomeError {}

export declare function strerror(code: number): string;
export declare function parseCombo(combo: string): { key: number; mods: number };
export declare function send(stateDir: string, msg: string): void;
export declare function nowMs(): number;
export declare function savePpm(path: string, pixels: Uint32Array, w: number, h: number, stride?: number): void;
export declare function radius(r: number): [number, number, number, number];
export declare function measure(text: string, size: number, font?: Font | null): number;
export declare function lineHeight(size: number, font?: Font | null): number;
export declare function setFont(index: number): void;
export declare function textDir(dir: number | "auto" | "ltr" | "rtl"): void;
export type Ease = number | "smooth" | "linear" | "out" | "in_out" | "in out" | "back" | "custom" | "in" | "spring" | "bounce";
export declare function ease(kind: Ease, t: number): number;
export declare const EASES: string[];
export declare function fontCount(): number;
export declare function pixelView(address: number, count: number): Uint32Array;

export interface EventFields {
  type?: number | string;
  x?: number;
  y?: number;
  mon?: number;
  button?: number;
  dy?: number;
  key?: number;
  mods?: number;
  text?: string;
  id?: number;
  msg?: string;
}

export declare class Event {
  constructor(fields?: EventFields);
  type: number;
  x: number;
  y: number;
  mon: number;
  button: number;
  dy: number;
  key: number;
  mods: number;
  text: string;
  id: number;
  msg: string;
  path: string | null;
  readonly name: string;
}

export interface Monitor {
  id: number;
  name: string;
  area: Rect;
  scale: number;
  pw: number;
  ph: number;
  rotation: number;
}

export declare class Image {
  readonly w: number;
  readonly h: number;
  readonly stride: number;
  readonly area: Rect;
  readonly mon: number;
  readonly hasSelf: boolean;
  readonly hasCursor: boolean;
  readonly cursor: Rect;
  readonly fresh: boolean;
  readonly pixels: Uint32Array;
  row(y: number): Uint32Array;
  pixel(x: number, y: number): number;
  copy(): Uint32Array;
  savePpm(path: string): void;
}

export declare class Pacer {
  constructor(fps?: number);
  fps: number;
  wait(fps?: number): number;
}

export declare class Bitmap {
  static load(path: string): Bitmap;
  static fromBytes(data: Uint8Array | ArrayBuffer): Bitmap;
  static fromArgb(pixels: Uint32Array | number[], w: number, h: number): Bitmap;
  static wrap(pixels: Uint32Array | number[], w: number, h: number, stride?: number): Bitmap;
  readonly w: number;
  readonly h: number;
  readonly stride: number;
  readonly owned: boolean;
  readonly closed: boolean;
  readonly pixels: Uint32Array;
  close(): void;
  [Symbol.dispose](): void;
}

export declare class Font {
  static load(path: string, index?: number): Font;
  static fromBytes(data: Uint8Array | ArrayBuffer): Font;
  static system(name?: string | null): Font | null;
  readonly closed: boolean;
  measure(text: string, size: number): { w: number; h: number };
  width(text: string, size: number): number;
  lineHeight(size: number): number;
  fallback(other: Font): this;
  readonly fallbacks: Font[];
  close(): void;
  [Symbol.dispose](): void;
}

export interface CanvasRaw {
  px: number;
  w: number;
  h: number;
  stride: number;
  ox: number;
  oy: number;
  scale: number;
  mon: number;
  dx0: number;
  dy0: number;
  dx1: number;
  dy1: number;
  cx0: number;
  cy0: number;
  cx1: number;
  cy1: number;
  kx0: number;
  ky0: number;
  kx1: number;
  ky1: number;
  nclip: number;
}

export declare class Canvas {
  static new(w: number, h: number, opts?: { stride?: number; scale?: number; ox?: number; oy?: number }): Canvas;
  readonly valid: boolean;
  readonly raw: CanvasRaw;
  readonly w: number;
  readonly h: number;
  readonly stride: number;
  readonly scale: number;
  readonly ox: number;
  readonly oy: number;
  readonly mon: number;
  readonly address: number;
  readonly drawn: Rect;
  readonly pixels: Uint32Array;
  row(y: number): Uint32Array;
  hit(x: number, y: number, w: number, h: number): this;
  damage(rect?: RectLike | null): this;
  clear(): this;
  rect(x: number, y: number, w: number, h: number, argb: Color): this;
  roundRect(x: number, y: number, w: number, h: number, radius: number, argb: Color): this;
  frame(x: number, y: number, w: number, h: number, width: number, argb: Color): this;
  line(x0: number, y0: number, x1: number, y1: number, width: number, argb: Color): this;
  triangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, argb: Color): this;
  image(x: number, y: number, w: number, h: number, pixels: Uint32Array | number[], iw: number, ih: number): this;
  erase(x: number, y: number, w: number, h: number): this;
  text(x: number, y: number, text: string, argb?: Color, big?: boolean): number;
  textWidth(text: string, big?: boolean): number;
  fontText(font: Font | null, size: number, x: number, y: number, text: string, argb?: Color): number;
  blit(src: Canvas, alpha?: number, dx?: number, dy?: number): this;
  clipPush(x: number, y: number, w: number, h: number): this;
  clipPop(): this;
  clip<T>(x: number, y: number, w: number, h: number, body: (c: this) => T): T;
  rrect(x: number, y: number, w: number, h: number, r: Radii, argb: Color): this;
  rrectLine(x: number, y: number, w: number, h: number, r: Radii, width: number, argb: Color): this;
  rrectGrad(x: number, y: number, w: number, h: number, r: Radii, from: Color, to: Color, sideways?: boolean): this;
  shadow(x: number, y: number, w: number, h: number, radius: number, blur: number, argb: Color): this;
  circle(cx: number, cy: number, r: number, argb: Color): this;
  ring(cx: number, cy: number, r: number, width: number, argb: Color): this;
  arc(cx: number, cy: number, r: number, width: number, a0: number, a1: number, argb: Color): this;
  poly(points: number[] | Array<[number, number]>, argb: Color): this;
  bitmap(bmp: Bitmap, x: number, y: number, w: number, h: number, r?: Radii, tint?: Color): this;
  bitmapPart(bmp: Bitmap, sx: number, sy: number, sw: number, sh: number, x: number, y: number, w: number, h: number, tint?: Color): this;
  bitmapNine(bmp: Bitmap, x: number, y: number, w: number, h: number, left: number, top?: number, right?: number, bottom?: number): this;
  close(): void;
  [Symbol.dispose](): void;
}

export interface OpenOptions {
  title?: string;
  backend?: number | "auto" | "wayland" | "gnome" | "portal" | "x11" | "win32" | "macos" | "test" | "offscreen";
  stateDir?: string;
  noCapture?: boolean;
  captureFps?: number;
  hideSelf?: boolean;
  testFrames?: string;
  testScript?: string;
  testShots?: string;
  mode?: number | "overlay" | "window" | "offscreen";
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  windowFlags?: number;
  scale?: number;
}

export interface FrameCopyOptions {
  stride?: number;
  format?: number;
  rect?: RectLike;
}

export declare class Goome {
  constructor(opts?: OpenOptions | string);
  readonly closed: boolean;
  readonly error: string | null;
  readonly backendName: string;
  readonly caps: number;
  readonly mode: number;
  readonly grabbed: boolean;
  readonly controlPath: string | null;
  readonly size: { w: number; h: number };
  readonly pos: { x: number; y: number } | null;
  readonly state: number;
  readonly cursor: number;
  readonly clipboard: string;
  readonly dropPath: string | null;
  readonly eventText: string;
  readonly preeditCursor: number;
  textInput(on?: boolean, caret?: RectLike | null): number;
  close(): void;
  [Symbol.dispose](): void;
  can(cap: number): boolean;
  monitors(): Monitor[];
  capture(mon?: number, rect?: RectLike | null): Image;
  alphaAt(x: number, y: number): number;
  begin(mon?: number): Canvas | null;
  end(canvas: Canvas, hits?: RectLike[]): number;
  frame(body: (c: Canvas) => void): boolean;
  frame(mon: number, body: (c: Canvas) => void): boolean;
  damage(canvas: Canvas, rect?: RectLike | null): void;
  poll(timeoutMs?: number): Event | null;
  events(timeoutMs?: number): Generator<Event, void, undefined>;
  pointer(): { x: number; y: number; buttons: number } | null;
  keyboard(on?: boolean): number;
  grab(on?: boolean): number;
  hotkey(combo: string, id: number): number;
  ui(): Ui;
  setTitle(title: string): void;
  setSize(w: number, h: number): void;
  resize(w: number, h: number, scale?: number): void;
  setPos(x: number, y: number): void;
  setState(state: number): void;
  minimize(): void;
  maximize(): void;
  fullscreen(on?: boolean): void;
  drag(edges?: number): number;
  show(on?: boolean): number;
  hide(): number;
  setCursor(shape: number): number;
  setClipboard(text: string): void;
  push(ev: Event): void;
  push(type: number | string, fields?: EventFields): void;
  pushText(text: string): void;
  pushClick(x: number, y: number, button?: number): void;
  pushCommit(text: string): void;
  pushPreedit(text: string, cursor?: number): void;
  lastFrame(): Image;
  hit(x: number, y: number): boolean;
  frameDirty(): Rect | null;
  frameCopy(buf?: null, opts?: FrameCopyOptions): Uint8Array;
  frameCopy<T extends ArrayBufferView | ArrayBuffer>(buf: T, opts?: FrameCopyOptions): T;
}

export declare function open(opts?: OpenOptions | string): Goome;
export declare function openApp(title?: string, width?: number, height?: number, opts?: OpenOptions): Goome;
export declare function openOffscreen(width?: number, height?: number, scale?: number, opts?: OpenOptions): Goome;

export interface WindowState {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  open?: boolean;
}

export interface FlagLike {
  value: boolean;
}

export declare class Flag implements FlagLike {
  constructor(value?: boolean);
  value: boolean;
  toggle(): boolean;
}

export interface SplitLike {
  frac?: number;
  vertical?: boolean;
}

export declare class Split implements SplitLike {
  constructor(frac?: number, vertical?: boolean);
  frac: number;
  vertical: boolean;
}

export interface Skin {
  bitmap: Bitmap;
  l: number;
  t: number;
  r: number;
  b: number;
}
export type SkinLike = Skin | [Bitmap, number] | [Bitmap, number, number, number, number] | { bitmap: Bitmap; l?: number; t?: number; r?: number; b?: number };

export interface Item {
  changed: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  hovered: boolean;
  pressed: boolean;
  held: boolean;
  released: boolean;
  clicked: boolean;
  doubleClicked: boolean;
  rightClicked: boolean;
  focused: boolean;
  mx: number;
  my: number;
  dx: number;
  dy: number;
  dragX: number;
  dragY: number;
  key: number;
}

export interface StyleValues {
  theme?: Theme;
  radii?: Radii;
  font?: Font | null;
  skin?: [number | string, ...unknown[]];
  icons?: Record<string, Bitmap | null>;
  [style: string]: unknown;
}

export declare class Theme {
  static make(accent: Color, dark?: boolean, radius?: number): Theme;
  static preset(name: number | string): Theme;
  dark(): this;
  light(): this;
  make(accent: Color, dark?: boolean, radius?: number): this;
  preset(name: number | string): this;
  copy(): Theme;
  icon(i: number | string): Bitmap | null;
  setIcon(i: number | string, bmp: Bitmap | null): this;
  clearIcons(): this;
  skin(name: string): Skin | null;
  setSkin(name: string, skin: SkinLike | null): this;
  toJSON(): Record<string, number>;
  update(values: Record<string, unknown>): this;
  close(): void;
  [Symbol.dispose](): void;
  iconTint: Color;
  font: Font | null;
  fontHeading: Font | null;
  fontMono: Font | null;
  fontSmall: Font | null;
  bg: Color; panel: Color; border: Color; text: Color; textDim: Color; accent: Color; accentText: Color;
  hover: Color; active: Color; inputBg: Color; shadow: Color;
  focus: Color; select: Color; caret: Color; link: Color; badge: Color; toast: Color; tooltip: Color; danger: Color; knob: Color; dim: Color;
  radius: number; pad: number; gap: number; borderWidth: number; fontSize: number; shadowBlur: number; animMs: number;
  checkSize: number; checkRadius: number; toggleW: number; toggleH: number; sliderH: number; sliderTrack: number; knobSize: number;
  scrollW: number; scrollMin: number; itemH: number; menuItemH: number; tabH: number; winTitleH: number; appTitleH: number; menubarH: number; statusbarH: number;
  focusW: number; focusGap: number; sepW: number; grip: number; indent: number; plotW: number; spinner: number; caretW: number;
  winMinW: number; winMinH: number; popGap: number; menuGap: number; tipPadX: number; tipPadY: number; tipX: number; tipY: number; tipRadius: number;
  shadowX: number; shadowY: number; align: number; headingSize: number; smallSize: number; ease: number;
  hoverMs: number; pressMs: number; popupMs: number; collapseMs: number; toastFadeMs: number;
  skinButton: Skin | null; skinPanel: Skin | null; skinInput: Skin | null; skinCheckbox: Skin | null; skinRadio: Skin | null;
  skinToggle: Skin | null; skinSlider: Skin | null; skinSliderFill: Skin | null; skinScrollbar: Skin | null; skinTab: Skin | null;
  skinTitlebar: Skin | null; skinTooltip: Skin | null; skinMenu: Skin | null; skinPopup: Skin | null;
}

export declare class Config {
  tipDelayMs: number; dblClickMs: number; dblClickPx: number; dragPx: number; repeatDelayMs: number; repeatMs: number;
  blinkMs: number; menuDelayMs: number; toastMs: number; scrollLines: number;
  raiseOnClick: boolean; escCloses: boolean; tabNav: boolean; focusOnMouse: boolean;
  mask: string | null;
  ease: ((t: number) => number) | null;
  cursor(what: number | string): number;
  setCursor(what: number | string, shape: number): this;
  keys(action: number | string): Array<{ key: number; mods: number }>;
  bind(action: number | string, combos: string | string[]): Ui;
  reset(): this;
}

type Body = (ui: Ui) => void;

export declare class Ui {
  constructor(g: Goome);
  changed: boolean;
  entered: boolean;
  readonly theme: Theme;
  readonly config: Config;
  readonly closed: boolean;
  readonly animating: boolean;
  readonly wants: number;
  readonly wantsMouse: boolean;
  readonly wantsKeyboard: boolean;
  readonly hovered: boolean;
  readonly focused: boolean;
  readonly canvas: Canvas | null;
  autoGrab: number;
  close(): void;
  [Symbol.dispose](): void;
  feed(ev: Event): boolean;
  begin(mon?: number): Canvas | null;
  end(): void;
  frame(body: (ui: Ui, c: Canvas) => void): boolean;
  frame(mon: number, body: (ui: Ui, c: Canvas) => void): boolean;
  hit(x: number, y: number, w: number, h: number): void;
  scale(s: number): void;

  window(title: string, state?: WindowState | null, flags?: number, body?: Body): boolean;
  window(title: string, state: WindowState | null, body: Body): boolean;
  windowEnd(): void;
  row(cols: number): void;
  sameLine(): void;
  space(px: number): void;
  separator(): void;
  width(w: number): void;
  pos(x: number, y: number): void;
  size(w?: number, h?: number): void;

  label(text: unknown): void;
  heading(text: string): void;
  wrapped(text: string): void;
  button(label: string): boolean;
  imageButton(id: string, bmp: Bitmap, w: number, h: number): boolean;
  image(bmp: Bitmap, w: number, h: number, radius?: number): void;
  checkbox(label: string, value: boolean): boolean;
  toggle(label: string, value: boolean): boolean;
  radio(label: string, value: number, option: number): number;
  slider(label: string, value: number, lo?: number, hi?: number, fmt?: string | null): number;
  sliderInt(label: string, value: number, lo?: number, hi?: number): number;
  input(label: string, text: string, cap?: number): string;
  inputEx(label: string, text: string, flags?: number, hint?: string | null, cap?: number): string;
  password(label: string, text: string, hint?: string | null, flags?: number, cap?: number): string;
  combo(label: string, sel: number, items: string[]): number;
  selectable(label: string, selected?: boolean): boolean;
  tabs(id: string, names: string[], sel: number): number;
  collapsing(label: string, open?: boolean | FlagLike | null): boolean;
  progress(frac: number, text?: string | null): void;
  color(label: string, argb: Color): Color;
  tooltip(text: string): void;
  setFocus(): void;

  scroll(id: string, h?: number, body?: Body): boolean;
  scroll(id: string, body: Body): boolean;
  scrollBegin(id: string, h?: number): boolean;
  scrollEnd(): void;
  pushId(id: unknown): void;
  popId(): void;
  id<T>(id: unknown, body: (ui: Ui) => T): T;

  app(title?: string | null, flags?: number, body?: Body): boolean;
  app(body: Body): boolean;
  appEnd(): void;
  menubar(body?: Body): boolean;
  menubarEnd(): void;
  menu(label: string, body?: Body): boolean;
  menuEnd(): void;
  menuItem(label: string, shortcut?: string | null, checked?: FlagLike | null): boolean;
  menuSeparator(): void;
  context(id: string, body?: Body): boolean;
  contextEnd(): void;
  popupOpen(id: string): void;
  popup(id: string, body?: Body): boolean;
  popupEnd(): void;
  popupClose(): void;
  modal(title: string, open?: FlagLike | null, body?: Body): boolean;
  modal(title: string, body: Body): boolean;
  modalEnd(): void;
  toast(text: string, ms?: number): void;
  statusbar(text: string): void;

  textEdit(id: string, text: string, h?: number, flags?: number, cap?: number | null): string;
  table(id: string, cols: number, h?: number, flags?: number, body?: Body): boolean;
  tableColumn(name: string, width?: number): void;
  tableSort(col?: number, desc?: boolean): { changed: boolean; col: number; desc: boolean };
  tableRow(): void;
  tableNext(): void;
  tableEnd(): void;
  tree(label: string, open?: FlagLike | null, body?: Body): boolean;
  tree(label: string, body: Body): boolean;
  treeEnd(): void;
  listClip(count: number, rowH?: number): { first: number; last: number };
  dragFloat(label: string, value: number, speed?: number, lo?: number, hi?: number, fmt?: string | null): number;
  dragInt(label: string, value: number, speed?: number, lo?: number, hi?: number): number;
  number(label: string, value: number, step?: number, fmt?: string | null): number;
  plotLines(label: string, values: ArrayLike<number>, lo?: number | null, hi?: number | null, h?: number): void;
  plotBars(label: string, values: ArrayLike<number>, lo?: number | null, hi?: number | null, h?: number): void;
  split(id: string, pane?: SplitLike | null, body?: Body): boolean;
  split(id: string, body: Body): boolean;
  splitNext(): void;
  splitEnd(): void;
  dragSource(type: string, data: string | Uint8Array): boolean;
  dropTarget(type: string, cap?: number): Uint8Array | null;
  spinner(size?: number): void;
  link(text: string): boolean;
  badge(text: string, argb?: Color | null): void;

  pushColor(what: number | string, argb: Color): void;
  pushNum(what: number | string, v: number | string): void;
  pushRadii(r: Radii): void;
  pushFont(font: Font | null): void;
  pushSkin(kind: number | string, skin: SkinLike | null): void;
  pushIcon(icon: number | string, bmp: Bitmap | null): void;
  pushTheme(theme: Theme): void;
  pop(n?: number): void;
  style(values: StyleValues): number;
  style<T>(values: StyleValues, body: (ui: Ui) => T): T;

  custom(id: string, w?: number, h?: number, flags?: number): Item;
  store(id: string, n: number): Float64Array;
  bind(action: number | string, combos: string | string[]): this;
  anim(id: string, target: number, ms?: number, ease?: Ease): number;
  animColor(id: string, target: number, ms?: number, ease?: Ease): number;
  a11y(on?: boolean): void;
  a11yRole(role: number | string, label?: string): void;
  a11yValue(value: string): void;
  a11yTree(): A11yNode[];
}

export interface A11yNode {
  role: number;
  roleName: string;
  parent: number | null;
  states: number;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  value: string;
  id: number;
  num: number;
  min: number;
  max: number;
  caret: number;
  focused: boolean;
  checked: boolean;
  disabled: boolean;
  expanded: boolean;
  selected: boolean;
}

export interface AppOptions extends OpenOptions {
  title?: string;
  width?: number;
  height?: number;
  flags?: number;
  fps?: number;
  idleMs?: number;
  light?: boolean;
}

export declare class App {
  constructor(opts?: AppOptions | string);
  title: string;
  width: number;
  height: number;
  flags: number;
  fps: number;
  idleMs: number;
  light: boolean;
  animate: boolean;
  running: boolean;
  frames: number;
  g: Goome | null;
  ui: Ui | null;
  frame(draw: (ui: Ui) => void): this;
  onEvent(handler: (ev: Event) => boolean | void): this;
  onClose(handler: () => boolean | void): this;
  onStart(handler: (app: App) => void): this;
  redraw(): void;
  quit(): void;
  start(): this;
  step(wait?: boolean): boolean;
  stop(): void;
  run(draw?: (ui: Ui) => void): void;
}

export declare const STYLE_NAMES: string[];
export declare const ALIGN_NAMES: string[];
export declare const EASE_NAMES: string[];
export declare const ROLE_NAMES: string[];
export declare const PRESET_NAMES: string[];
export declare const ICON_NAMES: string[];
export declare const SKIN_NAMES: string[];
export declare const ACT_NAMES: string[];
export declare const CUR_NAMES: string[];
