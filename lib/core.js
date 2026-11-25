"use strict";
const native = require("./native");
const C = require("./consts");
const L = require("./layout");

const fn = native.fn;
const dispose = Symbol.dispose || Symbol.for("nodejs.dispose");

/** Base error for everything goome throws. code is the GOOME_E* number. */
class GoomeError extends Error {
  constructor(code, message) {
    super(message || fn.strerror(code) || "goome error " + code);
    this.name = new.target.name;
    this.code = code;
  }
}
/** The backend or os cant do this. */
class NotSupported extends GoomeError {}
/** The os or the user said no, like a refused screen capture permission. */
class Denied extends GoomeError {}
/** No display to talk to. */
class NoDisplay extends GoomeError {}
/** The thing you used is gone, like an old Image or a closed window. */
class Gone extends GoomeError {}
/** Not ready yet, try again. */
class Again extends GoomeError {}
/** Ran out of memory. */
class NoMemory extends GoomeError {}
/** A bad argument went into goome. */
class BadArg extends GoomeError {}
const ERRORS = { [C.ENOTSUP]: NotSupported, [C.EDENIED]: Denied, [C.ENODISPLAY]: NoDisplay, [C.EGONE]: Gone,
  [C.EAGAIN]: Again, [C.ENOMEM]: NoMemory, [C.EARG]: BadArg };

function errorFor(code, message) {
  const E = ERRORS[code] || GoomeError;
  return new E(code, message);
}

/** Text for a goome error code. */
function strerror(code) {
  return fn.strerror(code);
}

let zeroCopy = true;
/** Wraps native memory at address as a Uint32Array of count pixels. */
function pixelView(addr, count) {
  if (!addr || count <= 0) return new Uint32Array(0);
  if (zeroCopy) {
    const ab = native.view(addr, count * 4);
    if (ab) return new Uint32Array(ab);
    zeroCopy = false;
  }
  return new Uint32Array(native.copy(addr, count * 4));
}

function rectIn(r) {
  if (r == null) return null;
  const dv = L.alloc(L.goome_rect);
  const [x, y, w, h] = Array.isArray(r) ? r : [r.x, r.y, r.w, r.h];
  dv.setInt32(0, Math.trunc(x), true);
  dv.setInt32(4, Math.trunc(y), true);
  dv.setInt32(8, Math.trunc(w), true);
  dv.setInt32(12, Math.trunc(h), true);
  return dv;
}

function rectOut(dv, off = 0) {
  return { x: dv.getInt32(off, true), y: dv.getInt32(off + 4, true), w: dv.getInt32(off + 8, true), h: dv.getInt32(off + 12, true) };
}

function nativeRect(addr, off) {
  return { x: native.peek(addr, off, 0), y: native.peek(addr, off + 4, 0), w: native.peek(addr, off + 8, 0), h: native.peek(addr, off + 12, 0) };
}

const EVENT_NAMES = ["none", "down", "up", "motion", "scroll", "key", "hotkey", "control", "monitors", "quit", "close", "focus", "drop", "text", "preedit"];

/** An input or window event from Goome.poll. */
class Event {
  constructor(fields = {}) {
    this.type = 0;
    this.x = 0;
    this.y = 0;
    this.mon = 0;
    this.button = 0;
    this.dy = 0;
    this.key = 0;
    this.mods = 0;
    this.text = "";
    this.id = 0;
    this.msg = "";
    this.path = null;
    Object.assign(this, fields);
    if (typeof this.type === "string") this.type = EVENT_NAMES.indexOf(this.type.toLowerCase());
  }

  get name() {
    return EVENT_NAMES[this.type] || String(this.type);
  }

  static fromRaw(dv) {
    const e = new Event();
    for (const k of L.goome_event.order) e[k] = L.read(dv, L.goome_event, k);
    return e;
  }

  toRaw() {
    const dv = L.alloc(L.goome_event);
    for (const k of L.goome_event.order) L.write(dv, L.goome_event, k, this[k] == null ? 0 : this[k]);
    return dv;
  }
}

/** One monitor. area is in logical desktop coords. */
class Monitor {
  constructor(dv, off) {
    const s = L.goome_monitor;
    const sub = new DataView(dv.buffer, dv.byteOffset + off, s.size);
    this.id = L.read(sub, s, "id");
    this.name = L.read(sub, s, "name");
    this.area = rectOut(sub, s.fields.area.offset);
    this.scale = L.read(sub, s, "scale");
    this.pw = L.read(sub, s, "pw");
    this.ph = L.read(sub, s, "ph");
    this.rotation = L.read(sub, s, "rotation");
  }
}

