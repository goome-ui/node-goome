export * from "./lib/consts";

/** goome version string. */
export declare const VERSION: string;
/** true when pixel views point straight at goome's memory instead of copies. */
export declare const zeroCopy: boolean;

/** 0xAARRGGBB number. Plain, not premultiplied. */
export type Color = number;
/** A Rect or an [x, y, w, h] array. */
export type RectLike = Rect | [number, number, number, number];
/** One radius for all corners, [tl, tr, br, bl], or an object with any of tl, tr, br, bl. */
export type Radii = number | [number, number, number, number] | { tl?: number; tr?: number; br?: number; bl?: number };

/** A rectangle in logical coordinates. */
export interface Rect {
  /** Left edge. */
  x: number;
  /** Top edge. */
  y: number;
  /** Width. */
  w: number;
  /** Height. */
  h: number;
}

/** Base error for everything goome throws. code is the GOOME_E* number. */
export declare class GoomeError extends Error {
  /** Makes an error from a goome error code. */
  constructor(code: number, message?: string);
  /** The GOOME_E* code, like EDENIED. */
  code: number;
}
/** The backend or os cant do this. */
export declare class NotSupported extends GoomeError {}
/** The os or the user said no, like a refused screen capture permission. */
export declare class Denied extends GoomeError {}
/** No display to talk to. */
export declare class NoDisplay extends GoomeError {}
/** The thing you used is gone, like an old Image or a closed window. */
export declare class Gone extends GoomeError {}
/** Not ready yet, try again. */
export declare class Again extends GoomeError {}
/** Ran out of memory. */
export declare class NoMemory extends GoomeError {}
/** A bad argument went into goome. */
export declare class BadArg extends GoomeError {}

/** Text for a goome error code. */
export declare function strerror(code: number): string;
/** Turns a combo like "ctrl+shift+k" into a key and mods. */
export declare function parseCombo(combo: string): { key: number; mods: number };
/** Sends a message line to the control fifo of a goome app that uses this stateDir. */
export declare function send(stateDir: string, msg: string): void;
/** Milliseconds from goome's clock. */
export declare function nowMs(): number;
/** Writes pixels to a .ppm file. */
export declare function savePpm(path: string, pixels: Uint32Array, w: number, h: number, stride?: number): void;
/** Turns a single radius into the [tl, tr, br, bl] form. */
export declare function radius(r: number): [number, number, number, number];
/** Width of text in logical px. Without a font it uses the built in one. */
export declare function measure(text: string, size: number, font?: Font | null): number;
/** Line height for a font size. Without a font it uses the built in one. */
export declare function lineHeight(size: number, font?: Font | null): number;
/** Picks which built in font plain canvas.text uses. */
export declare function setFont(index: number): void;
/** Paragraph direction for all text: auto goes by the first strong letter of each line. */
export declare function textDir(dir: number | "auto" | "ltr" | "rtl"): void;
/** An easing id or its name. */
export type Ease = number | "smooth" | "linear" | "out" | "in_out" | "in out" | "back" | "custom" | "in" | "spring" | "bounce";
/** Runs an easing curve, t goes 0 to 1 and the result is the eased 0 to 1. */
export declare function ease(kind: Ease, t: number): number;
/** Names of the easing curves. */
export declare const EASES: string[];
/** How many built in fonts there are. */
export declare function fontCount(): number;
/** Wraps native memory at address as a Uint32Array of count pixels. */
export declare function pixelView(address: number, count: number): Uint32Array;

/** Fields you can pass when making an Event. type can be a number or its name. */
export interface EventFields {
  /** Event type, like KEY or DOWN. Names work too. */
  type?: number | string;
  /** Pointer x, logical. */
  x?: number;
  /** Pointer y, logical. */
  y?: number;
  /** Monitor index. */
  mon?: number;
  /** 1 left, 2 middle, 3 right. */
  button?: number;
  /** Scroll notches, +1 is down. */
  dy?: number;
  /** Lowercase ascii or a K_ constant. */
  key?: number;
  /** SHIFT, CTRL, ALT and SUPER ored together. */
  mods?: number;
  /** Text the key typed, can be empty. */
  text?: string;
  /** Hotkey id, or for FOCUS 1 when focus was gained and 0 when lost. */
  id?: number;
  /** Message text, for CONTROL, DROP, TEXT and PREEDIT. */
  msg?: string;
}

/** An input or window event from Goome.poll. */
export declare class Event {
  /** Makes an event, handy for Goome.push. */
  constructor(fields?: EventFields);
  /** Event type, like KEY or DOWN. */
  type: number;
  /** Pointer x, logical. */
  x: number;
  /** Pointer y, logical. */
  y: number;
  /** Monitor index. */
  mon: number;
  /** 1 left, 2 middle, 3 right. */
  button: number;
  /** Scroll notches, +1 is down. */
  dy: number;
  /** Lowercase ascii or a K_ constant. */
  key: number;
  /** SHIFT, CTRL, ALT and SUPER ored together. */
  mods: number;
  /** Text the key typed, can be empty. */
  text: string;
  /** Hotkey id, or for FOCUS 1 when focus was gained and 0 when lost. */
  id: number;
  /** Message text, for CONTROL, TEXT and PREEDIT. */
  msg: string;
  /** Full path of the dropped file for DROP, otherwise null. */
  path: string | null;
  /** The type as a word, like "key". */
  readonly name: string;
}

/** One monitor. area is in logical desktop coords. */
export interface Monitor {
  /** Monitor index. */
  id: number;
  /** Monitor name from the os. */
  name: string;
  /** Where it sits on the desktop, logical coords. */
  area: Rect;
  /** Real px per logical px. */
  scale: number;
  /** Width in real px. */
  pw: number;
  /** Height in real px. */
  ph: number;
  /** 0, 90, 180 or 270, plus 360 if mirrored. Grabs and canvases already undo it. */
  rotation: number;
}

/** A grabbed screen image. Its pixels are only good until the next capture of that monitor. */
export declare class Image {
  /** Width in real px. */
  readonly w: number;
  /** Height in real px. */
  readonly h: number;
  /** Row length in pixels, can be more than w. */
  readonly stride: number;
  /** The logical area it covers. */
  readonly area: Rect;
  /** Monitor index it came from. */
  readonly mon: number;
  /** True if our own overlay is in it, mask it with Goome.alphaAt. */
  readonly hasSelf: boolean;
  /** True if the mouse got baked in at cursor. */
  readonly hasCursor: boolean;
  /** Where the mouse got baked in, logical. */
  readonly cursor: Rect;
  /** False once goome reused the pixels. Then pixels throws, so copy() first if you need them. */
  readonly fresh: boolean;
  /** The pixels as 0xFFRRGGBB, good until the next grab of that monitor. */
  readonly pixels: Uint32Array;
  /** One row of pixels, w long. */
  row(y: number): Uint32Array;
  /** One pixel. Throws if x,y is outside the image. */
  pixel(x: number, y: number): number;
  /** Copies the pixels into your own tightly packed array. */
  copy(): Uint32Array;
  /** Saves the image as a .ppm file. */
  savePpm(path: string): void;
}

