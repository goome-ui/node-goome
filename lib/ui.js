"use strict";
const native = require("./native");
const C = require("./consts");
const L = require("./layout");
const core = require("./core");

const fn = native.fn;
const { Gone, GoomeError, Canvas, Font, Bitmap, radiiIn, u32, pixelView, dispose } = core;

const camel = (s) => s.replace(/_([a-z])/g, (m, c) => c.toUpperCase());
const snake = (s) => s.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());

const STYLE_NAMES = Object.keys(C).filter((k) => k.startsWith("S_") && k !== "S_COUNT").sort((a, b) => C[a] - C[b]).map((k) => k.slice(2).toLowerCase());
const STYLE_COLORS = new Set(L.THEME_COLORS);
const ALIGN_NAMES = ["auto", "left", "center", "right"];
const EASE_NAMES = core.EASES;
const PRESET_NAMES = ["dark", "light", "midnight", "paper", "mint", "high_contrast", "rose"];
const ICON_NAMES = Object.keys(C).filter((k) => k.startsWith("ICON_") && k !== "ICON_COUNT").sort((a, b) => C[a] - C[b]).map((k) => k.slice(5).toLowerCase());
const SKIN_NAMES = Object.keys(C).filter((k) => k.startsWith("SKIN_") && k !== "SKIN_COUNT").sort((a, b) => C[a] - C[b]).map((k) => k.slice(5).toLowerCase());
const ACT_NAMES = Object.keys(C).filter((k) => k.startsWith("ACT_") && k !== "ACT_COUNT").sort((a, b) => C[a] - C[b]).map((k) => k.slice(4).toLowerCase());
const CUR_NAMES = Object.keys(C).filter((k) => k.startsWith("CUR_") && k !== "CUR_COUNT").sort((a, b) => C[a] - C[b]).map((k) => k.slice(4).toLowerCase());
const THEME_FONTS = ["font", "font_heading", "font_mono", "font_small"];
const ROLE_NAMES = Object.keys(C).filter((k) => k.startsWith("ROLE_")).sort((a, b) => C[a] - C[b]).map((k) => k.slice(5).toLowerCase());
const AX = L.goome_a11y_node;

function named(v, names, what) {
  if (typeof v !== "string") return v;
  const k = snake(v).toLowerCase().replace(/[ -]/g, "_");
  const i = names.indexOf(k);
  if (i < 0) throw new RangeError(`theres no ${what} called "${v}", its one of ${names.join(", ")}`);
  return i;
}

function styleValue(name, v) {
  if (STYLE_COLORS.has(name)) return u32(v);
  if (name === "align") return named(v, ALIGN_NAMES, "align");
  if (name === "ease") return named(v, EASE_NAMES, "ease");
  return +v;
}

function skinEdges(v) {
  if (v instanceof Bitmap) throw new TypeError("a skin needs a bitmap and its border size, like [bmp, 8] or {bitmap, l, t, r, b}");
  if (Array.isArray(v)) {
    const [bitmap, ...e] = v;
    if (e.length === 1) return { bitmap, l: e[0], t: e[0], r: e[0], b: e[0] };
    if (e.length === 4) return { bitmap, l: e[0], t: e[1], r: e[2], b: e[3] };
    throw new TypeError("give one border size or four (left, top, right, bottom)");
  }
  const b = v.b == null ? v.t == null ? v.l : v.t : v.b;
  return { bitmap: v.bitmap, l: v.l || 0, t: v.t == null ? v.l || 0 : v.t, r: v.r == null ? v.l || 0 : v.r, b: b || 0 };
}

function iconId(i) {
  const n = named(i, ICON_NAMES, "icon");
  if (!(n >= 0 && n < C.ICON_COUNT)) throw new RangeError(`icon has to be 0 to ${C.ICON_COUNT - 1}, not ${i}`);
  return n;
}

const T = L.goome_theme;

class Theme {
  constructor(ui, own) {
    this._ui = ui;
    this._own = own || 0;
    this._fonts = {};
    this._skins = {};
    this._icons = {};
  }

  static make(accent, dark = true, r = 10) {
    const t = new Theme(null, native.alloc(T.size));
    fn.ui_theme_make(t._own, u32(accent), dark ? 1 : 0, r);
    return t;
  }

  static preset(name) {
    const t = new Theme(null, native.alloc(T.size));
    return t.preset(name);
  }

  _p() {
    if (this._own) return this._own;
    if (!this._ui) throw new Gone(C.EGONE, "this theme is closed");
    return fn.ui_theme(this._ui._h());
  }

  dark() { fn.ui_theme_dark(this._p()); return this; }
  light() { fn.ui_theme_light(this._p()); return this; }
  make(accent, dark = true, r = 10) { fn.ui_theme_make(this._p(), u32(accent), dark ? 1 : 0, r); return this; }

  preset(name) {
    const i = named(name, PRESET_NAMES, "preset");
    if (fn.ui_theme_preset(this._p(), i) !== C.OK) throw new RangeError(`preset has to be one of ${PRESET_NAMES.join(", ")}`);
    return this;
  }

