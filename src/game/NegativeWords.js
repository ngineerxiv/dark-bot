"use strict"
const NegativeWordsRepository = require("../game/NegativeWordsRepository.js");
const negativeWordsRepository = new NegativeWordsRepository("http://yamiga.waka.ru.com/json/darkbot.json");
const guessWords    = ['そう'];
const denialWords   = ['ない'];
const ableToGoHome  = ['帰れる', 'かえれる'];
const appreciateWords = ['おつかれ', 'おつかれさま'];

class NegativeWords {
    constructor(negativeWordsRepository, logger, defaultNegativeWords) {
        this.negativeWordsRepository    = negativeWordsRepository;
        this.logger                     = logger;
        this.negativeWords              = defaultNegativeWords || [];
        this.updateNegativeWords();
    }

    updateNegativeWords() {
        this.negativeWordsRepository.get(
            (json) => (this.negativeWords = json.negativeWords), 
            (err)  => this.logger.error(err)
        )
    };

    countPain(kuromojiFormedTokens) {
        const negativeCount   = this.countNegativeWords(kuromojiFormedTokens.map((t) => t.basic_form));
        const appreciateCount = this.countAppreciatingWords(kuromojiFormedTokens.map((t) => t.surface_form));
        return Math.max(negativeCount - appreciateCount, 0);
    }

    countNegativeWords(tokens) {
        this.updateNegativeWords();
        let negativeCount = 0;
        if(!Array.isArray(tokens)) {
            return negativeCount;
        }

        tokens.forEach((token, idx) => {
            const next = tokens[idx + 1] || "";
            this.hasNegative(token, next) && negativeCount++;
        });
        return negativeCount;
    };

    countAppreciatingWords(tokens) {
        let appreciateCount = 0;
        if( !Array.isArray(tokens) ) {
            return appreciateCount;
        }

        tokens.forEach((token, idx) => {
            const next = tokens[idx + 1] || "";
            this.isAppreciatingWord(token, next) && appreciateCount++;
        });
        return appreciateCount;
    }

    hasNegative(token, next) {
        return (
            this.negativeWords.indexOf(token) !== -1 &&
            (denialWords.indexOf(next) === -1 && guessWords.indexOf(next) === -1)
        ) || (ableToGoHome.indexOf(token) !== -1 && denialWords.indexOf(next) !== -1);
    }
    isAppreciatingWord(token, next) {
        return appreciateWords.indexOf(token + next) !== -1;
    }

    static factory() {
        return new NegativeWords(negativeWordsRepository, console);
    }
};

module.exports = NegativeWords;
