"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleRuntimeUsed = void 0;
const rule_1 = require("../rule");
const helper_1 = require("../helper");
class ModuleRuntimeUsed extends rule_1.Rule {
    run({ $ }) {
        if (!helper_1.isTransformedAmp($)) {
            return this.pass();
        }
        const isModuleVersion = $("script[type='module'][src$='/v0.mjs']").length > 0;
        return isModuleVersion
            ? this.pass()
            : this.warn("The JavaScript module version of the AMP Runtime is not used");
    }
    meta() {
        return {
            url: "https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/amp-optimizer-guide/",
            title: "Page is using JavaScript Module version of the AMP Runtime",
            info: "",
        };
    }
}
exports.ModuleRuntimeUsed = ModuleRuntimeUsed;
