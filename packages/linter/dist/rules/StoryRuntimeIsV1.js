"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryRuntimeIsV1 = void 0;
const rule_1 = require("../rule");
class StoryRuntimeIsV1 extends rule_1.Rule {
    run({ $ }) {
        const isV1 = $("script[src='https://cdn.ampproject.org/v0/amp-story-1.0.js']").length >
            0;
        return isV1
            ? this.pass()
            : this.fail("amp-story-1.0.js not used (probably 0.1?)");
    }
    meta() {
        return {
            url: "https://amp.dev/documentation/components/amp-story/#migrating-from-0.1-to-1.0",
            title: "AMP Story v1.0 is used",
            info: "",
        };
    }
}
exports.StoryRuntimeIsV1 = StoryRuntimeIsV1;
