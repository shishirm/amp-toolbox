"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmpImgAmpPixelPreferred = void 0;
const rule_1 = require("../rule");
const filter_1 = require("../filter");
class AmpImgAmpPixelPreferred extends rule_1.Rule {
    async run(context) {
        const $ = context.$;
        return (await Promise.all($("amp-img[width=1][height=1]")
            .map((_, e) => {
            const layout = $(e).attr("layout");
            if (layout === "responsive") {
                // see comment at AmpImgHeightWidthIsOk
                return this.pass();
            }
            const s = $(e).toString();
            return this.warn(`[${s}] has width=1, height=1; <amp-pixel> may be a better choice`);
        })
            .get())).filter(filter_1.notPass);
    }
    meta() {
        return {
            url: "",
            title: "1x1 images are specified by <amp-pixel>",
            info: "",
        };
    }
}
exports.AmpImgAmpPixelPreferred = AmpImgAmpPixelPreferred;
