"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(__dirname, "data");

function data(name) {
  return fs.readFileSync(path.join(DATA, name));
}

function fnv(px, w, h, stride = w) {
  let v = 2166136261;
  const b = new Uint8Array(px.buffer, px.byteOffset, px.byteLength);
  for (let y = 0; y < h; y++) {
    const o = y * stride * 4;
    for (let i = 0; i < w * 4; i++) v = Math.imul(v ^ b[o + i], 16777619) >>> 0;
  }
  return v >>> 0;
}

const hex = (v) => (v >>> 0).toString(16).padStart(8, "0");

function zeroCols(px, stride, h, x0, x1) {
  for (let y = 0; y < h; y++) for (let x = x0; x < x1; x++) if (px[y * stride + x]) return false;
  return true;
}

function compiler() {
  const tries = [process.env.CC, "cc", "gcc", "clang"].filter(Boolean);
  for (const c of tries) {
    try {
      execFileSync(c, ["--version"], { stdio: "ignore" });
      return c;
    } catch (e) {}
  }
  return null;
}

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "goome-"));
}

function runC(src, extra = []) {
  const cc = compiler();
  if (!cc) return null;
  const d = tmpdir();
  try {
    let file = src;
    if (!fs.existsSync(src)) {
      file = path.join(d, "prog.c");
      fs.writeFileSync(file, src);
    }
    const exe = path.join(d, process.platform === "win32" ? "prog.exe" : "prog");
    execFileSync(cc, ["-std=c99", "-I" + path.join(ROOT, "native"), "-o", exe, file, ...extra], { stdio: ["ignore", "ignore", "inherit"] });
    return execFileSync(exe).toString();
  } finally {
    fs.rmSync(d, { recursive: true, force: true });
  }
}

function needC(t) {
  if (compiler()) return true;
  if (process.env.GOOME_STRICT) throw new Error("no C compiler, set CC");
  t.skip("no C compiler, set CC");
  return false;
}

module.exports = { ROOT, DATA, data, fnv, hex, zeroCols, compiler, runC, needC, tmpdir };
