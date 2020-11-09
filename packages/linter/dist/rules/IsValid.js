"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValid = void 0;
const validate_1 = require("../validate");
const rule_1 = require("../rule");
class IsValid extends rule_1.Rule {
    async run({ raw }) {
        const res = await validate_1.validate(raw.body);
        return res.status === "PASS"
            ? this.pass()
            : this.fail(JSON.stringify(res.errors));
    }
    meta() {
        return {
            url: "https://validator.amp.dev/",
            title: "Document is valid AMP",
            info: "",
        };
    }
}
exports.IsValid = IsValid;