  copy() {
    const t = new Theme(null, native.alloc(T.size));
    native.write(t._own, native.view(this._p(), T.size) || native.copy(this._p(), T.size), T.size);
    t._fonts = { ...this._fonts };
    t._skins = { ...this._skins };
    t._icons = { ...this._icons };
    for (const b of Object.values(t._icons)) b._themes.add(t);
    for (const k of Object.values(t._skins)) k.bitmap._themes.add(t);
    return t;
  }

  get iconTint() { return L.get(this._p(), T, "icon_tint"); }
  set iconTint(v) { L.set(this._p(), T, "icon_tint", u32(v)); }

  icon(i) {
    i = iconId(i);
    const b = this._icons[i];
    return b && !b.closed && L.get(this._p(), T, "icon", i) ? b : null;
  }

  setIcon(i, bmp) {
    i = iconId(i);
    if (bmp == null) {
      delete this._icons[i];
      L.set(this._p(), T, "icon", 0, i);
      return this;
    }
    L.set(this._p(), T, "icon", bmp._ref(), i);
    this._icons[i] = bmp;
    bmp._themes.add(this);
    return this;
  }

  clearIcons() {
    for (let i = 0; i < C.ICON_COUNT; i++) this.setIcon(i, null);
    return this;
  }

  skin(name) {
    name = this._skinName(name);
    const k = this._skins[name];
    return k && !k.bitmap.closed ? k : null;
  }

  setSkin(name, v) {
    name = this._skinName(name);
    const off = T.fields[name].offset;
    const p = this._p();
    if (v == null) {
      delete this._skins[name];
      native.poke(p, off, 3, 0);
      for (let i = 0; i < 4; i++) native.poke(p, off + L.goome_skin.fields.l.offset + i * 8, 2, 0);
      return this;
    }
    const k = skinEdges(v);
    native.poke(p, off, 3, k.bitmap._ref());
    [k.l, k.t, k.r, k.b].forEach((e, i) => native.poke(p, off + L.goome_skin.fields.l.offset + i * 8, 2, e));
    this._skins[name] = k;
    k.bitmap._themes.add(this);
    return this;
  }

  _skinName(name) {
    let s = snake(String(name));
    if (!s.startsWith("skin_")) s = "skin_" + s;
    if (!L.THEME_SKINS.includes(s)) throw new RangeError(`theres no skin called "${name}", its one of ${L.THEME_SKINS.join(", ")}`);
    return s;
  }

  _dropBitmap(bmp) {
    for (const [name, k] of Object.entries(this._skins)) if (k.bitmap === bmp) this.setSkin(name, null);
    for (const [i, b] of Object.entries(this._icons)) if (b === bmp) this.setIcon(+i, null);
  }

  toJSON() {
    const out = {};
    for (const n of L.THEME_COLORS.concat(L.THEME_NUMS)) out[camel(n)] = L.get(this._p(), T, n);
    return out;
  }

  update(values) {
    for (const [k, v] of Object.entries(values)) {
      if (k === "icons") {
        for (const [i, b] of Object.entries(v)) this.setIcon(isNaN(+i) ? i : +i, b);
      } else if (!(k in this) || k.startsWith("_")) throw new RangeError(`theme has no ${k}`);
      else this[k] = v;
    }
    return this;
  }

  close() {
    if (this._own) native.free(this._own);
    this._own = 0;
    this._ui = null;
  }

  [dispose]() {
    this.close();
  }
}

for (const n of L.THEME_COLORS.concat(L.THEME_NUMS)) {
  Object.defineProperty(Theme.prototype, camel(n), {
    get() { return L.get(this._p(), T, n); },
    set(v) { L.set(this._p(), T, n, styleValue(n, v)); },
  });
}
for (const n of THEME_FONTS) {
  Object.defineProperty(Theme.prototype, camel(n), {
    get() {
      const p = L.get(this._p(), T, n);
      if (!p) return null;
      const f = this._fonts[n];
      return f && f._f === p ? f : new Font(p);
    },
    set(f) {
      if (f == null) {
        delete this._fonts[n];
        L.set(this._p(), T, n, 0);
        return;
      }
      L.set(this._p(), T, n, f._h());
      this._fonts[n] = f;
    },
  });
}
for (const n of L.THEME_SKINS) {
  Object.defineProperty(Theme.prototype, camel(n), {
    get() { return this.skin(n); },
    set(v) { this.setSkin(n, v); },
  });
}

const G = L.goome_ui_config;
const CFG_INTS = ["tip_delay_ms", "dbl_click_ms", "dbl_click_px", "drag_px", "repeat_delay_ms", "repeat_ms", "blink_ms", "menu_delay_ms", "toast_ms"];
const CFG_BOOLS = ["raise_on_click", "esc_closes", "tab_nav", "focus_on_mouse"];

class Config {
  constructor(ui) {
    this._ui = ui;
    this._mask = 0;
    this._ease = null;
  }

  _p() { return fn.ui_cfg(this._ui._h()); }

  cursor(what) { return L.get(this._p(), G, "cursor", named(what, CUR_NAMES, "cursor spot")); }
  setCursor(what, shape) { L.set(this._p(), G, "cursor", shape, named(what, CUR_NAMES, "cursor spot")); return this; }

