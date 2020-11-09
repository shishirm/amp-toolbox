"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleMeetsLengthCriteria = void 0;
const rule_1 = require("../rule");
class TitleMeetsLengthCriteria extends rule_1.Rule {
    run({ $ }) {
        const e = $("amp-story[title]");
        const PASSING_LEN = 90;
        return e[0].attribs.title.length > PASSING_LEN
            ? this.warn("Title is too long")
            : this.pass();
    }
    meta() {
        return {
            url: "https://developers.google.com/search/docs/guides/web-stories-creation-best-practices#seo",
            title: "Title is ninety characters or less",
            info: "",
        };
    }
}
exports.TitleMeetsLengthCriteria = TitleMeetsLengthCriteria;
