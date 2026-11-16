"use strict";
const path = require("path");

let binding;
if (process.env.GOOME_NODE_ADDON) binding = require(path.resolve(process.env.GOOME_NODE_ADDON));
else binding = require("node-gyp-build")(path.join(__dirname, ".."));
module.exports = binding;
