"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointsAreAccessibleFromCache = void 0;
const url_1 = require("url");
const toolbox_cache_url_1 = require("@ampproject/toolbox-cache-url");
const node_fetch_1 = __importDefault(require("node-fetch"));
const caches_1 = require("../caches");
const helper_1 = require("../helper");
const rule_1 = require("../rule");
const filter_1 = require("../filter");
class EndpointsAreAccessibleFromCache extends rule_1.Rule {
    async run(context) {
        // Cartesian product from https://stackoverflow.com/a/43053803/11543
        const cartesian = (a, b) => [].concat(...a.map((d) => b.map((e) => [].concat(d, e))));
        const e = helper_1.corsEndpoints(context.$);
        const product = cartesian(e, (await caches_1.caches()).map((c) => c.cacheDomain));
        const canXhrCache = async (xhrUrl, cacheSuffix) => {
            const sourceOrigin = helper_1.buildSourceOrigin(context.url);
            const url = await toolbox_cache_url_1.createCacheUrl(cacheSuffix, context.url);
            const obj = url_1.parse(url);
            const origin = `${obj.protocol}//${obj.host}`;
            const headers = Object.assign({}, { origin }, context.headers);
            const curl = helper_1.fetchToCurl(helper_1.addSourceOrigin(xhrUrl, sourceOrigin), {
                headers,
            });
            return node_fetch_1.default(helper_1.addSourceOrigin(xhrUrl, sourceOrigin), { headers })
                .then(filter_1.isStatusOk)
                .then(filter_1.isAccessControlHeaders(origin, sourceOrigin))
                .then(filter_1.isJson)
                .then(() => this.pass(`${xhrUrl} is accessible from ${cacheSuffix}`), (e) => this.fail(`can't XHR [${xhrUrl}]: ${e.message} [debug: ${curl}]`));
        };
        return (await Promise.all(product.map(([xhrUrl, cacheSuffix]) => canXhrCache(helper_1.absoluteUrl(xhrUrl, context.url) || "", cacheSuffix)))).filter(filter_1.notPass);
    }
    meta() {
        return {
            url: "https://amp.dev/documentation/guides-and-tutorials/learn/amp-caches-and-cors/amp-cors-requests/",
            title: "Endpoints are accessible from cache",
            info: "",
        };
    }
}
exports.EndpointsAreAccessibleFromCache = EndpointsAreAccessibleFromCache;
