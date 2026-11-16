"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { ROOT, runC, needC } = require("./util");
const goome = require("..");

const { layout, native } = goome;

function head() {
  return fs.readFileSync(path.join(ROOT, "native", "goome.h"), "utf8").split("#if defined(GOOME_IMPLEMENTATION) && !defined(GOOME_IMPLEMENTED)")[0];
}

test("structs match C", (t) => {
  if (!needC(t)) return;
  const out = runC(path.join(__dirname, "layout.c"));
  let seen = 0;
  for (const line of out.split(/\r?\n/)) {
    const p = line.trim().split(/\s+/);
    if (p.length < 2) continue;
    if (p[0].includes(".")) {
      const [st, field] = p[0].split(".");
      const f = layout.structs[st].fields[field];
      assert.ok(f, p[0] + " is missing");
      assert.deepStrictEqual([f.offset, f.size], [+p[1], +p[2]], p[0]);
    } else {
      assert.strictEqual(layout.structs[p[0]].size, +p[1], p[0]);
    }
    seen++;
  }
  const want = Object.values(layout.structs).reduce((n, s) => n + 1 + s.order.length, 0);
  assert.strictEqual(seen, want);
});

test("constants match C", (t) => {
  if (!needC(t)) return;
  const names = [];
  for (const m of head().replace(/\/\/[^\n]*/g, "").matchAll(/enum\s*\{([^}]*)\}/g)) {
    for (const item of m[1].split(",")) {
      const k = /^\s*(GOOME_[A-Z0-9_]+)/.exec(item);
      if (k) names.push(k[1]);
    }
  }
  assert.ok(names.length > 100);
  let src = '#include <stdio.h>\n#include "goome.h"\nint main(void)\n{\n';
  for (const n of names) src += `    printf("%s %d\\n", "${n}", (int)${n});\n`;
  src += "    return 0;\n}\n";
  const out = runC(src);
  for (const line of out.trim().split(/\r?\n/)) {
    const [name, v] = line.trim().split(" ");
    const short = name.slice(6);
    assert.ok(short in goome, `goome.${short} is missing`);
    assert.strictEqual(goome[short], +v, name);
  }
});

test("every function in goome.h is in the addon", () => {
  const names = new Set([...head().replace(/\/\/[^\n]*/g, "").matchAll(/\b(goome_[a-z0-9_]+)\s*\(/g)].map((m) => m[1].slice(6)));
  const missing = [...names].filter((n) => typeof native.fn[n] !== "function");
  assert.deepStrictEqual(missing, []);
  assert.strictEqual(Object.keys(native.fn).length, names.size);
});

test("version", () => {
  assert.match(goome.VERSION, /^\d+\.\d+\.\d+/);
});

test("everything in index.d.ts exists", () => {
  const dts = fs.readFileSync(path.join(ROOT, "index.d.ts"), "utf8");
  const names = [...dts.matchAll(/^export declare (?:class|function|const) (\w+)/gm)].map((m) => m[1]);
  assert.ok(names.length > 30);
  for (const n of names) assert.ok(n in goome, n + " is in index.d.ts but not in the module");
});
