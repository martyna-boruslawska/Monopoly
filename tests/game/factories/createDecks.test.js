import test from "node:test";
import assert from "node:assert/strict";
import {
  createChanceDeck,
  createCommunityChestDeck,
  createDecks,
} from "../../../game/factories/createDecks.js";
import { Deck } from "../../../game/factories/Deck.js";

test("createChanceDeck returns a shuffled Deck instance", () => {
  const deck = createChanceDeck();

  assert.ok(deck instanceof Deck);

  for (let index = 0; index < 16; index += 1) {
    assert.doesNotThrow(() => deck.drawCard());
  }

  assert.throws(() => deck.drawCard(), /Deck is empty\./);
});

test("createCommunityChestDeck returns a shuffled Deck instance", () => {
  const deck = createCommunityChestDeck();

  assert.ok(deck instanceof Deck);

  for (let index = 0; index < 16; index += 1) {
    assert.doesNotThrow(() => deck.drawCard());
  }

  assert.throws(() => deck.drawCard(), /Deck is empty\./);
});

test("createDecks composes both deck factories", () => {
  const decks = createDecks();

  assert.ok(decks.chance instanceof Deck);
  assert.ok(decks.communityChest instanceof Deck);

  for (let index = 0; index < 16; index += 1) {
    assert.doesNotThrow(() => decks.chance.drawCard());
    assert.doesNotThrow(() => decks.communityChest.drawCard());
  }

  assert.throws(() => decks.chance.drawCard(), /Deck is empty\./);
  assert.throws(() => decks.communityChest.drawCard(), /Deck is empty\./);
});