/** A grabbed screen image. Its pixels are only good until the next capture of that monitor. */
class Image {
  constructor(g, dv, gen, key) {
    const s = L.goome_image;
    this._g = g;
    this._gen = gen;
    this._key = key;
    this._px = L.read(dv, s, "px");
    this.w = L.read(dv, s, "w");
    this.h = L.read(dv, s, "h");
    this.stride = L.read(dv, s, "stride");
    this.area = rectOut(dv, s.fields.area.offset);
    this.mon = L.read(dv, s, "mon");
    this.hasSelf = !!L.read(dv, s, "has_self");
    this.hasCursor = !!L.read(dv, s, "has_cursor");
    this.cursor = rectOut(dv, s.fields.cursor.offset);
  }

  get fresh() {
    return !this._g.closed && this._g._gens[this._key] === this._gen;
  }

  get pixels() {
    if (!this.fresh) throw new Gone(C.EGONE, "this image is old, goome reused its pixels. copy() it if you need to keep it");
    return pixelView(this._px, this.h > 0 ? (this.h - 1) * this.stride + this.w : 0);
  }

  row(y) {
    return this.pixels.subarray(y * this.stride, y * this.stride + this.w);
  }

  pixel(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) throw new RangeError(`${x},${y} is outside the ${this.w}x${this.h} image`);
    return this.pixels[y * this.stride + x];
  }

  copy() {
    const px = this.pixels;
    const out = new Uint32Array(this.w * this.h);
    for (let y = 0; y < this.h; y++) out.set(px.subarray(y * this.stride, y * this.stride + this.w), y * this.w);
    return out;
  }

  savePpm(path) {
    const rc = fn.save_ppm(path, this.pixels, this.w, this.h, this.stride);
    if (rc < 0) throw errorFor(rc, "cant save " + path);
  }
}

/** Frame limiter. Call wait() once per loop. */
class Pacer {
  constructor(fps = 60) {
    this.fps = fps;
    this._dv = L.alloc(L.goome_pacer);
  }

  wait(fps) {
    return fn.pace(this._dv, fps == null ? this.fps : fps);
  }
}

/** Turns a combo like "ctrl+shift+k" into a key and mods. */
function parseCombo(combo) {
  const k = new Int32Array(2);
  const rc = fn.parse_combo(String(combo), k, k.subarray(1));
  if (rc < 0) throw errorFor(rc, `cant read the combo "${combo}"`);
  return { key: k[0], mods: k[1] };
}

/** Sends a message line to the control fifo of a goome app that uses this stateDir. */
function send(stateDir, msg) {
  const rc = fn.send(stateDir, msg);
  if (rc < 0) throw errorFor(rc, "cant send to " + stateDir);
}

/** Milliseconds from goome's clock. */
function nowMs() {
  return fn.now_ms();
}

/** Writes pixels to a .ppm file. */
function savePpm(path, pixels, w, h, stride = w) {
  const px = pixels instanceof Uint32Array ? pixels : Uint32Array.from(pixels);
  if (!(w > 0 && h > 0 && stride >= w)) throw new RangeError(`bad image size ${w}x${h} stride ${stride}`);
  if (px.length < (h - 1) * stride + w) throw new RangeError(`${w}x${h} needs ${(h - 1) * stride + w} pixels, got ${px.length}`);
  const rc = fn.save_ppm(String(path), px, w, h, stride);
  if (rc < 0) throw errorFor(rc, "cant save " + path);
}

/** Turns a single radius into the [tl, tr, br, bl] form. */
function radius(r) {
  return [r, r, r, r];
}

function radiiIn(r) {
  if (r == null) return 0;
  if (typeof r === "number") return r;
  if (Array.isArray(r)) return r.length === 4 ? r : [r[0] || 0, r[1] || 0, r[2] || 0, r[3] || 0];
  return [r.tl || 0, r.tr || 0, r.br || 0, r.bl || 0];
}

function u32(argb) {
  return argb >>> 0;
}

/** A decoded image for drawing and skins. Close it when you are done, or use it with using. */
class Bitmap {
  constructor() {
    this._p = native.alloc(L.goome_bitmap.size);
    this._keep = null;
    this._live = false;
    this._themes = new Set();
  }

  static _loaded(rc, b, what) {
    if (rc !== C.OK) {
      native.free(b._p);
      b._p = 0;
      throw errorFor(rc, `cant load ${what}: ${fn.bitmap_error() || "unknown"}`);
    }
    b._live = true;
    return b;
  }

