# Wordlists

These are wordlists in the `JSON` format that you can use for your own projects however you want.

## Format

The words in the wordlist have [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) tags.

The `ja` tag is an object with `kanji` and `hiragana` properties.

### Typescript

The wordlist can be expressed as the following in Typescript:

```ts
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
```

## Examples

### One correct answer

If there is only one correct answer, the answer is a simple string.

```json
{
    "en": "January",
    "ja": {
        "kanji": "一月",
        "hiragana": "いちがつ"
    }
}
```

### Multiple correct answers (English)

If there are multiple correct answers, the answers are put in an array. The following word accepts both `fall` or `autumn` for the Japanese word `秋`.

```json
{
    "en": [
        "fall",
        "autumn"
    ],
    "ja": {
        "kanji": "秋",
        "hiragana": "あき"
    }
}
```

### Multiple correct answers (Japanese)

If there are multiple answers for the Japanese words, the list is an array of objects.

```json
{
    "en": "Japanese",
    "ja": [
        {
            "hiragana": "こくご",
            "kanji": "国語"
        },
        {
            "hiragana": "にほんご",
            "kanji": "日本語"
        }
    ]
}
```