/** Frame limiter. Call wait() once per loop. */
export declare class Pacer {
  /** Makes a pacer, 60 fps by default. */
  constructor(fps?: number);
  /** Target frames per second. */
  fps: number;
  /** Returns how many ms are left until the next frame is due, 0 means draw now. It doesnt sleep by itself. Pass fps to change the target for this call. */
  wait(fps?: number): number;
}

/** A decoded image for drawing and skins. Close it when you are done, or use it with using. */
export declare class Bitmap {
  /** Loads png, jpeg, bmp, ppm or qoi from a file. It goes by the content, not the name. */
  static load(path: string): Bitmap;
  /** Decodes an image from bytes in memory. */
  static fromBytes(data: Uint8Array | ArrayBuffer): Bitmap;
  /** Makes a bitmap from plain argb pixels. They get copied. */
  static fromArgb(pixels: Uint32Array | number[], w: number, h: number): Bitmap;
  /** Uses your pixels as they are without copying, so keep the array alive. stride is in pixels. */
  static wrap(pixels: Uint32Array | number[], w: number, h: number, stride?: number): Bitmap;
  /** Width in px. */
  readonly w: number;
  /** Height in px. */
  readonly h: number;
  /** Row length in pixels. */
  readonly stride: number;
  /** True if goome owns the pixels and frees them on close. */
  readonly owned: boolean;
  /** True after close(). */
  readonly closed: boolean;
  /** The pixels, premultiplied argb. */
  readonly pixels: Uint32Array;
  /** Frees the bitmap. */
  close(): void;
  /** Same as close(), so `using` works. */
  [Symbol.dispose](): void;
}

/** A loaded font. Close it when you are done, or use it with using. */
export declare class Font {
  /** Loads a .ttf, .otf or .ttc. index picks the face in a collection. */
  static load(path: string, index?: number): Font;
  /** Loads a font from bytes in memory. */
  static fromBytes(data: Uint8Array | ArrayBuffer): Font;
  /** The desktop's usual ui font, or a named one. null if there isnt one. */
  static system(name?: string | null): Font | null;
  /** True after close(). */
  readonly closed: boolean;
  /** Width and height of text at that size. */
  measure(text: string, size: number): { w: number; h: number };
  /** Width of text at that size. */
  width(text: string, size: number): number;
  /** Line height at that size. */
  lineHeight(size: number): number;
  /** Fonts tried in order for characters this one doesnt have. The other font isnt freed by this one. */
  fallback(other: Font): this;
  /** The fallback fonts added so far. */
  readonly fallbacks: Font[];
  /** Frees the font. */
  close(): void;
  /** Same as close(), so `using` works. */
  [Symbol.dispose](): void;
}

/** Raw numbers behind a Canvas, for people poking at memory. */
export interface CanvasRaw {
  /** Address of the pixels, premultiplied argb. */
  px: number;
  /** Width in real px. */
  w: number;
  /** Height in real px. */
  h: number;
  /** Row length in pixels. */
  stride: number;
  /** Logical x of the first pixel. */
  ox: number;
  /** Logical y of the first pixel. */
  oy: number;
  /** Real px per logical px. */
  scale: number;
  /** Monitor index. */
  mon: number;
  /** Left of what was drawn since the clear. */
  dx0: number;
  /** Top of what was drawn since the clear. */
  dy0: number;
  /** Right of what was drawn since the clear. */
  dx1: number;
  /** Bottom of what was drawn since the clear. */
  dy1: number;
  /** Left of what the clear wiped. */
  cx0: number;
  /** Top of what the clear wiped. */
  cy0: number;
  /** Right of what the clear wiped. */
  cx1: number;
  /** Bottom of what the clear wiped. */
  cy1: number;
  /** Left of the clip, real px. */
  kx0: number;
  /** Top of the clip, real px. */
  ky0: number;
  /** Right of the clip, real px. */
  kx1: number;
  /** Bottom of the clip, real px. */
  ky1: number;
  /** How many clips are pushed. */
  nclip: number;
}

/** Something you draw on. Coordinates are logical, colors are 0xAARRGGBB. */
export declare class Canvas {
  /** Makes a canvas of your own, not tied to a window. Handy for offscreen drawing you blit later. */
  static new(w: number, h: number, opts?: { stride?: number; scale?: number; ox?: number; oy?: number }): Canvas;
  /** False once the canvas was ended or closed. */
  readonly valid: boolean;
  /** The raw numbers behind the canvas. */
  readonly raw: CanvasRaw;
  /** Width in real px. */
  readonly w: number;
  /** Height in real px. */
  readonly h: number;
  /** Row length in pixels. */
  readonly stride: number;
  /** Real px per logical px. */
  readonly scale: number;
  /** Logical x of the first pixel. */
  readonly ox: number;
  /** Logical y of the first pixel. */
  readonly oy: number;
  /** Monitor index. */
  readonly mon: number;
  /** Memory address of the pixels. */
  readonly address: number;
  /** The logical rect that got drawn on since the clear. */
  readonly drawn: Rect;
  /** The pixels, premultiplied argb. */
  readonly pixels: Uint32Array;
  /** One row of pixels, w long. */
  row(y: number): Uint32Array;
  /** Marks a rect as a spot that takes clicks when you pass the canvas to end(). */
  hit(x: number, y: number, w: number, h: number): this;
  /** Marks a rect as changed. No rect means everything. */
  damage(rect?: RectLike | null): this;
  /** Wipes the canvas to transparent. */
  clear(): this;
  /** Fills a rect. */
  rect(x: number, y: number, w: number, h: number, argb: Color): this;
  /**
   * Fills a rect with rounded corners, radius in logical px.
   * @param radius Corner radius, logical px.
   */
  roundRect(x: number, y: number, w: number, h: number, radius: number, argb: Color): this;
  /**
   * Draws a rect outline, width in logical px.
   * @param width Line width, logical px.
   */
  frame(x: number, y: number, w: number, h: number, width: number, argb: Color): this;
  /** Draws a line, width in logical px. */
  line(x0: number, y0: number, x1: number, y1: number, width: number, argb: Color): this;
  /** Fills a triangle. */
  triangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, argb: Color): this;
  /** Draws argb pixels (iw x ih) scaled into the rect. */
  image(x: number, y: number, w: number, h: number, pixels: Uint32Array | number[], iw: number, ih: number): this;
  /** Clears a rect back to transparent. */
  erase(x: number, y: number, w: number, h: number): this;
  /**
   * Draws text with the built in font. y is the top, returns the width drawn. big uses the bigger size.
   * @param y Top of the text.
   * @param big Use the bigger built in size.
   */
  text(x: number, y: number, text: string, argb?: Color, big?: boolean): number;
  /** Width of text in the built in font. */
  textWidth(text: string, big?: boolean): number;
  /**
   * Draws text with a font at a size. y is the top, null font is the built in one. Returns the width drawn.
   * @param size Text size in logical px.
   * @param y Top of the text.
   */
  fontText(font: Font | null, size: number, x: number, y: number, text: string, argb?: Color): number;
  /**
   * Draws another canvas on this one with alpha (0 to 1) at an offset.
   * @param alpha 0 to 1, default 1.
   * @param dx Offset x.
   * @param dy Offset y.
   */
  blit(src: Canvas, alpha?: number, dx?: number, dy?: number): this;
  /** Clips drawing to a rect. It snaps to whole px and goes 16 deep. */
  clipPush(x: number, y: number, w: number, h: number): this;
  /** Takes off the last clip. */
  clipPop(): this;
  /** Runs body with a clip pushed and pops it after. */
  clip<T>(x: number, y: number, w: number, h: number, body: (c: this) => T): T;
  /** Fills a rect with a radius per corner. */
  rrect(x: number, y: number, w: number, h: number, r: Radii, argb: Color): this;
  /** Outlines a rect with a radius per corner. */
  rrectLine(x: number, y: number, w: number, h: number, r: Radii, width: number, argb: Color): this;
  /** Fills a rect with a gradient from one color to another. Top to bottom, or left to right if sideways. */
  rrectGrad(x: number, y: number, w: number, h: number, r: Radii, from: Color, to: Color, sideways?: boolean): this;
  /**
   * Draws a soft shadow like css box-shadow. blur is in logical px.
   * @param blur Blur size, logical px.
   */
  shadow(x: number, y: number, w: number, h: number, radius: number, blur: number, argb: Color): this;
  /** Fills a circle. */
  circle(cx: number, cy: number, r: number, argb: Color): this;
  /** Draws a circle outline. r is the middle of the stroke. */
  ring(cx: number, cy: number, r: number, width: number, argb: Color): this;
  /**
   * Draws an arc, angles in radians. 0 is 3 oclock and it goes clockwise, with round caps.
   * @param a0 Start angle in radians, 0 is 3 oclock.
   * @param a1 End angle in radians, clockwise from a0.
   */
  arc(cx: number, cy: number, r: number, width: number, a0: number, a1: number, argb: Color): this;
  /** Fills a polygon from points, either flat x,y numbers or [x, y] pairs. */
  poly(points: number[] | Array<[number, number]>, argb: Color): this;
  /** Draws a bitmap scaled into the rect, optionally rounded and tinted. */
  bitmap(bmp: Bitmap, x: number, y: number, w: number, h: number, r?: Radii, tint?: Color): this;
  /** Draws part of a bitmap (sx, sy, sw, sh in bitmap px) into the rect. */
  bitmapPart(bmp: Bitmap, sx: number, sy: number, sw: number, sh: number, x: number, y: number, w: number, h: number, tint?: Color): this;
  /** Draws a bitmap as a nine slice. left, top, right and bottom are border sizes in bitmap px. top and right default to left, bottom to top. */
  bitmapNine(bmp: Bitmap, x: number, y: number, w: number, h: number, left: number, top?: number, right?: number, bottom?: number): this;
  /** Frees a canvas you made with Canvas.new. */
  close(): void;
  /** Same as close(), so `using` works. */
  [Symbol.dispose](): void;
}

