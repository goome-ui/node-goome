"use strict";
const native = require("./native");
const C = require("./consts");

const P = native.ptrSize;
const L = native.longSize;
const prim = {
  i32: { size: 4, align: 4, kind: 0 },
  u32: { size: 4, align: 4, kind: 1 },
  f64: { size: 8, align: 8, kind: 2 },
  ptr: { size: P, align: P, kind: 3 },
  char: { size: 1, align: 1, kind: 4 },
  long: { size: L, align: L, kind: 5 },
  f32: { size: 4, align: 4, kind: 6 },
};

function struct(name, fields) {
  const s = { name, fields: {}, order: [], size: 0, align: 1 };
  let off = 0;
  for (const [fname, type, count = 1] of fields) {
    const t = typeof type === "string" ? prim[type] : type;
    off = Math.ceil(off / t.align) * t.align;
    s.fields[fname] = { offset: off, size: t.size * count, type, count, kind: t.kind };
    s.order.push(fname);
    off += t.size * count;
    s.align = Math.max(s.align, t.align);
  }
  s.size = Math.ceil(off / s.align) * s.align;
  return s;
}

const each = (type, names) => names.trim().split(/\s+/).map((n) => [n, type]);

const opts = struct("goome_opts", [
  ["title", "ptr"], ["backend", "i32"], ["state_dir", "ptr"], ["no_capture", "i32"], ["capture_fps", "i32"],
  ["hide_self", "i32"], ["test_frames", "ptr"], ["test_script", "ptr"], ["test_shots", "ptr"], ["mode", "i32"],
  ["width", "i32"], ["height", "i32"], ["min_width", "i32"], ["min_height", "i32"], ["window_flags", "i32"],
  ["scale", "f64"],
]);
const rect = struct("goome_rect", each("i32", "x y w h"));
const monitor = struct("goome_monitor", [
  ["id", "i32"], ["name", "char", 64], ["area", rect], ["scale", "f64"], ["pw", "i32"], ["ph", "i32"], ["rotation", "i32"],
]);
const image = struct("goome_image", [
  ["px", "ptr"], ["w", "i32"], ["h", "i32"], ["stride", "i32"], ["area", rect], ["mon", "i32"], ["has_self", "i32"],
  ["has_cursor", "i32"], ["cursor", rect],
]);
const canvas = struct("goome_canvas", [
  ["px", "ptr"], ["w", "i32"], ["h", "i32"], ["stride", "i32"], ["ox", "f64"], ["oy", "f64"], ["scale", "f64"],
  ["mon", "i32"], ...each("i32", "dx0 dy0 dx1 dy1 cx0 cy0 cx1 cy1 kx0 ky0 kx1 ky1 nclip"), ["clips", "i32", 64],
]);
const event = struct("goome_event", [
  ["type", "i32"], ["x", "f64"], ["y", "f64"], ["mon", "i32"], ["button", "i32"], ["dy", "i32"], ["key", "i32"],
  ["mods", "i32"], ["text", "char", 8], ["id", "i32"], ["msg", "char", 64],
]);
const pacer = struct("goome_pacer", [["next", "long"], ["fps", "i32"]]);
const radii = struct("goome_radii", each("f64", "tl tr br bl"));
const bitmap = struct("goome_bitmap", [["px", "ptr"], ...each("i32", "w h stride owned")]);
const skin = struct("goome_skin", [["bm", "ptr"], ...each("f64", "l t r b")]);
const themeColors1 = "bg panel border text text_dim accent accent_text hover active input_bg shadow";
const themeNums1 = "radius pad gap border_width font_size shadow_blur anim_ms";
const themeSkins2 = "skin_checkbox skin_radio skin_toggle skin_slider skin_slider_fill skin_scrollbar skin_tab skin_titlebar skin_tooltip skin_menu skin_popup";
const themeColors2 = "focus select caret link badge toast tooltip danger knob dim";
const themeNums2 =
  "check_size check_radius toggle_w toggle_h slider_h slider_track knob_size " +
  "scroll_w scroll_min item_h menu_item_h tab_h win_title_h app_title_h menubar_h statusbar_h " +
  "focus_w focus_gap sep_w grip indent plot_w spinner caret_w " +
  "win_min_w win_min_h pop_gap menu_gap tip_pad_x tip_pad_y tip_x tip_y tip_radius " +
  "shadow_x shadow_y align heading_size small_size ease " +
  "hover_ms press_ms popup_ms collapse_ms toast_fade_ms";
