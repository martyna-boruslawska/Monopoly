import test from "node:test";
import assert from "node:assert/strict";
import { landingRules } from "../../../game/rules/landingRules.js";
import { createTestGame } from "../../helpers/createTestGame.js";
import { Deck } from "../../../game/factories/Deck.js";

function setupGame(testPlayers, { chanceCards = [], communityChestCards = [] } = {}) {
  const game = createTestGame(testPlayers);
  const chanceDeck = new Deck(chanceCards);
  const communityChestDeck = new Deck(communityChestCards);

  game.chanceDeck = chanceDeck;
  game.communityChestDeck = communityChestDeck;

  return { game, chanceDeck, communityChestDeck };
}

test("landingRules cards - landing on Chance draws the top card, resolves it, and returns a normal card to the bottom of the deck", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const dividendCard = { type: "collect", value: 50, text: "Bank pays you dividend of $50." };
  const bonusCard = { type: "collect", value: 150, text: "Your building loan matures. Collect $150" };
  const { game, chanceDeck, communityChestDeck } = setupGame(
    [
      { name: "Luke Skywalker", position: 2 },
      { name: "Darth Vader" },
    ],
    { chanceCards: [dividendCard, bonusCard] },
  );

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1550);
  assert.deepStrictEqual(chanceDeck.getCards(), [bonusCard]);
  assert.deepStrictEqual(chanceDeck.getDiscardedCards(), [dividendCard]);
  assert.strictEqual(communityChestDeck.getCards().length, 0);
});

test("landingRules cards - landing on Community Chest draws the top Community Chest card and resolves it", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const birthdayCard = {
    type: "gift-from-players",
    value: 10,
    text: "It is your birthday. Collect $10 from every player",
  };
  const { game, chanceDeck, communityChestDeck } = setupGame(
    [
      { name: "Luke Skywalker", position: 17 },
      { name: "Darth Vader" },
      { name: "Han Solo" },
    ],
    { communityChestCards: [birthdayCard] },
  );

  landingRules(game);

  assert.strictEqual(game.players[0].money, 1520);
  assert.strictEqual(game.players[1].money, 1490);
  assert.strictEqual(game.players[2].money, 1490);
  assert.deepStrictEqual(communityChestDeck.getCards(), []);
  assert.deepStrictEqual(communityChestDeck.getDiscardedCards(), [birthdayCard]);
  assert.deepStrictEqual(chanceDeck.getCards(), []);
});

test("landingRules cards - Get Out of Jail Free card stays with the player until used", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const getOutOfJailCard = { type: "get-out-jail", text: "Get Out of Jail Free" };
  const nextCard = { type: "collect", value: 50, text: "Bank pays you dividend of $50." };
  const { game, chanceDeck } = setupGame(
    [
      { name: "Luke Skywalker", position: 2 },
      { name: "Darth Vader" },
    ],
    { chanceCards: [getOutOfJailCard, nextCard] },
  );

  landingRules(game);

  assert.strictEqual(game.currentPlayer().getOutOfJailCards.length, 1);
  assert.deepStrictEqual(chanceDeck.getDiscardedCards(), []);
  assert.deepStrictEqual(chanceDeck.getCards(), [nextCard]);
});

test("landingRules cards - advance cards correctly handle passing Start", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const advanceCard = {
    type: "advance",
    location: "Illinois Avenue",
    text: "Advance to Illinois Avenue. If you pass Go, collect $200.",
  };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 36, propertyIds: [24] },
      { name: "Darth Vader" },
    ],
    { chanceCards: [advanceCard] },
  );

  landingRules(game);

  assert.strictEqual(game.currentPlayer().position, 24);
  assert.strictEqual(game.currentPlayer().money, 1700);
});

test("landingRules cards - nearest railroad card applies the special doubled railroad rent", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const railroadCard = {
    type: "advance-nearest-railroad",
    text: "Advance to the nearest Railroad. If owned, pay twice the rental to which they are otherwise entitled.",
  };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 7 },
      { name: "Darth Vader", propertyIds: [15] },
    ],
    { chanceCards: [railroadCard] },
  );

  landingRules(game);

  assert.strictEqual(game.currentPlayer().position, 15);
  assert.strictEqual(game.players[0].money, 1450);
  assert.strictEqual(game.players[1].money, 1550);
});