  static load(path) {
    const b = new Bitmap();
    return Bitmap._loaded(fn.bitmap_load(String(path), b._p), b, path);
  }

  static fromBytes(data) {
    const b = new Bitmap();
    const u8 = data instanceof Uint8Array ? data : new Uint8Array(data);
    return Bitmap._loaded(fn.bitmap_load_mem(u8, u8.byteLength, b._p), b, "the image bytes");
  }

  static fromArgb(pixels, w, h) {
    const px = pixels instanceof Uint32Array ? pixels : Uint32Array.from(pixels);
    if (px.length < w * h) throw new RangeError(`${w}x${h} needs ${w * h} pixels, got ${px.length}`);
    const b = new Bitmap();
    return Bitmap._loaded(fn.bitmap_from_argb(px, w, h, b._p), b, "the pixels");
  }

  static wrap(pixels, w, h, stride = w) {
    const px = pixels instanceof Uint32Array ? pixels : Uint32Array.from(pixels);
    if (h > 0 && px.length < (h - 1) * stride + w) throw new RangeError("not enough pixels for that size");
    const b = new Bitmap();
    const s = L.goome_bitmap;
    L.set(b._p, s, "px", native.addr(px));
    L.set(b._p, s, "w", w);
    L.set(b._p, s, "h", h);
    L.set(b._p, s, "stride", stride);
    L.set(b._p, s, "owned", 0);
    b._keep = px;
    b._live = true;
    return b;
  }

  _ref() {
    if (!this._live) throw new Gone(C.EGONE, "this bitmap is closed");
    return this._p;
  }

  get w() { return this._live ? L.get(this._p, L.goome_bitmap, "w") : 0; }
  get h() { return this._live ? L.get(this._p, L.goome_bitmap, "h") : 0; }
  get stride() { return this._live ? L.get(this._p, L.goome_bitmap, "stride") : 0; }
  get owned() { return this._live && !!L.get(this._p, L.goome_bitmap, "owned"); }
  get closed() { return !this._live; }

  get pixels() {
    const p = this._ref();
    const h = this.h;
    return pixelView(L.get(p, L.goome_bitmap, "px"), h > 0 ? (h - 1) * this.stride + this.w : 0);
  }

  close() {
    if (!this._live) return;
    for (const t of this._themes) {
      try {
        t._dropBitmap(this);
      } catch (e) {}
    }
    this._themes.clear();
    this._live = false;
    if (L.get(this._p, L.goome_bitmap, "owned")) fn.bitmap_free(this._p);
    native.free(this._p);
    this._p = 0;
    this._keep = null;
  }

  [dispose]() {
    this.close();
  }
}

/** A loaded font. Close it when you are done, or use it with using. */
class Font {
  constructor(handle, keep, borrowed) {
    this._f = handle;
    this._keep = keep || null;
    this._borrowed = !!borrowed;
    this._fallbacks = [];
    this._users = new Set();
    this._shut = false;
  }

  static load(path, index) {
    const h = index == null ? fn.font_load(String(path)) : fn.font_load_index(String(path), index);
    if (!h) throw new GoomeError(C.EARG, "cant load the font " + path);
    return new Font(h);
  }

  static fromBytes(data) {
    const u8 = data instanceof Uint8Array ? data : new Uint8Array(data);
    const h = fn.font_load_mem(u8, u8.byteLength, 1);
    if (!h) throw new GoomeError(C.EARG, "thats not a font goome can read");
    return new Font(h);
  }

  static system(name) {
    const h = fn.font_system(name == null ? null : String(name));
    return h ? new Font(h) : null;
  }

  _h() {
    if (!this._f || this._shut) throw new Gone(C.EGONE, "this font is closed");
    return this._f;
  }

  get closed() { return !this._f || this._shut; }

  fallback(other) {
    if (!(other instanceof Font)) throw new TypeError("a fallback has to be a Font");
    const h = this._h();
    const o = other._h();
    if (other === this || this._fallbacks.includes(other)) return this;
    fn.font_fallback(h, o);
    this._fallbacks.push(other);
    other._users.add(this);
    return this;
  }

  get fallbacks() { return this._fallbacks.slice(); }

  measure(text, size) {
    const h = new Float64Array(1);
    const w = fn.text_measure(this._h(), size, String(text), h);
    return { w, h: h[0] };
  }

  width(text, size) {
    return fn.text_measure(this._h(), size, String(text), null);
  }

