"use strict";
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const head = fs.readFileSync(path.join(root, "native", "goome.h"), "utf8")
  .split("#if defined(GOOME_IMPLEMENTATION) && !defined(GOOME_IMPLEMENTED)")[0]
  .replace(/\/\/[^\n]*/g, "");

const protos = [];
const re = /^([A-Za-z_][\w *]*?\b)(goome_\w+)\s*\(([^;{]*?)\)\s*;/gm;
let m;
while ((m = re.exec(head))) protos.push({ ret: m[1].trim(), name: m[2], args: m[3] });

function kind(t) {
  if (t === "int") return "i";
  if (t === "uint32_t") return "u";
  if (t === "double") return "d";
  if (t === "size_t") return "z";
  if (t === "long") return "l";
  if (t === "const char *") return "s";
  if (t === "const char *const *") return "S";
  if (t === "goome_radii") return "R";
  if (t === "void") return "v";
  if (t.endsWith("*")) return "p";
  throw new Error("dont know " + t);
}

function argType(a) {
  a = a.trim().replace(/\[.*\]/, "").replace(/\s+/g, " ");
  if (a.endsWith("*")) return a;
  return a.replace(/\s*\b\w+$/, "").trim().replace(/\s*\*$/, " *").replace(/\s+\*/, " *") || a;
}

function fix(t) {
  return t.replace(/\s*\*\s*/g, " *").replace(/\* const \*/, "*const *").trim();
}

let out = "";
const names = [];
for (const p of protos) {
  const raw = p.args.trim();
  const args = raw === "void" || raw === "" ? [] : raw.split(",").map((a) => a.trim());
  const rk = kind(p.ret.replace(/\s+/g, " ").replace(/ \*$/, " *"));
  const n = args.length;
  let body = "";
  const calls = [];
  const frees = [];
  let variadic = false;
  args.forEach((a, i) => {
    if (a === "...") { variadic = true; return; }
    let t = a.replace(/\s+\w+$/, "");
    if (/\*\s*\w+$/.test(a)) t = a.replace(/\w+$/, "");
    t = fix(t.replace(/\s+/g, " "));
    const k = kind(t);
    if (k === "s") {
      body += `    char *a${i} = arg_s(env, a, n, ${i});\n`;
      frees.push(`free(a${i});`);
      calls.push(`a${i}`);
    } else if (k === "S") {
      body += `    char **a${i} = arg_strs(env, a, n, ${i});\n`;
      frees.push(`free(a${i});`);
      calls.push(`(const char *const *)a${i}`);
    } else if (k === "R") calls.push(`arg_radii(env, a, n, ${i})`);
    else if (k === "p") calls.push(`(${t})arg_p(env, a, n, ${i})`);
    else if (k === "i") calls.push(`arg_i(env, a, n, ${i})`);
    else if (k === "u") calls.push(`arg_u(env, a, n, ${i})`);
    else if (k === "z") calls.push(`(size_t)arg_d(env, a, n, ${i})`);
    else calls.push(`arg_d(env, a, n, ${i})`);
  });
  if (variadic) calls.splice(1, 0, '"%s"');
  const call = `${p.name}(${calls.join(", ")})`;
  const cnt = Math.max(n, 1);
  let s = `static napi_value w_${p.name}(napi_env env, napi_callback_info info)\n{\n    napi_value a[${cnt}];\n    size_t n = ${cnt};\n    napi_get_cb_info(env, info, &n, a, NULL, NULL);\n${body}`;
  if (rk === "v") s += `    ${call};\n${frees.map((f) => "    " + f + "\n").join("")}    return ret_undef(env);\n`;
  else {
    const ct = { i: "int", d: "double", l: "long", s: "const char *", p: "void *", R: "goome_radii" }[rk];
    const conv = { i: "ret_i", d: "ret_d", l: "ret_l", s: "ret_s", p: "ret_p", R: "ret_radii" }[rk];
    s += `    ${ct} r = ${rk === "p" ? "(void *)" : ""}${call};\n${frees.map((f) => "    " + f + "\n").join("")}    return ${conv}(env, r);\n`;
  }
  s += "}\n\n";
  out += s;
  names.push(p.name);
}
out += "static const struct api_fn api_fns[] = {\n";
for (const nm of names) out += `    {"${nm.slice(6)}", w_${nm}},\n`;
out += "};\n";
fs.writeFileSync(path.join(root, "src", "api.c"), out);
console.log(names.length + " functions in src/api.c");

const consts = [];
for (const body of head.matchAll(/enum\s*\{([^}]*)\}/g)) {
  let next = 0;
  for (let item of body[1].split(",")) {
    item = item.trim();
    if (!item) continue;
    const mm = /^(GOOME_\w+)\s*(?:=\s*(.+))?$/.exec(item);
    if (!mm) throw new Error("cant read enum item " + item);
    const v = mm[2] === undefined ? next : Number(mm[2].trim());
    if (Number.isNaN(v)) throw new Error("cant read enum value " + item);
    consts.push([mm[1].slice(6), v]);
    next = v + 1;
  }
}
let js = '"use strict";\nmodule.exports = Object.freeze({\n';
for (const [k, v] of consts) js += `  ${k}: ${v},\n`;
js += "});\n";
fs.writeFileSync(path.join(root, "lib", "consts.js"), js);
console.log(consts.length + " constants in lib/consts.js");

let dts = "";
for (const [k] of consts) dts += `export declare const ${k}: number;\n`;
fs.writeFileSync(path.join(root, "lib", "consts.d.ts"), dts);
