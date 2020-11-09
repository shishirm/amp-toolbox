"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryMetadataIsV1 = void 0;
const rule_1 = require("../rule");
class StoryMetadataIsV1 extends rule_1.Rule {
    run({ $ }) {
        const isV1 = $("script[src='https://cdn.ampproject.org/v0/amp-story-1.0.js']").length >
            0;
        if (!isV1) {
            return this.pass();
        }
        const attr = [
            "title",
            "publisher",
            "publisher-logo-src",
            "poster-portrait-src",
        ]
            .map((a) => ($(`amp-story[${a}]`).length > 0 ? false : a))
            .filter(Boolean);
        if (attr.length > 0) {
            return this.warn(`<amp-story> is missing required attribute(s): [${attr.join(", ")}]`);
        }
        else {
            return this.pass();
        }
    }
    meta() {
        return {
            url: "https://amp.dev/documentation/components/amp-story/#new-metadata-requirements",
            title: "Required story metadata attributes in <amp-story> tag",
            info: "",
        };
    }
}
exports.StoryMetadataIsV1 = StoryMetadataIsV1;