  lineHeight(size) {
    return fn.text_line_height(this._h(), size);
  }

  close() {
    this._shut = true;
    this._free();
  }

  _free() {
    if (!this._f || !this._shut || this._users.size) return;
    if (!this._borrowed) fn.font_free(this._f);
    this._f = 0;
    const fbs = this._fallbacks;
    this._fallbacks = [];
    for (const f of fbs) {
      f._users.delete(this);
      f._free();
    }
  }

  [dispose]() {
    this.close();
  }
}

function fontPtr(f) {
  return f == null ? null : f._h();
}

/** Width of text in logical px. Without a font it uses the built in one. */
function measure(text, size, font) {
  return fn.text_measure(fontPtr(font), size, String(text), null);
}

/** Line height for a font size. Without a font it uses the built in one. */
function lineHeight(size, font) {
  return fn.text_line_height(fontPtr(font), size);
}

/** Paragraph direction for all text: auto goes by the first strong letter of each line. */
function textDir(dir) {
  const d = typeof dir === "string" ? ["auto", "ltr", "rtl"].indexOf(dir.toLowerCase()) : dir;
  if (!(d >= 0 && d <= 2)) throw new RangeError(`text direction is auto, ltr or rtl, not ${dir}`);
  fn.text_dir(d);
}

/** Runs an easing curve, t goes 0 to 1 and the result is the eased 0 to 1. */
function ease(kind, t) {
  return fn.ease(easeId(kind), +t);
}

const EASES = ["smooth", "linear", "out", "in_out", "back", "custom", "in", "spring", "bounce"];

function easeId(kind) {
  if (typeof kind !== "string") return kind | 0;
  const i = EASES.indexOf(kind.toLowerCase().replace(/[ -]/g, "_").replace(/inout/, "in_out"));
  if (i < 0) throw new RangeError(`theres no ease called "${kind}", its one of ${EASES.join(", ")}`);
  return i;
}

/** Picks which built in font plain canvas.text uses. */
function setFont(i) {
  fn.set_font(i);
}

/** How many built in fonts there are. */
function fontCount() {
  return fn.font_count();
}

/** Something you draw on. Coordinates are logical, colors are 0xAARRGGBB. */
class Canvas {
  constructor(ptr, g, own) {
    this._ptr = ptr;
    this._g = g || null;
    this._own = own || null;
    this._hits = [];
  }

  static new(w, h, opts = {}) {
    const stride = opts.stride == null ? w : opts.stride;
    if (w < 0 || h < 0 || stride < w) throw new RangeError(`bad canvas size ${w}x${h} stride ${stride}`);
    const s = L.goome_canvas;
    const p = native.alloc(s.size);
    const px = native.alloc(Math.max(1, h * stride) * 4);
    if (!p || !px) {
      native.free(p);
      native.free(px);
      throw new NoMemory(C.ENOMEM, `no memory for a ${w}x${h} canvas`);
    }
    L.set(p, s, "px", px);
    L.set(p, s, "w", w);
    L.set(p, s, "h", h);
    L.set(p, s, "stride", stride);
    L.set(p, s, "scale", opts.scale == null ? 1 : opts.scale);
    L.set(p, s, "ox", opts.ox || 0);
    L.set(p, s, "oy", opts.oy || 0);
    return new Canvas(p, null, { p, px });
  }

  _p() {
    if (!this._ptr) throw new Gone(C.EGONE, "this canvas got handed back with end(), get a new one from begin()");
    return this._ptr;
  }

  _take() {
    const p = this._p();
    if (!this._own) this._ptr = 0;
    return p;
  }

  get valid() { return !!this._ptr; }

  _f(name) { return L.get(this._p(), L.goome_canvas, name); }

  get raw() {
    const out = {};
    for (const k of L.goome_canvas.order) if (k !== "clips") out[k] = this._f(k);
    return out;
  }

  get w() { return this._f("w"); }
  get h() { return this._f("h"); }
  get stride() { return this._f("stride"); }
  get scale() { return this._f("scale"); }
  get ox() { return this._f("ox"); }
  get oy() { return this._f("oy"); }
  get mon() { return this._f("mon"); }
  get address() { return this._p(); }

  get drawn() {
    const x0 = this._f("dx0"), y0 = this._f("dy0");
    return { x: x0, y: y0, w: this._f("dx1") - x0, h: this._f("dy1") - y0 };
  }

  get pixels() {
    return pixelView(this._f("px"), this._f("h") * this._f("stride"));
  }

