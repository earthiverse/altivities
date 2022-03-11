"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const categories = {
    gen: {
        name: "General",
        wordlists: {
            animals: {
                description: "Animals",
                file: "../wordlists/General/animals.json"
            },
            colors: {
                description: "Colors",
                file: "../wordlists/General/colors.json"
            }
        }
    },
    hep: {
        art: "images/categories/hepburn.png",
        name: "Hepburn Romaji",
        wordlists: {
            hep_english: {
                description: "English Words from Japanese",
                file: "../wordlists/Hepburn/english.json"
            },
            hep_prefectures: {
                description: "Prefectures of Japan",
                file: "../wordlists/Hepburn/prefectures.json"
            }
        }
    },
    js5: {
        art: "images/categories/js5.jpg",
        name: "Junior Sunshine 5",
        wordlists: {
            js5_alphabet: {
                description: "Junior Sunshine 5 - Alphabet",
                file: "../wordlists/JuniorSunshine5/alphabet.json"
            },
            js5_l2: {
                description: "Junior Sunshine 5 - Lesson 2",
                file: "../wordlists/JuniorSunshine5/lesson2.json"
            },
            js5_l3: {
                description: "Junior Sunshine 5 - Lesson 3",
                file: "../wordlists/JuniorSunshine5/lesson3.json"
            },
            js5_l4: {
                description: "Junior Sunshine 5 - Lesson 4",
                file: "../wordlists/JuniorSunshine5/lesson4.json"
            },
            js5_l5: {
                description: "Junior Sunshine 5 - Lesson 5",
                file: "../wordlists/JuniorSunshine5/lesson5.json"
            },
            js5_l7: {
                description: "Junior Sunshine 5 - Lesson 7",
                file: "../wordlists/JuniorSunshine5/lesson7.json"
            },
            js5_l8: {
                description: "Junior Sunshine 5 - Lesson 8",
                file: "../wordlists/JuniorSunshine5/lesson8.json"
            },
            js5_l9: {
                description: "Junior Sunshine 5 - Lesson 9",
                file: "../wordlists/JuniorSunshine5/lesson9.json"
            },
            js5_phonics: {
                description: "Junior Sunshine 5 - Phonics",
                file: "../wordlists/JuniorSunshine5/phonics.json"
            }
        }
    },
    js6: {
        art: "images/categories/js6.jpg",
        name: "Junior Sunshine 6",
        wordlists: {
            js5_alphabet: {
                description: "Junior Sunshine 6 - Alphabet",
                file: "../wordlists/JuniorSunshine5/alphabet.json"
            },
            js5_phonics: {
                description: "Junior Sunshine 6 - Phonics",
                file: "../wordlists/JuniorSunshine5/phonics.json"
            }
        }
    },
    sun1: {
        art: "images/categories/sunshine1.jpg",
        name: "Sunshine 1",
        wordlists: {
            sun1_p1: {
                description: "Sunshine 1 - Program 1",
                file: "../wordlists/Sunshine1/program1.json"
            }
        }
    },
    sun2: {
        art: "images/categories/sunshine2.jpg",
        name: "Sunshine 2",
        wordlists: {
            sun2_p1: {
                description: "Sunshine 2 - Program 1",
                file: "../wordlists/Sunshine2/program1.json"
            }
        }
    },
    sun3: {
        art: "images/categories/sunshine3.jpg",
        name: "Sunshine 3",
        wordlists: {
            sun3_p1: {
                description: "Sunshine 3 - Program 1",
                file: "../wordlists/Sunshine3/program1.json"
            }
        }
    }
};
