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
    const input = `"unit","list","english","japanese","partOfSpeech"
"3","1","told","tell（言う）の過去形《過去分詞形も同形》","動"
"3","1","suitcase","スーツケース","名"
"3","2","musicalinstrument(s)","楽器","名"
"3","2","marathon","マラソン","名"
"3","3","picnic","ピクニック","名"
"3","3","relay","リレー（競走）","名"
"3","3","chosen","choose（選ぶ）の過去分詞形","動"
"3","3","lent","lend（貸す）の過去形《過去分詞形も同形》","動"
"3","3","stapler","ホッチキス","名"
"3","4","blossom(s)","（おもに果樹の）花","名"
"3","4","noon","正午","名"
"3","4","colorful","色彩に富んだ，カラフルな","形"
"3","4","wait for ~","～を待つ",""
"3","4","Here is ~.","これが～です。［ここに～があります。］",""
"3","4","in this way","このようにして",""
"3","5","home-made","自家製の","形"
"3","5","available","入手できる，利用できる","形"
"3","5","oyster(s)","カキ（貝）","名"
"3","5","fantastic","すばらしい，すてきな","形"
"3","5","more than ~","～以上",""
"3","6","variety","（a variety of ～で）さまざまな","名"
"3","6","well-balanced","バランスのとれた","形"
"3","6","nutrition","栄養","名"
"3","6","develop(ed)","発展させる，開発する","動"
"3","6","own","独自の","形"
"3","6","Mumbai","ムンバイ（インドの都市）","名"
"3","6","delivery","配達","名"
"3","6","service","サービス","名"
"3","6","deliver(ed)","配達する","動"
"3","6","workplace(s)","職場","名"
"3","6","different","違った，異なる","形"
"3","7","headache","頭痛","名"
"3","7","fever","高熱","名"
"3","7","chilly","寒くて身ぶるいするような","形"
"3","7","pain","痛み","名"
"3","7","medicine","薬","名"
"3","7","bandage","包帯","名"
"3","7","stomachache","腹痛，胃痛","名"
"3","7","least","little（少ない）の最上級","形"
"3","7","have a fever","熱がある",""
"3","7","right now","今すぐ",""
"3","7","at least","少なくとも",""
"3","8","calendar","カレンダー","名"
"3","8","poster","ポスター","名"
"3","8","headphones","（通例複数形で）ヘッドホン","名"
"3","8","carpet","カーペット，じゅうたん","名"
"3","8","curtain","カーテン","名"
"3","8","shirt","シャツ","名"
"3","8","vase","花びん","名"
"3","8","tie","ネクタイ","名"
"3","8","sweater","セーター","名"
"3","8","skirt","スカート","名"
"3","8","garden","花だん","名"
"3","8","air conditioner","エアコン","名"
"3","8","sofa","ソファ","名"
"3","9","spend(s)","（時間を）過ごす","動"
"3","9","brush","ブラシをかける","動"
"3","9","boil","（液体を）ふっとうさせる，わかす","動"
"3","9","toast","こんがりと焼く，トーストする","動"
"3","9","bread","パン","名"
"3","9","dryer","ドライヤー","名"
"3","9","mirror","鏡","名"
"3","9","restroom","トイレ","名"
"3","9","shutter","シャッター","名"
"3","9","fence","へい","名"
"3","10","journalist(s)","ジャーナリスト，報道記者","名"
"3","10","writing","文書，書かれたもの","名"
"3","10","publish","発行［出版］する","動"
"3","10","trust","信頼する","動"`;
    const words = [];
    for (const csvWord of await (0, csvtojson_1.default)({ delimiter: "," }).fromString(input)) {
        csvWord.english = csvWord.english.replace("’", "'");
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
