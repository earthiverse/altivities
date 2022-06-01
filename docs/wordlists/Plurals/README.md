# Plural Wordlists

These are special wordlists specifically for plural words in the `JSON` format that you can use for your own projects however you want.

## Access

You should be able to access the wordlists from [https://altivities.earthiverse.ca/wordlists/Plurals/](https://altivities.earthiverse.ca/wordlists/Plurals/) if you provide the same relative path.

**NOTE**: The path is case sensitive.

Example: [https://altivities.earthiverse.ca/wordlists/Plurals/fruits.json](https://altivities.earthiverse.ca/wordlists/Plurals/fruits.json)

### Typescript

The wordlist can be expressed as the following in Typescript:

```ts
type PluralWord = {
  singular: {
    en: string
    image?: string
  }
  plural: {
    en: string
    image?: string
  }
}

type PluralWordlist = PluralWord[]
```

## Examples

### Apple / Apples

```json
{
    "singular": {
        "en": "apple",
        "image": "https://4.bp.blogspot.com/-uY6ko43-ABE/VD3RiIglszI/AAAAAAAAoEA/kI39usefO44/s8192/fruit_ringo.png"
    },
    "plural": {
        "en": "apples",
        "image": "https://altivities.earthiverse.ca/wordlists/General/images/custom_irasutoya/apples.png"
    }
}
```
