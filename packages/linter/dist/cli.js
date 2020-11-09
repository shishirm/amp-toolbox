"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.easyLint = exports.cli = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
const commander_1 = __importDefault(require("commander"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio_1 = __importDefault(require("cheerio"));
const chalk_1 = __importDefault(require("chalk"));
const _1 = require(".");
const helper_1 = require("./helper");
// import { version } from "../package.json";
const UA = {
    googlebot_mobile: [
        "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36",
        "(KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36",
        "(compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    ].join(" "),
    googlebot_desktop: [
        "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible;",
        "Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36",
    ].join(" "),
    chrome_mobile: [
        "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012)",
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Mobile Safari/537.36",
    ].join(" "),
    chrome_desktop: [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3)",
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36",
    ].join(" "),
};
function cli(argv, logger = console, cmd = "amplint") {
    commander_1.default
        // .version(version)
        .usage(`${cmd} [options] URL|copy_as_cURL`)
        .option(`-f, --force <string>`, "override test type", /^(auto|sxg|amp|ampstory|pageexperience)$/i, // needs to be of type LintMode | "auto"
    "auto")
        .option(`-t, --format <string>`, "override output format", /^(text|json|tsv|html)$/i, "text")
        .option(`-A, --user-agent <string>`, "user agent string", /^(googlebot_desktop|googlebot_mobile|chrome_desktop|chrome_mobile)$/i, "googlebot_mobile")
        .option(`-s, --show-passing`, "show passing tests in output", false)
        .option(`-r, --report-mode`, "include metadata for passing tests in output", false)
        .on("--help", function () {
        logger.log("");
        logger.log("Examples:");
        logger.log(`  $ ${cmd} https://amp.dev/`);
        logger.log(`  $ ${cmd} --force sxg https://amp.dev/`);
    });
    if (argv.length <= 2) {
        commander_1.default.help();
    }
    function seq(first, last) {
        if (first < last) {
            return [first].concat(seq(first + 1, last));
        }
        else if (first > last) {
            return [last].concat(seq(first, last - 1));
        }
        else {
            return [first];
        }
    }
    // One reason to support curl-style arguments is to provide cookies that avoid
    // GDPR interstitials.
    const headers = seq(2, argv.length - 1)
        .filter((n) => argv[n] === "-H")
        .map((n) => argv[n + 1])
        .map((s) => {
        const [h, ...v] = s.split(": ");
        return [h, v.join("")];
    })
        .reduce((a, kv) => {
        a[kv[0]] = kv[1];
        return a;
    }, {});
    // Options is argv with "curl" and all -H flags removed (to pass to
    // program.parse())
    const options = seq(0, argv.length - 1)
        .filter((n) => argv[n] !== "curl" && argv[n] !== "-H" && argv[n - 1] !== "-H")
        .map((n) => argv[n]);
    commander_1.default.parse(options);
    const url = commander_1.default.args[0];
    if (!url) {
        commander_1.default.help();
    }
    else {
        commander_1.default.url = url;
    }
    commander_1.default.headers = headers;
    return easyLint(commander_1.default)
        .then(logger.info.bind(logger))
        .catch((e) => {
        logger.error(e.stack || e.message || e);
        process.exitCode = 1;
    });
}
exports.cli = cli;
async function easyLint({ url, userAgent, format, force, headers, showPassing, reportMode, }) {
    headers["user-agent"] = UA[userAgent];
    const raw = await (async () => {
        if (url === "-") {
            return Promise.resolve({
                body: fs_1.readFileSync("/dev/stdin").toString(),
                headers: {},
            });
        }
        const debug = helper_1.fetchToCurl(url, { headers });
        try {
            const res = await node_fetch_1.default(url, { headers });
            return res.ok
                ? Promise.resolve({
                    headers: res.headers,
                    body: await res.text(),
                })
                : Promise.reject(`couldn't load [${url}]: ${res.statusText} [debug: ${debug}]`);
        }
        catch (e) {
            return Promise.reject(`couldn't load [${url}] [debug: ${debug}]`);
        }
    })();
    const $ = cheerio_1.default.load(raw.body);
    const mode = force === "auto" ? _1.guessMode($) : force;
    return printer(format, showPassing, reportMode, await _1.lint({
        raw,
        $,
        headers,
        url,
        mode,
    }));
}
exports.easyLint = easyLint;
function colorStatus(s) {
    switch (s) {
        case _1.Status.PASS:
            return chalk_1.default.green(s);
        case _1.Status.FAIL:
            return chalk_1.default.red(s);
        case _1.Status.WARN:
            return chalk_1.default.yellow(s);
        case _1.Status.INFO:
            return chalk_1.default.blueBright(s);
        default:
            return s;
    }
}
function printer(type, showPassing, reportMode, data) {
    function flatten(data) {
        const rows = [];
        rows.push(["id", "title", "status", "message"]);
        for (const k of Object.keys(data).sort()) {
            const v = data[k];
            if (!util_1.isArray(v)) {
                rows.push([k, v.title, v.status, v.message || ""]);
            }
            else {
                for (const vv of v) {
                    rows.push([k, vv.title, vv.status, vv.message || ""]);
                }
            }
        }
        return rows;
    }
    let sep = "\t";
    switch (type) {
        case "tsv":
            return flatten(data)
                .map((l) => l.join(sep))
                .join("\n");
        case "html":
            const res = flatten(data).splice(1);
            const thead = `<tr><th>Name</th><th>Status</th><th>Message</th><tr>`;
            const tbody = res
                .map((r) => r.map((td) => `<td>${escape(td)}</td>`).join(""))
                .map((r) => `<tr>${r}</tr>`)
                .join("");
            return [
                `<table class="amplint">`,
                `<thead>`,
                thead,
                `</thead>`,
                `<tbody>`,
                tbody,
                `</tbody>`,
                `</table>`,
            ].join("\n");
        case "json":
            return JSON.stringify(data, null, 2);
        case "text":
        default:
            return flatten(data)
                .splice(1)
                .sort((a, b) => _1.StatusNumber[a[2]] -
                _1.StatusNumber[b[2]])
                .map((l) => {
                // Check for a output message
                // If FAIL/WARN return status and message
                // If PASS
                //  check whether to include in output w/ or w/o reporting
                //  or return empty
                return l[3] !== "" && l[2] !== _1.Status.PASS
                    ? `${colorStatus(l[2])} ${l[1]}\n> ${l[3]}\n`
                    : showPassing && reportMode && l[3] !== ""
                        ? `${colorStatus(l[2])} ${l[1]}\n ${l[3]}\n`
                        : showPassing
                            ? `${colorStatus(l[2])} ${l[1]}\n`
                            : "";
            })
                .filter((line) => line.length > 0)
                .join("\n");
    }
}
if (require.main === module) {
    cli(process.argv);
}
