"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesHaveAltText = void 0;
const rule_1 = require("../rule");
const chalk_1 = __importDefault(require("chalk"));
class ImagesHaveAltText extends rule_1.Rule {
    run({ $ }) {
        let imgsWithoutAlt = {};
        let output = "";
        const color = (s) => {
            return chalk_1.default.yellow(s);
        };
        $("amp-img").each(function (i, elem) {
            if (!elem.attribs.alt) {
                if (typeof imgsWithoutAlt[elem.attribs.src] == "undefined") {
                    imgsWithoutAlt[elem.attribs.src] = 1;
                }
                else {
                    imgsWithoutAlt[elem.attribs.src] += 1;
                }
            }
        });
        for (let key in imgsWithoutAlt) {
            imgsWithoutAlt[key] > 1
                ? (output += key + color(" [used " + imgsWithoutAlt[key] + " times]\n"))
                : (output += key + "\n");
        }
        return Object.keys(imgsWithoutAlt).length > 0
            ? this.warn("Missing alt text from images: \n" + output)
            : this.pass();
    }
    meta() {
        return {
            url: "https://blog.amp.dev/2020/02/12/seo-for-amp-stories/",
            title: "Images contain alt text",
            info: "",
        };
    }
}
exports.ImagesHaveAltText = ImagesHaveAltText;