  keys(act) {
    const a = named(act, ACT_NAMES, "action");
    const out = [];
    const base = G.fields.keys.offset + a * 4 * 8;
    for (let i = 0; i < 4; i++) {
      const key = native.peek(this._p(), base + i * 8, 0);
      if (key) out.push({ key, mods: native.peek(this._p(), base + i * 8 + 4, 0) });
    }
    return out;
  }

  bind(act, combos) {
    return this._ui.bind(act, combos);
  }

  reset() {
    this._dropMask();
    this._setEase(null);
    fn.ui_config_default(this._p());
    return this;
  }

  get mask() { return L.get(this._p(), G, "mask") ? native.peek(this._p(), G.fields.mask.offset, 8) : null; }

  set mask(text) {
    const old = this._mask;
    this._mask = text == null ? 0 : native.cstr(String(text));
    L.set(this._p(), G, "mask", this._mask);
    if (old) native.free(old);
  }

  get ease() { return this._ease; }
  set ease(f) { this._setEase(f); }

  _setEase(f) {
    if (f != null && typeof f !== "function") throw new TypeError("ease has to be a function (t) => number, or null");
    native.ease(this._p(), f || null);
    this._ease = f || null;
  }

  _dropMask() {
    if (this._mask) {
      try {
        L.set(this._p(), G, "mask", 0);
      } catch (e) {}
      native.free(this._mask);
    }
    this._mask = 0;
  }

  _drop() {
    if (this._ease) {
      try { native.ease(this._p(), null); } catch (e) {}
      this._ease = null;
    }
    this._dropMask();
  }
}

for (const n of CFG_INTS.concat(["scroll_lines"])) {
  Object.defineProperty(Config.prototype, camel(n), {
    get() { return L.get(this._p(), G, n); },
    set(v) { L.set(this._p(), G, n, v); },
  });
}
for (const n of CFG_BOOLS) {
  Object.defineProperty(Config.prototype, camel(n), {
    get() { return !!L.get(this._p(), G, n); },
    set(v) { L.set(this._p(), G, n, v ? 1 : 0); },
  });
}

class Flag {
  constructor(value = false) {
    this._v = new Int32Array([value ? 1 : 0]);
  }

  get value() { return !!this._v[0]; }
  set value(v) { this._v[0] = v ? 1 : 0; }

  toggle() {
    this.value = !this.value;
    return this.value;
  }
}

function lastFn(args) {
  return args.length && typeof args[args.length - 1] === "function" ? args.pop() : null;
}

function cbuf(text, cap) {
  const b = new Uint8Array(cap);
  b.set(L.cut(text == null ? "" : String(text), cap));
  return b;
}

function cread(b) {
  const end = b.indexOf(0);
  return Buffer.from(b.buffer, b.byteOffset, end < 0 ? b.length : end).toString("utf8");
}

const ITEM = L.goome_ui_item;
const ITEM_BOOLS = ["hovered", "pressed", "held", "released", "clicked", "double_clicked", "right_clicked", "focused"];

class Ui {
  constructor(g) {
    this._g = g;
    this._u = fn.ui_new(g._h());
    if (!this._u) throw new GoomeError(C.ENOMEM, "no memory for the ui");
    g._uis.add(this);
    this.changed = false;
    this.entered = false;
    this.theme = new Theme(this);
    this.config = new Config(this);
    this._canvas = null;
    this._layers = [];
    this._edits = new Map();
    this._used = new Set();
    this._ids = [];
    this._frames = 0;
    this._autoGrab = C.WANT_MOUSE | C.WANT_KEYBOARD;
    this._i = new Int32Array(4);
    this._d = new Float64Array(4);
    this._c = new Uint32Array(1);
    this._item = L.alloc(ITEM);
    this._wins = new WeakMap();
    this._anon = {};
    this._open = [];
    this._flags = new WeakMap();
    this._splits = [];
  }

  _h() {
    if (!this._u) throw new Gone(C.EGONE, "this ui is closed");
    return this._u;
  }

  get closed() { return !this._u; }

  close() {
    if (!this._u) return;
    this.config._drop();
    const u = this._u;
    this._u = 0;
    this._dropCanvas();
    this.theme._ui = null;
    fn.ui_free(u);
    this._g._uis.delete(this);
    this._edits.clear();
  }

  [dispose]() {
    this.close();
  }

  _dropCanvas() {
    if (this._canvas) this._canvas._ptr = 0;
    this._canvas = null;
    for (const c of this._layers) c._ptr = 0;
    this._layers = [];
  }

  feed(ev) {
    return !!fn.ui_feed(this._h(), ev.toRaw());
  }

  begin(mon = 0) {
    const p = fn.ui_begin(this._h(), mon);
    this._g._began++;
    this._g._gens.frame = this._g._began;
    this._frames++;
    this._used.clear();
    this._ids = [];
    this._dropCanvas();
    if (!p) return null;
    this._canvas = new Canvas(p, this._g);
    return this._canvas;
  }

  end() {
    fn.ui_end(this._h());
    for (const [k, e] of this._edits) if (e.seen < this._frames - 600) this._edits.delete(k);
    this._dropCanvas();
  }

  frame(mon, body) {
    if (typeof mon === "function") body = mon, mon = 0;
    const c = this.begin(mon || 0);
    if (!c) return false;
    try {
      body(this, c);
    } finally {
      if (this._u) this.end();
    }
    return true;
  }

