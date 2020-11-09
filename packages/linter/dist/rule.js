"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rule = void 0;
const index_1 = require("./index");
class Rule {
    meta() {
        return {
            url: "",
            title: this.constructor.name.replace(/([a-z])([A-Z])/g, (_, c1, c2) => `${c1} ${c2.toLowerCase()}`) + "?",
            info: "",
        };
    }
    async pass(s) {
        return {
            status: index_1.Status.PASS,
            message: s,
            ...this.meta(),
        };
    }
    async fail(s) {
        return {
            status: index_1.Status.FAIL,
            message: s,
            ...this.meta(),
        };
    }
    async warn(s) {
        return {
            status: index_1.Status.WARN,
            message: s,
            ...this.meta(),
        };
    }
    async info(s) {
        return {
            status: index_1.Status.INFO,
            message: s,
            ...this.meta(),
        };
    }
}
exports.Rule = Rule;
