"use strict"

class NegativeWords {
    constructor(negativeWordsRepository, logger, defaultNegativeWords) {
        this.negativeWords = defaultNegativeWords || [];
        this.negativeWordsRepository = negativeWordsRepository;
        this.logger = logger;
        this.updateNegativeWords();
    }

    updateNegativeWords() {
        this.negativeWordsRepository.get((json) => {
            this.negativeWords = json.negativeWords;
        }, (err) => this.logger.error(err));
    }

    countNegativeWords(tokens) {
        this.updateNegativeWords();
        let negativeCount = 0;
        if(tokens === undefined) {
            return negativeCount;
        }

        tokens.forEach((token, idx) => {
            if(this.negativeWords.indexOf(token) !== -1) {
                negativeCount++;
                if(idx + 1 < tokens.length && tokens[idx + 1] === 'ない') {
                    negativeCount--;
                }
            };

            if(token === '帰れる' || token === 'かえれる') {
                if(idx + 1 < tokens.length && tokens[idx + 1] === 'ない') {
                    negativeCount++;
                }
            }
        });
        return negativeCount;
    }
}

module.exports = NegativeWords;
