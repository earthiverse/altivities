# Let's put things in order

## About

This is a simple "game" that you can use to to have students put cards in order.

You can share the page to another device by clicking the red `QR` code button at the bottom of the screen.

## Wordlists

### General

These wordlists have pictures (mostly from [Irasutoya](https://irasutoya.com)!) associated with them, which makes them nice to use

* [Alphabet](https://altivities.earthiverse.ca/order/?wordlist=../wordlists/General/alphabet.json&order=A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z)
* [Months](https://altivities.earthiverse.ca/order/?wordlist=../wordlists/General/months.json&order=January,February,March,April,May,June,July,August,September,October,November,December)

### Junior Sunshine 5

These wordlists have pictures that match with the cards available in the back of the textbook.

* Lesson 1
  [Let's Play 2-1 (Alphabet (Uppercase))](https://altivities.earthiverse.ca/order/?wordlist=../wordlists/JuniorSunshine5/alphabet_uppercase_cards.json&order=A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z)
* Lesson 2
  * [Let's Play 3 (Months)](https://altivities.earthiverse.ca/order/?wordlist=../wordlists/JuniorSunshine5/lesson2_cards.json&order=January,February,March,April,May,June,July,August,September,October,November,December)

### Junior Sunshine 6

These wordlists have pictures that match with the cards available in the back of the textbook.

* [Alphabet (Uppercase)](https://altivities.earthiverse.ca/order/?wordlist=../wordlists/JuniorSunshine5/alphabet_uppercase_cards.json)
* [Phonics](https://altivities.earthiverse.ca/order/?wordlist=../wordlists/JuniorSunshine5/phonics_cards.json)

## Ordering

### Custom Order

You can specify the order of the words by adding `&order=<word 1>,<word 2>,<...>` to the URL. You don't need to use all cards, a subset of cards is fine.

### Specifying the number of boxes

If you want to have some flexibility to do class activities with a certain number of boxes to check the ordering manually in class (i.e. no `check` button), you can specify the number of boxes by adding `&order=<number of boxes>` (e.g.: `&order=4` for four boxes) to the URL.

## Custom Wordlists

Please see the [wordlist documentation](../wordlists/) to see how to make your own wordlist.

After uploading your wordlist to the web, change the path to the wordlist in the URL: `https://altivities.earthiverse.ca/order/?wordlist=<path-to-url-here>`

## Multiple Wordlists

Use the following URL pattern to combine multiple wordlists:
`https://altivities.earthiverse.ca/order/?wordlists=<path-to-url-1-here>,<path-to-url-2-here>,<...>`

## Ignoring (Excluding) Words

You can ignore words from your wordlist(s) by adding `&ignore=<word 1>,<word 2>,<...>` to the URL.

Example: <https://altivities.earthiverse.ca/order/?wordlist=../wordlists/General/numbers.json&ignore=one,three,five>

## Filtering (Including) Words

**NOTE**: This is not for including *extra* words. To do that, you need to add an additional wordlist, or modify the wordlist to include more words.

You can specify the set of words you want to use by adding `&include=<word 1>,<word 2>,<...>` to the URL.

Example: <https://altivities.earthiverse.ca/order/?wordlist=../wordlists/General/numbers.json&include=ten,eleven,twelve,thirteen,fourteen,fifteen,sixteen,seventeen,eighteen,nineteen,twenty>
