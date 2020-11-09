"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentLength = exports.dimensions = exports.redirectUrl = exports.fetchToCurl = exports.absoluteUrl = exports.isTransformedAmp = exports.corsEndpoints = exports.buildSourceOrigin = exports.addSourceOrigin = exports.schemaMetadata = void 0;
const CONCURRENCY = 8;
const url_1 = require("url");
const querystring_1 = require("querystring");
const throat_1 = __importDefault(require("throat"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const probe_image_size_1 = __importDefault(require("probe-image-size"));
function schemaMetadata($) {
    const metadata = JSON.parse($('script[type="application/ld+json"]').html());
    return metadata ? metadata : {};
}
exports.schemaMetadata = schemaMetadata;
/**
 * Adds `__amp_source_origin` query parameter to URL.
 *
 * @param url
 * @param sourceOrigin
 */
function addSourceOrigin(url, sourceOrigin) {
    const obj = url_1.parse(url, true);
    obj.query.__amp_source_origin = sourceOrigin;
    obj.search = querystring_1.stringify(obj.query);
    return url_1.format(obj);
}
exports.addSourceOrigin = addSourceOrigin;
function buildSourceOrigin(url) {
    const obj = url_1.parse(url, true);
    return `${obj.protocol}//${obj.host}`;
}
exports.buildSourceOrigin = buildSourceOrigin;
function corsEndpoints($) {
    const result = [];
    const storyBookendSrc = $("amp-story amp-story-bookend").attr("src");
    if (storyBookendSrc) {
        result.push(storyBookendSrc);
    }
    const bookendConfigSrc = $("amp-story").attr("bookend-config-src");
    if (bookendConfigSrc) {
        result.push(bookendConfigSrc);
    }
    const ampListSrc = $("amp-list[src]")
        .map((_, e) => $(e).attr("src"))
        .get();
    return result.concat(ampListSrc);
}
exports.corsEndpoints = corsEndpoints;
exports.isTransformedAmp = ($) => {
    return $("html[transformed]").length > 0;
};
exports.absoluteUrl = (s, base) => {
    if (typeof s !== "string" || typeof base !== "string") {
        return undefined;
    }
    else {
        return url_1.resolve(base, s);
    }
};
function fetchToCurl(url, init = { headers: {} }, includeHeaders = true) {
    const headers = init.headers || {};
    const h = Object.keys(headers)
        .map((k) => `-H '${k}: ${headers[k]}'`)
        .join(" ");
    return `curl -sS ${includeHeaders ? " -i " : ""}${h} '${url}'`;
}
exports.fetchToCurl = fetchToCurl;
exports.redirectUrl = throat_1.default(CONCURRENCY, async (context, s) => {
    const res = await node_fetch_1.default(s, { headers: context.headers });
    return res.url;
});
function dimensions(context, url) {
    // Try to prevent server from sending us encoded/compressed streams, since
    // probe-image-size can't handle them:
    // https://github.com/nodeca/probe-image-size/issues/28
    const headers = Object.assign({}, context.headers);
    delete headers["accept-encoding"];
    return probe_image_size_1.default(exports.absoluteUrl(url, context.url), { headers });
}
exports.dimensions = dimensions;
exports.contentLength = throat_1.default(CONCURRENCY, async (context, s) => {
    const options = Object.assign({}, { method: "HEAD" }, { headers: context.headers });
    const res = await node_fetch_1.default(s, options);
    if (!res.ok) {
        return Promise.reject(res);
    }
    const contentLength = res.headers.get("content-length");
    return contentLength ? contentLength : 0;
});
