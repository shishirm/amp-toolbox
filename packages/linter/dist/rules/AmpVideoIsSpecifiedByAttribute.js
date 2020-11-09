"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmpVideoIsSpecifiedByAttribute = void 0;
const rule_1 = require("../rule");
class AmpVideoIsSpecifiedByAttribute extends rule_1.Rule {
    run({ $ }) {
        if ($("amp-video[src]").length > 0) {
            return this.warn("<amp-video src> used instead of <amp-video><source/></amp-video>");
        }
        else {
            return this.pass();
        }
    }
    meta() {
        return {
            url: "",
            title: "<amp-video><source/></amp-video> syntax is used for video",
            info: "",
        };
    }
}
exports.AmpVideoIsSpecifiedByAttribute = AmpVideoIsSpecifiedByAttribute;