  row(y) {
    const s = this.stride;
    return this.pixels.subarray(y * s, y * s + this.w);
  }

  hit(x, y, w, h) {
    this._hits.push([x, y, w, h]);
    return this;
  }

  damage(rect) { fn.damage(this._p(), rectIn(rect)); return this; }
  clear() { fn.clear(this._p()); return this; }
  rect(x, y, w, h, argb) { fn.draw_rect(this._p(), x, y, w, h, u32(argb)); return this; }
  roundRect(x, y, w, h, r, argb) { fn.draw_round_rect(this._p(), x, y, w, h, r, u32(argb)); return this; }
  frame(x, y, w, h, width, argb) { fn.draw_frame(this._p(), x, y, w, h, width, u32(argb)); return this; }
  line(x0, y0, x1, y1, width, argb) { fn.draw_line(this._p(), x0, y0, x1, y1, width, u32(argb)); return this; }
  triangle(x0, y0, x1, y1, x2, y2, argb) { fn.draw_triangle(this._p(), x0, y0, x1, y1, x2, y2, u32(argb)); return this; }

  image(x, y, w, h, pixels, iw, ih) {
    const px = pixels instanceof Uint32Array ? pixels : Uint32Array.from(pixels);
    if (px.length < iw * ih) throw new RangeError(`${iw}x${ih} needs ${iw * ih} pixels`);
    fn.draw_image(this._p(), x, y, w, h, px, iw, ih);
    return this;
  }

  erase(x, y, w, h) { fn.erase(this._p(), x, y, w, h); return this; }
  text(x, y, text, argb = 0xffffffff, big = false) { return fn.draw_text(this._p(), x, y, String(text), big ? 1 : 0, u32(argb)); }
  textWidth(text, big = false) { return fn.text_width(this._p(), String(text), big ? 1 : 0); }
  fontText(font, size, x, y, text, argb = 0xffffffff) { return fn.text(this._p(), fontPtr(font), size, x, y, String(text), u32(argb)); }

  blit(src, alpha = 1, dx = 0, dy = 0) { fn.canvas_blit(this._p(), src._p(), alpha, dx, dy); return this; }
  clipPush(x, y, w, h) { fn.clip_push(this._p(), x, y, w, h); return this; }
  clipPop() { fn.clip_pop(this._p()); return this; }

  clip(x, y, w, h, body) {
    this.clipPush(x, y, w, h);
    try {
      return body(this);
    } finally {
      if (this._ptr) this.clipPop();
    }
  }

  rrect(x, y, w, h, r, argb) { fn.draw_rrect(this._p(), x, y, w, h, radiiIn(r), u32(argb)); return this; }
  rrectLine(x, y, w, h, r, width, argb) { fn.draw_rrect_line(this._p(), x, y, w, h, radiiIn(r), width, u32(argb)); return this; }
  rrectGrad(x, y, w, h, r, from, to, sideways = false) { fn.draw_rrect_grad(this._p(), x, y, w, h, radiiIn(r), u32(from), u32(to), sideways ? 1 : 0); return this; }
  shadow(x, y, w, h, r, blur, argb) { fn.draw_shadow(this._p(), x, y, w, h, r, blur, u32(argb)); return this; }
  circle(cx, cy, r, argb) { fn.draw_circle(this._p(), cx, cy, r, u32(argb)); return this; }
  ring(cx, cy, r, width, argb) { fn.draw_ring(this._p(), cx, cy, r, width, u32(argb)); return this; }
  arc(cx, cy, r, width, a0, a1, argb) { fn.draw_arc(this._p(), cx, cy, r, width, a0, a1, u32(argb)); return this; }

  poly(points, argb) {
    const flat = [];
    for (const p of points) {
      if (typeof p === "number") flat.push(p);
      else flat.push(p[0], p[1]);
    }
    if (flat.length % 2) throw new RangeError("poly wants x,y pairs, got an odd number of values");
    fn.draw_poly(this._p(), Float64Array.from(flat), flat.length / 2, u32(argb));
    return this;
  }

  bitmap(bmp, x, y, w, h, r = 0, tint = 0xffffffff) { fn.draw_bitmap(this._p(), bmp._ref(), x, y, w, h, radiiIn(r), u32(tint)); return this; }
  bitmapPart(bmp, sx, sy, sw, sh, x, y, w, h, tint = 0xffffffff) { fn.draw_bitmap_part(this._p(), bmp._ref(), sx, sy, sw, sh, x, y, w, h, u32(tint)); return this; }

