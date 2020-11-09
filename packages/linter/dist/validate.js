"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const amphtml_validator_1 = require("amphtml-validator");
const fs_1 = require("fs");
// If validator.js exists locally, use that, otherwise fetch over network.
const validator = fs_1.existsSync("validator.js")
    ? amphtml_validator_1.getInstance("validator.js")
    : amphtml_validator_1.getInstance();
async function validate(s) {
    const v = await validator;
    return v.validateString(s);
}
exports.validate = validate;
