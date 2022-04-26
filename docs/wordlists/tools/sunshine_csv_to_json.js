"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const kuroshiro_1 = __importDefault(require("kuroshiro"));
const kuroshiro_analyzer_kuromoji_1 = __importDefault(require("kuroshiro-analyzer-kuromoji"));
const csvtojson_1 = __importDefault(require("csvtojson"));
const kuroshiro = new kuroshiro_1.default();
async function toHiragana(kanjiString) {
    let hiragana = kuroshiro_1.default.Util.kanaToHiragna(await kuroshiro.convert(kanjiString, { to: "hiragana" }));
    hiragana = hiragana
        .replace("かこがた", "かこけい")
        .replace("1にん", "ひとり")
        .replace("いなていけい", "ひていけい")
        .replace("へんかがた", "へんかけい")
        .replace("ふくすうがた", "ふくすうけい");
    return hiragana;
}
async function run() {
    await kuroshiro.init(new kuroshiro_analyzer_kuromoji_1.default());
    const input = (await promises_1.default.readFile("C:\\Users\\Hyprk\\ownCloud\\Work\\Jet Programme\\サンシャイン Sunshine\\Grade 1\\Sunshine 1 wordlist.csv")).toString("utf-8");
    const words = [];
    for (const csvWord of await (0, csvtojson_1.default)({ delimiter: "," }).fromString(input)) {
        if (csvWord.unit !== "9")
            continue;
        const original_en = csvWord.english
            .trim()
            .replace("’", "'")
            .replace("．", ".")
            .replace("（", "(")
            .replace("）", ")")
            .replace("［", "[")
            .replace("］", "]")
            .replace("…", "...")
            .replace(/，\s*/, ", ")
            .replace("～", "~")
            .replace(/\s*＝\s*/, " = ")
            .replace(/\s*\.\.\./, " ...");
        const original_ja = csvWord.japanese
            .trim()
            .replace(/\s*＝\s*/, " = ");
        const en = [];
        const ja = [];
        if (original_en.endsWith("(s)") || original_en.endsWith("(es)")) {
            const singular = original_en.replace(/\(.+?\)$/, "");
            const plural = original_en.replace(/[()]/g, "");
            en.push(singular, plural, original_en);
        }
        else if (original_en.endsWith("(ing)")) {
            const base = original_en.replace(/\(.+?\)$/, "");
            en.push(base, original_en);
        }
        else if (/^[a-zA-Z]e\s+[a-z][A-Z]ing$/.test(original_en)) {
            const words = original_en.split(" ");
            en.push(words[0], original_en, `${words[1]} ${words[0]}`);
        }
        else if (original_en.endsWith("(ed)") || original_en.endsWith("(d)")) {
            const base = original_en.replace(/\(.+?\)$/, "");
            en.push(base, original_en);
        }
        else if (original_en.endsWith("~")) {
            const no_tilde = original_en.replace(/\s*~$/, "");
            en.push(original_en, no_tilde);
        }
        else if (/^.+y\s+.+ies$/.test(original_en)) {
            const words = original_en.split(" ");
            en.push(words[0], words[1], original_en, `${words[1]} ${words[0]}`);
        }
        else if (/\(.+?\)$/.test(original_en)) {
            const base = original_en.replace(/\(.+?\)$/, "");
            en.push(base, original_en);
        }
        else {
            en.push(original_en);
        }
        if (/.+?=.+?/.test(original_ja) && original_en.includes("'")) {
            const answer = original_ja.replace(/.+?=\s*/, "") + "の省略";
            ja.push({
                "hiragana": await toHiragana(answer),
                "kanji": answer
            });
        }
        else {
            ja.push({
                "hiragana": await toHiragana(original_ja),
                "kanji": original_ja
            });
        }
        const word = {
            "en": en.length == 1 ? en[0] : en,
            "ja": ja.length == 1 ? ja[0] : ja
        };
        words.push(word);
    }
    const wordsJSON = JSON.stringify(words, null, 2);
    console.log(wordsJSON);
    await promises_1.default.writeFile("output.json", wordsJSON, "utf-8");
}
run();