test("landingRules cards - nearest utility card applies the special ten-times-roll payment", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const utilityCard = {
    type: "advance-nearest-utility",
    text: "Advance token to nearest Utility. If owned, throw dice and pay owner a total ten times amount thrown.",
  };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 22 },
      { name: "Darth Vader", propertyIds: [28] },
    ],
    { chanceCards: [utilityCard] },
  );
  game.lastRoll = { dice1: 3, dice2: 4, total: 7, isDouble: false };

  landingRules(game);

  assert.strictEqual(game.currentPlayer().position, 28);
  assert.strictEqual(game.players[0].money, 1430);
  assert.strictEqual(game.players[1].money, 1570);
});

test("landingRules cards - Go to Jail card sends the player directly to jail without collecting $200", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const goToJailCard = {
    type: "get-to-jail",
    text: "Go to Jail. Go directly to Jail, do not pass Go, do not collect $200.",
  };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 36, money: 1500 },
      { name: "Darth Vader" },
    ],
    { chanceCards: [goToJailCard] },
  );

  landingRules(game);

  assert.strictEqual(game.currentPlayer().position, 10);
  assert.strictEqual(game.currentPlayer().isInJail, true);
  assert.strictEqual(game.currentPlayer().money, 1500);
});

test("landingRules cards - pay card transfers money from the player to the bank", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const payCard = {
    type: "pay",
    value: 50,
    text: "Doctor’s fee. Pay $50",
  };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 17 },
      { name: "Darth Vader" },
    ],
    { communityChestCards: [payCard] },
  );

  landingRules(game);

  assert.strictEqual(game.currentPlayer().money, 1450);
  assert.strictEqual(game.players[1].money, 1500);
});

test("landingRules cards - pay each player card transfers money to every other player", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const chairmanCard = {
    type: "pay-each-player",
    value: 50,
    text: "You have been elected Chairman of the Board. Pay each player $50.",
  };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 2 },
      { name: "Darth Vader" },
      { name: "Han Solo" },
    ],
    { chanceCards: [chairmanCard] },
  );

  landingRules(game);

  assert.strictEqual(game.players[0].money, 1400);
  assert.strictEqual(game.players[1].money, 1550);
  assert.strictEqual(game.players[2].money, 1550);
});

test("landingRules cards - go-back-3 card resolves a landed unowned property space", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  // Chance at position 22, go back 3 lands on New York Avenue (position 19, price $200)
  const goBack3Card = { type: "go-back-3", name: "Go Back 3 Spaces." };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 22 },
      { name: "Darth Vader" },
    ],
    { chanceCards: [goBack3Card] },
  );

  landingRules(game);

  assert.strictEqual(game.currentPlayer().position, 19);
  assert.strictEqual(game.currentPlayer().money, 1300);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, [19]);
});

test("landingRules cards - go-back-3 card resolves a landed tax space", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  // Chance at position 7, go back 3 lands on Income Tax at position 4 ($200)
  const goBack3Card = { type: "go-back-3", text: "Go Back 3 Spaces." };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 7 },
      { name: "Darth Vader" },
    ],
    { chanceCards: [goBack3Card] },
  );

  landingRules(game);

  assert.strictEqual(game.currentPlayer().position, 4);
  assert.strictEqual(game.currentPlayer().money, 1300);
});

test("landingRules cards - advance card moves to destination without collecting $200 when Go is not passed", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const advanceCard = {
    type: "advance",
    location: "Illinois Avenue",
    text: "Advance to Illinois Avenue. If you pass Go, collect $200.",
  };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 2, propertyIds: [24] },
      { name: "Darth Vader" },
    ],
    { chanceCards: [advanceCard] },
  );

  landingRules(game);

  assert.strictEqual(game.currentPlayer().position, 24);
  assert.strictEqual(game.currentPlayer().money, 1500);
});

