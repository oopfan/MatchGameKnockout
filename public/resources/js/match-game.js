(function() {
  function GameState() {
    this.cards = ko.observableArray([]);
    this.render = function(cardValues) {
      this.cards.removeAll();
      for (var i = 0; i < cardValues.length; i++) {
        var card = new Card();
        card.cardValue(cardValues[i]);
        card.cardState('hidden');
        this.cards.push(card);
      }
      this.selected = [];
      this.solved = 0;
    }
  }
  function Card() {
    this.cardValue = ko.observable(0);
    this.cardState = ko.observable('');
    this.spanValue = ko.computed(function() {
      return this.cardState() === 'hidden' ? '' : this.cardValue();
    }, this);
    this.style = {
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
  function viewModel() {
    var gameState = new GameState();
    var cardValues = [];
    var newGame = function () {
      cardValues = generateCardValues();
      gameState.render(cardValues);
    };
    var restartGame = function () {
      gameState.render(cardValues);
    };
    newGame();
    var cardClick = function (card) {
      // Test if this card is already flipped
      if (card.cardState() !== 'hidden') {
        // Yes, so then return
        return;
      }
      // Prevent more than 2 flipped cards
      if (gameState.selected.length >= 2) {
        return;
      }
      // Show that this card is now selected
      card.cardState('selected');
      gameState.selected.push(card);

      // Test if we have two selected cards
      if (gameState.selected.length < 2) {
        // No, so then return
        return;
      }
      var otherCard = gameState.selected[0];

      // Test if both selected cards have the same value
      if (card.cardValue() === otherCard.cardValue()) {
        // Yes they do, change colors to reflect this
        card.cardState('solved');
        otherCard.cardState('solved');
        // Bump the total number of cards flipped
        gameState.solved += 2;
        gameState.selected = [];

        // Test if all cards flipped
        if (gameState.solved === 16) {
          // You are a winner!
          window.setTimeout(function() {
            alert('You are a winner!');
          }, 500);
        }
        return;
      }

      // The cards have different values
      window.setTimeout(function() {
        // Hide the cards after a half second delay
        card.cardState('hidden');
        otherCard.cardState('hidden');
        gameState.selected = [];
      }, 500);
    };
    return {
      gameState: gameState,
      newGame: newGame,
      restartGame: restartGame,
      cardClick: cardClick
    };
  }
  var vm = viewModel();
  ko.applyBindings(vm);
})();
