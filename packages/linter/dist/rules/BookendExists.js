"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookendExists = void 0;
const rule_1 = require("../rule");
class BookendExists extends rule_1.Rule {
    run(context) {
        const { $ } = context;
        const s1 = $("amp-story amp-story-bookend").length === 1;
        const s2 = $("amp-story").attr("bookend-config-src");
        const bookendSrc = s1 || s2;
        return bookendSrc
            ? this.pass()
            : this.warn("<amp-story-bookend> not found");
    }
    meta() {
        return {
            url: "https://amp.dev/documentation/components/amp-story/#bookend:-amp-story-bookend",
            title: "A bookend exists",
            info: "",
        };
    }
}
exports.BookendExists = BookendExists;
