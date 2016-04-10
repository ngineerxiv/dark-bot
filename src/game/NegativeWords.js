
var NegativeWords = function(negativeWordsRepository, logger, defaultNegativeWords) {
    this.negativeWords = defaultNegativeWords ? defaultNegativeWords : [];

    this.updateNegativeWords = function() {
        var self = this;
        negativeWordsRepository.get(function(json) {
            self.negativeWords = json.negativeWords;
        }, function(err) {
            logger.error(err);
        });
    };

    this.countNegativeWords = function(tokens) {
        this.updateNegativeWords();
        var negativeCount = 0;
        if(tokens === undefined) {
            return negativeCount;
        }

        var length = tokens.length;
        var self   = this;
        tokens.forEach(function(token, idx) {
            if(self.negativeWords.indexOf(token) !== -1) {
                negativeCount++;
                if(idx + 1 < length && tokens[idx + 1] === 'ない') {
                    negativeCount--;
                }
            };

            if(token === '帰れる' || token === 'かえれる') {
                if(idx + 1 < length && tokens[idx + 1] === 'ない') {
                    negativeCount++;
                }
            }
        });
        return negativeCount;
    };
    this.updateNegativeWords();
};

module.exports = NegativeWords;
