"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chooseNewRandomWord = exports.prepareWordlist = exports.randomIntFromInterval = exports.WORDLISTS = exports.WORDLISTS_BASE_URL = void 0;
let PARAMETERS;
if (typeof window !== "undefined") {
    PARAMETERS = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => {
            const parameter = searchParams.get(prop);
            if (parameter)
                return parameter;
        }
    });
}
exports.WORDLISTS_BASE_URL = "https://altivities.earthiverse.ca/wordlists";
exports.WORDLISTS = {
    "General": {
        "Events": [
            {
                "name": "Christmas & Winter",
                "num_cards": 16,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/General/winter.json"
                ]
            },
            {
                "name": "Halloween",
                "num_cards": 20,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/General/halloween.json"
                ]
            },
            {
                "name": "Valentine's Day",
                "num_cards": 10,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/General/valentines.json"
                ]
            }
        ],
        "General": [
            {
                "name": "Alphabet",
                "num_cards": 26,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/General/alphabet.json"
                ]
            },
            {
                "name": "Animals",
                "num_cards": 10,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/General/animals.json"
                ]
            },
            {
                "name": "Colors",
                "num_cards": 11,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/General/colors.json"
                ]
            },
            {
                "name": "Countries",
                "num_cards": 26,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/General/countries.json"
                ]
            },
            {
                "name": "Months",
                "num_cards": 12,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/General/months.json"
                ]
            },
            {
                "name": "Numbers 1-20",
                "num_cards": 20,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/General/numbers.json"
                ]
            },
            {
                "name": "Occupations",
                "num_cards": 22,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson10.json"
                ]
            },
            {
                "name": "Ordinals 1st to 31st",
                "num_cards": 31,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/General/ordinals.json"
                ]
            },
            {
                "name": "Prefectures",
                "num_cards": 47,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/Hepburn/prefectures.json"
                ]
            },
            {
                "name": "Sports",
                "num_cards": 14,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/General/sports.json"
                ]
            },
            {
                "name": "Stationery",
                "num_cards": 16,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/General/stationery.json"
                ]
            }
        ]
    },
    "Let's Try 1": {
        "Unit 3": [
            {
                "name": "All",
                "num_cards": 23,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit3_cards.json"
                ]
            },
            {
                "ignore": [
                    "strawberry",
                    "apple",
                    "tomato"
                ],
                "name": "Numbers 1-20",
                "num_cards": 20,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit3_cards.json"
                ]
            },
            {
                "include": [
                    "strawberry",
                    "apple",
                    "tomato"
                ],
                "name": "Fruits + 'tomato'",
                "num_cards": 3,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit3_cards.json"
                ]
            }
        ],
        "Unit 4": [
            {
                "name": "All",
                "num_cards": 23,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json"
                ]
            },
            {
                "include": [
                    "red",
                    "yellow",
                    "blue",
                    "green",
                    "purple",
                    "orange",
                    "pink",
                    "brown",
                    "white",
                    "black"
                ],
                "name": "Colors",
                "num_cards": 10,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json"
                ]
            },
            {
                "include": [
                    "baseball",
                    "dodgeball",
                    "soccer",
                    "basketball",
                    "swimming"
                ],
                "name": "Sports",
                "num_cards": 5,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json"
                ]
            },
            {
                "include": [
                    "ice cream",
                    "pudding",
                    "milk",
                    "orange juice",
                    "onion",
                    "green pepper",
                    "cucumber",
                    "carrot"
                ],
                "name": "Food & Drinks",
                "num_cards": 8,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json"
                ]
            }
        ],
        "Unit 5": [
            {
                "name": "All",
                "num_cards": 21,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json"
                ]
            },
            {
                "include": [
                    "hamburger",
                    "pizza",
                    "spaghetti",
                    "sushi",
                    "steak",
                    "salad",
                    "cake",
                    "egg",
                    "jam",
                    "noodle",
                    "rice ball"
                ],
                "name": "Food",
                "num_cards": 11,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json"
                ]
            },
            {
                "include": [
                    "ice cream",
                    "pudding",
                    "hamburger",
                    "pizza",
                    "spaghetti",
                    "sushi",
                    "steak",
                    "salad",
                    "cake",
                    "egg",
                    "jam",
                    "noodle",
                    "rice ball"
                ],
                "name": "Food (+ Unit 4 Food)",
                "num_cards": 13,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json"
                ]
            },
            {
                "include": [
                    "grapes",
                    "orange",
                    "pineapple",
                    "peach",
                    "melon",
                    "banana",
                    "kiwi fruit",
                    "lemon"
                ],
                "name": "Fruits",
                "num_cards": 8,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json"
                ]
            },
            {
                "include": [
                    "strawberry",
                    "apple",
                    "grapes",
                    "orange",
                    "pineapple",
                    "peach",
                    "melon",
                    "banana",
                    "kiwi fruit",
                    "lemon"
                ],
                "name": "Fruits (+ Unit 3 Fruits)",
                "num_cards": 10,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit3_cards.json",
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json"
                ]
            },
            {
                "include": [
                    "table tennis",
                    "volleyball"
                ],
                "name": "Sports",
                "num_cards": 2,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json"
                ]
            },
            {
                "include": [
                    "baseball",
                    "dodgeball",
                    "soccer",
                    "basketball",
                    "swimming",
                    "table tennis",
                    "volleyball"
                ],
                "name": "Sports (+ Unit 4 Sports)",
                "num_cards": 7,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json"
                ]
            }
        ],
        "Unit 6": [
            {
                "name": "Uppercase Alphabet",
                "num_cards": 26,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit6_cards.json"
                ]
            }
        ],
        "Unit 7": [
            {
                "name": "Colored Shapes",
                "notes": "The original cards don't have English, they only have the picture.",
                "num_cards": 28,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit7_cards.json"
                ]
            }
        ],
        "Unit 8": [
            {
                "name": "Animals (+ 'tree)",
                "num_cards": 6,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit8_cards.json"
                ]
            }
        ],
        "Unit 9": [
            {
                "name": "All",
                "num_cards": 28,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json"
                ]
            },
            {
                "include": [
                    "mouse",
                    "cow",
                    "tiger",
                    "rabbit",
                    "dragon",
                    "snake",
                    "horse",
                    "sheep",
                    "monkey",
                    "chicken",
                    "dog",
                    "wild boar"
                ],
                "name": "Animals",
                "num_cards": 12,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json"
                ]
            },
            {
                "include": [
                    "cat",
                    "panda",
                    "bear",
                    "spider",
                    "elephant",
                    "mouse",
                    "cow",
                    "tiger",
                    "rabbit",
                    "dragon",
                    "snake",
                    "horse",
                    "sheep",
                    "monkey",
                    "chicken",
                    "dog",
                    "wild boar"
                ],
                "name": "Animals (+ Unit 8 Animals)",
                "num_cards": 17,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit8_cards.json",
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json"
                ]
            },
            {
                "include": [
                    "head",
                    "shoulders",
                    "knees",
                    "toes",
                    "ears",
                    "eyes",
                    "mouth",
                    "nose"
                ],
                "name": "Body Parts",
                "num_cards": 8,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json"
                ]
            },
            {
                "include": [
                    "long",
                    "short",
                    "big",
                    "small",
                    "scary",
                    "furry",
                    "round",
                    "shiny"
                ],
                "name": "Adjectives",
                "num_cards": 8,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json"
                ]
            }
        ]
    },
    "Let's Try 2": {
        "Unit 2": [
            {
                "name": "All",
                "num_cards": 16,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit2_cards.json"
                ]
            },
            {
                "include": [
                    "sunny",
                    "cloudy",
                    "rainy",
                    "snowy",
                    "hot",
                    "cold"
                ],
                "name": "Weather",
                "num_cards": 6,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit2_cards.json"
                ]
            },
            {
                "include": [
                    "shorts",
                    "shirt",
                    "pants",
                    "jacket",
                    "boots",
                    "cap"
                ],
                "name": "Clothing",
                "num_cards": 6,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit2_cards.json"
                ]
            },
            {
                "include": [
                    "play tag",
                    "play cards",
                    "play dodgeball",
                    "make a snowman"
                ],
                "name": "Activities",
                "num_cards": 4,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit2_cards.json"
                ]
            }
        ],
        "Unit 3": [
            {
                "name": "Weekdays",
                "num_cards": 7,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit3_cards.json"
                ]
            }
        ],
        "Unit 4": [
            {
                "name": "All",
                "num_cards": 15,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit4_cards.json"
                ]
            },
            {
                "ignore": [
                    "6 o'clock",
                    "12 o'clock",
                    "3 o'clock",
                    "8 o'clock",
                    "10 o'clock"
                ],
                "name": "~ time",
                "num_cards": 10,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit4_cards.json"
                ]
            },
            {
                "include": [
                    "6 o'clock",
                    "12 o'clock",
                    "3 o'clock",
                    "8 o'clock",
                    "10 o'clock"
                ],
                "name": "~ o'clock",
                "notes": "The original cards don't have English, they only have the picture.",
                "num_cards": 5,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit4_cards.json"
                ]
            }
        ],
        "Unit 5": [
            {
                "name": "Stationery",
                "num_cards": 12,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit5_cards.json"
                ]
            }
        ],
        "Unit 6": [
            {
                "name": "All",
                "num_cards": 63,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit6_cards.json"
                ]
            },
            {
                "include": [
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                    "n",
                    "o",
                    "p",
                    "q",
                    "r",
                    "s",
                    "t",
                    "u",
                    "v",
                    "w",
                    "x",
                    "y",
                    "z"
                ],
                "name": "Lowercase Alphabet",
                "num_cards": 26,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit6_cards.json"
                ]
            },
            {
                "name": "Uppercase Alphabet",
                "num_cards": 26,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit6_cards.json"
                ]
            },
            {
                "ignore": [
                    "bus stop",
                    "up",
                    "down",
                    "taxi",
                    "telephone",
                    "station",
                    "news",
                    "juice",
                    "school",
                    "ice cream",
                    "flowers"
                ],
                "name": "Lowercase & Uppercase Alphabet",
                "num_cards": 52,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit6_cards.json"
                ]
            },
            {
                "include": [
                    "bus stop",
                    "up",
                    "down",
                    "taxi",
                    "telephone",
                    "station",
                    "news",
                    "juice",
                    "school",
                    "ice cream",
                    "flowers"
                ],
                "name": "Words",
                "num_cards": 11,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit6_cards.json"
                ]
            }
        ],
        "Unit 7": [
            {
                "name": "All",
                "num_cards": 19,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json"
                ]
            },
            {
                "include": [
                    "onion",
                    "mushroom",
                    "potato",
                    "tomato",
                    "cabbage",
                    "corn",
                    "carrot",
                    "cucumber",
                    "green pepper"
                ],
                "name": "Vegetables",
                "num_cards": 9,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json"
                ]
            },
            {
                "include": [
                    "onion",
                    "mushroom",
                    "potato",
                    "tomato",
                    "cabbage",
                    "corn",
                    "carrot",
                    "cucumber",
                    "green pepper",
                    "sausage"
                ],
                "name": "Vegetables (+ 'sausage')",
                "num_cards": 10,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json"
                ]
            },
            {
                "include": [
                    "melon",
                    "peach",
                    "banana",
                    "apple",
                    "pineapple",
                    "orange",
                    "strawberry",
                    "cherry",
                    "kiwi fruit"
                ],
                "name": "Fruits",
                "num_cards": 9,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json"
                ]
            },
            {
                "include": [
                    "grapes",
                    "lemon",
                    "melon",
                    "peach",
                    "banana",
                    "apple",
                    "pineapple",
                    "orange",
                    "strawberry",
                    "cherry",
                    "kiwi fruit"
                ],
                "name": "Fruits (+ Let's Try 1 Fruits)",
                "num_cards": 11,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json"
                ]
            }
        ],
        "Unit 8": [
            {
                "name": "School Rooms & Places",
                "num_cards": 14,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit8_cards.json"
                ]
            }
        ],
        "Unit 9": [
            {
                "name": "Daily Routine",
                "num_cards": 10,
                "wordlists": [
                    "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit9_cards.json"
                ]
            }
        ]
    }
};
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.randomIntFromInterval = randomIntFromInterval;
async function prepareWordlist(options = {
    ignore: PARAMETERS.ignore,
    include: PARAMETERS.include,
    wordlist: PARAMETERS.wordlist,
    wordlists: PARAMETERS.wordlists
}) {
    let combinedWordlist = [];
    if (options.wordlist) {
        const response = await fetch(options.wordlist);
        const wordlist = await response.json();
        combinedWordlist.push(...wordlist);
    }
    if (options.wordlists) {
        for (const url of options.wordlists.split(",")) {
            const response = await fetch(url);
            const wordlist = await response.json();
            combinedWordlist.push(...wordlist);
        }
    }
    if (options.ignore) {
        const toIgnore = options.ignore.split(",");
        for (let i = 0; i < combinedWordlist.length; i++) {
            const word = combinedWordlist[i];
            for (const ignoreWord of toIgnore) {
                if (word.en == ignoreWord
                    || (Array.isArray(word.en) && word.en[0] == ignoreWord)) {
                    combinedWordlist.splice(i, 1);
                    i -= 1;
                    break;
                }
            }
        }
    }
    if (options.include) {
        const toInclude = options.include.split(",");
        const newCombined = [];
        while (toInclude.length > 0) {
            const includeWord = toInclude.shift();
            let found = false;
            for (const word of combinedWordlist) {
                if (word.en == includeWord
                    || (Array.isArray(word.en) && word.en[0] == includeWord)) {
                    newCombined.push(word);
                    found = true;
                    break;
                }
                if (Array.isArray(word.en)) {
                    for (let j = 0; j < word.en.length; j++) {
                        const alternativeWord = word.en[j];
                        if (alternativeWord !== includeWord)
                            continue;
                        word.en = alternativeWord;
                        newCombined.push(word);
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                newCombined.push({
                    en: includeWord,
                    ja: {
                        hiragana: "???",
                        kanji: "???"
                    }
                });
            }
        }
        combinedWordlist = newCombined;
    }
    return combinedWordlist;
}
exports.prepareWordlist = prepareWordlist;
const TO_CHOOSE = new Map();
function chooseNewRandomWord(from) {
    let toChoose = TO_CHOOSE.get(from);
    if (!toChoose || toChoose.length == 0) {
        toChoose = [];
        for (let i = 0; i < from.length; i++)
            toChoose.push(i);
        TO_CHOOSE.set(from, toChoose);
    }
    const randomIndex = randomIntFromInterval(0, toChoose.length - 1);
    return from[toChoose.splice(randomIndex, 1)[0]];
}
exports.chooseNewRandomWord = chooseNewRandomWord;
