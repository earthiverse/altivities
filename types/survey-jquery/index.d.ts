declare namespace Survey {
    class StylesManager {
        static applyTheme(theme: string): void;
    }
    function Model(surveyJSON: any): void;
}

interface JQuery {
    Survey(survey: any): void;
}