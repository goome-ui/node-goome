"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { data, fnv, hex, zeroCols, tmpdir } = require("./util");
const goome = require("..");

const STAR = [80, 5, 98, 85, 40, 35, 120, 35, 62, 85];

const SHAPES = [
  [0xA7B3B4C5, 0x0FB29A82, 0x1A98CF16, 0x1E7B729F, 0x21FD3B05, 0x241CE7FD, 0x6910B0D5, 0x7180B28E, 0x6F33AC30, 0xB48ADFA3, 0x796B9105, 0x2D93DC92, 0x1F908FAD, 0x23A6CF0C],
  [0x73429A18, 0xD9BD97AB, 0xD031F56C, 0xD2D9FA9A, 0xD639A1A7, 0xA77C3E9E, 0x7BD3FEAD, 0xAC76561E, 0x5BD0648D, 0xD0AC70E1, 0x0BB5DDA0, 0xE7C304C7, 0xCCEF8860, 0xEFC1F212],
  [0x9175788F, 0x6E99EA87, 0x935CC8E1, 0x0B73F68D, 0x23891BE5, 0xA28476C1, 0xEA64F655, 0x87DC9430, 0x909D11B5, 0x0550BB7A, 0x6455EE86, 0xD8C08E2B, 0xFD0DD1FD, 0x28C27977],
];

const IMAGES = [
  ["png-gray-1-bit.png", 9, 3, 0x01975AD8],
  ["png-palette-4-bit-trns-interlaced.png", 6, 6, 0xAF77E7E2],
  ["png-rgb-16-bit.png", 5, 4, 0xDD60C23E],
  ["png-gray-alpha-stored-interlaced.png", 5, 5, 0x52D68985],
  ["png-rgba-fixed-huffman-split.png", 8, 6, 0x66DB9DCD],
  ["png-gray-key.png", 7, 4, 0x843ED605],
  ["png-rgba-16-bit-interlaced.png", 9, 9, 0xDC2F91D5],
  ["jpeg-420.jpg", 16, 16, 0x32E2C9CE],
  ["jpeg-422-restarts.jpg", 13, 9, 0x0E230BAF],
  ["jpeg-444.jpg", 10, 10, 0x34FC5275],
  ["jpeg-progressive-420-restarts.jpg", 14, 11, 0x5BCEE932],
  ["jpeg-gray.jpg", 9, 7, 0xF010B3C8],
  ["jpeg-exif-rotated.jpg", 6, 10, 0x65909E25],
  ["bmp-4-bit.bmp", 5, 3, 0x9256D097],
  ["bmp-32-bit-alpha-top-down.bmp", 3, 2, 0x6BDB3A29],
  ["bmp-24-bit.bmp", 5, 3, 0x09D94C56],
  ["ppm.ppm", 3, 2, 0xC6FDF725],
  ["pgm-16-bit.pgm", 3, 1, 0x35029201],
  ["qoi.qoi", 6, 4, 0x23AF45AD],
];

function shape(c, k, b) {
  switch (k) {
    case 0: return c.rrect(10.3, 8.6, 120, 70.2, [4, 20, 0, 33], 0xE02060C0);
    case 1: return c.rrectLine(10.3, 8.6, 120, 70.2, goome.radius(18), 2.5, 0xFF20A060);
    case 2: return c.rrectGrad(10, 10, 130, 70, 12, 0xFF102040, 0x8080C0FF);
    case 3: return c.rrectGrad(10, 10, 130, 70, 35, 0xFFFF4080, 0x004080FF, true);
    case 4: return c.shadow(30, 20, 90, 50, 10, 16, 0x80000000);
    case 5: return c.circle(50.5, 50.2, 30.7, 0xFFFFC020).circle(120, 30, 1.3, 0xFF000000);
    case 6: return c.ring(80, 50, 30, 5, 0xC0208080);
    case 7: return c.arc(50, 50, 30, 6, 0.3, 4.5, 0xFF3060E0).arc(120, 50, 20, 30, 2, 2.5, 0xFF905020);
    case 8: return c.poly(STAR, 0xFF2040A0);
    case 9: return c.bitmap(b, 10, 10, 100.5, 75.3, 20);
    case 10: return c.bitmap(b, 10, 10, 24, 16, 0, 0x80FF8080);
    case 11: return c.bitmap(b, 10, 10, 9, 5, 2);
    case 12: return c.bitmapPart(b, 4, 2, 8, 8, 100, 10, 40, 40);
  }
  c.clip(20, 15, 80, 50, () => {
    c.rrect(0, 0, 160, 100, 30, 0xFF4080FF);
    c.clip(50, 0, 100, 40, () => {
      c.circle(70, 40, 30, 0xFFFF4040);
      c.text(30, 30, "clip", 0xFF000000, true);
      c.shadow(40, 20, 60, 30, 8, 10, 0xFF000000);
      c.bitmap(b, 40, 10, 48, 32, 6);
    });
    c.line(0, 0, 160, 100, 3, 0xFF00A000);
    const pts = [];
    for (let i = 0; i < STAR.length; i += 2) pts.push([STAR[i], STAR[i + 1]]);
    c.poly(pts, 0x80000000);
  });
  c.frame(20, 15, 80, 50, 1, 0x80000000);
}