/** Options for opening goome. Anything left out takes the default. */
export interface OpenOptions {
  /** Window title, "goome" if left out. */
  title?: string;
  /** Force a backend. The GOOME_BACKEND env var wins over this. */
  backend?: number | "auto" | "wayland" | "gnome" | "portal" | "x11" | "win32" | "macos" | "test" | "offscreen";
  /** Where the portal token and control fifo live. Without it you get neither. */
  stateDir?: string;
  /** Overlay only, never asks for screen access. */
  noCapture?: boolean;
  /** Frame rate of gnome and portal capture streams, 0 means 5. */
  captureFps?: number;
  /** Keeps our overlay out of grabs where the os lets us. */
  hideSelf?: boolean;
  /** Test backend only, same as env GOOME_TEST_FRAMES. */
  testFrames?: string;
  /** Test backend only, same as env GOOME_TEST_SCRIPT. */
  testScript?: string;
  /** Test backend only, same as env GOOME_TEST_SHOTS. */
  testShots?: string;
  /** overlay, window or offscreen. */
  mode?: number | "overlay" | "window" | "offscreen";
  /** Window or offscreen width, logical. 0 means 960. */
  width?: number;
  /** Window or offscreen height, logical. 0 means 640. */
  height?: number;
  /** Smallest window width, window only. 0 means no limit. */
  minWidth?: number;
  /** Smallest window height, window only. 0 means no limit. */
  minHeight?: number;
  /** WINDOW_* flags ored together. */
  windowFlags?: number;
  /** Offscreen only, real px per logical px. 0 means 1. */
  scale?: number;
}

/** Options for Goome.frameCopy. */
export interface FrameCopyOptions {
  /** Bytes per row in the buffer. Defaults to the rect width times 4. */
  stride?: number;
  /** FMT_* byte order. The non premultiplied ones unpremultiply for you. */
  format?: number;
  /** Part of the frame to copy, real px. Defaults to the whole frame. */
  rect?: RectLike;
}

