"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataIncludesOGImageSrc = void 0;
const rule_1 = require("../rule");
class MetadataIncludesOGImageSrc extends rule_1.Rule {
    run({ $ }) {
        let hasOGImage = false;
        $("meta").each(function (i, elem) {
            if ((elem.attribs.property &&
                elem.attribs.property.includes("og:image", 0) &&
                elem.attribs.content) ||
                (elem.attribs.name &&
                    elem.attribs.name.includes("og:image", 0) &&
                    elem.attribs.content)) {
                hasOGImage = true;
                return false;
            }
        });
        return !hasOGImage
            ? this.warn(`Missing og:image property or content source`)
            : this.pass();
    }
    meta() {
        return {
            url: "https://blog.amp.dev/2020/02/12/seo-for-amp-stories/",
            title: "Metadata includes og:image and src",
            info: "",
        };
    }
}
exports.MetadataIncludesOGImageSrc = MetadataIncludesOGImageSrc;