  hit(x, y, w, h) { fn.ui_hit(this._h(), x, y, w, h); }
  get animating() { return !!fn.ui_animating(this._h()); }
  get wants() { return fn.ui_wants(this._h()); }
  get wantsMouse() { return !!(this.wants & C.WANT_MOUSE); }
  get wantsKeyboard() { return !!(this.wants & C.WANT_KEYBOARD); }
  get autoGrab() { return this._autoGrab; }
  set autoGrab(w) { fn.ui_auto_grab(this._h(), w | 0); this._autoGrab = w | 0; }
  scale(s) { fn.ui_scale(this._h(), +s); }

  _scoped(shown, end, always, body) {
    if (!body) return shown;
    try {
      if (shown) body(this);
    } finally {
      if ((always || shown) && this._u) end.call(this);
    }
    return shown;
  }

  _winSlot(state) {
    let w = this._wins.get(state);
    if (!w) {
      w = { d: new Float64Array(4), o: new Int32Array(1), last: null };
      this._wins.set(state, w);
    }
    const cur = [state.x == null ? 40 : state.x, state.y == null ? 40 : state.y, state.w == null ? 300 : state.w, state.h == null ? 0 : state.h, state.open === false ? 0 : 1];
    if (!w.last || cur.some((v, i) => v !== w.last[i])) {
      w.d.set(cur.slice(0, 4));
      w.o[0] = cur[4];
    }
    return w;
  }

  _winBack(state, w) {
    state.x = w.d[0];
    state.y = w.d[1];
    state.w = w.d[2];
    state.h = w.d[3];
    state.open = !!w.o[0];
    w.last = [w.d[0], w.d[1], w.d[2], w.d[3], w.o[0]];
  }

  window(title, state, ...rest) {
    const body = lastFn(rest);
    const flags = rest.length && rest[0] != null ? rest[0] : C.WIN_MOVE | C.WIN_COLLAPSE;
    if (state == null) state = this._anon[title] = this._anon[title] || {};
    const w = this._winSlot(state);
    const d = w.d;
    const shown = !!fn.ui_window(this._h(), String(title), d, d.subarray(1), d.subarray(2), d.subarray(3), flags, w.o);
    this._winBack(state, w);
    this._open.push([state, w]);
    this._ids.push("w:" + title);
    return this._scoped(shown, this.windowEnd, true, body);
  }

  windowEnd() {
    fn.ui_window_end(this._h());
    const top = this._open.pop();
    if (top) this._winBack(top[0], top[1]);
    this._ids.pop();
  }

  row(cols) { fn.ui_row(this._h(), cols | 0); }
  sameLine() { fn.ui_same_line(this._h()); }
  space(px) { fn.ui_space(this._h(), px); }
  separator() { fn.ui_separator(this._h()); }
  width(w) { fn.ui_width(this._h(), w); }
  pos(x, y) { fn.ui_pos(this._h(), x, y); }
  size(w = 0, h = 0) { fn.ui_size(this._h(), w, h); }

  label(text) { fn.ui_label(this._h(), String(text)); }
  heading(text) { fn.ui_heading(this._h(), String(text)); }
  wrapped(text) { fn.ui_wrapped(this._h(), String(text)); }

  button(label) { return (this.changed = !!fn.ui_button(this._h(), String(label))); }
  imageButton(id, bmp, w, h) { return (this.changed = !!fn.ui_image_button(this._h(), String(id), bmp._ref(), w, h)); }
  image(bmp, w, h, r = 0) { fn.ui_image(this._h(), bmp._ref(), w, h, r); }

  _flag(f, label, value) {
    this._i[0] = value ? 1 : 0;
    this.changed = !!f(this._h(), String(label), this._i);
    return !!this._i[0];
  }

  checkbox(label, value) { return this._flag(fn.ui_checkbox, label, value); }
  toggle(label, value) { return this._flag(fn.ui_toggle, label, value); }

  radio(label, value, option) {
    this._i[0] = value | 0;
    this.changed = !!fn.ui_radio(this._h(), String(label), this._i, option | 0);
    return this._i[0];
  }

  slider(label, value, lo = 0, hi = 1, fmt = null) {
    this._d[0] = value;
    this.changed = !!fn.ui_slider(this._h(), String(label), this._d, lo, hi, fmt);
    return this._d[0];
  }

  sliderInt(label, value, lo = 0, hi = 100) {
    this._i[0] = value | 0;
    this.changed = !!fn.ui_slider_int(this._h(), String(label), this._i, lo | 0, hi | 0);
    return this._i[0];
  }

  input(label, text, cap = 256) {
    const b = cbuf(text, cap);
    this.changed = !!fn.ui_input(this._h(), String(label), b, cap);
    this.entered = false;
    return cread(b);
  }

  inputEx(label, text, flags = 0, hint = null, cap = 256) {
    const b = cbuf(text, cap);
    const r = fn.ui_input_ex(this._h(), String(label), b, cap, flags, hint == null ? null : String(hint));
    this.changed = r !== 0;
    this.entered = r === 2;
    return cread(b);
  }