/** One goome session: an overlay, a window or an offscreen canvas. */
export declare class Goome {
  /** Opens goome, same as open(). */
  constructor(opts?: OpenOptions | string);
  /** True after close(). */
  readonly closed: boolean;
  /** The last error text, or null. */
  readonly error: string | null;
  /** Name of the backend that got picked. */
  readonly backendName: string;
  /** CAP_* bits for what this backend can do. */
  readonly caps: number;
  /** MODE_OVERLAY, MODE_WINDOW or MODE_OFFSCREEN. */
  readonly mode: number;
  /** True while grab is on. */
  readonly grabbed: boolean;
  /** Path of the control fifo, null if there isnt one. */
  readonly controlPath: string | null;
  /** Window client size, logical. */
  readonly size: { w: number; h: number };
  /** Window position, or null where the os wont say (wayland). */
  readonly pos: { x: number; y: number } | null;
  /** STATE_* of the window. */
  readonly state: number;
  /** The cursor shape last asked for, offscreen embedders read this. */
  readonly cursor: number;
  /** Clipboard text. Can block for around 250 ms on x11 and wayland. */
  readonly clipboard: string;
  /** Full path of the last DROP event, good until the next poll. */
  readonly dropPath: string | null;
  /** Full text of the last TEXT or PREEDIT event, good until the next poll. */
  readonly eventText: string;
  /** Byte offset of the caret in the last preedit text. */
  readonly preeditCursor: number;
  /**
   * Turns ime on or off. caret is where the candidate window goes, logical.
   * @param on Turn ime on or off.
   * @param caret Logical rect where the candidate window goes.
   */
  textInput(on?: boolean, caret?: RectLike | null): number;
  /** Closes goome and frees everything. */
  close(): void;
  /** Same as close(), so `using` works. */
  [Symbol.dispose](): void;
  /** True if the backend has that CAP_* bit. */
  can(cap: number): boolean;
  /** Lists the monitors. */
  monitors(): Monitor[];
  /**
   * Grabs a monitor, or part of it (logical rect). The image is only good until the next grab of that monitor.
   * @param mon Monitor index.
   * @param rect Logical rect to grab, whole monitor if left out.
   */
  capture(mon?: number, rect?: RectLike | null): Image;
  /** Alpha of our own overlay at x,y, use it to mask hasSelf grabs. */
  alphaAt(x: number, y: number): number;
  /**
   * Starts a frame and gives you the canvas, or null if there is nothing to draw on. Pair it with end.
   * @param mon Monitor index, 0 by default.
   */
  begin(mon?: number): Canvas | null;
  /**
   * Sends the canvas to the screen. Hit rects (plus any from canvas.hit) are where clicks land on us.
   * @param canvas The canvas from begin.
   * @param hits Extra logical rects that take clicks.
   */
  end(canvas: Canvas, hits?: RectLike[]): number;
  /** Draws one frame. Runs body with the canvas and ends it after. Returns false if there was nothing to draw on. */
  frame(body: (c: Canvas) => void): boolean;
  /** Draws one frame. Runs body with the canvas and ends it after. Returns false if there was nothing to draw on. */
  frame(mon: number, body: (c: Canvas) => void): boolean;
  /** Marks a rect of the canvas as changed. No rect means everything. */
  damage(canvas: Canvas, rect?: RectLike | null): void;
  /**
   * Next event or null. Waits up to timeoutMs, 0 doesnt wait.
   * @param timeoutMs How long to wait for an event. 0 doesnt wait.
   */
  poll(timeoutMs?: number): Event | null;
  /**
   * Loops over the events that are waiting, waiting up to timeoutMs for the first.
   * @param timeoutMs How long to wait for the first event. 0 doesnt wait.
   */
  events(timeoutMs?: number): Generator<Event, void, undefined>;
  /** Global pointer position and buttons, or null if the backend cant tell. */
  pointer(): { x: number; y: number; buttons: number } | null;
  /** Turns keyboard capture on or off. */
  keyboard(on?: boolean): number;
  /** Overlay: takes focus and the pointer until you turn it off. Window: drags keep going outside it. */
  grab(on?: boolean): number;
  /**
   * Registers a global hotkey like "ctrl+alt+k". It comes back as a HOTKEY event with your id.
   * @param combo Like "ctrl+alt+k".
   * @param id Number you get back in the HOTKEY event.
   */
  hotkey(combo: string, id: number): number;
  /** Makes a Ui for this session. */
  ui(): Ui;
  /** Sets the window title. */
  setTitle(title: string): void;
  /** Sets the window client size, logical. */
  setSize(w: number, h: number): void;
  /**
   * Offscreen only, new size and optionally a new scale.
   * @param scale Real px per logical px, offscreen only. 0 keeps it.
   */
  resize(w: number, h: number, scale?: number): void;
  /** Moves the window. Can throw NotSupported where the os wont allow it (wayland). */
  setPos(x: number, y: number): void;
  /** Sets the window state, a STATE_* value. */
  setState(state: number): void;
  /** Minimizes the window. */
  minimize(): void;
  /** Maximizes the window. */
  maximize(): void;
  /** Turns fullscreen on or off. */
  fullscreen(on?: boolean): void;
  /**
   * Starts a native window move (0) or resize (EDGE_* bits) from the press happening now.
   * @param edges 0 moves the window, EDGE_* bits resize it.
   */
  drag(edges?: number): number;
  /** Shows or hides the window. */
  show(on?: boolean): number;
  /** Hides the window. */
  hide(): number;
  /** Sets the cursor shape, a CURSOR_* value. */
  setCursor(shape: number): number;
  /** Puts text on the clipboard. */
  setClipboard(text: string): void;
  /** Queues an event, in any mode. Pass an Event, or a type with fields. */
  push(ev: Event): void;
  /** Queues an event, in any mode. Pass an Event, or a type with fields. */
  push(type: number | string, fields?: EventFields): void;
  /** Queues key events that type this text. */
  pushText(text: string): void;
  /** Queues a click at x,y, button 1 left, 2 middle, 3 right. */
  pushClick(x: number, y: number, button?: number): void;
  /** Queues a TEXT event as if an ime finished composing it. */
  pushCommit(text: string): void;
  /** Queues a PREEDIT event, cursor is the caret byte offset. */
  pushPreedit(text: string, cursor?: number): void;
  /** The last frame end() sent, premultiplied argb, good until the next begin. */
  lastFrame(): Image;
  /** True if x,y is inside the hit rects of the last end(). */
  hit(x: number, y: number): boolean;
  /** Real px rect that changed since the last call, null if nothing did. The first one after open or resize is the whole frame. */
  frameDirty(): Rect | null;
  /** Copies part of the last frame (real px, default the whole thing) into a buffer, or into a new Uint8Array if you pass null. */
  frameCopy(buf?: null, opts?: FrameCopyOptions): Uint8Array;
  /** Copies part of the last frame (real px, default the whole thing) into a buffer, or into a new Uint8Array if you pass null. */
  frameCopy<T extends ArrayBufferView | ArrayBuffer>(buf: T, opts?: FrameCopyOptions): T;
}

/** Opens goome. A string is the title. */
export declare function open(opts?: OpenOptions | string): Goome;
/** Opens a normal resizable window, centered. */
export declare function openApp(title?: string, width?: number, height?: number, opts?: OpenOptions): Goome;
/** Opens an offscreen canvas you read the pixels of yourself. */
export declare function openOffscreen(width?: number, height?: number, scale?: number, opts?: OpenOptions): Goome;

/** Position, size and open state of a ui window. The ui keeps it up to date. */
export interface WindowState {
  /** Left edge, logical. */
  x?: number;
  /** Top edge, logical. */
  y?: number;
  /** Width, logical. */
  w?: number;
  /** Height, logical. */
  h?: number;
  /** False once the user closed it with the close button. */
  open?: boolean;
}

/** Anything with a boolean value. */
export interface FlagLike {
  /** The boolean. */
  value: boolean;
}

/** A boolean the ui can read and write, for open states and menu checks. */
export declare class Flag implements FlagLike {
  /** Makes a flag, false by default. */
  constructor(value?: boolean);
  /** The boolean. */
  value: boolean;
  /** Flips it and returns the new value. */
  toggle(): boolean;
}

/** Where a split sits. */
export interface SplitLike {
  /** Where the divider sits, 0 to 1. */
  frac?: number;
  /** True to stack the panes top to bottom. */
  vertical?: boolean;
}

/** Split position the ui drags around. */
export declare class Split implements SplitLike {
  /** Makes a split, half and half and side by side by default. */
  constructor(frac?: number, vertical?: boolean);
  /** Where the divider sits, 0 to 1. */
  frac: number;
  /** True to stack the panes top to bottom. */
  vertical: boolean;
}

/** A nine slice skin. l, t, r, b are the border sizes in bitmap px. */
export interface Skin {
  /** The image to slice. */
  bitmap: Bitmap;
  /** Left border size in bitmap px. */
  l: number;
  /** Top border size in bitmap px. */
  t: number;
  /** Right border size in bitmap px. */
  r: number;
  /** Bottom border size in bitmap px. */
  b: number;
}
/** A Skin, [bitmap, border] or [bitmap, l, t, r, b]. */
export type SkinLike = Skin | [Bitmap, number] | [Bitmap, number, number, number, number] | { bitmap: Bitmap; l?: number; t?: number; r?: number; b?: number };

