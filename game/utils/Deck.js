/**
 * A class representing a deck of Monopoly cards.
 * Supports drawing, returning to bottom, and shuffling.
 * @class Deck
 */
export class Deck {
  constructor(cards) {
    this.cards = [...cards];
    this.discardPile = [];
  }

  drawCard() {
    if (this.cards.length === 0) {
      if (this.discardPile.length === 0) {
        throw new Error("Deck is empty and no cards in discard pile");
      }
      this.cards = this.discardPile;
      this.discardPile = [];
      this.shuffle();
    }
    return this.cards.shift();
  }

  returnCard(card) {
    this.discardPile.push(card);
  }

  shuffle(randomFn = Math.random) {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(randomFn() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  get size() {
    return this.cards.length;
  }
}
