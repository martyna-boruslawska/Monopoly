import { describe, it, expect } from "node:test";
import { Deck } from "../../game/utils/Deck.js";
import { createChanceCardDeck } from "../../game/factories/createChanceCardDeck.js";
import { createCommunityChestCardDeck } from "../../game/factories/createCommunityChestCardDeck.js";

describe("Deck", () => {
  describe("constructor", () => {
    it("should create a deck with given cards", () => {
      const deck = new Deck([{ id: 1 }, { id: 2 }]);
      expect(deck.size).toBe(2);
    });
  });

  describe("drawCard", () => {
    it("should draw top card", () => {
      const deck = new Deck([{ id: 1 }, { id: 2 }]);
      expect(deck.drawCard().id).toBe(1);
      expect(deck.size).toBe(1);
    });

    it("should reshuffle from discard pile when empty", () => {
      const deck = new Deck([{ id: 1 }, { id: 2 }]);
      deck.drawCard();
      deck.drawCard();
      deck.returnCard({ id: 1 });
      expect(deck.drawCard()).toBeDefined();
    });

    it("should throw when completely empty", () => {
      const deck = new Deck([]);
      expect(() => deck.drawCard()).toThrow();
    });
  });

  describe("returnCard", () => {
    it("should add to discard pile", () => {
      const deck = new Deck([{ id: 1 }]);
      const card = deck.drawCard();
      deck.returnCard(card);
      expect(deck.discardPile).toContain(card);
    });
  });

  describe("shuffle", () => {
    it("should accept custom random function", () => {
      const deck = new Deck([{ id: 1 }, { id: 2 }, { id: 3 }]);
      deck.shuffle((n) => n - 1);
      expect(deck.cards[0].id).toBe(3);
      expect(deck.cards[2].id).toBe(1);
    });
  });
});

describe("Chance Card Deck", () => {
  it("should create shuffled deck with 16 cards", () => {
    const deck = createChanceCardDeck();
    expect(deck.size).toBe(16);
  });

  it("should contain Get Out of Jail Free card", () => {
    const deck = createChanceCardDeck();
    const all = [...deck.cards, ...deck.discardPile];
    expect(all.some(c => c.type === "get-out-jail")).toBe(true);
  });
});

describe("Community Chest Card Deck", () => {
  it("should create shuffled deck with 17 cards", () => {
    const deck = createCommunityChestCardDeck();
    expect(deck.size).toBe(17);
  });

  it("should contain required card types", () => {
    const deck = createCommunityChestCardDeck();
    const types = [...deck.cards, ...deck.discardPile].map(c => c.type);
    expect(types).toContain("collect");
    expect(types).toContain("pay");
    expect(types).toContain("get-out-jail");
  });
});