/** What happened to a custom widget this frame. Positions are logical. */
export interface Item {
  /** True if something happened to it. */
  changed: boolean;
  /** Left edge, logical. */
  x: number;
  /** Top edge, logical. */
  y: number;
  /** Width, logical. */
  w: number;
  /** Height, logical. */
  h: number;
  /** Pointer is over it. */
  hovered: boolean;
  /** Pressed this frame. */
  pressed: boolean;
  /** Held down. */
  held: boolean;
  /** Released this frame. */
  released: boolean;
  /** Clicked this frame. */
  clicked: boolean;
  /** Double clicked this frame. */
  doubleClicked: boolean;
  /** Right clicked this frame. */
  rightClicked: boolean;
  /** Has keyboard focus. */
  focused: boolean;
  /** Pointer x, logical. */
  mx: number;
  /** Pointer y, logical. */
  my: number;
  /** Horizontal move this frame while held, after the axis lock. */
  dx: number;
  /** Vertical move this frame while held, after the axis lock. */
  dy: number;
  /** Horizontal move since the press, after the axis lock. */
  dragX: number;
  /** Vertical move since the press, after the axis lock. */
  dragY: number;
  /** Key pressed this frame while focused, with SHIFT etc ored in. 0 is none. */
  key: number;
}

/** Values for Ui.style. Keys are camelCase style names plus theme, radii, font, skin and icons. */
export interface StyleValues {
  /** A whole theme, pushed first. */
  theme?: Theme;
  /** Per corner radii. */
  radii?: Radii;
  /** Font to use, null is the built in one. */
  font?: Font | null;
  /** [kind, ...skin] to push one skin. */
  skin?: [number | string, ...unknown[]];
  /** Icon overrides by name. */
  icons?: Record<string, Bitmap | null>;
  [style: string]: unknown;
}

/** Colors, sizes and skins for the ui. Close it when you are done, or use it with using. */
export declare class Theme {
  /** Makes a theme from an accent color. radius is the corner radius. */
  static make(accent: Color, dark?: boolean, radius?: number): Theme;
  /** Makes a theme from a preset, by PRESET_* id or name. */
  static preset(name: number | string): Theme;
  /** Turns this theme dark, leaves the font alone. */
  dark(): this;
  /** Turns this theme light, leaves the font alone. */
  light(): this;
  /** Rebuilds this theme in place from an accent color. radius is the corner radius. */
  make(accent: Color, dark?: boolean, radius?: number): this;
  /** Rebuilds this theme in place from a preset, by PRESET_* id or name. */
  preset(name: number | string): this;
  /** Makes a copy. */
  copy(): Theme;
  /** The icon bitmap set for that slot, or null. */
  icon(i: number | string): Bitmap | null;
  /** Sets an icon bitmap, null puts the default back. */
  setIcon(i: number | string, bmp: Bitmap | null): this;
  /** Puts every icon back to the default. */
  clearIcons(): this;
  /** The skin set for that slot (like "button"), or null. */
  skin(name: string): Skin | null;
  /** Sets a skin for a slot, null removes it. */
  setSkin(name: string, skin: SkinLike | null): this;
  /** The numbers and colors as a plain object. */
  toJSON(): Record<string, number>;
  /** Sets several fields from an object. */
  update(values: Record<string, unknown>): this;
  /** Frees the theme. */
  close(): void;
  /** Same as close(), so `using` works. */
  [Symbol.dispose](): void;
  /** Color multiplied into the icons. */
  iconTint: Color;
  /** Main font, null is the built in one. */
  font: Font | null;
  /** Font for headings. */
  fontHeading: Font | null;
  /** Font for mono text, like in text edits. */
  fontMono: Font | null;
  /** Font for small text. */
  fontSmall: Font | null;
  /** Background color. */
  bg: Color;
  /** Panel color. */
  panel: Color;
  /** Border color. */
  border: Color;
  /** Text color. */
  text: Color;
  /** Dimmed text color. */
  textDim: Color;
  /** Accent color, for buttons and highlights. */
  accent: Color;
  /** Text color on top of the accent. */
  accentText: Color;
  /** Color of a hovered widget. */
  hover: Color;
  /** Color of a pressed widget. */
  active: Color;
  /** Background of inputs. */
  inputBg: Color;
  /** Shadow color. */
  shadow: Color;
  /** Focus ring color. */
  focus: Color;
  /** Text selection color. */
  select: Color;
  /** Text caret color. */
  caret: Color;
  /** Link color. */
  link: Color;
  /** Badge color. */
  badge: Color;
  /** Toast color. */
  toast: Color;
  /** Tooltip color. */
  tooltip: Color;
  /** Color for dangerous things. */
  danger: Color;
  /** Slider and toggle knob color. */
  knob: Color;
  /** Color that dims what is behind a modal. */
  dim: Color;
  /** Corner radius. */
  radius: number;
  /** Padding inside panels. */
  pad: number;
  /** Gap between widgets. */
  gap: number;
  /** Border width. */
  borderWidth: number;
  /** Text size. */
  fontSize: number;
  /** Shadow blur. */
  shadowBlur: number;
  /** Default animation time in ms. */
  animMs: number;
  /** Checkbox and radio size. */
  checkSize: number;
  /** Checkbox corner radius. */
  checkRadius: number;
  /** Toggle width. */
  toggleW: number;
  /** Toggle height. */
  toggleH: number;
  /** Slider height. */
  sliderH: number;
  /** Slider track thickness. */
  sliderTrack: number;
  /** Knob size. */
  knobSize: number;
  /** Scrollbar width. */
  scrollW: number;
  /** Smallest size of the scrollbar thumb. */
  scrollMin: number;
  /** Height of a normal widget row. */
  itemH: number;
  /** Height of a menu item. */
  menuItemH: number;
  /** Tab height. */
  tabH: number;
  /** Window title bar height. */
  winTitleH: number;
  /** App title bar height. */
  appTitleH: number;
  /** Menu bar height. */
  menubarH: number;
  /** Status bar height. */
  statusbarH: number;
  /** Focus ring thickness. */
  focusW: number;
  /** Gap between a widget and its focus ring. */
  focusGap: number;
  /** Separator thickness. */
  sepW: number;
  /** Size of the window resize grip. */
  grip: number;
  /** Indent for tree levels. */
  indent: number;
  /** Line width of plots. */
  plotW: number;
  /** Spinner thickness. */
  spinner: number;
  /** Text caret width. */
  caretW: number;
  /** Smallest window width. */
  winMinW: number;
  /** Smallest window height. */
  winMinH: number;
  /** Gap between a popup and what opened it. */
  popGap: number;
  /** Gap when placing submenus. */
  menuGap: number;
  /** Horizontal padding in tooltips. */
  tipPadX: number;
  /** Vertical padding in tooltips. */
  tipPadY: number;
  /** Tooltip x offset from the pointer. */
  tipX: number;
  /** Tooltip y offset from the pointer. */
  tipY: number;
  /** Tooltip corner radius. */
  tipRadius: number;
  /** Shadow x offset. */
  shadowX: number;
  /** Shadow y offset. */
  shadowY: number;
  /** Default text alignment, an ALIGN_* value. */
  align: number;
  /** Heading text size. */
  headingSize: number;
  /** Small text size. */
  smallSize: number;
  /** Default easing, an EASE_* value. */
  ease: number;
  /** Hover animation time in ms. */
  hoverMs: number;
  /** Press animation time in ms. */
  pressMs: number;
  /** Popup animation time in ms. */
  popupMs: number;
  /** Collapse animation time in ms. */
  collapseMs: number;
  /** Toast fade time in ms. */
  toastFadeMs: number;
  /** Skin for buttons, null for none. */
  skinButton: Skin | null;
  /** Skin for panels, null for none. */
  skinPanel: Skin | null;
  /** Skin for inputs, null for none. */
  skinInput: Skin | null;
  /** Skin for checkboxes, null for none. */
  skinCheckbox: Skin | null;
  /** Skin for radios, null for none. */
  skinRadio: Skin | null;
  /** Skin for toggles, null for none. */
  skinToggle: Skin | null;
  /** Skin for slider tracks, null for none. */
  skinSlider: Skin | null;
  /** Skin for the filled part of sliders, null for none. */
  skinSliderFill: Skin | null;
  /** Skin for scrollbars, null for none. */
  skinScrollbar: Skin | null;
  /** Skin for tabs, null for none. */
  skinTab: Skin | null;
  /** Skin for title bars, null for none. */
  skinTitlebar: Skin | null;
  /** Skin for tooltips, null for none. */
  skinTooltip: Skin | null;
  /** Skin for menus, null for none. */
  skinMenu: Skin | null;
  /** Skin for popups, null for none. */
  skinPopup: Skin | null;
}