function makeBitmap() {
  const bp = new Uint32Array(27 * 16);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 24; x++) {
      const a = Math.floor((x * 255) / 23);
      const v = ((x >> 2) + (y >> 2)) & 1 ? 0xffffff : 0x2050c0;
      const ch = (s) => Math.floor((((v >> s) & 255) * a) / 255);
      bp[y * 27 + x] = ((a << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)) >>> 0;
    }
  }
  return goome.Bitmap.wrap(bp, 24, 16, 27);
}

test("basic drawing hash", () => {
  const c = goome.Canvas.new(160, 100, { stride: 200, scale: 1.5 });
  c.roundRect(5, 5, 60, 40, 8, 0xc0203040);
  c.line(0, 0, 100, 60, 3, 0xffff0000);
  c.triangle(10, 50, 60, 50, 35, 10, 0x8000ff00);
  c.text(8, 8, "goome!", 0xffffffff, true);
  c.frame(70, 10, 30, 30, 2, 0xff00ffff);
  const px = c.pixels;
  for (let y = 0; y < 100; y++) assert.strictEqual(px[y * 200 + 170], 0);
  const r = c.raw;
  assert.ok(r.dx1 > r.dx0 && r.dy1 > r.dy0);
  assert.strictEqual(hex(fnv(px, 200, 100)), hex(0xb93b60cf));
  c.clear();
  assert.strictEqual(fnv(px, 200, 100), fnv(new Uint32Array(200 * 100), 200, 100));
  assert.ok(c.textWidth("abc") > 0);
  c.close();
  c.close();
});

test("shapes hash the same as c-goome", () => {
  const b = makeBitmap();
  [1, 1.25, 2].forEach((sc, s) => {
    const got = [];
    for (let k = 0; k < 14; k++) {
      const w = Math.trunc(160 * sc), h = Math.trunc(100 * sc);
      const c = goome.Canvas.new(w, h, { stride: w + 3, scale: sc });
      shape(c, k, b);
      const px = c.pixels;
      got.push(fnv(px, w + 3, h));
      assert.ok(c.raw.dx1 > c.raw.dx0);
      assert.ok(zeroCols(px, w + 3, h, w, w + 3));
      for (const p of px) {
        const a = p >>> 24;
        if (((p >>> 16) & 255) > a || ((p >>> 8) & 255) > a || (p & 255) > a) assert.fail("not premultiplied");
      }
      c.close();
    }
    assert.deepStrictEqual(got.map(hex), SHAPES[s].map(hex), "scale " + sc);
  });
  b.close();
});

test("clip keeps drawing inside", () => {
  const b = makeBitmap();
  const sc = 1.25, w = 200, h = 125;
  const c = goome.Canvas.new(w, h, { stride: w + 3, scale: sc });
  const x0 = Math.trunc(20 * sc + 0.5), y0 = Math.trunc(15 * sc + 0.5), x1 = Math.trunc(100 * sc + 0.5), y1 = Math.trunc(65 * sc + 0.5);
  c.clipPush(20, 15, 80, 50);
  shape(c, 8, b);
  shape(c, 4, b);
  shape(c, 9, b);
  c.text(0, 20, "outside", 0xffffffff, true);
  const r = c.raw;
  assert.ok(r.dx0 >= x0 && r.dy0 >= y0 && r.dx1 <= x1 && r.dy1 <= y1 && r.dx1 > r.dx0);
  const px = c.pixels;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if ((x < x0 || x >= x1 || y < y0 || y >= y1) && px[y * (w + 3) + x]) assert.fail("drew outside the clip");
  c.clipPop();
  assert.strictEqual(c.raw.nclip, 0);
  c.close();
  b.close();
});

test("image and blit", () => {
  const src = goome.Canvas.new(20, 20);
  src.image(0, 0, 20, 20, new Uint32Array(16).fill(0xff00ff00), 4, 4);
  assert.strictEqual(src.pixels[0], 0xff00ff00);
  const dst = goome.Canvas.new(40, 40);
  dst.blit(src, 1, 10, 10);
  assert.strictEqual(dst.pixels[10 * 40 + 10], 0xff00ff00);
  assert.strictEqual(dst.pixels[0], 0);
  dst.erase(0, 0, 40, 40);
  assert.strictEqual(dst.pixels[10 * 40 + 10], 0);
  dst.image(0, 0, 2, 1, new Uint32Array(new Uint8Array([0, 0, 255, 255, 255, 0, 0, 255]).buffer), 2, 1);
  assert.strictEqual(dst.row(0)[0], 0xffff0000);
  assert.strictEqual(dst.row(0)[1], 0xff0000ff);
  src.close();
  dst.close();
});