  password(label, text, hint = null, flags = 0, cap = 256) {
    return this.inputEx(label, text, C.INPUT_PASSWORD | flags, hint, cap);
  }

  combo(label, sel, items) {
    this._i[0] = sel | 0;
    const list = items.map(String);
    this.changed = !!fn.ui_combo(this._h(), String(label), this._i, list, list.length);
    return this._i[0];
  }

  selectable(label, selected = false) {
    return (this.changed = !!fn.ui_selectable(this._h(), String(label), selected ? 1 : 0));
  }

  tabs(id, names, sel) {
    this._i[0] = sel | 0;
    const list = names.map(String);
    this.changed = !!fn.ui_tabs(this._h(), String(id), list, list.length, this._i);
    return this._i[0];
  }

  collapsing(label, open) {
    if (open == null) {
      this.changed = false;
      return !!fn.ui_collapsing(this._h(), String(label), null);
    }
    if (typeof open === "object") {
      this._i[0] = open.value ? 1 : 0;
      const r = !!fn.ui_collapsing(this._h(), String(label), this._i);
      this.changed = !!this._i[0] !== !!open.value;
      open.value = !!this._i[0];
      return r;
    }
    this._i[0] = open ? 1 : 0;
    const r = !!fn.ui_collapsing(this._h(), String(label), this._i);
    this.changed = !!this._i[0] !== !!open;
    return r;
  }

  progress(frac, text = null) { fn.ui_progress(this._h(), frac, text == null ? null : String(text)); }

  color(label, argb) {
    this._c[0] = u32(argb);
    this.changed = !!fn.ui_color(this._h(), String(label), this._c);
    return this._c[0];
  }

  tooltip(text) { fn.ui_tooltip(this._h(), String(text)); }
  get hovered() { return !!fn.ui_hovered(this._h()); }
  get focused() { return !!fn.ui_focused(this._h()); }
  setFocus() { fn.ui_set_focus(this._h()); }

  scroll(id, h = 0, body) {
    if (typeof h === "function") body = h, h = 0;
    const shown = !!fn.ui_scroll_begin(this._h(), String(id), h);
    this._ids.push("s:" + id);
    return this._scoped(shown, this.scrollEnd, true, body);
  }

  scrollBegin(id, h = 0) { return this.scroll(id, h); }

  scrollEnd() {
    fn.ui_scroll_end(this._h());
    this._ids.pop();
  }

  pushId(id) {
    fn.ui_push_id(this._h(), String(id));
    this._ids.push("i:" + id);
  }

  popId() {
    fn.ui_pop_id(this._h());
    this._ids.pop();
  }

  id(id, body) {
    this.pushId(id);
    try {
      return body(this);
    } finally {
      if (this._u) this.popId();
    }
  }

  _ref(flag) {
    if (flag == null) return null;
    if (flag instanceof Flag) return flag._v;
    let v = this._flags.get(flag);
    if (!v) this._flags.set(flag, (v = { a: new Int32Array(1), last: null }));
    if (v.last !== !!flag.value) v.a[0] = flag.value ? 1 : 0;
    return v.a;
  }

  _back(flag) {
    if (flag == null || flag instanceof Flag) return;
    const v = this._flags.get(flag);
    flag.value = v.last = !!v.a[0];
  }

  app(title = null, flags = 0, body) {
    if (typeof title === "function") body = title, title = null, flags = 0;
    if (typeof flags === "function") body = flags, flags = 0;
    return this._scoped(!!fn.ui_app(this._h(), title == null ? null : String(title), flags), this.appEnd, true, body);
  }

  appEnd() { fn.ui_app_end(this._h()); }
  menubar(body) { return this._scoped(!!fn.ui_menubar_begin(this._h()), this.menubarEnd, false, body); }
  menubarEnd() { fn.ui_menubar_end(this._h()); }
  menu(label, body) { return this._scoped(!!fn.ui_menu_begin(this._h(), String(label)), this.menuEnd, false, body); }
  menuEnd() { fn.ui_menu_end(this._h()); }

  menuItem(label, shortcut = null, checked = null) {
    const r = !!fn.ui_menu_item(this._h(), String(label), shortcut == null ? null : String(shortcut), this._ref(checked));
    this._back(checked);
    return (this.changed = r);
  }

  menuSeparator() { fn.ui_menu_separator(this._h()); }
  context(id, body) { return this._scoped(!!fn.ui_context_begin(this._h(), String(id)), this.contextEnd, false, body); }
  contextEnd() { fn.ui_context_end(this._h()); }
  popupOpen(id) { fn.ui_popup_open(this._h(), String(id)); }
  popup(id, body) { return this._scoped(!!fn.ui_popup_begin(this._h(), String(id)), this.popupEnd, false, body); }
  popupEnd() { fn.ui_popup_end(this._h()); }
  popupClose() { fn.ui_popup_close(this._h()); }

  modal(title, open = null, body) {
    if (typeof open === "function") body = open, open = null;
    const shown = !!fn.ui_modal_begin(this._h(), String(title), this._ref(open));
    this._back(open);
    return this._scoped(shown, this.modalEnd, false, body);
  }

