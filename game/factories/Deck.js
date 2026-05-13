export class Deck {
  #cards;
  #discardedCards;

  constructor(cards) {
    this.#cards = [...cards];
    this.#discardedCards = [];
  }

  drawCard() {
    if (this.#cards.length === 0) {
      this.#reshuffleDiscardedCards();
    }
    if (this.#cards.length === 0) throw new Error("Deck is empty.");
    return this.#cards.shift();
  }

  returnCard(card) {
    this.#discardedCards.push(card);
  }

  shuffle(random = Math.random) {
    for (let i = this.#cards.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [this.#cards[i], this.#cards[j]] = [this.#cards[j], this.#cards[i]];
    }
  }

  #reshuffleDiscardedCards(random = Math.random) {
    if (this.#discardedCards.length === 0) {
      return;
    }
    this.#cards = [...this.#discardedCards];
    this.#discardedCards = [];
    this.shuffle(random);
  }
}
