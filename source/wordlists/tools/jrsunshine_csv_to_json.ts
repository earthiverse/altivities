import fs from "fs/promises"
import Kuroshiro from "kuroshiro"
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji"
import CSV from "csvtojson"
// import Pluralize from "pluralize"

/**
 * This is a helper file I made to help me convert CSVs in a certain format to
 * JSON wordlists.
 *
 * This is specifically for Sunshine CSVs, to help add extra answers and clean up
 * some things to a format I prefer.
 *
 * Kuroshiro https://www.npmjs.com/package/kuroshiro
 * This is a package that converts kanji to hiragana for me.
 */

type Languages =
    | "en"
    | "ja"

type Word = {
    [T in Exclude<Languages, "ja">]: string | string[]
} & {
    ja: {
        kanji: string
        hiragana: string
    } | {
        kanji: string
        hiragana: string
    }[]
}

type Wordlist = Word[]

const kuroshiro = new Kuroshiro()

async function toHiragana(kanjiString: string) {
    let hiragana = Kuroshiro.Util.kanaToHiragna(await kuroshiro.convert(kanjiString, { to: "hiragana" })) as string
    hiragana = hiragana
        .replace("かこがた", "かこけい")
        .replace("1にん", "ひとり")
        .replace("いなていけい", "ひていけい")
        .replace("へんかがた", "へんかけい")
        .replace("ふくすうがた", "ふくすうけい")
        .replace("かこぶんしがた", "かこぶんしけい")
    return hiragana
}

async function writeToFile(words: Wordlist, unit: string) {
    const wordsJSON = JSON.stringify(words, null, 2)
    // console.log(wordsJSON)
    return fs.writeFile(`output_${unit}.json`, wordsJSON, "utf-8")
}

async function run() {
    await kuroshiro.init(new KuromojiAnalyzer())
    const input = (await fs.readFile("C:\\Users\\Hyprk\\Desktop\\temp\\Junior Sunshine 6 wordlist.csv")).toString("utf-8")

    let words: Wordlist = []
    let last = undefined
    for (const csvWord of await CSV({ delimiter: "," }).fromString(input)) {
        if (csvWord.unit !== last) {
            if (last == undefined) {
                // It's our first word
                last = csvWord.unit
            } else {
                // Write wordlist to file
                await writeToFile(words, last)

                words = []
                last = csvWord.unit
            }
        }
        const original_en = (csvWord.english as string)
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
            .replace(/\s*\.\.\./, " ...")
        const original_ja = (csvWord.japanese as string)
            .trim()
            .replace(/\s*＝\s*/, " = ")

        const en: string[] = []
        const ja: {
            kanji: string
            hiragana: string
        }[] = []

        en.push(original_en)
        ja.push({
            "hiragana": await toHiragana(original_ja),
            "kanji": original_ja
        })

        const word: Word = {
            "en": en.length == 1 ? en[0] : en,
            "ja": ja.length == 1 ? ja[0] : ja
        }
        words.push(word)
    }

    await writeToFile(words, last)
}

run()