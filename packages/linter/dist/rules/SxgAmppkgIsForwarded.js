"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SxgAmppkgIsForwarded = void 0;
const url_1 = require("url");
const node_fetch_1 = __importDefault(require("node-fetch"));
const helper_1 = require("../helper");
const rule_1 = require("../rule");
class SxgAmppkgIsForwarded extends rule_1.Rule {
    async run({ url, headers }) {
        const validity = (() => {
            const { protocol, host } = new url_1.URL(url);
            return `${protocol}//${host}/amppkg/validity`;
        })();
        const res = await node_fetch_1.default(validity, { headers });
        const contentType = res.headers.get("content-type");
        // Substring instead of equality because some server provide a
        // charset--probably incorrectly, but seems to work, so...
        return res.ok && contentType && contentType.includes("application/cbor")
            ? this.pass()
            : this.fail(`/amppkg/ not forwarded to amppackager [debug: ${helper_1.fetchToCurl(validity, {
                headers,
            })}]`);
    }
    meta() {
        return {
            url: "",
            title: "/amppkg/ is forwarded correctly",
            info: "",
        };
    }
}
exports.SxgAmppkgIsForwarded = SxgAmppkgIsForwarded;
