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
        .replace("ふくすうがた", "ふくすうけい")
        .replace("かこぶんしがた", "かこぶんしけい");
    return hiragana;
}
async function writeToFile(words, unit) {
    const wordsJSON = JSON.stringify(words, null, 2);
    return promises_1.default.writeFile(`output_${unit}.json`, wordsJSON, "utf-8");
}
async function run() {
    await kuroshiro.init(new kuroshiro_analyzer_kuromoji_1.default());
    const input = (await promises_1.default.readFile("C:\\Users\\Hyprk\\Desktop\\temp\\Junior Sunshine 6 wordlist.csv")).toString("utf-8");
    let words = [];
    let last = undefined;
    for (const csvWord of await (0, csvtojson_1.default)({ delimiter: "," }).fromString(input)) {
        if (csvWord.unit !== last) {
            if (last == undefined) {
                last = csvWord.unit;
            }
            else {
                await writeToFile(words, last);
                words = [];
                last = csvWord.unit;
            }
        }
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
        en.push(original_en);
        ja.push({
            "hiragana": await toHiragana(original_ja),
            "kanji": original_ja
        });
        const word = {
            "en": en.length == 1 ? en[0] : en,
            "ja": ja.length == 1 ? ja[0] : ja
        };
        words.push(word);
    }
    await writeToFile(words, last);
}
run();
