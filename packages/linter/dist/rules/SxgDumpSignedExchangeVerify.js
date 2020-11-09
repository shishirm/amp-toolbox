"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SxgDumpSignedExchangeVerify = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const execa_1 = __importDefault(require("execa"));
const helper_1 = require("../helper");
const rule_1 = require("../rule");
const CMD_DUMP_SXG = `dump-signedexchange`;
const CMD_DUMP_SXG_ARGS = [`-verify`, `-json`];
function compare(expected, actual) {
    return Object.keys(expected).reduce((acc, k) => {
        if (typeof actual[k] === "undefined") {
            acc[k] = `expected: [${expected[k]}], actual: property missing`;
            return acc;
        }
        else if (expected[k] !== actual[k]) {
            acc[k] = `expected: [${expected[k]}], actual: [${actual[k]}]`;
            return acc;
        }
        else {
            return acc;
        }
    }, {});
}
async function urlHasContentType(url, headers, contentType) {
    const res = await node_fetch_1.default(url, { headers });
    if (!res.ok) {
        return false;
    }
    return res.headers.get("content-type") === contentType;
}
const REQUEST_HEADERS = {
    "accept": "application/signed-exchange;v=b3",
    "amp-cache-transform": `google;v="1"`,
};
const EXPECTED_VERSION = "1b3";
const SECONDS_IN_A_DAY = 24 * 60 * 60;
class SxgDumpSignedExchangeVerify extends rule_1.Rule {
    async run({ url, headers }) {
        const opt = {
            headers: {
                ...REQUEST_HEADERS,
                ...headers,
            },
        };
        const res = await node_fetch_1.default(url, opt);
        const hdr = res.headers.get("content-type") || "";
        if (hdr.indexOf("application/signed-exchange") === -1) {
            return this.fail(`response is not [content-type: application/signed-exchange] [debug: ${helper_1.fetchToCurl(url, opt)}]`);
        }
        const body = await res.buffer();
        const debug = `[debug: ${helper_1.fetchToCurl(url, opt, false)} | ${CMD_DUMP_SXG} ${CMD_DUMP_SXG_ARGS.join(" ")}]`;
        let sxg;
        try {
            sxg = await execa_1.default(CMD_DUMP_SXG, CMD_DUMP_SXG_ARGS, { input: body }).then((spawn) => {
                const stdout = JSON.parse(spawn.stdout);
                return {
                    isValid: stdout.Valid,
                    version: stdout.Version,
                    uri: stdout.RequestURI,
                    status: stdout.ResponseStatus,
                    signatures: stdout.Signatures,
                };
            });
        }
        catch (e) {
            return this.warn(`couldn't execute [${CMD_DUMP_SXG}] (not installed? not in PATH?)`);
        }
        const expected = {
            isValid: true,
            version: EXPECTED_VERSION,
            uri: url,
            status: 200,
        };
        const diff = compare(expected, sxg);
        if (Object.keys(diff).length !== 0) {
            return this.fail(`[${url}] is not valid [${JSON.stringify(diff)}] [${debug}]`);
        }
        const certUrl = sxg.signatures[0]["Params"]["cert-url"];
        if (!certUrl) {
            return this.fail(`Can't find valid [cert-url] [${JSON.stringify(sxg)}]`);
        }
        if (!(await urlHasContentType(certUrl, headers, "application/cert-chain+cbor"))) {
            return this.fail(`cert-url [${certUrl}] is not found or has wrong content type`);
        }
        const validityUrl = sxg.signatures[0]["Params"]["validity-url"];
        if (!validityUrl) {
            return this.fail(`Can't find valid [cert-url] [${JSON.stringify(sxg)}]`);
        }
        if (!(await urlHasContentType(validityUrl, headers, "application/cbor"))) {
            return this.fail(`validity-url [${validityUrl}] is not found or has wrong content type`);
        }
        const expires = sxg.signatures[0]["Params"]["expires"];
        if (7 * SECONDS_IN_A_DAY + Date.now() / 1000 < expires) {
            return this.fail(`the signed content expires more than 7 days into the future [at ${new Date(expires * 1000)}] [${debug}]`);
        }
        return this.pass();
    }
    meta() {
        return {
            url: "",
            title: `verification by ${CMD_DUMP_SXG} tool`,
            info: "",
        };
    }
}
exports.SxgDumpSignedExchangeVerify = SxgDumpSignedExchangeVerify;