  modalEnd() { fn.ui_modal_end(this._h()); }
  toast(text, ms = 2500) { fn.ui_toast(this._h(), String(text), ms | 0); }
  statusbar(text) { fn.ui_statusbar(this._h(), String(text)); }

  textEdit(id, text, h = 0, flags = 0, cap = null) {
    const raw = Buffer.from(text == null ? "" : String(text), "utf8");
    let key = this._ids.join("/") + "|" + id;
    let n = 0;
    while (this._used.has(key + "#" + n)) n++;
    key += "#" + n;
    this._used.add(key);
    let e = this._edits.get(key);
    const size = cap != null ? cap | 0 : Math.max(65536, raw.length * 4);
    if (!e || (cap != null ? e.buf.length !== size : raw.length * 4 > e.buf.length * 3)) {
      e = { buf: new Uint8Array(size), seen: 0 };
      this._edits.set(key, e);
    }
    e.seen = this._frames;
    const want = L.cut(raw.toString("utf8"), e.buf.length);
    if (cread(e.buf) !== want.toString("utf8")) {
      e.buf.fill(0);
      e.buf.set(want);
    }
    this.changed = !!fn.ui_text_edit(this._h(), String(id), e.buf, e.buf.length, h, flags);
    return cread(e.buf);
  }

  table(id, cols, h = 0, flags = 0, body) {
    if (typeof h === "function") body = h, h = 0;
    if (typeof flags === "function") body = flags, flags = 0;
    return this._scoped(!!fn.ui_table_begin(this._h(), String(id), cols | 0, h, flags), this.tableEnd, true, body);
  }

  tableColumn(name, width = 0) { fn.ui_table_column(this._h(), String(name), width); }

  tableSort(col = 0, desc = false) {
    this._i[0] = col | 0;
    this._i[1] = desc ? 1 : 0;
    const changed = !!fn.ui_table_sort(this._h(), this._i, this._i.subarray(1));
    return { changed, col: this._i[0], desc: !!this._i[1] };
  }

  tableRow() { fn.ui_table_row(this._h()); }
  tableNext() { fn.ui_table_next(this._h()); }
  tableEnd() { fn.ui_table_end(this._h()); }

  tree(label, open = null, body) {
    if (typeof open === "function") body = open, open = null;
    const shown = !!fn.ui_tree(this._h(), String(label), this._ref(open));
    this._back(open);
    return this._scoped(shown, this.treeEnd, false, body);
  }

  treeEnd() { fn.ui_tree_end(this._h()); }

  listClip(count, rowH = 0) {
    const v = this._i;
    fn.ui_list_clip(this._h(), count | 0, rowH, v, v.subarray(1));
    return { first: v[0], last: v[1] };
  }

  dragFloat(label, value, speed = 1, lo = 0, hi = 0, fmt = null) {
    this._d[0] = value;
    this.changed = !!fn.ui_drag_float(this._h(), String(label), this._d, speed, lo, hi, fmt);
    return this._d[0];
  }

  dragInt(label, value, speed = 1, lo = 0, hi = 0) {
    this._i[0] = value | 0;
    this.changed = !!fn.ui_drag_int(this._h(), String(label), this._i, speed, lo | 0, hi | 0);
    return this._i[0];
  }

  number(label, value, step = 1, fmt = null) {
    this._d[0] = value;
    this.changed = !!fn.ui_number(this._h(), String(label), this._d, step, fmt);
    return this._d[0];
  }

  _plot(f, label, values, lo, hi, h) {
    const v = values instanceof Float32Array ? values : Float32Array.from(values);
    if (lo == null || hi == null) {
      let mn = Infinity, mx = -Infinity;
      for (const x of v) mn = Math.min(mn, x), mx = Math.max(mx, x);
      if (lo == null) lo = v.length ? mn : 0;
      if (hi == null) hi = v.length ? mx : 1;
    }
    f(this._h(), String(label), v.length ? v : new Float32Array(1), v.length, lo, hi, h);
  }

  plotLines(label, values, lo = null, hi = null, h = 60) { this._plot(fn.ui_plot_lines, label, values, lo, hi, h); }
  plotBars(label, values, lo = null, hi = null, h = 60) { this._plot(fn.ui_plot_bars, label, values, lo, hi, h); }

  split(id, pane, body) {
    if (typeof pane === "function") body = pane, pane = null;
    if (pane == null) {
      this._panes = this._panes || {};
      pane = this._panes[id] = this._panes[id] || new Split();
    }
    let f;
    if (pane instanceof Split) f = pane._f;
    else {
      let v = this._flags.get(pane);
      if (!v) this._flags.set(pane, (v = { a: new Float64Array([0.5]), last: null }));
      const want = pane.frac == null ? 0.5 : pane.frac;
      if (v.last !== want) v.a[0] = want;
      f = v.a;
      this._splits.push(pane);
    }
    const shown = !!fn.ui_split_begin(this._h(), String(id), pane.vertical ? 1 : 0, f);
    if (!(pane instanceof Split)) pane.frac = this._flags.get(pane).last = f[0];
    else this._splits.push(null);
    return this._scoped(shown, this.splitEnd, true, body);
  }

  splitNext() { fn.ui_split_next(this._h()); }
  splitEnd() {
    fn.ui_split_end(this._h());
    const pane = this._splits.pop();
    if (pane) pane.frac = this._flags.get(pane).last = this._flags.get(pane).a[0];
  }

