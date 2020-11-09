"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosHaveAltText = void 0;
const rule_1 = require("../rule");
class VideosHaveAltText extends rule_1.Rule {
    run({ $ }) {
        let vidsWithoutAlt = 0;
        $("amp-video").each(function (i, elem) {
            if (!elem.attribs.title) {
                vidsWithoutAlt += 1;
            }
        });
        return vidsWithoutAlt > 0
            ? this.warn(`Missing alt text from ${vidsWithoutAlt} videos`)
            : this.pass();
    }
    meta() {
        return {
            url: "https://blog.amp.dev/2020/02/12/seo-for-amp-stories/",
            title: "Videos contain alt text",
            info: "",
        };
    }
}
exports.VideosHaveAltText = VideosHaveAltText;