/** Ui behavior settings: timings, keybinds, cursors. */
export declare class Config {
  /** How long to hover before a tooltip shows. */
  tipDelayMs: number;
  /** Longest gap between the clicks of a double click. */
  dblClickMs: number;
  /** How far the pointer may move during a double click. */
  dblClickPx: number;
  /** How far the pointer must move before a press becomes a drag. */
  dragPx: number;
  /** Wait before a held key or button starts repeating. */
  repeatDelayMs: number;
  /** Time between repeats. */
  repeatMs: number;
  /** Caret blink time. */
  blinkMs: number;
  /** Hover time before a submenu opens. */
  menuDelayMs: number;
  /** Default toast time. */
  toastMs: number;
  /** Lines scrolled per wheel notch. */
  scrollLines: number;
  /** Clicking a window brings it to the front. */
  raiseOnClick: boolean;
  /** Esc closes popups, menus and modals. */
  escCloses: boolean;
  /** Tab moves keyboard focus. */
  tabNav: boolean;
  /** Clicking gives keyboard focus. */
  focusOnMouse: boolean;
  /** What password inputs show for each character, null means "*". */
  mask: string | null;
  /** Your own easing function for EASE_CUSTOM, takes t from 0 to 1. */
  ease: ((t: number) => number) | null;
  /** The cursor shape used for a slot (CUR_* id or name). */
  cursor(what: number | string): number;
  /** Sets the cursor shape for a slot. */
  setCursor(what: number | string, shape: number): this;
  /** The key combos bound to an editing action. */
  keys(action: number | string): Array<{ key: number; mods: number }>;
  /** Binds an action to combos like "ctrl+z" or an array of them. Replaces what was there. */
  bind(action: number | string, combos: string | string[]): Ui;
  /** Puts every setting back to the default. */
  reset(): this;
}

type Body = (ui: Ui) => void;

/** The immediate mode ui kit. Make one with Goome.ui and call its widgets every frame. */
export declare class Ui {
  /** Makes a ui for a Goome session. g.ui() does the same. */
  constructor(g: Goome);
  /** True if the widget you called last changed its value. */
  changed: boolean;
  /** True if the input you called last had enter pressed in it. */
  entered: boolean;
  /** The theme the ui draws with. */
  readonly theme: Theme;
  /** The ui settings. */
  readonly config: Config;
  /** True after close(). */
  readonly closed: boolean;
  /** True while something still moves, so draw again soon. */
  readonly animating: boolean;
  /** WANT_MOUSE and WANT_KEYBOARD bits for what the ui wants right now. Good after feed and end. */
  readonly wants: number;
  /** True if the ui wants the mouse. */
  readonly wantsMouse: boolean;
  /** True if the ui wants the keyboard. */
  readonly wantsKeyboard: boolean;
  /** The widget right before this is hovered. */
  readonly hovered: boolean;
  /** The widget right before this has keyboard focus. */
  readonly focused: boolean;
  /** The canvas of the current frame, null outside one. */
  readonly canvas: Canvas | null;
  /** What the ui takes from the os by itself, WANT_* bits. Default is both, 0 means you do it. */
  autoGrab: number;
  /** Frees the ui. */
  close(): void;
  /** Same as close(), so `using` works. */
  [Symbol.dispose](): void;
  /** Gives the ui an event. Returns true if the ui used it. */
  feed(ev: Event): boolean;
  /** Starts a ui frame. Returns the canvas, or null if there is nothing to draw on so skip the frame. */
  begin(mon?: number): Canvas | null;
  /** Ends the frame and sends it with every widgets hit area. */
  end(): void;
  /** Runs a whole ui frame: begin, your body, end. Returns false if the frame was skipped. */
  frame(body: (ui: Ui, c: Canvas) => void): boolean;
  /** Runs a whole ui frame: begin, your body, end. Returns false if the frame was skipped. */
  frame(mon: number, body: (ui: Ui, c: Canvas) => void): boolean;
  /** Adds an extra clickable rect to the frame. */
  hit(x: number, y: number, w: number, h: number): void;
  /** Scales sizes, fonts and padding of the theme by s. */
  scale(s: number): void;

  /**
   * A floating window. Returns true if it is showing, then runs body. state keeps its position, size and open flag, flags is WIN_*.
   * @param flags WIN_* flags, defaults to WIN_MOVE | WIN_COLLAPSE.
   */
  window(title: string, state?: WindowState | null, flags?: number, body?: Body): boolean;
  /**
   * A floating window. Returns true if it is showing, then runs body. state keeps its position, size and open flag, flags is WIN_*.
   * @param flags WIN_* flags, defaults to WIN_MOVE | WIN_COLLAPSE.
   */
  window(title: string, state: WindowState | null, body: Body): boolean;
  /** Ends a window you started without a body. */
  windowEnd(): void;
  /** The next cols widgets share a row. */
  row(cols: number): void;
  /** Puts the next widget on the same line. */
  sameLine(): void;
  /** Adds blank space in logical px. */
  space(px: number): void;
  /** Draws a separator line. */
  separator(): void;
  /** Width of the next widget, 0 fills. */
  width(w: number): void;
  /** Puts the next widget at x,y from the content top left (scroll included). The flow doesnt move. */
  pos(x: number, y: number): void;
  /** Size of the next widget, 0 means its own size for that side. */
  size(w?: number, h?: number): void;

