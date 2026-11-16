"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { tmpdir } = require("./util");

const EX = path.join(__dirname, "..", "examples");

function run(name, script, args = []) {
  const env = { ...process.env, GOOME_BACKEND: "test", GOOME_TEST_SCRIPT: script };
  if (!script) delete env.GOOME_BACKEND, delete env.GOOME_TEST_SCRIPT;
  return execFileSync(process.execPath, [path.join(EX, name), ...args], { env, timeout: 60000 }).toString();
}

test("hello", () => {
  const out = run("hello.js", "screen 800x600 1; 2 click 100,100; 4 key hi; end 8");
  assert.match(out, /backend: test/);
  assert.match(out, /click 100,100/);
});

test("ui demo", () => {
  assert.match(run("ui_demo.js", "screen 1280x720 1; 3 click 80,90; 5 click 120,140; end 12"), /frames, .* ms a frame/);
});

test("app", () => {
  run("app.js", "screen 1x1 1; 3 resize 700x500; 4 click 20,10; 6 close; end 12");
});

test("offscreen", () => {
  const d = tmpdir();
  const p = path.join(d, "o.png");
  const out = run("offscreen.js", null, [p]);
  assert.match(out, /check [01] volume [0-9.]+ name '.*' cursor \w+ -> /);
  assert.strictEqual(fs.readFileSync(p).subarray(1, 4).toString(), "PNG");
  fs.rmSync(d, { recursive: true, force: true });
});
