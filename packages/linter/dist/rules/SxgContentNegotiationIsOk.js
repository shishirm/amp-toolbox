"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SxgContentNegotiationIsOk = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const rule_1 = require("../rule");
const helper_1 = require("../helper");
class SxgContentNegotiationIsOk extends rule_1.Rule {
    async run({ url, headers }) {
        const opt1 = {
            headers: Object.assign({ accept: "text/html" }, headers),
        };
        const res1 = await node_fetch_1.default(url, opt1);
        const hdr1 = res1.headers.get("content-type") || "";
        if (hdr1.indexOf("application/signed-exchange") !== -1) {
            return this.fail(`[content-type: application/signed-exchange] incorrectly returned for [accept: text/html] [debug: ${helper_1.fetchToCurl(url, opt1)}]`);
        }
        const opt2 = {
            headers: Object.assign({ accept: "application/signed-exchange;v=b3" }, headers),
        };
        const res2 = await node_fetch_1.default(url, opt2);
        const hdr2 = res2.headers.get("content-type") || "";
        if (hdr2.indexOf("application/signed-exchange") !== -1) {
            return this.fail(`[content-type: application/signed-exchange] incorrectly returned for [accept: application/signed-exchange;v=b3] [debug: ${helper_1.fetchToCurl(url, opt2)}]`);
        }
        const opt3 = {
            headers: Object.assign({
                "accept": "application/signed-exchange;v=b3",
                "amp-cache-transform": `google;v="1"`,
            }, headers),
        };
        const res3 = await node_fetch_1.default(url, opt3);
        const hdr3 = res3.headers.get("content-type") || "";
        if (hdr3.indexOf("application/signed-exchange") === -1) {
            return this.fail(`[content-type: application/signed-exchange] not returned for [accept: application/signed-exchange;v=b3], [amp-cache-transform: google;v="1"] [debug: ${helper_1.fetchToCurl(url, opt3)}]`);
        }
        return this.pass();
    }
    meta() {
        return {
            url: "",
            title: "content negotiation is correct",
            info: "",
        };
    }
}
exports.SxgContentNegotiationIsOk = SxgContentNegotiationIsOk;
