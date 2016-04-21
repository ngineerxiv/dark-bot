"use strict"
const guessWords    = ['そう'];
const denialWords   = ['ない'];
const ableToGoHome  = ['帰れる', 'かえれる'];

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

    hasNegative(token, next) {
        return (
            this.negativeWords.indexOf(token) !== -1 &&
            (denialWords.indexOf(next) === -1 && guessWords.indexOf(next) === -1)
        ) || (ableToGoHome.indexOf(token) !== -1 && denialWords.indexOf(next) !== -1);
    }
};

module.exports = NegativeWords;