  bitmapNine(bmp, x, y, w, h, left, top = left, right = left, bottom = top) {
    fn.draw_bitmap_nine(this._p(), bmp._ref(), x, y, w, h, left, top, right, bottom);
    return this;
  }

  close() {
    if (!this._own) return;
    native.free(this._own.px);
    native.free(this._own.p);
    this._own = null;
    this._ptr = 0;
  }

  [dispose]() {
    this.close();
  }
}

const BACKENDS = { auto: C.AUTO, wayland: C.WAYLAND, gnome: C.GNOME, portal: C.PORTAL, x11: C.X11, win32: C.WIN32, macos: C.MACOS, test: C.TEST, offscreen: C.OFFSCREEN };
const MODES = { overlay: C.MODE_OVERLAY, window: C.MODE_WINDOW, offscreen: C.MODE_OFFSCREEN };

function pick(v, names, what) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const k = String(v).toLowerCase();
  if (!(k in names)) throw new RangeError(`theres no ${what} called "${v}", try ${Object.keys(names).join(", ")}`);
  return names[k];
}

/** One goome session: an overlay, a window or an offscreen canvas. */
class Goome {
  constructor(opts = {}) {
    if (typeof opts === "string") opts = { title: opts };
    const s = L.goome_opts;
    const mode = pick(opts.mode, MODES, "mode");
    this._strs = [];
    const str = (v) => {
      if (v == null) return 0;
      const p = native.cstr(String(v));
      this._strs.push(p);
      return p;
    };
    const dv = L.alloc(s);
    const set = (k, v) => L.write(dv, s, k, v);
    set("title", str(opts.title));
    set("backend", pick(opts.backend, BACKENDS, "backend"));
    set("state_dir", str(opts.stateDir));
    set("no_capture", opts.noCapture ? 1 : 0);
    set("capture_fps", opts.captureFps || 0);
    set("hide_self", opts.hideSelf ? 1 : 0);
    set("test_frames", str(opts.testFrames));
    set("test_script", str(opts.testScript));
    set("test_shots", str(opts.testShots));
    set("mode", mode);
    set("width", opts.width || 0);
    set("height", opts.height || 0);
    set("min_width", opts.minWidth || 0);
    set("min_height", opts.minHeight || 0);
    set("window_flags", opts.windowFlags || 0);
    set("scale", opts.scale || 0);
    const err = new Int32Array(1);
    this._g = opts._app ? fn.open_app(opts.title == null ? null : String(opts.title), opts.width || 0, opts.height || 0, err) : fn.open(dv, err);
    this._ev = L.alloc(L.goome_event);
    this._gens = {};
    this._began = 0;
    this._uis = new Set();
    this._canvases = new Set();
    if (!this._g) {
      this._free();
      const code = err[0] || C.ENODISPLAY;
      const what = mode === C.MODE_OFFSCREEN ? "an offscreen goome" : opts._app || mode === C.MODE_WINDOW ? "an app window" : "an overlay";
      throw errorFor(code, `cant open ${what}: ${strerror(code)}`);
    }
  }

  _free() {
    for (const p of this._strs) native.free(p);
    this._strs = [];
  }

  _h() {
    if (!this._g) throw new Gone(C.EGONE, "goome is already closed");
    return this._g;
  }

  _check(rc) {
    if (rc < 0) throw errorFor(rc, this.error || strerror(rc));
    return rc;
  }

  get closed() { return !this._g; }

  close() {
    if (!this._g) return;
    for (const u of [...this._uis]) u.close();
    for (const c of this._canvases) c._ptr = 0;
    this._canvases.clear();
    const g = this._g;
    this._g = 0;
    fn.close(g);
    this._free();
  }

  [dispose]() {
    this.close();
  }

  get error() { return this._g ? fn.error(this._g) : null; }
  get backendName() { return fn.backend_name(this._h()); }
  get caps() { return fn.caps(this._h()); }
  can(cap) { return !!(this.caps & cap); }
  get mode() { return fn.mode(this._h()); }

  monitors() {
    const s = L.goome_monitor;
    const dv = new DataView(new ArrayBuffer(s.size * 32));
    const n = this._check(fn.monitors(this._h(), dv, 32));
    const out = [];
    for (let i = 0; i < Math.min(n, 32); i++) out.push(new Monitor(dv, i * s.size));
    return out;
  }

