
var guessWords = ['そう'];
var denialWords = ["ない"];

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
                if(idx + 1 < length) {
                    var token = tokens[idx + 1];
                    denialWords.indexOf(token) !== -1 && negativeCount--;
                    guessWords.indexOf(token) !== -1 && negativeCount--;
                }
            };

            if(token === '帰れる' || token === 'かえれる') {
                if(idx + 1 < length && denialWords.indexOf(tokens[idx + 1]) !== -1) {
                    negativeCount++;
                }
            }
        });
        return negativeCount;
    };
    this.updateNegativeWords();
};

module.exports = NegativeWords;
