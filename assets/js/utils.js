const SUITS = ['C', 'D', 'H', 'S'];

const FIGURES = {1: 'A', 11: 'J', 12: 'Q', 13: 'K'};

const getCardValue = (value, score) => {
  if (isNaN(value)) {
    return (value === 'A' ? (score + 11) > 21 ? 1 : 11 : 10);
  }
  return +value;
}

const compare = (a, b) => {
  if (a === 'A') return 1;
  if (b === 'A') return -1;
  return 0;
};

const shuffle = (deck) => {
  return [...deck].map((_, i, deckCopy) => {
    let rand = i + (Math.floor( Math.random() * (deckCopy.length - i)));
    [deckCopy[rand], deckCopy[i]] = [deckCopy[i], deckCopy[rand]];
    return deckCopy[i];
  });
}

export const fakeSleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const createDeck = () => {
  const deck = [];
  for (let i = 1; i <= 13; i++) {
    for (const suit of SUITS) {
      const number = FIGURES[i] ?? i;
      deck.push(`${number}${suit}`);
    }
  }
  return shuffle(deck);
}

export const getCard = (deck) => { 
  if (!deck.length > 0) {
    throw 'No more cards.';
  }
  return deck.pop();
}

export const recalculateScore = (cards) => {
  let score = 0;
  const cardValues = cards.map((card) => card.substring(0, card.length - 1)).sort(compare);
  for (const value of cardValues) {
    score += getCardValue(value, score);
  }
  return score;
}

export const createCardElement = (card) => {
  const img = document.createElement('img');
  img.src = `./assets/playing_cards/${card}.png`;
  img.classList.add('card');
  return img;
}
