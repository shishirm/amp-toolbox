"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryIsMostlyText = void 0;
const rule_1 = require("../rule");
class StoryIsMostlyText extends rule_1.Rule {
    run({ $ }) {
        const text = $("amp-story").text();
        if (text.length > 100) {
            return this.pass();
        }
        else {
            return this.warn(`minimal text in the story [${text}]`);
        }
    }
    meta() {
        return {
            url: "",
            title: "Text is HTML (and not embedded into video)",
            info: "",
        };
    }
}
exports.StoryIsMostlyText = StoryIsMostlyText;