  /** Plain text. */
  label(text: unknown): void;
  /** Bigger heading text. */
  heading(text: string): void;
  /** Text that wraps at the width. */
  wrapped(text: string): void;
  /** A button. Returns true when clicked. */
  button(label: string): boolean;
  /** A button showing a bitmap. id tells it apart from other ones. */
  imageButton(id: string, bmp: Bitmap, w: number, h: number): boolean;
  /** Shows a bitmap, optionally with rounded corners. */
  image(bmp: Bitmap, w: number, h: number, radius?: number): void;
  /** A checkbox. Returns the new value. */
  checkbox(label: string, value: boolean): boolean;
  /** A toggle switch. Returns the new value. */
  toggle(label: string, value: boolean): boolean;
  /**
   * A radio button. Returns the new selection, option is the value this one stands for.
   * @param value The currently selected option.
   * @param option The value this radio stands for.
   */
  radio(label: string, value: number, option: number): number;
  /**
   * A slider from lo to hi. fmt is a printf style format for the label text. Returns the new value.
   * @param lo Lowest value.
   * @param hi Highest value.
   * @param fmt printf style format, like "%.2f".
   */
  slider(label: string, value: number, lo?: number, hi?: number, fmt?: string | null): number;
  /**
   * A slider with whole numbers. Returns the new value.
   * @param lo Lowest value.
   * @param hi Highest value.
   */
  sliderInt(label: string, value: number, lo?: number, hi?: number): number;
  /**
   * A single line text input. cap is the most bytes it takes. Returns the new text.
   * @param cap Most bytes the text can hold.
   */
  input(label: string, text: string, cap?: number): string;
  /** Text input with INPUT_* flags and a hint shown while its empty. Returns the new text. */
  inputEx(label: string, text: string, flags?: number, hint?: string | null, cap?: number): string;
  /** Text input that hides what you type. Returns the new text. */
  password(label: string, text: string, hint?: string | null, flags?: number, cap?: number): string;
  /** A dropdown. sel is the selected index in items, returns the new index. */
  combo(label: string, sel: number, items: string[]): number;
  /** A row you can select. Returns true when clicked. */
  selectable(label: string, selected?: boolean): boolean;
  /** A tab bar. Returns the selected index. */
  tabs(id: string, names: string[], sel: number): number;
  /** A collapsing header. Returns true while open, pass a Flag to keep the state. */
  collapsing(label: string, open?: boolean | FlagLike | null): boolean;
  /** A progress bar, frac from 0 to 1, with optional text on it. */
  progress(frac: number, text?: string | null): void;
  /** A color picker. Returns the new color. */
  color(label: string, argb: Color): Color;
  /** Shows a tooltip for the widget right before it. */
  tooltip(text: string): void;
  /** Gives keyboard focus to the next widget. */
  setFocus(): void;

  /**
   * A scroll area, h is its height and 0 fills. Returns true if it shows. It ends itself when you pass a body.
   * @param h Height in logical px, 0 fills.
   */
  scroll(id: string, h?: number, body?: Body): boolean;
  /**
   * A scroll area, h is its height and 0 fills. Returns true if it shows. It ends itself when you pass a body.
   * @param h Height in logical px, 0 fills.
   */
  scroll(id: string, body: Body): boolean;
  /** Starts a scroll area without a body. Always call scrollEnd. */
  scrollBegin(id: string, h?: number): boolean;
  /** Ends a scroll area. */
  scrollEnd(): void;
  /** Pushes an id so the same labels in a loop dont clash. Push the index first. */
  pushId(id: unknown): void;
  /** Pops an id from pushId. */
  popId(): void;
  /** Runs body inside an id and pops it after. */
  id<T>(id: unknown, body: (ui: Ui) => T): T;

  /** A root panel that fills the window. flags is APP_*. Call it after begin. */
  app(title?: string | null, flags?: number, body?: Body): boolean;
  /** A root panel that fills the window. flags is APP_*. Call it after begin. */
  app(body: Body): boolean;
  /** Ends app() when you didnt pass a body. */
  appEnd(): void;
  /** The menu bar of an app. */
  menubar(body?: Body): boolean;
  /** Ends menubar() when you didnt pass a body. */
  menubarEnd(): void;
  /** A menu inside the menu bar, nest them for submenus. Returns true while open. */
  menu(label: string, body?: Body): boolean;
  /** Ends menu() when you didnt pass a body. */
  menuEnd(): void;
  /** A menu item. shortcut is just text shown on the right, checked shows a tick. Returns true when clicked. */
  menuItem(label: string, shortcut?: string | null, checked?: FlagLike | null): boolean;
  /** A separator inside a menu. */
  menuSeparator(): void;
  /** A right click menu for the widget before it, or for empty space. Returns true while open. */
  context(id: string, body?: Body): boolean;
  /** Ends context() when you didnt pass a body. */
  contextEnd(): void;
  /** Opens the popup with that id. */
  popupOpen(id: string): void;
  /** A popup. Returns true while it is open. */
  popup(id: string, body?: Body): boolean;
  /** Ends popup() when you didnt pass a body. */
  popupEnd(): void;
  /** Closes the innermost open popup, menu or modal. */
  popupClose(): void;
  /** A centered dialog that dims the rest, esc closes it. Pass a Flag to open and close it. */
  modal(title: string, open?: FlagLike | null, body?: Body): boolean;
  /** A centered dialog that dims the rest, esc closes it. Pass a Flag to open and close it. */
  modal(title: string, body: Body): boolean;
  /** Ends modal() when you didnt pass a body. */
  modalEnd(): void;
  /**
   * Shows a small message for ms milliseconds.
   * @param ms How long it shows, in ms.
   */
  toast(text: string, ms?: number): void;
  /** Text in the status bar, needs APP_STATUSBAR. */
  statusbar(text: string): void;

  /** A multiline text editor with EDIT_* flags. Returns the new text. */
  textEdit(id: string, text: string, h?: number, flags?: number, cap?: number | null): string;
  /** A table with cols columns, TABLE_* flags. Returns true if it shows. */
  table(id: string, cols: number, h?: number, flags?: number, body?: Body): boolean;
  /** Adds a column, call it once per column first. Width 0 shares the rest. */
  tableColumn(name: string, width?: number): void;
  /** After the columns: tells you if the sort changed this frame and which column, and descending or not. */
  tableSort(col?: number, desc?: boolean): { changed: boolean; col: number; desc: boolean };
  /** Starts a new row. */
  tableRow(): void;
  /** Moves to the next cell. */
  tableNext(): void;
  /** Ends a table you started without a body. */
  tableEnd(): void;
  /** A tree node. Returns true while open, pass a Flag to keep the state. */
  tree(label: string, open?: FlagLike | null, body?: Body): boolean;
  /** A tree node. Returns true while open, pass a Flag to keep the state. */
  tree(label: string, body: Body): boolean;
  /** Ends tree() when you didnt pass a body. */
  treeEnd(): void;
  /**
   * Inside a scroll area, tells you which rows (first to last) are in view so you only draw those.
   * @param rowH Row height, 0 means the theme's item height.
   */
  listClip(count: number, rowH?: number): { first: number; last: number };
  /**
   * A number you drag. speed is the change per px. Returns the new value.
   * @param speed Change per px dragged.
   * @param fmt printf style format.
   */
  dragFloat(label: string, value: number, speed?: number, lo?: number, hi?: number, fmt?: string | null): number;
  /** A whole number you drag. Returns the new value. */
  dragInt(label: string, value: number, speed?: number, lo?: number, hi?: number): number;
  /**
   * A number field with plus and minus buttons, step is the amount. Returns the new value.
   * @param step Amount the plus and minus buttons change it by.
   */
  number(label: string, value: number, step?: number, fmt?: string | null): number;
  /**
   * A line plot of values, lo and hi default to their min and max.
   * @param h Height in logical px, 60 by default.
   */
  plotLines(label: string, values: ArrayLike<number>, lo?: number | null, hi?: number | null, h?: number): void;
  /**
   * A bar plot of values, lo and hi default to their min and max.
   * @param h Height in logical px, 60 by default.
   */
  plotBars(label: string, values: ArrayLike<number>, lo?: number | null, hi?: number | null, h?: number): void;
  /** Two resizable panes. Use splitNext() between them. pane keeps the divider position. */
  split(id: string, pane?: SplitLike | null, body?: Body): boolean;
  /** Two resizable panes. Use splitNext() between them. pane keeps the divider position. */
  split(id: string, body: Body): boolean;
  /** Moves from the first pane to the second. */
  splitNext(): void;
  /** Ends split() when you didnt pass a body. */
  splitEnd(): void;
  /** Makes the widget before it draggable, carrying data of a type name. */
  dragSource(type: string, data: string | Uint8Array): boolean;
  /** Makes the widget before it a drop target for that type. Returns the dropped bytes, or null. */
  dropTarget(type: string, cap?: number): Uint8Array | null;
  /** A loading spinner. */
  spinner(size?: number): void;
  /** A clickable link. Returns true when clicked. */
  link(text: string): boolean;
  /** A small badge, with an optional color. */
  badge(text: string, argb?: Color | null): void;

