"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.caches = void 0;
const fs_1 = require("fs");
const toolbox_cache_list_1 = __importDefault(require("@ampproject/toolbox-cache-list"));
const cacheList = (fs_1.existsSync("caches.json")
    ? Promise.resolve(JSON.parse(fs_1.readFileSync("caches.json").toString()).caches)
    : new toolbox_cache_list_1.default().list());
function caches() {
    return cacheList;
}
exports.caches = caches;