const theme = struct("goome_theme", [
  ...each("u32", themeColors1), ...each("f64", themeNums1), ["font", "ptr"],
  ["skin_button", skin], ["skin_panel", skin], ["skin_input", skin],
  ["icon", "ptr", C.ICON_COUNT], ["icon_tint", "u32"],
  ...each(skin, themeSkins2), ...each("u32", themeColors2), ...each("f64", themeNums2),
  ["font_heading", "ptr"], ["font_mono", "ptr"], ["font_small", "ptr"],
]);
const item = struct("goome_ui_item", [
  ...each("f64", "x y w h"), ...each("i32", "hovered pressed held released clicked double_clicked right_clicked focused"),
  ...each("f64", "mx my dx dy drag_x drag_y"), ["key", "i32"],
]);
const combo = struct("goome_combo", each("i32", "key mods"));
const config = struct("goome_ui_config", [
  ...each("i32", "tip_delay_ms dbl_click_ms dbl_click_px drag_px repeat_delay_ms repeat_ms blink_ms menu_delay_ms toast_ms"),
  ["scroll_lines", "f64"], ...each("i32", "raise_on_click esc_closes tab_nav focus_on_mouse"),
  ["cursor", "i32", C.CUR_COUNT], ["keys", combo, C.ACT_COUNT * 4], ["ease", "ptr"], ["ease_user", "ptr"], ["mask", "ptr"],
]);

const structs = { goome_opts: opts, goome_rect: rect, goome_monitor: monitor, goome_image: image, goome_canvas: canvas,
  goome_event: event, goome_pacer: pacer, goome_radii: radii, goome_bitmap: bitmap, goome_theme: theme, goome_skin: skin,
  goome_ui_item: item, goome_combo: combo, goome_ui_config: config };

const THEME_COLORS = (themeColors1 + " " + themeColors2).split(" ");
const THEME_NUMS = (themeNums1 + " " + themeNums2).split(" ");
const THEME_SKINS = ["skin_button", "skin_panel", "skin_input", ...themeSkins2.split(" ")];

function get(addr, s, name, i = 0) {
  const f = s.fields[name];
  if (f.kind === 4) return native.peek(addr, f.offset, 4);
  const t = typeof f.type === "string" ? prim[f.type] : f.type;
  return native.peek(addr, f.offset + i * t.size, f.kind);
}

function set(addr, s, name, v, i = 0) {
  const f = s.fields[name];
  if (f.kind === 4) return native.poke(addr, f.offset, 4, String(v), f.count);
  const t = typeof f.type === "string" ? prim[f.type] : f.type;
  native.poke(addr, f.offset + i * t.size, f.kind, v);
}

function read(dv, s, name, i = 0) {
  const f = s.fields[name];
  const t = typeof f.type === "string" ? prim[f.type] : f.type;
  const o = f.offset + i * t.size;
  switch (f.kind) {
    case 0: return dv.getInt32(o, true);
    case 1: return dv.getUint32(o, true);
    case 2: return dv.getFloat64(o, true);
    case 3: return P === 8 ? Number(dv.getBigUint64(o, true)) : dv.getUint32(o, true);
    case 4: {
      const b = new Uint8Array(dv.buffer, dv.byteOffset + f.offset, f.count);
      const end = b.indexOf(0);
      return Buffer.from(b.subarray(0, end < 0 ? f.count : end)).toString("utf8");
    }
    case 5: return L === 8 ? Number(dv.getBigInt64(o, true)) : dv.getInt32(o, true);
    case 6: return dv.getFloat32(o, true);
  }
}

function write(dv, s, name, v, i = 0) {
  const f = s.fields[name];
  const t = typeof f.type === "string" ? prim[f.type] : f.type;
  const o = f.offset + i * t.size;
  switch (f.kind) {
    case 0: dv.setInt32(o, v | 0, true); break;
    case 1: dv.setUint32(o, v >>> 0, true); break;
    case 2: dv.setFloat64(o, +v, true); break;
    case 3: P === 8 ? dv.setBigUint64(o, BigInt(v || 0), true) : dv.setUint32(o, v || 0, true); break;
    case 4: {
      const b = new Uint8Array(dv.buffer, dv.byteOffset + f.offset, f.count);
      b.fill(0);
      b.set(cut(String(v), f.count));
      break;
    }
    case 5: L === 8 ? dv.setBigInt64(o, BigInt(Math.trunc(v)), true) : dv.setInt32(o, v | 0, true); break;
    case 6: dv.setFloat32(o, +v, true); break;
  }
}

function cut(text, cap) {
  let b = Buffer.from(text, "utf8");
  if (b.length <= cap - 1) return b;
  let n = cap - 1;
  while (n > 0 && (b[n] & 0xc0) === 0x80) n--;
  return b.subarray(0, n);
}

function alloc(s) {
  const buf = new ArrayBuffer(s.size);
  return new DataView(buf);
}

module.exports = { structs, struct, get, set, read, write, alloc, cut, THEME_COLORS, THEME_NUMS, THEME_SKINS, ...structs };
