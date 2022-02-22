"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kuroshiro_1 = __importDefault(require("kuroshiro"));
const kuroshiro_analyzer_kuromoji_1 = __importDefault(require("kuroshiro-analyzer-kuromoji"));
const csvtojson_1 = __importDefault(require("csvtojson"));
async function run() {
    const kuroshiro = new kuroshiro_1.default();
    await kuroshiro.init(new kuroshiro_analyzer_kuromoji_1.default());
    const input = `unit,english,japanese
Phonics,bat,バット
Phonics,box,箱
Phonics,cap,（ふちのない）ぼうし
Phonics,cat,猫
Phonics,fox,狐
Phonics,fun,楽しい
Phonics,hen,めんどり
Phonics,hop,びょんびょんとぶ
Phonics,map,地図
Phonics,mat,マット
Phonics,pen,ベン
Phonics,run,走る
Phonics,sun,太陽
Phonics,tap,軽くたたく
Phonics,ten,十
Phonics,top,頂上`;
    const words = [];
    for (const csvWord of await (0, csvtojson_1.default)({ delimiter: "," }).fromString(input)) {
        const word = {
            "en": csvWord.english,
            "ja": {
                "hiragana": kuroshiro_1.default.Util.kanaToHiragna(await kuroshiro.convert(csvWord.japanese, { to: "hiragana" })),
                "kanji": csvWord.japanese
            }
        };
        words.push(word);
    }
    const wordsJSON = JSON.stringify(words, null, 2);
    console.log(wordsJSON);
}
run();
