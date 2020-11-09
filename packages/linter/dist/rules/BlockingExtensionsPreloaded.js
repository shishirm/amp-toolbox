"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockingExtensionsPreloaded = void 0;
const rule_1 = require("../rule");
const blockingExtension = [
    "amp-dynamic-css-classes",
    "amp-experiment",
    "amp-story",
];
class BlockingExtensionsPreloaded extends rule_1.Rule {
    run({ $ }) {
        const results = [];
        blockingExtension.forEach((extension) => {
            const scriptPart = `/v0/${extension}-`;
            if ($(`script[src*='${scriptPart}']`).length > 0) {
                if ($(`link[rel$='preload'][href*='${scriptPart}']`).length == 0) {
                    results.push(this.warn(`Preload for ${extension} is missing`));
                }
            }
        });
        return Promise.all(results);
    }
    meta() {
        return {
            url: "https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/optimize_amp/#optimize-the-amp-runtime-loading",
            title: "Render-blocking extensions are preloaded",
            info: "",
        };
    }
}
exports.BlockingExtensionsPreloaded = BlockingExtensionsPreloaded;