  /** Pushes a color style (S_ id or name) until popped. */
  pushColor(what: number | string, argb: Color): void;
  /** Pushes a number style (S_RADIUS and friends) until popped. */
  pushNum(what: number | string, v: number | string): void;
  /** Pushes per corner radii, beats S_RADIUS until popped. */
  pushRadii(r: Radii): void;
  /** Pushes a font until popped. null is the built in one. */
  pushFont(font: Font | null): void;
  /** Pushes a skin (SKIN_* kind) until popped, null for no skin. */
  pushSkin(kind: number | string, skin: SkinLike | null): void;
  /** Pushes an icon bitmap (ICON_* id or name) until popped. */
  pushIcon(icon: number | string, bmp: Bitmap | null): void;
  /** Pushes a whole theme in one go. */
  pushTheme(theme: Theme): void;
  /** Pops the last n pushes of any kind. */
  pop(n?: number): void;
  /** Pushes style values, and with a body pops them after. Without a body it returns how many it pushed, pass that to pop. */
  style(values: StyleValues): number;
  /** Pushes style values, and with a body pops them after. Without a body it returns how many it pushed, pass that to pop. */
  style<T>(values: StyleValues, body: (ui: Ui) => T): T;

  /** Your own widget. Reserves w by h and tells you what happened to it. ITEM_* flags, DRAG_X or DRAG_Y alone lock that axis. */
  custom(id: string, w?: number, h?: number, flags?: number): Item;
  /** Keeps n numbers per id between frames, zero the first time. */
  store(id: string, n: number): Float64Array;
  /** Binds an editing action to key combos, same as config.bind. */
  bind(action: number | string, combos: string | string[]): this;
  /**
   * Animates a number towards target over ms, call it every frame. Returns the current value.
   * @param ms How long it takes, in ms.
   */
  anim(id: string, target: number, ms?: number, ease?: Ease): number;
  /** Same as anim for a color. */
  animColor(id: string, target: number, ms?: number, ease?: Ease): number;
  /** Turns the accessibility tree on or off. */
  a11y(on?: boolean): void;
  /** Sets the role and label for the next widget. */
  a11yRole(role: number | string, label?: string): void;
  /** Sets the value text for the next widget. */
  a11yValue(value: string): void;
  /** The accessibility tree built last frame. */
  a11yTree(): A11yNode[];
}

/** One node of the accessibility tree. */
export interface A11yNode {
  /** ROLE_* of the node. */
  role: number;
  /** The role as a word. */
  roleName: string;
  /** Index of the parent node, null for a root. */
  parent: number | null;
  /** A11Y_* bits. */
  states: number;
  /** Left edge, logical. */
  x: number;
  /** Top edge, logical. */
  y: number;
  /** Width, logical. */
  w: number;
  /** Height, logical. */
  h: number;
  /** Label text. */
  label: string;
  /** Value text. */
  value: string;
  /** Widget id. */
  id: number;
  /** Current number, for sliders and the like. */
  num: number;
  /** Smallest number. */
  min: number;
  /** Biggest number. */
  max: number;
  /** Caret byte offset in text. */
  caret: number;
  /** Has keyboard focus. */
  focused: boolean;
  /** Is checked. */
  checked: boolean;
  /** Is disabled. */
  disabled: boolean;
  /** Is expanded. */
  expanded: boolean;
  /** Is selected. */
  selected: boolean;
}

/** Options for App. */
export interface AppOptions extends OpenOptions {
  /** Window title. */
  title?: string;
  /** Window width, logical. */
  width?: number;
  /** Window height, logical. */
  height?: number;
  /** APP_* flags for the root panel. */
  flags?: number;
  /** Frame rate while it is drawing, default 60. */
  fps?: number;
  /** How long to wait for events when nothing needs drawing, default 500. */
  idleMs?: number;
  /** Use the light theme. */
  light?: boolean;
}

/** A small run loop around the ui. Give it a draw function and call run(). */
export declare class App {
  /** Makes an app. A string is the title. */
  constructor(opts?: AppOptions | string);
  /** Window title. */
  title: string;
  /** Window width, logical. */
  width: number;
  /** Window height, logical. */
  height: number;
  /** APP_* flags for the root panel. */
  flags: number;
  /** Frame rate while it is drawing, default 60. */
  fps: number;
  /** How long to wait for events when nothing needs drawing, default 500. */
  idleMs: number;
  /** Use the light theme. */
  light: boolean;
  /** Keep redrawing every frame. */
  animate: boolean;
  /** True while the loop runs. */
  running: boolean;
  /** How many frames were drawn. */
  frames: number;
  /** The Goome session, after start(). */
  g: Goome | null;
  /** The Ui, after start(). */
  ui: Ui | null;
  /** Sets the draw function. */
  frame(draw: (ui: Ui) => void): this;
  /** Sets an event handler, return true to say you used the event. */
  onEvent(handler: (ev: Event) => boolean | void): this;
  /** Sets a handler for the close button, return true to stop it closing. */
  onClose(handler: () => boolean | void): this;
  /** Sets a handler that runs after start(). */
  onStart(handler: (app: App) => void): this;
  /** Asks for another frame. */
  redraw(): void;
  /** Asks the loop to stop. */
  quit(): void;
  /** Opens the window and the ui without running the loop. */
  start(): this;
  /** Handles events and draws one frame if one is due. Returns false once the app should stop. */
  step(wait?: boolean): boolean;
  /** Closes everything. */
  stop(): void;
  /** Starts the app and loops until it quits. */
  run(draw?: (ui: Ui) => void): void;
}

/** Names of the style fields you can push. */
export declare const STYLE_NAMES: string[];
/** Names of the text alignments. */
export declare const ALIGN_NAMES: string[];
/** Names of the easing curves. */
export declare const EASE_NAMES: string[];
/** Names of the accessibility roles. */
export declare const ROLE_NAMES: string[];
/** Names of the theme presets. */
export declare const PRESET_NAMES: string[];
/** Names of the themable icons. */
export declare const ICON_NAMES: string[];
/** Names of the skin slots. */
export declare const SKIN_NAMES: string[];
/** Names of the editing actions you can rebind. */
export declare const ACT_NAMES: string[];
/** Names of the cursor slots in Config. */
export declare const CUR_NAMES: string[];
