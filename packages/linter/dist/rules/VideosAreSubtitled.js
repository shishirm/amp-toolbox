"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosAreSubtitled = void 0;
const rule_1 = require("../rule");
class VideosAreSubtitled extends rule_1.Rule {
    run({ $ }) {
        const numOfSubtitleElems = $("track").length;
        const numOfVideoElems = $("amp-video").length;
        //Are there any <amp-video> tags? If so, is there at least 1 <track>?
        return numOfVideoElems > 0 && numOfSubtitleElems <= 0
            ? this.warn(`One or more videos are missing HMTL subtitles`)
            : this.pass();
    }
    meta() {
        return {
            url: "https://blog.amp.dev/2020/02/12/seo-for-amp-stories/",
            title: "Videos are subtitled",
            info: "",
        };
    }
}
exports.VideosAreSubtitled = VideosAreSubtitled;