  capture(mon = 0, rect = null) {
    const dv = L.alloc(L.goome_image);
    this._check(fn.capture(this._h(), mon, rectIn(rect), dv));
    const key = "grab" + mon;
    this._gens[key] = (this._gens[key] || 0) + 1;
    return new Image(this, dv, this._gens[key], key);
  }

  alphaAt(x, y) { return fn.alpha_at(this._h(), x, y); }

  begin(mon = 0) {
    const p = fn.begin(this._h(), mon);
    this._began++;
    this._gens.frame = this._began;
    if (!p) return null;
    const c = new Canvas(p, this);
    this._canvases.add(c);
    return c;
  }

  end(canvas, hits) {
    const rects = canvas._hits.concat(hits || []);
    let arr = null;
    if (rects.length) {
      arr = new DataView(new ArrayBuffer(16 * rects.length));
      rects.forEach((r, i) => {
        const one = rectIn(r);
        for (let k = 0; k < 16; k += 4) arr.setInt32(i * 16 + k, one.getInt32(k, true), true);
      });
    }
    const p = canvas._take();
    this._canvases.delete(canvas);
    return this._check(fn.end(this._h(), p, arr, rects.length));
  }

  frame(mon, body) {
    if (typeof mon === "function") body = mon, mon = 0;
    const c = this.begin(mon || 0);
    if (!c) return false;
    try {
      body(c);
    } finally {
      if (c.valid) this.end(c);
    }
    return true;
  }

  damage(canvas, rect) { fn.damage(canvas._p(), rectIn(rect)); }

  poll(timeoutMs = 0) {
    const rc = this._check(fn.poll(this._h(), this._ev, timeoutMs | 0));
    if (rc <= 0) return null;
    const e = Event.fromRaw(this._ev);
    if (e.type === C.DROP) e.path = fn.drop_path(this._g);
    if (e.type === C.TEXT || e.type === C.PREEDIT) e.msg = fn.event_text(this._g);
    return e;
  }

  *events(timeoutMs = 0) {
    let e = this.poll(timeoutMs);
    while (e) {
      yield e;
      e = this.poll(0);
    }
  }

  pointer() {
    const d = new Float64Array(2);
    const b = new Int32Array(1);
    if (!fn.pointer(this._h(), d, d.subarray(1), b)) return null;
    return { x: d[0], y: d[1], buttons: b[0] };
  }

  keyboard(on = true) { return this._check(fn.keyboard(this._h(), on ? 1 : 0)); }
  grab(on = true) { return this._check(fn.grab(this._h(), on ? 1 : 0)); }
  get grabbed() { return !!fn.grabbed(this._h()); }
  hotkey(combo, id) { return this._check(fn.hotkey(this._h(), String(combo), id | 0)); }
  get controlPath() { return fn.control_path(this._h()); }

  ui() {
    const { Ui } = require("./ui");
    return new Ui(this);
  }

  setTitle(title) { this._check(fn.window_title(this._h(), String(title))); }

  get size() {
    const m = this.monitors()[0];
    return m ? { w: m.area.w, h: m.area.h } : { w: 0, h: 0 };
  }

  setSize(w, h) { this._check(fn.window_size(this._h(), w, h)); }

  resize(w, h, scale = 0) {
    if (this.mode === C.MODE_OFFSCREEN) this._check(fn.resize(this._h(), w, h, scale));
    else this._check(fn.window_size(this._h(), w, h));
  }

  get pos() {
    const v = new Int32Array(2);
    const rc = fn.window_pos(this._h(), v, v.subarray(1), 0);
    return rc < 0 ? null : { x: v[0], y: v[1] };
  }

  setPos(x, y) {
    const v = new Int32Array([x, y]);
    this._check(fn.window_pos(this._h(), v, v.subarray(1), 1));
  }

  get state() { return fn.window_get_state(this._h()); }
  setState(st) { this._check(fn.window_state(this._h(), st)); }
  minimize() { this.setState(C.STATE_MINIMIZED); }
  maximize() { this.setState(C.STATE_MAXIMIZED); }
  fullscreen(on = true) { this.setState(on ? C.STATE_FULLSCREEN : C.STATE_NORMAL); }
  drag(edges = 0) { return this._check(fn.window_drag(this._h(), edges)); }
  show(on = true) { return this._check(fn.window_show(this._h(), on ? 1 : 0)); }
  hide() { return this.show(false); }
  get cursor() { return fn.cursor_shape(this._h()); }
  setCursor(shape) { return this._check(fn.cursor(this._h(), shape)); }

