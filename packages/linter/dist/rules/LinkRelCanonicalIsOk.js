"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkRelCanonicalIsOk = void 0;
const helper_1 = require("../helper");
const index_1 = require("../index");
const rule_1 = require("../rule");
class LinkRelCanonicalIsOk extends rule_1.Rule {
    async run(context) {
        const { $, url, mode } = context;
        if (mode !== index_1.LintMode.AmpStory) {
            return this.pass();
        }
        const canonical = $('link[rel="canonical"]').attr("href");
        if (!canonical) {
            return this.fail("<link rel=canonical> not specified");
        }
        const s1 = helper_1.absoluteUrl(canonical, url);
        // does canonical match url?
        if (url !== s1) {
            return this.fail(`actual: ${s1}, expected: ${url}`);
        }
        // does url redirect?
        try {
            const s2 = await helper_1.redirectUrl(context, url);
            if (s2 === url) {
                return this.pass(`actual: ${s2}, expected: ${url}`);
            }
            else {
                return this.fail(`actual: ${s2}, expected: ${url}`);
            }
        }
        catch (e) {
            return this.fail(`couldn't retrieve canonical ${url}`);
        }
    }
    meta() {
        return {
            url: "https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/discovery/#what-if-i-only-have-one-page?",
            title: "Story is self-canonical",
            info: "",
        };
    }
}
exports.LinkRelCanonicalIsOk = LinkRelCanonicalIsOk;
