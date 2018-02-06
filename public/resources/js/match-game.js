(function() {
  ko.components.register('game', {
    viewModel: function(params) {
      var self = this;
      var cardValues = [];
      self.newGame = function() {
        cardValues = generateCardValues();
        render(cardValues);
      };
      self.restartGame = function() {
        render(cardValues);
      };
      self.gameNumber = params.gameNumber;
      self.wonStyle = ko.observable();
      self.gameStyle = ko.observable();
      self.cards = ko.observableArray([]);
      self.newGame();
      self.cardClick = function(card) {
        // Test if this card is already flipped
        if (card.cardState() !== 'hidden') {
          // Yes, so then return
          return;
        }
        // Prevent more than 2 flipped cards
        if (self.selected.length >= 2) {
          return;
        }
        // Show that this card is now selected
        card.cardState('selected');
        self.selected.push(card);

        // Test if we have two selected cards
        if (self.selected.length < 2) {
          // No, so then return
          return;
        }
        var otherCard = self.selected[0];

        // Test if both selected cards have the same value
        if (card.cardValue() === otherCard.cardValue()) {
          // Yes they do, change colors to reflect this
          card.cardState('solved');
          otherCard.cardState('solved');
          // Bump the total number of cards flipped
          self.solved += 2;
          self.selected = [];

          // Test if all cards flipped
          if (self.solved === 16) {
            // You are a winner!
            self.wonStyle({ display: 'flex' });
            self.gameStyle({ opacity: 0.1 });
            window.setTimeout(function() {
              self.wonStyle({ display: 'none' });
              self.gameStyle({ opacity: 1 });
            }, 2000);
          }
          return;
        }

        // The cards have different values
        window.setTimeout(function() {
          // Hide the cards after a half second delay
          card.cardState('hidden');
          otherCard.cardState('hidden');
          self.selected = [];
        }, 500);
      };
      function render(cardValues) {
        self.cards.removeAll();
        for (var i = 0; i < cardValues.length; i++) {
          var card = new Card();
          card.cardValue(cardValues[i]);
          card.cardState('hidden');
          self.cards.push(card);
        }
        self.selected = [];
        self.solved = 0;
      };
    },
    template:
      '<div class="you-won" data-bind="style: wonStyle">\
        <span>You\'re a Winner!</span>\
      </div>\
      <div class="match-game container" data-bind="style: gameStyle">\
        <div class="row">\
          <div class="col-md-3">\
            <h1>Match Game (Knockout) Game <span data-bind="text: gameNumber"></span></h1>\
            <h2>Rules</h2>\
            <p>\
              Click on a card to reveal the number on the other side. Click on a second\
              card to try and find a match to the first. If you succeed, the pair will\
              be removed from play. If not, try again!\
            </p>\
            <h2>How To Win</h2>\
            <p>You win when all pairs have been found.</p>\
            <p>\
              <button type="button" className="btn btn-default" data-bind="click: restartGame">Restart Game</button>\
            </p>\
            <p>\
              <button type="button" className="btn btn-default" data-bind="click: newGame">New Game</button>\
            </p>\
          </div>\
          <div class="col-md-9">\
            <div class="row" data-bind="foreach: cards">\
              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 card" data-bind="style: cardStyle, click: $parent.cardClick">\
                <span data-bind="text: spanValue"></span>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>'
  });
  function Card() {
    this.cardValue = ko.observable(0);
    this.cardState = ko.observable('');
    this.spanValue = ko.computed(function() {
      return this.cardState() === 'hidden' ? '' : this.cardValue();
    }, this);
    this.cardStyle = {
      color: ko.computed(function() {
        return this.cardState() === 'solved' ? 'rgb(204, 204, 204)' : 'rgb(255, 255, 255)';
      }, this),
      backgroundColor: ko.computed(function() {
        var colors = [
          'hsl(25, 85%, 65%)',
          'hsl(55, 85%, 65%)',
          'hsl(90, 85%, 65%)',
          'hsl(160, 85%, 65%)',
          'hsl(220, 85%, 65%)',
          'hsl(265, 85%, 65%)',
          'hsl(310, 85%, 65%)',
          'hsl(360, 85%, 65%)',
        ];
        return this.cardState() === 'solved' ? 'rgb(153, 153, 153)' :
          (this.cardState() === 'selected' ? colors[this.cardValue() - 1] : 'rgb(32, 64, 86)');
      }, this)
    };
  }
  function generateCardValues() {
    var orderedCards = [];
    for (var i = 1; i <= 8; i++) {
      orderedCards.push(i);
      orderedCards.push(i);
    }
    var randomCards = [];
    while (orderedCards.length > 0) {
      var randomIndex = getRandomInt(0, orderedCards.length);
      randomCards.push(orderedCards[randomIndex]);
      orderedCards.splice(randomIndex, 1);
    }
    return randomCards;
  }
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  ko.applyBindings({
    games: [1, 2]
  });
})();