  get clipboard() {
    let cap = 4096;
    for (;;) {
      const buf = new Uint8Array(cap);
      const n = this._check(fn.clipboard_get(this._h(), buf, cap));
      if (n < cap) return Buffer.from(buf.subarray(0, n)).toString("utf8");
      cap = n + 1;
    }
  }

  setClipboard(text) { this._check(fn.clipboard_set(this._h(), String(text))); }
  get dropPath() { return fn.drop_path(this._h()); }
  get eventText() { return fn.event_text(this._h()); }
  get preeditCursor() { return fn.preedit_cursor(this._h()); }
  textInput(on = true, caret = null) { return this._check(fn.text_input(this._h(), on ? 1 : 0, rectIn(caret))); }

  push(ev, fields) {
    if (!(ev instanceof Event)) ev = new Event({ ...(fields || {}), type: ev });
    this._check(fn.push(this._h(), ev.toRaw()));
  }

  pushText(text) {
    for (const ch of String(text)) {
      const k = ch.codePointAt(0);
      this.push(C.KEY, { key: k < 128 ? k : 0, text: ch });
    }
  }

  pushCommit(text) {
    this.push(C.TEXT, { msg: String(text) });
  }

  pushPreedit(text, cursor = Buffer.byteLength(String(text))) {
    this.push(C.PREEDIT, { msg: String(text), id: cursor | 0 });
  }

  pushClick(x, y, button = 1) {
    this.push(C.MOTION, { x, y });
    this.push(C.DOWN, { x, y, button });
    this.push(C.UP, { x, y, button });
  }

  lastFrame() {
    const dv = L.alloc(L.goome_image);
    this._check(fn.frame(this._h(), dv));
    return new Image(this, dv, this._began, "frame");
  }

  hit(x, y) { return !!fn.hit(this._h(), x, y); }

  frameDirty() {
    const dv = L.alloc(L.goome_rect);
    if (!fn.frame_dirty(this._h(), dv)) return null;
    return rectOut(dv);
  }

  frameCopy(buf, opts = {}) {
    let rect = opts.rect;
    if (!rect) {
      const f = this.lastFrame();
      rect = { x: 0, y: 0, w: f.w, h: f.h };
    }
    const r = Array.isArray(rect) ? { x: rect[0], y: rect[1], w: rect[2], h: rect[3] } : rect;
    if (r.w <= 0 || r.h <= 0) throw new RangeError("cant copy an empty rect");
    const stride = opts.stride == null ? r.w * 4 : opts.stride;
    if (stride < r.w * 4) throw new RangeError(`stride ${stride} is too small for ${r.w} px`);
    const need = (r.h - 1) * stride + r.w * 4;
    if (buf == null) buf = new Uint8Array(r.h * stride);
    if (!ArrayBuffer.isView(buf) && !(buf instanceof ArrayBuffer)) throw new TypeError("frameCopy wants a typed array, Buffer or ArrayBuffer to copy into");
    const bytes = ArrayBuffer.isView(buf) ? buf.byteLength : buf.byteLength;
    if (bytes < need) throw new RangeError(`buffer has ${bytes} bytes, needs ${need}`);
    this._check(fn.frame_copy(this._h(), buf, stride, opts.format || 0, rectIn(r)));
    return buf;
  }
}

/** Opens goome. A string is the title. */
function open(opts) {
  return new Goome(opts);
}

/** Opens a normal resizable window, centered. */
function openApp(title = "goome", width = 960, height = 640, opts) {
  if (opts && Object.keys(opts).length) {
    return new Goome({ windowFlags: C.WINDOW_RESIZABLE | C.WINDOW_CENTER, ...opts, title, width, height, mode: C.MODE_WINDOW });
  }
  return new Goome({ title, width, height, mode: C.MODE_WINDOW, _app: true });
}

/** Opens an offscreen canvas you read the pixels of yourself. */
function openOffscreen(width = 960, height = 640, scale = 1, opts = {}) {
  return new Goome({ ...opts, width, height, scale, mode: C.MODE_OFFSCREEN });
}

module.exports = {
  GoomeError, NotSupported, Denied, NoDisplay, Gone, Again, NoMemory, BadArg, errorFor, strerror,
  Event, Monitor, Image, Pacer, Bitmap, Font, Canvas, Goome, open, openApp, openOffscreen,
  parseCombo, send, nowMs, savePpm, radius, radiiIn, measure, lineHeight, setFont, fontCount, pixelView, textDir, ease, easeId, EASES,
  rectIn, rectOut, nativeRect, fontPtr, u32, dispose,
  get zeroCopy() { return zeroCopy; },
};
