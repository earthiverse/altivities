import Kuroshiro from "kuroshiro"
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji"
import CSV from "csvtojson"

/**
 * This is a helper file I made to help me convert CSVs in a certain format to
 * JSON wordlists.
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

async function run() {
    const kuroshiro = new Kuroshiro()
    await kuroshiro.init(new KuromojiAnalyzer())

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
Phonics,top,頂上`

    const words: Wordlist = []
    for (const csvWord of await CSV({ delimiter: "," }).fromString(input)) {
        const word: Word = {
            "en": csvWord.english,
            "ja": {
                "hiragana": Kuroshiro.Util.kanaToHiragna(await kuroshiro.convert(csvWord.japanese, { to: "hiragana" })),
                "kanji": csvWord.japanese
            }
        }
        words.push(word)
    }
    const wordsJSON = JSON.stringify(words, null, 2)
    console.log(wordsJSON)
}

run()