function setClip(c, x0, y0, x1, y1, n) {
  const s = goome.layout.goome_canvas;
  const set = (k, v) => goome.layout.set(c.address, s, k, v);
  set("kx0", x0);
  set("ky0", y0);
  set("kx1", x1);
  set("ky1", y1);
  if (n != null) set("nclip", n);
}

test("fonts", () => {
  const ttf = data("dejavu-sub.ttf"), otf = data("dejavu-sub.otf");
  assert.throws(() => goome.Font.fromBytes(Buffer.from("nope, not a font")), goome.GoomeError);
  assert.throws(() => goome.Font.fromBytes(ttf.subarray(0, 40)), goome.GoomeError);
  const f = goome.Font.fromBytes(ttf), o = goome.Font.fromBytes(otf);
  const m = f.measure("goome!", 20);
  assert.ok(m.w > 76.97 && m.w < 76.98 && m.h > 23.2 && m.h < 23.3, JSON.stringify(m));
  for (const font of [f, o]) assert.ok(font.width("AV", 20) < font.width("A", 20) + font.width("V", 20) - 1);
  assert.ok(f.measure("a\nbb\n", 20).h > 3 * 23.2);
  assert.ok(f.lineHeight(20) > 0);
  const want = [0x412c299f, 0xbcd42095];
  [f, o].forEach((font, k) => {
    const c = goome.Canvas.new(200, 120, { stride: 240, scale: 1.5 });
    setClip(c, 0, 0, 200, 120);
    c.fontText(font, 13, 4, 2, "goome! Hié\nAVAWAY Ty.@ ☃");
    c.fontText(font, 30, 2.3, 24, "Hig", 0xc0ff8040);
    setClip(c, 30, 60, 90, 100, 1);
    c.fontText(font, 40, 10, 50, "WoW", 0xff2080ff);
    const px = c.pixels;
    assert.ok(zeroCols(px, 240, 120, 200, 240));
    assert.ok(px.subarray(100 * 240).every((p) => p === 0));
    assert.strictEqual(hex(fnv(px, 240, 120)), hex(want[k]));
    c.close();
  });
  const c = goome.Canvas.new(200, 120, { stride: 240 });
  assert.strictEqual(c.fontText(null, 12, 0, 0, "ab\nabc"), goome.measure("abc", 12));
  c.close();
  f.close();
  f.close();
  o.close();
  assert.throws(() => f.measure("x", 10), goome.Gone);
  assert.ok(goome.fontCount() >= 1);
  goome.setFont(0);
  assert.ok(goome.lineHeight(12) > 0);
  const d = tmpdir();
  const p = path.join(d, "f.ttf");
  fs.writeFileSync(p, ttf);
  const lf = goome.Font.load(p);
  assert.ok(lf.width("goome", 12) > 0);
  lf.close();
  fs.rmSync(d, { recursive: true, force: true });
  assert.throws(() => goome.Font.load(path.join(d, "gone.ttf")), goome.GoomeError);
});

test("bitmaps decode like c-goome", () => {
  for (const [name, w, h, hv] of IMAGES) {
    const raw = data(name);
    const b = goome.Bitmap.fromBytes(raw);
    assert.deepStrictEqual([b.w, b.h, b.owned], [w, h, true], name);
    assert.strictEqual(hex(fnv(b.pixels, b.w, b.h, b.stride)), hex(hv), name);
    b.close();
    assert.ok(b.closed);
    b.close();
    let half = null;
    try {
      half = goome.Bitmap.fromBytes(raw.subarray(0, raw.length >> 1));
    } catch (e) {
      assert.ok(e instanceof goome.GoomeError);
    }
    if (half) half.close();
  }
  assert.throws(() => goome.Bitmap.fromBytes(data("jpeg-arithmetic.jpg")), (e) => e instanceof goome.NotSupported && /arithmetic/.test(e.message));
  assert.throws(() => goome.Bitmap.fromBytes(Buffer.from("GIF89a......")), goome.NotSupported);
  assert.throws(() => goome.Bitmap.load("no/such/file.png"), goome.GoomeError);
  const b = goome.Bitmap.fromArgb([0xffff0000, 0x80ffffff, 0x00123456, 0x40804020], 2, 2);
  assert.deepStrictEqual([...b.pixels], [0xffff0000, 0x80808080, 0, 0x40201008]);
  b.close();
  assert.throws(() => b.pixels, goome.Gone);
  assert.throws(() => goome.Bitmap.fromArgb([1, 2], 2, 2), RangeError);
});
