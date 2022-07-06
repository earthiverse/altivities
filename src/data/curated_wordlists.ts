export type CuratedWordLists = {
  /** Category */
  [T in string]: {
    /** Subcategory */
    [T in string]: {
      name: string;
      wordlists: string[];
      ignore?: string[];
      include?: string[];
      num_cards?: number;
      notes?: string;
    }[];
  };
};

export const ALTIVITIES_BASE_URL =
  "https://altivities.earthiverse.ca/wordlists";

/**
 * NOTE: If you change this, you can run `tools/get_counts` to verify it and make it pretty
 */
export const CURATED_WORD_LISTS: CuratedWordLists = {
  General: {
    Events: [
      {
        name: "Christmas & Winter",
        num_cards: 16,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/winter.json",
        ],
      },
      {
        name: "Halloween",
        num_cards: 20,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/halloween.json",
        ],
      },
      {
        name: "Valentine's Day",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/valentines.json",
        ],
      },
    ],
    General: [
      {
        name: "Alphabet",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/alphabet.json",
        ],
      },
      {
        name: "Animals",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/animals.json",
        ],
      },
      {
        name: "Colors",
        num_cards: 11,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/colors.json",
        ],
      },
      {
        name: "Countries",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/countries.json",
        ],
      },
      {
        name: "Months",
        num_cards: 12,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/months.json",
        ],
      },
      {
        name: "Numbers 1-20",
        num_cards: 20,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/numbers.json",
        ],
      },
      {
        name: "Occupations",
        num_cards: 22,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson10.json",
        ],
      },
      {
        name: "Ordinals 1st to 31st",
        num_cards: 31,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/ordinals.json",
        ],
      },
      {
        name: "Prefectures",
        num_cards: 47,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/Hepburn/prefectures.json",
        ],
      },
      {
        name: "Sports",
        num_cards: 14,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/sports.json",
        ],
      },
      {
        name: "Stationery",
        num_cards: 16,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/stationery.json",
        ],
      },
    ],
  },
  "Let's Try 1": {
    "Unit 3": [
      {
        name: "All",
        num_cards: 23,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit3_cards.json",
        ],
      },
      {
        ignore: ["strawberry", "apple", "tomato"],
        name: "Numbers 1-20",
        num_cards: 20,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit3_cards.json",
        ],
      },
      {
        include: ["strawberry", "apple", "tomato"],
        name: "Fruits + 'tomato'",
        num_cards: 3,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit3_cards.json",
        ],
      },
    ],
    "Unit 4": [
      {
        name: "All",
        num_cards: 23,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
        ],
      },
      {
        include: [
          "red",
          "yellow",
          "blue",
          "green",
          "purple",
          "orange",
          "pink",
          "brown",
          "white",
          "black",
        ],
        name: "Colors",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
        ],
      },
      {
        include: ["baseball", "dodgeball", "soccer", "basketball", "swimming"],
        name: "Sports",
        num_cards: 5,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
        ],
      },
      {
        include: [
          "ice cream",
          "pudding",
          "milk",
          "orange juice",
          "onion",
          "green pepper",
          "cucumber",
          "carrot",
        ],
        name: "Food & Drinks",
        num_cards: 8,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
        ],
      },
    ],
    "Unit 5": [
      {
        name: "All",
        num_cards: 21,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
      {
        include: [
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
          "rice ball",
        ],
        name: "Food",
        num_cards: 11,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
      {
        include: [
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
          "rice ball",
        ],
        name: "Food (+ Unit 4 Food)",
        num_cards: 13,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
      {
        include: [
          "grapes",
          "orange",
          "pineapple",
          "peach",
          "melon",
          "banana",
          "kiwi fruit",
          "lemon",
        ],
        name: "Fruits",
        num_cards: 8,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
      {
        include: [
          "strawberry",
          "apple",
          "grapes",
          "orange",
          "pineapple",
          "peach",
          "melon",
          "banana",
          "kiwi fruit",
          "lemon",
        ],
        name: "Fruits (+ Unit 3 Fruits)",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit3_cards.json",
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
      {
        include: ["table tennis", "volleyball"],
        name: "Sports",
        num_cards: 2,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
      {
        include: [
          "baseball",
          "dodgeball",
          "soccer",
          "basketball",
          "swimming",
          "table tennis",
          "volleyball",
        ],
        name: "Sports (+ Unit 4 Sports)",
        num_cards: 7,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
    ],
    "Unit 6": [
      {
        name: "Uppercase Alphabet",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit6_cards.json",
        ],
      },
    ],
    "Unit 7": [
      {
        name: "Colored Shapes",
        notes:
          "The original cards don't have English, they only have the picture.",
        num_cards: 28,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit7_cards.json",
        ],
      },
    ],
    "Unit 8": [
      {
        name: "Animals (+ 'tree)",
        num_cards: 6,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit8_cards.json",
        ],
      },
    ],
    "Unit 9": [
      {
        name: "All",
        num_cards: 28,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json",
        ],
      },
      {
        include: [
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
          "wild boar",
        ],
        name: "Animals",
        num_cards: 12,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json",
        ],
      },
      {
        include: [
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
          "wild boar",
        ],
        name: "Animals (+ Unit 8 Animals)",
        num_cards: 17,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit8_cards.json",
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json",
        ],
      },
      {
        include: [
          "head",
          "shoulders",
          "knees",
          "toes",
          "ears",
          "eyes",
          "mouth",
          "nose",
        ],
        name: "Body Parts",
        num_cards: 8,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json",
        ],
      },
      {
        include: [
          "long",
          "short",
          "big",
          "small",
          "scary",
          "furry",
          "round",
          "shiny",
        ],
        name: "Adjectives",
        num_cards: 8,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json",
        ],
      },
    ],
  },
  "Let's Try 2": {
    "Unit 2": [
      {
        name: "All",
        num_cards: 16,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit2_cards.json",
        ],
      },
      {
        include: ["sunny", "cloudy", "rainy", "snowy", "hot", "cold"],
        name: "Weather",
        num_cards: 6,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit2_cards.json",
        ],
      },
      {
        include: ["shorts", "shirt", "pants", "jacket", "boots", "cap"],
        name: "Clothing",
        num_cards: 6,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit2_cards.json",
        ],
      },
      {
        include: ["play tag", "play cards", "play dodgeball", "make a snowman"],
        name: "Activities",
        num_cards: 4,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit2_cards.json",
        ],
      },
    ],
    "Unit 3": [
      {
        name: "Weekdays",
        num_cards: 7,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit3_cards.json",
        ],
      },
    ],
    "Unit 4": [
      {
        name: "All",
        num_cards: 15,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit4_cards.json",
        ],
      },
      {
        ignore: [
          "6 o'clock",
          "12 o'clock",
          "3 o'clock",
          "8 o'clock",
          "10 o'clock",
        ],
        name: "~ time",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit4_cards.json",
        ],
      },
      {
        include: [
          "6 o'clock",
          "12 o'clock",
          "3 o'clock",
          "8 o'clock",
          "10 o'clock",
        ],
        name: "~ o'clock",
        notes:
          "The original cards don't have English, they only have the picture.",
        num_cards: 5,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit4_cards.json",
        ],
      },
    ],
    "Unit 5": [
      {
        name: "Stationery",
        num_cards: 12,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit5_cards.json",
        ],
      },
    ],
    "Unit 6": [
      {
        name: "All",
        num_cards: 63,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit6_cards.json",
        ],
      },
      {
        include: [
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
          "z",
        ],
        name: "Lowercase Alphabet",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit6_cards.json",
        ],
      },
      {
        name: "Uppercase Alphabet",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit6_cards.json",
        ],
      },
      {
        ignore: [
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
          "flowers",
        ],
        name: "Lowercase & Uppercase Alphabet",
        num_cards: 52,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit6_cards.json",
        ],
      },
      {
        include: [
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
          "flowers",
        ],
        name: "Words",
        num_cards: 11,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit6_cards.json",
        ],
      },
    ],
    "Unit 7": [
      {
        name: "All",
        num_cards: 19,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json",
        ],
      },
      {
        include: [
          "onion",
          "mushroom",
          "potato",
          "tomato",
          "cabbage",
          "corn",
          "carrot",
          "cucumber",
          "green pepper",
        ],
        name: "Vegetables",
        num_cards: 9,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json",
        ],
      },
      {
        include: [
          "onion",
          "mushroom",
          "potato",
          "tomato",
          "cabbage",
          "corn",
          "carrot",
          "cucumber",
          "green pepper",
          "sausage",
        ],
        name: "Vegetables (+ 'sausage')",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json",
        ],
      },
      {
        include: [
          "melon",
          "peach",
          "banana",
          "apple",
          "pineapple",
          "orange",
          "strawberry",
          "cherry",
          "kiwi fruit",
        ],
        name: "Fruits",
        num_cards: 9,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json",
        ],
      },
      {
        include: [
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
          "kiwi fruit",
        ],
        name: "Fruits (+ Let's Try 1 Fruits)",
        num_cards: 11,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json",
        ],
      },
    ],
    "Unit 8": [
      {
        name: "School Rooms & Places",
        num_cards: 14,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit8_cards.json",
        ],
      },
    ],
    "Unit 9": [
      {
        name: "Daily Routine",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit9_cards.json",
        ],
      },
    ],
  },
  "Junior Sunshine 5": {
    Alphabet: [
      {
        name: "Lowercase (a-z)",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/alphabet_lowercase_cards.json",
        ],
      },
      {
        name: "Uppercase (A-Z)",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/alphabet_uppercase_cards.json",
        ],
      },
      {
        name: "Lowercase & Uppercase (a-z, A-Z)",
        num_cards: 52,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/alphabet_lowercase_cards.json",
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/alphabet_uppercase_cards.json",
        ],
      },
      {
        name: "Alphabet Words",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/alphabet_words.json",
        ],
      },
    ],
    "Lesson 2": [
      {
        name: "Months",
        num_cards: 12,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/lesson2_cards.json",
        ],
      },
    ],
    "Lesson 3": [
      {
        name: "All",
        num_cards: 19,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/lesson3_cards.json",
        ],
      },
      {
        name: "Occupations",
        num_cards: 5,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/lesson3_cards.json",
        ],
        include: [
          "doctor",
          "soccer player",
          "police officer",
          "florist",
          "teacher",
        ],
      },
      {
        name: "Subjects",
        num_cards: 14,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/lesson3_cards.json",
        ],
        ignore: [
          "doctor",
          "soccer player",
          "police officer",
          "florist",
          "teacher",
        ],
      },
    ],
    "Lesson 8": [
      {
        name: "All",
        num_cards: 22,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/lesson8_cards.json",
        ],
      },
      {
        name: "Food",
        num_cards: 15,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/lesson8_cards.json",
        ],
        ignore: [
          "milk",
          "soda",
          "juice",
          "mineral water",
          "tea",
          "coffee",
          "Japanese tea",
        ],
      },
      {
        name: "Drinks",
        num_cards: 7,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/lesson8_cards.json",
        ],
        include: [
          "milk",
          "soda",
          "juice",
          "mineral water",
          "tea",
          "coffee",
          "Japanese tea",
        ],
      },
    ],
    "Lesson 9": [
      {
        name: "Opposites",
        num_cards: 14,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine5/lesson9_cards.json",
        ],
      },
    ],
  },
  "Junior Sunshine 6": {
    "Lesson 2": [
      {
        name: "Actions",
        num_cards: 8,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson2_cards.json",
        ],
      },
    ],
    "Lesson 3": [
      {
        name: "All",
        num_cards: 8,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson3_cards.json",
        ],
      },
      {
        name: "Food",
        num_cards: 4,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson3_cards.json",
        ],
        include: ["sushi", "gyoza", "curry and naan", "cheeseburger"],
      },
      {
        name: "Places",
        num_cards: 4,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson3_cards.json",
        ],
        ignore: ["sushi", "gyoza", "curry and naan", "cheeseburger"],
      },
    ],
    "Lesson 6": [
      {
        name: "All",
        num_cards: 25,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson6_cards.json",
        ],
      },
      {
        name: "Words",
        num_cards: 20,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson6_cards.json",
        ],
        ignore: ["I saw", "I enjoyed", "I went to", "I ate", "It was"],
      },
      {
        name: "Sentence Starters",
        num_cards: 20,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson6_cards.json",
        ],
        include: ["I saw", "I enjoyed", "I went to", "I ate", "It was"],
      },
      {
        name: '"I went to ~" Words',
        num_cards: 4,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson6_cards.json",
        ],
        include: [
          "the zoo",
          "the swimming pool",
          "my grandmother's house",
          "a festival",
        ],
      },
      {
        name: '"I ate to ~" Words',
        num_cards: 4,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson6_cards.json",
        ],
        include: ["watermelon", "somen", "sushi", "ice cream"],
      },
      {
        name: '"I saw ~" Words',
        num_cards: 4,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson6_cards.json",
        ],
        include: ["pandas", "beetles", "the Milky Way", "fireworks"],
      },
      {
        name: '"I enjoyed ~" Words',
        num_cards: 4,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson6_cards.json",
        ],
        include: ["shopping", "camping", "swimming", "barbecuing"],
      },
      {
        name: '"It was ~" Words',
        num_cards: 4,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson6_cards.json",
        ],
        include: ["nice", "beautiful", "cute", "fun"],
      },
    ],
  },
};
