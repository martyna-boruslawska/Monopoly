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
  const deck = new Deck([cardA, cardB]);

  const firstDraw = deck.drawCard();
  const secondDraw = deck.drawCard();
  deck.returnCard(firstDraw);
  deck.returnCard(secondDraw);

  const randomValues = [0, 0];
  const random = () => randomValues.shift() ?? 0;
  deck.shuffle = deck.shuffle.bind(deck, random);

  assert.strictEqual(deck.drawCard(), cardB);
  assert.strictEqual(deck.drawCard(), cardA);
});

test("Deck throws when both draw pile and discarded cards are empty", () => {
  const deck = new Deck([]);

  assert.throws(() => deck.drawCard(), /Deck is empty\./);
});