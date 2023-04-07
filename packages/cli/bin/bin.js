#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const arg_1 = __importDefault(require("arg"));
const args = (0, arg_1.default)({
    '--branch': String,
    '--destination': String,
    '--token': String,
    '--_env': String,
    '--_dry': Boolean,
    '-b': '--branch',
    '-d': '--destination',
});
(0, index_1.pull)({
    branch: args['--branch'],
    destination: args['--destination'],
    apiToken: args['--token'],
    _env: args['--_env'],
    _dry: args['--_dry'],
})
    .then(() => {
    process.exit(0);
})
    .catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=bin.js.map