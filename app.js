import {
  getCard,
  createDeck,
  createCardElement,
  recalculateScore,
  fakeSleep,
} from "./assets/js/utils.js";

(() => {
  'use strict';
  const buttonHit = document.querySelector('#hit-button');
  const buttonStand = document.querySelector('#stand-button');
  const buttonNewGame = document.querySelector('#new-game-button');
  const spanPlayerScore = document.querySelector('#player-score');
  const spanDealerScore = document.querySelector('#dealer-score');
  const divPlayerCards = document.querySelector('#player-cards');
  const divDealerCards = document.querySelector('#dealer-cards');
  const alertContainer = document.querySelector('#alert-container');

  let deck = createDeck();
  let playerScore = 0;
  let dealerScore = 0;
  let playerCards = [];
  let dealerCards = [];

  const disableHitButton = () => {
    buttonHit.disabled = true;
    buttonHit.classList.add('disabled');
  }

  const disableStandButton = () => {
    buttonStand.disabled = true;
    buttonStand.classList.add('disabled');
  }

  const disableNewGameButton = () => {
    buttonNewGame.disabled = true;
    buttonNewGame.classList.add('disabled');
  }

  const enableHitButton = () => {
    buttonHit.disabled = false;
    buttonHit.classList.remove('disabled');
  }

  const enableStandButton = () => {
    buttonStand.disabled = false;
    buttonStand.classList.remove('disabled');
  }

  const enableNewGameButton = () => {
    buttonNewGame.disabled = false;
    buttonNewGame.classList.remove('disabled');
  }

  const disableAllButtons = () => {
    disableHitButton();
    disableStandButton();
    disableNewGameButton();
  }

  const enableAllButtons = () => {
    enableHitButton();
    enableStandButton();
    enableNewGameButton();
  }

  const showAlert = (text, type) => {  
    alertContainer.innerHTML = [
      `<div class="alert alert-${type} alert-min-width fade show text-center mt-4" role="alert">`,
      `   <h4 class="alert-heading mb-0">${text}</h4>`,
      '</div>'
    ].join('');
  }

  const removeAlert = () => {
    alertContainer.innerHTML = "";
  }
  
  const showDealerWinsAlert = () => {
    removeAlert();
    showAlert('Dealer wins!', 'danger');
  }

  const showPlayerWinsAlert = () => {
    removeAlert();
    showAlert('Player wins!', 'success');
  }

  const clearCards = () => {
    divPlayerCards.innerHTML = "";
    divDealerCards.innerHTML = "";
    spanPlayerScore.innerHTML = "0";
    spanDealerScore.innerHTML = "0";
  }

  const showDealerCards = () => {
    divDealerCards.innerHTML = "";
    spanDealerScore.innerText = dealerScore;
    for (const card of dealerCards) {
      const cardElement = createCardElement(card);
      divDealerCards.append(cardElement);
    }
  }

  const playerGetCard = () => {
    const card = getCard(deck);
    const cardElement = createCardElement(card);
    playerCards.push(card);
    playerScore = recalculateScore(playerCards);
    spanPlayerScore.innerText = playerScore;
    divPlayerCards.append(cardElement);
  }

  const dealerGetCard = (hide = false) => {
    const card = getCard(deck);
    const cardElement = createCardElement(hide ? 'grey_back' : card);
    dealerCards.push(card);
    dealerScore = recalculateScore(dealerCards);
    if (!hide) {
      spanDealerScore.innerText = dealerScore;
    }
    divDealerCards.append(cardElement);
  }

  const dealerTurn = async () => {
    disableAllButtons();
    showDealerCards();

    while(dealerScore !== 21 && dealerScore < playerScore) {
      await fakeSleep(500);
      dealerGetCard();
    }

    if (dealerScore === 21) {
      showDealerWinsAlert();
    } else if (dealerScore > 21) {
      showPlayerWinsAlert();
    } else if (dealerScore >= playerScore) {
      showDealerWinsAlert();
    }
    enableNewGameButton();
  }

  const initGame = async () => {
    disableAllButtons();
    await fakeSleep(500);
    playerGetCard();
    await fakeSleep(500);
    dealerGetCard();
    await fakeSleep(500);
    playerGetCard();
    await fakeSleep(500);
    dealerGetCard(true);

    if (dealerScore === 21) {
      enableNewGameButton();
      showDealerCards();
      showDealerWinsAlert();
      return;
    }

    if (playerScore === 21) {
      enableStandButton();
      enableNewGameButton();
      return;
    }
    
    enableAllButtons();
  }

  const newGame = () => {
    removeAlert();
    clearCards();
    deck = createDeck();
    playerScore = 0;
    dealerScore = 0;
    playerCards = [];
    dealerCards = [];
    initGame();
  }

  buttonHit.addEventListener('click', () => {
    if (playerScore >= 21) {
      throw 'Maximum score reached or exceeded.';
    }

    playerGetCard();

    if (playerScore === 21) {
      disableHitButton();
    }

    if (playerScore > 21) {
      disableHitButton();
      disableStandButton();
      showDealerCards();
      showDealerWinsAlert();
    }
  });

  buttonStand.addEventListener('click', () => {
    dealerTurn();
  });

  buttonNewGame.addEventListener('click', () => {
    newGame();
  });

  initGame();

})();
