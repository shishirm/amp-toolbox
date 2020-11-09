"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaMetadataIsNews = void 0;
const helper_1 = require("../helper");
const rule_1 = require("../rule");
class SchemaMetadataIsNews extends rule_1.Rule {
    run({ $ }) {
        const metadata = helper_1.schemaMetadata($);
        const type = metadata["@type"];
        if (type !== "Article" &&
            type !== "NewsArticle" &&
            type !== "ReportageNewsArticle") {
            return this.warn(`@type is not 'Article' or 'NewsArticle' or 'ReportageNewsArticle'`);
        }
        else {
            return this.pass(`@type is ${type}`);
        }
    }
    meta() {
        return {
            url: "",
            title: "schema.org metadata has news or article type",
            info: "",
        };
    }
}
exports.SchemaMetadataIsNews = SchemaMetadataIsNews;
