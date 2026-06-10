import test from "node:test";
import assert from "node:assert/strict";
import { Deck } from "../../../game/factories/Deck.js";

test("Deck draws returned cards only after the draw pile is exhausted", () => {
  const cardA = { name: "A" };
  const cardB = { name: "B" };
  const deck = new Deck([cardA, cardB]);

  const firstDraw = deck.drawCard();
  deck.returnCard(firstDraw);

  assert.strictEqual(deck.drawCard(), cardB);
  assert.strictEqual(deck.drawCard(), cardA);
});

test("Deck reshuffles returned cards when refilling the draw pile", () => {
  const cardA = { name: "A" };
  const cardB = { name: "B" };
  const randomValues = [0, 0];
  const deck = new Deck([cardA, cardB]);
  let shuffleCounter = 0;
  deck.shuffle = () => { shuffleCounter++; };

  // Act
  const card1 = deck.drawCard();
  const shuffleCounter1 = shuffleCounter;
  deck.returnCard(card1);
  const card2 = deck.drawCard();
  const shuffleCounter2 = shuffleCounter;
  deck.returnCard(card2);
  // -
  const card3 = deck.drawCard();
  const shuffleCounter3 = shuffleCounter;
  deck.returnCard(card3);
  const card4 = deck.drawCard();
  const shuffleCounter4 = shuffleCounter;
  deck.returnCard(card4);
  // -
  const card5 = deck.drawCard();
  deck.returnCard(card5);

  // Assert
  assert.strictEqual(card1, cardA);
  assert.strictEqual(shuffleCounter1, 0);
  assert.strictEqual(card2, cardB);
  assert.strictEqual(shuffleCounter2, 0);
  assert.strictEqual(card3, cardA);
  assert.strictEqual(shuffleCounter3, 1);
  assert.strictEqual(card4, cardB);
  assert.strictEqual(shuffleCounter4, 1);
  assert.strictEqual(card5, cardA);
  assert.strictEqual(shuffleCounter, 2);
});

test("Deck throws when both draw pile and discarded cards are empty", () => {
  const deck = new Deck([]);

  assert.throws(() => deck.drawCard(), /Deck is empty\./);
});