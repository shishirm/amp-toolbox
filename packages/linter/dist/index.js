"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.easyLint = exports.cli = exports.lint = exports.guessMode = exports.StatusNumber = exports.Status = exports.LintMode = void 0;
const cli_1 = require("./cli");
Object.defineProperty(exports, "cli", { enumerable: true, get: function () { return cli_1.cli; } });
const cli_2 = require("./cli");
Object.defineProperty(exports, "easyLint", { enumerable: true, get: function () { return cli_2.easyLint; } });
const LinkRelCanonicalIsOk_1 = require("./rules/LinkRelCanonicalIsOk");
const AmpVideoIsSmall_1 = require("./rules/AmpVideoIsSmall");
const AmpVideoIsSpecifiedByAttribute_1 = require("./rules/AmpVideoIsSpecifiedByAttribute");
const StoryRuntimeIsV1_1 = require("./rules/StoryRuntimeIsV1");
const StoryMetadataIsV1_1 = require("./rules/StoryMetadataIsV1");
const MetaCharsetIsFirst_1 = require("./rules/MetaCharsetIsFirst");
const RuntimeIsPreloaded_1 = require("./rules/RuntimeIsPreloaded");
const StoryIsMostlyText_1 = require("./rules/StoryIsMostlyText");
const StoryMetadataThumbnailsAreOk_1 = require("./rules/StoryMetadataThumbnailsAreOk");
const AmpImgHeightWidthIsOk_1 = require("./rules/AmpImgHeightWidthIsOk");
const AmpImgAmpPixelPreferred_1 = require("./rules/AmpImgAmpPixelPreferred");
const EndpointsAreAccessibleFromOrigin_1 = require("./rules/EndpointsAreAccessibleFromOrigin");
const EndpointsAreAccessibleFromCache_1 = require("./rules/EndpointsAreAccessibleFromCache");
const SxgVaryOnAcceptAct_1 = require("./rules/SxgVaryOnAcceptAct");
const SxgContentNegotiationIsOk_1 = require("./rules/SxgContentNegotiationIsOk");
const SxgDumpSignedExchangeVerify_1 = require("./rules/SxgDumpSignedExchangeVerify");
const SxgAmppkgIsForwarded_1 = require("./rules/SxgAmppkgIsForwarded");
const MetadataIncludesOGImageSrc_1 = require("./rules/MetadataIncludesOGImageSrc");
const ImagesHaveAltText_1 = require("./rules/ImagesHaveAltText");
const VideosHaveAltText_1 = require("./rules/VideosHaveAltText");
const VideosAreSubtitled_1 = require("./rules/VideosAreSubtitled");
const IsValid_1 = require("./rules/IsValid");
const TitleMeetsLengthCriteria_1 = require("./rules/TitleMeetsLengthCriteria");
const IsTransformedAmp_1 = require("./rules/IsTransformedAmp");
const ModuleRuntimeUsed_1 = require("./rules/ModuleRuntimeUsed");
const BlockingExtensionsPreloaded_1 = require("./rules/BlockingExtensionsPreloaded");
const FontsArePreloaded_1 = require("./rules/FontsArePreloaded");
const HeroImageIsDefined_1 = require("./rules/HeroImageIsDefined");
const FastGoogleFontsDisplay_1 = require("./rules/FastGoogleFontsDisplay");
const GoogleFontPreconnect_1 = require("./rules/GoogleFontPreconnect");
const BoilerplateIsRemoved_1 = require("./rules/BoilerplateIsRemoved");
const AmpImgUsesSrcSet_1 = require("./rules/AmpImgUsesSrcSet");
const util_1 = require("util");
var LintMode;
(function (LintMode) {
    LintMode["Amp"] = "amp";
    LintMode["AmpStory"] = "ampstory";
    LintMode["Amp4Ads"] = "amp4ads";
    LintMode["Amp4Email"] = "amp4email";
    LintMode["PageExperience"] = "pageexperience";
    LintMode["Sxg"] = "sxg";
})(LintMode = exports.LintMode || (exports.LintMode = {}));
var Status;
(function (Status) {
    Status["PASS"] = "PASS";
    Status["FAIL"] = "FAIL";
    Status["WARN"] = "WARN";
    Status["INFO"] = "INFO";
    Status["INTERNAL_ERROR"] = "INTERNAL_ERROR";
})(Status = exports.Status || (exports.Status = {}));
var StatusNumber;
(function (StatusNumber) {
    StatusNumber[StatusNumber["PASS"] = 0] = "PASS";
    StatusNumber[StatusNumber["FAIL"] = 1] = "FAIL";
    StatusNumber[StatusNumber["WARN"] = 2] = "WARN";
    StatusNumber[StatusNumber["INFO"] = 3] = "INFO";
    StatusNumber[StatusNumber["INTERNAL_ERROR"] = 4] = "INTERNAL_ERROR";
})(StatusNumber = exports.StatusNumber || (exports.StatusNumber = {}));
function guessMode($) {
    if ($("body amp-story[standalone]").length === 1) {
        return LintMode.AmpStory;
    }
    // TODO Add tests for the other types
    return LintMode.Amp;
}
exports.guessMode = guessMode;
function testsForMode(type) {
    const tests = new Map();
    tests.set(LintMode.Sxg, [
        IsValid_1.IsValid,
        SxgAmppkgIsForwarded_1.SxgAmppkgIsForwarded,
        SxgContentNegotiationIsOk_1.SxgContentNegotiationIsOk,
        SxgVaryOnAcceptAct_1.SxgVaryOnAcceptAct,
        SxgDumpSignedExchangeVerify_1.SxgDumpSignedExchangeVerify,
    ]);
    tests.set(LintMode.Amp, [
        IsValid_1.IsValid,
        AmpVideoIsSmall_1.AmpVideoIsSmall,
        AmpVideoIsSpecifiedByAttribute_1.AmpVideoIsSpecifiedByAttribute,
        MetaCharsetIsFirst_1.MetaCharsetIsFirst,
        RuntimeIsPreloaded_1.RuntimeIsPreloaded,
        AmpImgHeightWidthIsOk_1.AmpImgHeightWidthIsOk,
        AmpImgAmpPixelPreferred_1.AmpImgAmpPixelPreferred,
        EndpointsAreAccessibleFromOrigin_1.EndpointsAreAccessibleFromOrigin,
        EndpointsAreAccessibleFromCache_1.EndpointsAreAccessibleFromCache,
    ]);
    tests.set(LintMode.AmpStory, (tests.get(LintMode.Amp) || []).concat([
        IsValid_1.IsValid,
        LinkRelCanonicalIsOk_1.LinkRelCanonicalIsOk,
        StoryRuntimeIsV1_1.StoryRuntimeIsV1,
        StoryMetadataIsV1_1.StoryMetadataIsV1,
        StoryIsMostlyText_1.StoryIsMostlyText,
        StoryMetadataThumbnailsAreOk_1.StoryMetadataThumbnailsAreOk,
        MetadataIncludesOGImageSrc_1.MetadataIncludesOGImageSrc,
        ImagesHaveAltText_1.ImagesHaveAltText,
        VideosHaveAltText_1.VideosHaveAltText,
        VideosAreSubtitled_1.VideosAreSubtitled,
        TitleMeetsLengthCriteria_1.TitleMeetsLengthCriteria,
    ]));
    tests.set(LintMode.PageExperience, (tests.get(LintMode.PageExperience) || []).concat([
        IsValid_1.IsValid,
        RuntimeIsPreloaded_1.RuntimeIsPreloaded,
        BlockingExtensionsPreloaded_1.BlockingExtensionsPreloaded,
        FontsArePreloaded_1.FontsArePreloaded,
        FastGoogleFontsDisplay_1.FastGoogleFontsDisplay,
        GoogleFontPreconnect_1.GoogleFontPreconnect,
        IsTransformedAmp_1.IsTransformedAmp,
        BoilerplateIsRemoved_1.BoilerplateIsRemoved,
        ModuleRuntimeUsed_1.ModuleRuntimeUsed,
        HeroImageIsDefined_1.HeroImageIsDefined,
        AmpImgUsesSrcSet_1.AmpImgUsesSrcSet,
    ]));
    return tests.get(type) || [];
}
async function lint(context) {
    const res = await Promise.all(testsForMode(context.mode).map(async (tc) => {
        const t = new tc();
        try {
            const r = await t.run(context);
            if (util_1.isArray(r) && r.length === 0) {
                // Hack: if the result of running a test is [], then the test has
                // tested multiple constructs (e.g. images), and found no issues. In
                // this case, there's no meta information available, so we
                // artificially create a "PASS".
                return [
                    t.constructor.name,
                    [Object.assign({ status: Status.PASS, message: "" }, t.meta())],
                ];
            }
            else {
                return [t.constructor.name, r];
            }
        }
        catch (e) {
            return [
                t.constructor.name,
                {
                    status: Status.INTERNAL_ERROR,
                    message: JSON.stringify(e),
                },
            ];
        }
    }));
    return res.reduce((a, kv) => {
        a[kv[0].toLowerCase()] = kv[1];
        return a;
    }, {});
}
exports.lint = lint;
