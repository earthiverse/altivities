Survey.StylesManager.applyTheme("defaultV2")

const wordlists = [
    "https://altivities.earthiverse.ca/wordlists/General/alphabet_words.json",
    "https://altivities.earthiverse.ca/wordlists/General/animals.json",
    "https://altivities.earthiverse.ca/wordlists/General/colors.json",
    "https://altivities.earthiverse.ca/wordlists/General/countries.json",
    "https://altivities.earthiverse.ca/wordlists/General/emotions.json",
    "https://altivities.earthiverse.ca/wordlists/General/halloween.json",
    "https://altivities.earthiverse.ca/wordlists/General/numbers.json",
    "https://altivities.earthiverse.ca/wordlists/General/sports.json",
    "https://altivities.earthiverse.ca/wordlists/General/stationery.json",
    "https://altivities.earthiverse.ca/wordlists/General/valentines.json",
    "https://altivities.earthiverse.ca/wordlists/General/winter.json",
    "https://altivities.earthiverse.ca/wordlists/Hepburn/english.json",
    "https://altivities.earthiverse.ca/wordlists/General/prefectures.json"
]

const surveyJSON = {
    "description": "Customize your word list(s) for the various games.",
    "logoPosition": "right",
    "pages": [
        {
            "elements": [
                {
                    "addRowText": "Add word list",
                    "columns": [
                        {
                            "choices": wordlists,
                            "hasOther": true,
                            "name": "url",
                            "otherText": "Custom Wordlist",
                            "storeOthersAsComment": true,
                            "title": "Word List(s)"
                        }
                    ],
                    "minRowCount": 1,
                    "name": "wordlists",
                    "optionsCaption": "Choose a word list...",
                    "removeRowText": "Remove",
                    "rowCount": 1,
                    "title": "Please add the word lists you would like to include words from.",
                    "type": "matrixdynamic",
                    "valueName": "wordlists"
                }
            ],
            "name": "page1"
        },
        {
            "elements": [
                {
                    "allowAddPanel": false,
                    "allowRemovePanel": false,
                    "name": "arrray_employer_info",
                    "renderMode": "list",
                    "templateElements": [
                        {
                            "elements": [
                                {
                                    "name": "employer_address",
                                    "title": "Address",
                                    "type": "text",
                                    "valueName": "address"
                                },
                                {
                                    "name": "employer_phone",
                                    "title": "Phone number:",
                                    "type": "text",
                                    "valueName": "phone"
                                },
                                {
                                    "name": "employer_abn",
                                    "title": "ABN",
                                    "type": "text",
                                    "valueName": "abn"
                                }
                            ],
                            "name": "panel_mployer_address",
                            "title": "Address",
                            "type": "panel"
                        },
                        {
                            "elements": [
                                {
                                    "choices": [
                                        "Full time",
                                        "Part time",
                                        "Casual",
                                        "Seasonal"
                                    ],
                                    "name": "employer_role",
                                    "title": "Your role",
                                    "type": "radiogroup",
                                    "valueName": "role"
                                }
                            ],
                            "name": "panel_employer_role",
                            "title": "What is your role?",
                            "type": "panel"
                        },
                        {
                            "elements": [
                                {
                                    "inputType": "number",
                                    "name": "member_hours_worked",
                                    "title": "Hours:",
                                    "type": "text",
                                    "valueName": "hours_worked"
                                },
                                {
                                    "choices": [
                                        "Day",
                                        "Week",
                                        "Fortnight",
                                        "Month",
                                        "Year"
                                    ],
                                    "defaultValue": "Year",
                                    "name": "member_hours_worked_frequency",
                                    "startWithNewLine": false,
                                    "title": "Worked Frequency:",
                                    "type": "dropdown",
                                    "valueName": "hours_worked_frequency"
                                }
                            ],
                            "name": "panel_employer_hours_work",
                            "title": "What hours do you work?",
                            "type": "panel"
                        },
                        {
                            "elements": [
                                {
                                    "inputType": "number",
                                    "name": "employer_income",
                                    "title": "Income:",
                                    "type": "text",
                                    "valueName": "income"
                                },
                                {
                                    "choices": [
                                        "Day",
                                        "Week",
                                        "Fortnight",
                                        "Month",
                                        "Year"
                                    ],
                                    "defaultValue": "Year",
                                    "name": "employer_income_frequency",
                                    "startWithNewLine": false,
                                    "title": "Income Frequency",
                                    "type": "dropdown",
                                    "valueName": "income_frequency"
                                }
                            ],
                            "name": "panel_employer_income",
                            "title": "What income do you receive?",
                            "type": "panel"
                        }
                    ],
                    "templateTitle": "Wordlist: {panel.url}",
                    "title": "Your word lists",
                    "type": "paneldynamic",
                    "valueName": "wordlists"
                }
            ],
            "name": "page2",
            "title": "Tells us about your employer(s)"
        }
    ],
    "showProgressBar": "top",
    "showQuestionNumbers": "off",
    "title": "Altivities Wordlist Customizer"
}

function sendDataToServer(survey) {
    $("#surveyResult").html("Result JSON:\n" + JSON.stringify(survey.data, null, 2))
    //send Ajax request to your web server
    //alert("The results are: " + JSON.stringify(survey.data))
}

const survey = new Survey.Model(surveyJSON)
$("#surveyContainer").Survey({
    model: survey,
    onComplete: sendDataToServer
})

export { }