  dragSource(type, data) {
    const raw = typeof data === "string" ? Buffer.from(data, "utf8") : new Uint8Array(data);
    return !!fn.ui_drag_source(this._h(), String(type), raw.length ? raw : new Uint8Array(1), raw.length);
  }

  dropTarget(type, cap = 4096) {
    const buf = new Uint8Array(cap);
    const n = fn.ui_drop_target(this._h(), String(type), buf, cap);
    return n > 0 ? buf.slice(0, Math.min(n, cap)) : null;
  }

  spinner(size = 16) { fn.ui_spinner(this._h(), size); }
  link(text) { return (this.changed = !!fn.ui_link(this._h(), String(text))); }
  badge(text, argb = null) { fn.ui_badge(this._h(), String(text), u32(argb == null ? this.theme.accent : argb)); }

  _styleId(what, colors) {
    let w = what;
    if (typeof w === "string") {
      w = STYLE_NAMES.indexOf(snake(w).toLowerCase());
      if (w < 0) throw new RangeError(`theres no style called "${what}"`);
    }
    const name = STYLE_NAMES[w];
    if (name == null || STYLE_COLORS.has(name) !== colors) throw new RangeError(`style ${what} isnt a ${colors ? "color" : "number"}`);
    return w;
  }

  pushColor(what, argb) { fn.ui_push_color(this._h(), this._styleId(what, true), u32(argb)); }

  pushNum(what, v) {
    const w = this._styleId(what, false);
    fn.ui_push_num(this._h(), w, styleValue(STYLE_NAMES[w], v));
  }

  pushRadii(r) { fn.ui_push_radii(this._h(), radiiIn(r)); }
  pushFont(font) { fn.ui_push_font(this._h(), font == null ? null : font._h()); }

  pushSkin(kind, skin) {
    const k = named(typeof kind === "string" ? snake(kind).replace(/^skin_/, "") : kind, SKIN_NAMES, "skin kind");
    if (!(k >= 0 && k < C.SKIN_COUNT)) throw new RangeError("skin kind has to be one of the SKIN_* ones");
    if (skin == null) return fn.ui_push_skin(this._h(), k, null);
    const e = skinEdges(skin);
    const dv = L.alloc(L.goome_skin);
    L.write(dv, L.goome_skin, "bm", e.bitmap._ref());
    L.write(dv, L.goome_skin, "l", e.l);
    L.write(dv, L.goome_skin, "t", e.t);
    L.write(dv, L.goome_skin, "r", e.r);
    L.write(dv, L.goome_skin, "b", e.b);
    fn.ui_push_skin(this._h(), k, dv);
  }

  pushIcon(icon, bmp) { fn.ui_push_icon(this._h(), iconId(icon), bmp == null ? null : bmp._ref()); }

  pushTheme(theme) {
    if (!(theme instanceof Theme)) throw new TypeError("pushTheme needs a Theme, like ui.theme.copy()");
    fn.ui_push_theme(this._h(), theme._p());
  }

  pop(n = 1) { fn.ui_pop(this._h(), n | 0); }

  style(values, body) {
    let n = 0;
    try {
      for (const [k, v] of Object.entries(values || {})) {
        const s = snake(k);
        if (k === "theme") this.pushTheme(v);
        else if (STYLE_COLORS.has(s)) this.pushColor(s, v);
        else if (STYLE_NAMES.includes(s)) this.pushNum(s, v);
        else if (k === "radii") this.pushRadii(v);
        else if (k === "font") this.pushFont(v);
        else if (k === "skin") this.pushSkin(v[0], v.slice(1).length === 1 ? v[1] : v.slice(1));
        else if (k === "icons") {
          for (const [i, b] of Object.entries(v)) {
            this.pushIcon(isNaN(+i) ? i : +i, b);
            n++;
          }
          continue;
        } else throw new RangeError(`style() has no ${k}`);
        n++;
      }
    } catch (e) {
      this.pop(n);
      throw e;
    }
    if (!body) return n;
    try {
      return body(this);
    } finally {
      if (this._u) this.pop(n);
    }
  }

  custom(id, w = 0, h = 0, flags = 0) {
    const dv = this._item;
    const r = fn.ui_custom(this._h(), String(id), w, h, flags, dv);
    const it = { changed: !!r };
    for (const k of ITEM.order) {
      const v = L.read(dv, ITEM, k);
      it[camel(k)] = ITEM_BOOLS.includes(k) ? !!v : v;
    }
    this.changed = it.changed;
    return it;
  }

  get canvas() {
    const p = fn.ui_canvas(this._h());
    if (!p) return null;
    const c = new Canvas(p, this._g);
    this._layers.push(c);
    return c;
  }

  store(id, n) {
    n |= 0;
    if (n <= 0) throw new RangeError(`store needs at least 1 slot, got ${n}`);
    const p = fn.ui_store(this._h(), String(id), n);
    if (!p) throw new GoomeError(C.ENOMEM, `no memory for the store "${id}"`);
    const ab = native.view(p, n * 8);
    return ab ? new Float64Array(ab) : new Float64Array(native.copy(p, n * 8));
  }

