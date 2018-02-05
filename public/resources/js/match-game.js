(function() {
  function viewModel() {
    var cardValues = [];
    var gameState = {};
    var newGame = function () {
      cardValues = generateCardValues();
      renderGameState(cardValues);
    };
    var restartGame = function () {
      renderGameState(cardValues);
    };
    function initGameState() {
      var cards = [];
      for (var i = 0; i < 16; i++) {
        var card = {
          cardValue: 0,
          cardState: '',
          spanValue: ko.observable(0),
          style: {
            color: ko.observable(''),
            backgroundColor: ko.observable('')
          }
        };
        cards.push(card);
      }
      gameState = {
        cards: ko.observableArray(cards),
        selected: [],
        solved: 0
      };
    }
    function renderGameState(cardValues) {
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
      for (var i = 0; i < cardValues.length; i++) {
        var cardValue = cardValues[i];
        gameState.cards()[i].cardValue = cardValue;
        gameState.cards()[i].cardState = 'selected';
        gameState.cards()[i].spanValue(cardValue);
        gameState.cards()[i].style.color('rgb(255, 255, 255)');
        gameState.cards()[i].style.backgroundColor(colors[cardValue - 1]);
      }
      gameState.selected = [];
      gameState.solved = 0;
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
    initGameState();
    newGame();
    return {
      gameState: gameState,
      newGame: newGame,
      restartGame: restartGame
    };
  }
  var vm = viewModel();
  ko.applyBindings(vm);
})();
