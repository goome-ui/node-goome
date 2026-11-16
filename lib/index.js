"use strict";
const native = require("./native");
const C = require("./consts");
const core = require("./core");
const ui = require("./ui");
const layout = require("./layout");

module.exports = {
  ...C,
  ...core,
  ...ui,
  layout,
  native,
  VERSION: native.version,
  get zeroCopy() { return core.zeroCopy; },
};