  anim(id, target, ms = 200, ease = C.EASE_OUT) {
    return fn.ui_anim(this._h(), String(id), +target, +ms, core.easeId(ease));
  }

  animColor(id, target, ms = 200, ease = C.EASE_LINEAR) {
    return fn.ui_anim_color(this._h(), String(id), u32(target), +ms, core.easeId(ease));
  }

  a11y(on = true) { fn.ui_a11y(this._h(), on ? 1 : 0); }
  a11yRole(role, label = "") { fn.ui_a11y_role(this._h(), named(role, ROLE_NAMES, "role"), String(label)); }
  a11yValue(value) { fn.ui_a11y_value(this._h(), String(value)); }

  a11yTree() {
    const u = this._h();
    const n = fn.a11y_tree(u, null, 0);
    if (n <= 0) return [];
    const dv = new DataView(new ArrayBuffer(AX.size * n));
    const got = Math.min(fn.a11y_tree(u, dv, n), n);
    const out = [];
    for (let i = 0; i < got; i++) {
      const one = new DataView(dv.buffer, i * AX.size, AX.size);
      const node = {};
      for (const k of AX.order) node[k] = L.read(one, AX, k);
      if (node.parent < 0) node.parent = null;
      node.roleName = ROLE_NAMES[node.role] || String(node.role);
      node.focused = !!(node.states & C.A11Y_FOCUSED);
      node.checked = !!(node.states & C.A11Y_CHECKED);
      node.disabled = !!(node.states & C.A11Y_DISABLED);
      node.expanded = !!(node.states & C.A11Y_EXPANDED);
      node.selected = !!(node.states & C.A11Y_SELECTED);
      out.push(node);
    }
    return out;
  }

  bind(act, combos) {
    const list = Array.isArray(combos) ? combos.join(",") : combos == null ? "" : String(combos);
    const rc = fn.ui_bind(this._h(), named(act, ACT_NAMES, "action"), list);
    if (rc < 0) throw core.errorFor(rc, `cant bind "${list}"`);
    return this;
  }
}

class Split {
  constructor(frac = 0.5, vertical = false) {
    this._f = new Float64Array([frac]);
    this.vertical = !!vertical;
  }

  get frac() { return this._f[0]; }
  set frac(v) { this._f[0] = v; }
}

class App {
  constructor(opts = {}) {
    if (typeof opts === "string") opts = { title: opts };
    const { title = "goome", width = 960, height = 640, flags = 0, fps = 60, idleMs = 500, light = false, ...rest } = opts;
    Object.assign(this, { title, width, height, flags, fps, idleMs, light });
    this.opts = rest;
    this.animate = false;
    this.running = false;
    this.frames = 0;
    this.g = null;
    this.ui = null;
    this._draw = null;
    this._handlers = [];
    this._close = null;
    this._start = null;
    this._dirty = 0;
  }

  frame(f) { this._draw = f; return this; }
  onEvent(f) { this._handlers.push(f); return this; }
  onClose(f) { this._close = f; return this; }
  onStart(f) { this._start = f; return this; }
  redraw() { this._dirty = Math.max(this._dirty, 1); }
  quit() { this.running = false; }

  _handle(ev) {
    for (const h of this._handlers) if (h(ev)) return;
    this.ui.feed(ev);
    if (ev.type === C.QUIT) this.running = false;
    else if (ev.type === C.CLOSE && (!this._close || this._close() !== false)) this.running = false;
  }

  _paint() {
    const ui = this.ui;
    if (!ui.begin(0)) return;
    try {
      ui.app(this.title, this.flags, () => {
        if (this._draw) this._draw(ui);
      });
    } finally {
      ui.end();
    }
    this.frames++;
  }

  start() {
    const g = core.openApp(this.title, this.width, this.height, this.opts);
    this.g = g;
    this.ui = g.ui();
    if (this.light) this.ui.theme.light();
    this._every = g.backendName.split(" ")[0] === "test";
    this._pace = new core.Pacer(this.fps);
    this._dirty = 2;
    this.running = true;
    if (this._start) this._start(this);
    return this;
  }

  step(wait = true) {
    const ui = this.ui;
    const busy = this._every || this.animate || this._dirty > 0 || ui.animating;
    if (this._dirty > 0) this._dirty--;
    const timeout = wait ? (busy ? this._pace.wait() : this.idleMs) : 0;
    for (const ev of this.g.events(timeout)) {
      this._handle(ev);
      this._dirty = Math.max(this._dirty, 1);
      if (!this.running) return false;
    }
    if (this.running && (busy || this._dirty > 0)) this._paint();
    return this.running;
  }

  stop() {
    this.running = false;
    const { g, ui } = this;
    this.g = this.ui = null;
    if (ui) ui.close();
    if (g) g.close();
  }

  run(draw) {
    if (draw) this._draw = draw;
    this.start();
    try {
      while (this.step());
    } finally {
      this.stop();
    }
  }
}

module.exports = { Ui, Theme, Config, Flag, Split, App, STYLE_NAMES, ALIGN_NAMES, EASE_NAMES, ROLE_NAMES, PRESET_NAMES, ICON_NAMES, SKIN_NAMES, ACT_NAMES, CUR_NAMES };
