# Let's Play Bingo

## About

This is a simple 3x3 bingo card generator that you can use on a tablet (e.g. iPad) to play bingo.

When you load a wordlist, if you click on the `QR` button, you can have the students scan the QR code to make their own bingo sheet.

Students can drag the tiles from the right on to the bingo grid, or click the 'Random' button to automatically generate a card.

## Wordlists

### General

These wordlists have pictures (mostly from [Irasutoya](https://irasutoya.com)!) associated with them, which makes them nice to use with bingo:

* [Alphabet (26)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/alphabet.json)
* [Animals](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/animals.json)
* [Christmas (winter)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/winter.json)
* [Colors (11)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/colors.json)
* [Countries](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/countries.json)
  * [Junior Sunshine 6 - Lesson 3](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/JuniorSunshine6/lesson3.json)
  * [Junior Sunshine 6 - Lesson 3 + Canada](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/countries.json&include=the%20U.S.A.,Brazil,Japan,South%20Korea,China,India,the%20U.K.,France,Germany,Italy,Switzerland,Australia,Egypt,Kenya,Canada)
* [Halloween](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/halloween.json)
* [Months](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/months.json)
* [Numbers (1-20)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/numbers.json)
  * [Ordinals (1st-31st)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/ordinals.json)
* [Occupations (Junior Sunshine 6 - Lesson 10)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/JuniorSunshine6/lesson10.json)
* [Prefectures](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/Hepburn/prefectures.json)
* [Sports](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/sports.json)
* [Stationery](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/stationery.json)
* [Valentine's Day](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/valentines.json)

### Let's Try 1 Cards

* Unit 6
  * [Alphabet (Uppercase) (26)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/LetsTry1/unit6_cards.json)
* Unit 7
  * [Colored Shapes (28)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/LetsTry1/unit7_cards.json)

### Let's Try 2 Cards

* Unit 5
  * [Stationery (12)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/LetsTry2/unit5_cards.json)

### Junior Sunshine 5 Cards

These wordlists have pictures that match with the cards available in the back of the textbook.

* [Alphabet (Uppercase) (26)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/JuniorSunshine5/alphabet_uppercase_cards.json)
* [Phonics (16)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/JuniorSunshine5/phonics_cards.json)
* Lesson 2
  * [Months (12)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/JuniorSunshine5/lesson2_cards.json)
* Lesson 3
  * [All (19)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/JuniorSunshine5/lesson3_cards.json)
  * [Subjects (14)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/JuniorSunshine5/lesson3_cards.json&ignore=doctor,soccer%20player,police%20officer,florist,teacher)

### Junior Sunshine 6 Cards

These wordlists have pictures that match with the cards available in the back of the textbook.

* [Alphabet (Uppercase)](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/JuniorSunshine5/alphabet_uppercase_cards.json)
* [Phonics](https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/JuniorSunshine5/phonics_cards.json)

## Custom Wordlists

Please see the [wordlist documentation](../wordlists/) to see how to make your own wordlist.

After uploading your wordlist to the web, change the path to the wordlist in the URL: `https://altivities.earthiverse.ca/bingo/?wordlist=<path-to-url-here>`

## Multiple Wordlists

Use the following URL pattern to combine multiple wordlists:
`https://altivities.earthiverse.ca/bingo/?wordlists=<path-to-url-1-here>,<path-to-url-2-here>,<...>`

## Ignoring (Excluding) Words

You can ignore words from your wordlist(s) by adding `&ignore=<word 1>,<word 2>,<...>` to the URL.

Example: <https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/numbers.json&ignore=one,three,five>

## Filtering (Including) Words

**NOTE**: This is not for including *extra* words. To do that, you need to add an additional wordlist, or modify the wordlist to include more words.

**NOTE**: You need a minimum of nine words to play bingo, so the URL can get quite long.

You can specify the set of words you want to use by adding `&include=<word 1>,<word 2>,<...>` to the URL.

Example: <https://altivities.earthiverse.ca/bingo/?wordlist=../wordlists/General/numbers.json&include=ten,eleven,twelve,thirteen,fourteen,fifteen,sixteen,seventeen,eighteen,nineteen,twenty>
