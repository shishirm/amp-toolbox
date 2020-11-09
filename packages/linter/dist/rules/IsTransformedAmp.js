"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTransformedAmp = void 0;
const rule_1 = require("../rule");
const helper_1 = require("../helper");
class IsTransformedAmp extends rule_1.Rule {
    run({ $ }) {
        return helper_1.isTransformedAmp($)
            ? this.pass()
            : this.warn("No transformed AMP found");
    }
    meta() {
        return {
            url: "https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/amp-optimizer-guide/",
            title: "Page is transformed AMP",
            info: "",
        };
    }
}
exports.IsTransformedAmp = IsTransformedAmp;