test("landingRules cards - advance to Go collects $200", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const advanceToGoCard = {
    type: "advance",
    location: "Go",
    text: "Advance to Go (Collect $200)",
  };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 22 },
      { name: "Darth Vader" },
    ],
    { chanceCards: [advanceToGoCard] },
  );

  landingRules(game);

  assert.strictEqual(game.currentPlayer().position, 0);
  assert.strictEqual(game.currentPlayer().money, 1700);
});

test("landingRules cards - Get Out of Jail Free card from Community Chest stays with the player", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const getOutOfJailCard = { type: "get-out-jail", text: "Get Out of Jail Free" };
  const nextCard = { type: "collect", value: 100, text: "Holiday fund matures. Receive $100" };
  const { game, communityChestDeck } = setupGame(
    [
      { name: "Luke Skywalker", position: 17 },
      { name: "Darth Vader" },
    ],
    { communityChestCards: [getOutOfJailCard, nextCard] },
  );

  landingRules(game);

  assert.strictEqual(game.currentPlayer().getOutOfJailCards.length, 1);
  assert.deepStrictEqual(communityChestDeck.getCards(), [nextCard]);
  assert.deepStrictEqual(communityChestDeck.getDiscardedCards(), []);
});

test("landingRules cards - nearest railroad card wraps around the board to find the closest railroad", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const railroadCard = {
    type: "advance-nearest-railroad",
    text: "Advance to the nearest Railroad. If owned, pay twice the rental to which they are otherwise entitled.",
  };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 36 },
      { name: "Darth Vader", propertyIds: [5] },
    ],
    { chanceCards: [railroadCard] },
  );

  landingRules(game);

  // From position 36, nearest railroad going forward is Reading Railroad (5), wrapping around
  assert.strictEqual(game.currentPlayer().position, 5);
  assert.strictEqual(game.players[0].money, 1450);
  assert.strictEqual(game.players[1].money, 1550);
});

test("landingRules cards - Community Chest normal card returns to the bottom of the deck", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const firstCard = { type: "collect", value: 50, text: "From sale of stock you get $50" };
  const secondCard = { type: "collect", value: 100, text: "You inherit $100" };
  const { game, communityChestDeck } = setupGame(
    [
      { name: "Luke Skywalker", position: 17 },
      { name: "Darth Vader" },
    ],
    { communityChestCards: [firstCard, secondCard] },
  );

  landingRules(game);

  assert.deepStrictEqual(communityChestDeck.getCards(), [secondCard]);
  assert.deepStrictEqual(communityChestDeck.getDiscardedCards(), [firstCard]);
});

test("landingRules cards - nearest railroad card moves the player and offers to buy the railroad when unowned", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const railroadCard = {
    type: "advance-nearest-railroad",
    text: "Advance to the nearest Railroad. If unowned, you may buy it from the Bank.",
  };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 7 },
      { name: "Darth Vader" },
    ],
    { chanceCards: [railroadCard] },
  );

  landingRules(game);

  // From position 7, nearest railroad going forward is Pennsylvania Railroad (15)
  // Pennsylvania Railroad is unowned — player auto-buys for $200
  assert.strictEqual(game.currentPlayer().position, 15);
  assert.strictEqual(game.players[0].money, 1300);
  assert.deepStrictEqual(game.players[0].propertyIds, [15]);
});

test("landingRules cards - nearest utility card moves the player and offers to buy the utility when unowned", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const utilityCard = {
    type: "advance-nearest-utility",
    text: "Advance token to nearest Utility. If unowned, you may buy it from the Bank.",
  };
  const { game } = setupGame(
    [
      { name: "Luke Skywalker", position: 22 },
      { name: "Darth Vader" },
    ],
    { chanceCards: [utilityCard] },
  );

  landingRules(game);

  // From position 22, nearest utility going forward is Waterworks (28)
  // Waterworks is unowned — player auto-buys for $150
  assert.strictEqual(game.currentPlayer().position, 28);
  assert.strictEqual(game.players[0].money, 1350);
  assert.deepStrictEqual(game.players[0].propertyIds, [28]);
});