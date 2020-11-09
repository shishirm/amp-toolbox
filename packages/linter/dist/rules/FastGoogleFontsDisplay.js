"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastGoogleFontsDisplay = void 0;
const rule_1 = require("../rule");
const GOOGLE_FONT_URL_PATTERN = /https?:\/\/fonts.googleapis.com\/css\?(?!(?:[\s\S]+&)?display=(?:swap|fallback|optional)(?:&|$))/i;
/**
 * Checks if Google Font stylesheets are loaded with the display parameter
 * value of 'swap', 'fallback', or 'optional'
 */
class FastGoogleFontsDisplay extends rule_1.Rule {
    run({ $ }) {
        const fonts = $("link[rel='stylesheet'][href^='https://fonts.googleapis.com/css']");
        if (!fonts.length) {
            return this.pass();
        }
        const results = [];
        fonts.each((i, linkNode) => {
            const href = $(linkNode).attr("href");
            const match = GOOGLE_FONT_URL_PATTERN.exec(href);
            if (match) {
                results.push(this.warn(`Use &display=swap|fallback|optional in Google Font stylesheet URL: ${href}`));
            }
        });
        return Promise.all(results);
    }
    meta() {
        return {
            url: "https://web.dev/font-display/",
            title: "Use fast font-display for Google Fonts",
            info: "",
        };
    }
}
exports.FastGoogleFontsDisplay = FastGoogleFontsDisplay;
