"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaMetadataIsRecent = void 0;
const helper_1 = require("../helper");
const rule_1 = require("../rule");
class SchemaMetadataIsRecent extends rule_1.Rule {
    run({ $ }) {
        const inLastMonth = (time) => {
            return time > Date.now() - 30 * 24 * 60 * 60 * 1000 && time < Date.now();
        };
        const metadata = helper_1.schemaMetadata($);
        const datePublished = metadata.datePublished;
        const dateModified = metadata.dateModified;
        if (!datePublished || !dateModified) {
            return this.fail(`datePublished or dateModified not found`);
        }
        const timePublished = Date.parse(datePublished);
        const timeModified = Date.parse(dateModified);
        if (isNaN(timePublished) || isNaN(timeModified)) {
            return this.fail(`couldn't parse datePublished [${datePublished}] or dateModified [${dateModified}]`);
        }
        if (timeModified < timePublished) {
            return this.fail(`dateModified [${dateModified}] is earlier than datePublished [${datePublished}]`);
        }
        if (inLastMonth(timePublished) && inLastMonth(timeModified)) {
            return this.pass();
        }
        else {
            return this.warn(`datePublished [${datePublished}] or dateModified [${dateModified}] is old or in the future`);
        }
    }
}
exports.SchemaMetadataIsRecent = SchemaMetadataIsRecent;
