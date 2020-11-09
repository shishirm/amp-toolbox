"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaCharsetIsFirst = void 0;
const rule_1 = require("../rule");
class MetaCharsetIsFirst extends rule_1.Rule {
    run({ $ }) {
        const firstChild = $("head *:first-child");
        const charset = firstChild.attr("charset");
        return !charset
            ? this.fail(`<meta charset> not the first <meta> tag`)
            : this.pass();
    }
    meta() {
        return {
            url: "https://html.spec.whatwg.org/multipage/parsing.html#determining-the-character-encoding",
            title: "<meta charset> is the first <meta> tag",
            info: "",
        };
    }
}
exports.MetaCharsetIsFirst = MetaCharsetIsFirst;
