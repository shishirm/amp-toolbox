"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmpVideoIsSmall = void 0;
const helper_1 = require("../helper");
const rule_1 = require("../rule");
class AmpVideoIsSmall extends rule_1.Rule {
    async run(context) {
        const { $ } = context;
        const args = await Promise.all($(`amp-video source[type="video/mp4"][src], amp-video[src]`)
            .map(async (i, e) => {
            const url = helper_1.absoluteUrl($(e).attr("src"), context.url);
            try {
                const length = await helper_1.contentLength(context, url);
                return { url, length };
            }
            catch (e) {
                // URL is non-2xx (TODO: improve error handling)
                return { url, length: -1 };
            }
        })
            .get());
        const videos = args.reduce((a, v) => {
            a[v.url] = v.length;
            return a;
        }, {});
        if (args.length === 0) {
            return [];
        }
        // Over 4MB is too big: https://amp.dev/documentation/guides-and-tutorials/develop/amp_story_best_practices#size/length-of-video
        const large = Object.keys(videos).filter((v) => videos[v] > 4000000);
        if (large.length > 0) {
            return this.fail(`videos over 4MB: [${large.join(",")}]`);
        }
        else {
            return this.pass(`[${Object.keys(videos).join(",")}] are all under 4MB`);
        }
    }
    meta() {
        return {
            url: "https://amp.dev/documentation/guides-and-tutorials/develop/amp_story_best_practices#size/length-of-video",
            title: "Videos are under 4MB",
            info: "",
        };
    }
}
exports.AmpVideoIsSmall = AmpVideoIsSmall;
