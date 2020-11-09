"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SxgVaryOnAcceptAct = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const helper_1 = require("../helper");
const rule_1 = require("../rule");
class SxgVaryOnAcceptAct extends rule_1.Rule {
    async run({ url, headers }) {
        headers.accept = "text/html,application/signed-exchange;v=b3";
        const res = await node_fetch_1.default(url, { headers });
        const debug = `debug: ${helper_1.fetchToCurl(url, { headers })}`;
        const vary = ("" + res.headers.get("vary"))
            .split(",")
            .map((s) => s.toLowerCase().trim());
        if (vary.length == 0)
            return this.fail(`[vary] header is missing [${debug}]`);
        if (!vary.includes("amp-cache-transform"))
            return this.fail(`[vary] header is missing value [amp-cache-transform] [${debug}]`);
        if (!vary.includes("accept"))
            return this.fail(`[vary] header is missing value [accept] [${debug}]`);
        return this.pass();
    }
    meta() {
        return {
            url: "",
            title: "vary header is correct",
            info: "",
        };
    }
}
exports.SxgVaryOnAcceptAct = SxgVaryOnAcceptAct;
