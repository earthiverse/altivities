# Let's Play Memory

## About

This is a simple multiplayer memory game that you can use on a tablet (e.g. iPad) to play memory.

Players can tap on the cards to flip them over. If they match, they get one point.

## Setup

1. Choose a wordlist from below, or customize your URL and load the page. Do not enter a username.
2. Have each group choose one host (group leader).
3. Click on the QR button in the bottom right, and get hosts to scan the **red QR code** that displays.
4. Have the hosts enter their username.
5. Have the remaining players scan their host's **blue QR code**.

## Wordlists

These wordlists have pictures associated with them, which makes them nice to use with memory:

* [Alphabet](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/alphabet.json)
* [Animals](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/animals.json)
* [Christmas (winter)](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/winter.json)
* [Colors](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/colors.json)
* [Countries](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/countries.json)
  * [Junior Sunshine 6 - Lesson 3](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/JuniorSunshine6/lesson3.json)
  * [Junior Sunshine 6 - Lesson 3 + Canada](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/countries.json&include=the%20U.S.A.,Brazil,Japan,South%20Korea,China,India,the%20U.K.,France,Germany,Italy,Switzerland,Australia,Egypt,Kenya,Canada)
* [Halloween](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/halloween.json)
* [Numbers (1-20)](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/numbers.json)
* [Occupations (Junior Sunshine 6 - Lesson 10)](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/JuniorSunshine6/lesson10.json)
* [Prefectures](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/Hepburn/prefectures.json)
* [Sports](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/sports.json)
* [Stationery](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/stationery.json)
* [Valentine's Day](https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/valentines.json)

## Custom Wordlists

Please see the [wordlist documentation](../wordlists/) to see how to make your own wordlist.

After uploading your wordlist to the web, change the path to the wordlist in the URL: `https://altivities.earthiverse.ca/memory/?wordlist=<path-to-url-here>`

## Multiple Wordlists

Use the following URL pattern to combine multiple wordlists:
`https://altivities.earthiverse.ca/memory/?wordlists=<path-to-url-1-here>,<path-to-url-2-here>,<...>`

## Ignoring (Excluding) Words

You can ignore words from your wordlist(s) by adding `&ignore=<word 1>,<word 2>,<...>` to the URL.

Example: <https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/numbers.json&ignore=one,three,five>

## Filtering (Including) Words

**NOTE**: This is not for including *extra* words. To do that, you need to add an additional wordlist, or modify the wordlist to include more words.

**NOTE**: There is currently a maximum of 10 words, but they will be chosen randomly, so you can specify more than 10 words.

You can specify the set of words you want to use by adding `&include=<word 1>,<word 2>,<...>` to the URL.

Example: <https://altivities.earthiverse.ca/memory/?wordlist=../wordlists/General/numbers.json&include=ten,eleven,twelve,thirteen,fourteen,fifteen,sixteen,seventeen,eighteen,nineteen,twenty>
