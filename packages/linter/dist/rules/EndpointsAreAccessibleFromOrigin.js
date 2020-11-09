"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointsAreAccessibleFromOrigin = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const helper_1 = require("../helper");
const rule_1 = require("../rule");
const filter_1 = require("../filter");
class EndpointsAreAccessibleFromOrigin extends rule_1.Rule {
    async run(context) {
        const e = helper_1.corsEndpoints(context.$);
        const canXhrSameOrigin = (xhrUrl) => {
            xhrUrl = helper_1.absoluteUrl(xhrUrl, context.url);
            const sourceOrigin = helper_1.buildSourceOrigin(context.url);
            const headers = Object.assign({ "amp-same-origin": "true" }, context.headers);
            const debug = helper_1.fetchToCurl(helper_1.addSourceOrigin(xhrUrl, sourceOrigin), {
                headers,
            });
            return node_fetch_1.default(helper_1.addSourceOrigin(xhrUrl, sourceOrigin), { headers })
                .then(filter_1.isStatusOk)
                .then(filter_1.isJson)
                .then(() => this.pass(`${xhrUrl} is accessible from ${sourceOrigin}`), (e) => this.fail(`can't XHR [${xhrUrl}]: ${e.message} [debug: ${debug}]`));
        };
        return (await Promise.all(e.map((url) => canXhrSameOrigin(helper_1.absoluteUrl(url.toString(), context.url) || "")))).filter(filter_1.notPass);
    }
    meta() {
        return {
            url: "https://amp.dev/documentation/guides-and-tutorials/learn/amp-caches-and-cors/amp-cors-requests/",
            title: "Endpoints are accessible from origin",
            info: "",
        };
    }
}
exports.EndpointsAreAccessibleFromOrigin = EndpointsAreAccessibleFromOrigin;
