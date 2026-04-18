import test from "node:test";
import assert from "node:assert/strict";
import { createGame } from "../game/createGame.js";

test("creates game with expected structure and defaults", () => {
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);

  assert.deepStrictEqual(game.players, [
    {
      id: 1,
      name: "Luke Skywalker",
      position: 0,
      money: 1500,
      propertyIds: [],
      isBankrupt: false,
      isInJail: false,
      failedJailRolls: 0,
    },
    {
      id: 2,
      name: "Darth Vader",
      position: 0,
      money: 1500,
      propertyIds: [],
      isBankrupt: false,
      isInJail: false,
      failedJailRolls: 0,
    },
    {
      id: 3,
      name: "Leia Organa",
      position: 0,
      money: 1500,
      propertyIds: [],
      isBankrupt: false,
      isInJail: false,
      failedJailRolls: 0,
    },
  ]);

  assert.deepStrictEqual(game.board, [
    { id: 0, name: "Start", type: "start" },
    {
      id: 1,
      name: "Mediterranean Avenue",
      type: "property",
      color: "dark-purple",
      price: 60,
      rent: 2,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 2, name: "Chance", type: "chance" },
    {
      id: 3,
      name: "Baltic Avenue",
      type: "property",
      color: "dark-purple",
      price: 60,
      rent: 4,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 4, name: "Income Tax", type: "tax", amount: 200 },
    { id: 5, name: "Reading Railroad", type: "railroad", price: 200, rent: 25, ownerId: null },
    {
      id: 6,
      name: "Oriental Avenue",
      type: "property",
      color: "light-blue",
      price: 100,
      rent: 6,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 7, name: "Chance", type: "chance" },
    {
      id: 8,
      name: "Vermont Avenue",
      type: "property",
      color: "light-blue",
      price: 100,
      rent: 6,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    {
      id: 9,
      name: "Connecticut Avenue",
      type: "property",
      color: "light-blue",
      price: 120,
      rent: 8,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 10, name: "Jail", type: "jail" },
    {
      id: 11,
      name: "St. Charles Place",
      type: "property",
      color: "purple",
      price: 140,
      rent: 10,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 12, name: "Electric Company", type: "utility", price: 150, ownerId: null },
    {
      id: 13,
      name: "States Avenue",
      type: "property",
      color: "purple",
      price: 140,
      rent: 10,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    {
      id: 14,
      name: "Virginia Avenue",
      type: "property",
      color: "purple",
      price: 160,
      rent: 12,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    {
      id: 15,
      name: "Pennsylvania Railroad",
      type: "railroad",
      price: 200,
      rent: 25,
      ownerId: null,
    },
    {
      id: 16,
      name: "St. James Place",
      type: "property",
      color: "orange",
      price: 180,
      rent: 14,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 17, name: "Community Chest", type: "community-chest" },
    {
      id: 18,
      name: "Tennessee Avenue",
      type: "property",
      color: "orange",
      price: 180,
      rent: 14,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    {
      id: 19,
      name: "New York Avenue",
      type: "property",
      color: "orange",
      price: 200,
      rent: 16,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 20, name: "Free Parking", type: "free-parking" },
    {
      id: 21,
      name: "Kentucky Avenue",
      type: "property",
      color: "red",
      price: 220,
      rent: 18,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 22, name: "Chance", type: "chance" },
    {
      id: 23,
      name: "Indiana Avenue",
      type: "property",
      color: "red",
      price: 220,
      rent: 18,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    {
      id: 24,
      name: "Illinois Avenue",
      type: "property",
      color: "red",
      price: 240,
      rent: 20,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 25, name: "B & O Railroad", type: "railroad", price: 200, rent: 25, ownerId: null },
    {
      id: 26,
      name: "Atlantic Avenue",
      type: "property",
      color: "yellow",
      price: 260,
      rent: 22,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    {
      id: 27,
      name: "Ventnor Avenue",
      type: "property",
      color: "yellow",
      price: 260,
      rent: 22,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 28, name: "Waterworks", type: "utility", price: 150, ownerId: null },
    {
      id: 29,
      name: "Marvin Gardens",
      type: "property",
      color: "yellow",
      price: 280,
      rent: 24,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 30, name: "Go To Jail", type: "go-to-jail" },
    {
      id: 31,
      name: "Pacific Avenue",
      type: "property",
      color: "green",
      price: 300,
      rent: 26,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    {
      id: 32,
      name: "North Carolina Avenue",
      type: "property",
      color: "green",
      price: 300,
      rent: 26,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 33, name: "Community Chest", type: "community-chest" },
    {
      id: 34,
      name: "Pennsylvania Avenue",
      type: "property",
      color: "green",
      price: 320,
      rent: 28,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 35, name: "Short Line", type: "railroad", price: 200, rent: 25, ownerId: null },
    { id: 36, name: "Chance", type: "chance" },
    {
      id: 37,
      name: "Park Place",
      type: "property",
      color: "dark-blue",
      price: 350,
      rent: 35,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
    { id: 38, name: "Luxury Tax", type: "tax", amount: 100 },
    {
      id: 39,
      name: "Boardwalk",
      type: "property",
      color: "dark-blue",
      price: 400,
      rent: 50,
      ownerId: null,
      houses: 0,
      hasHotel: false,
    },
  ]);
});

test("rollDice method returns an object with two dice values between 1 and 6", () => {
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);

  assert.strictEqual(typeof game.rollDice, "function");
  const diceResult = game.rollDice();
  assert.strictEqual(typeof diceResult.dice1, "number");
  assert.strictEqual(typeof diceResult.dice2, "number");
  assert.ok(diceResult.dice1 >= 1 && diceResult.dice1 <= 6);
  assert.ok(diceResult.dice2 >= 1 && diceResult.dice2 <= 6);
  assert.strictEqual(typeof diceResult.total, "number");
  assert.strictEqual(diceResult.total, diceResult.dice1 + diceResult.dice2);
  assert.strictEqual(typeof diceResult.isDouble, "boolean");
  assert.strictEqual(diceResult.isDouble, diceResult.dice1 === diceResult.dice2);
});

test("currentPlayer method returns null when currentPlayerId is null", () => {
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);

  game.currentPlayerId = null;
  assert.strictEqual(game.currentPlayer(), null);
});

test("nextActivePlayer method returns first active player when currentPlayerId is null", () => {
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);

  game.players[0].isBankrupt = false;
  game.players[1].isBankrupt = false;
  game.players[2].isBankrupt = false;
  game.currentPlayerId = null;

  assert.deepStrictEqual(game.nextActivePlayer(), {
    id: 1,
    name: "Luke Skywalker",
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false,
    isInJail: false,
    failedJailRolls: 0,
  });
  assert.strictEqual(game.currentPlayerId, 1);
});

test("currentPlayer method returns the correct player based on currentPlayerId", () => {
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);

  game.currentPlayerId = 1;
  assert.deepStrictEqual(game.currentPlayer(), {
    id: 1,
    name: "Luke Skywalker",
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false,
    isInJail: false,
    failedJailRolls: 0,
  });
});

test("getActivePlayers method returns an array of active players", () => {
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);

  game.players[0].isBankrupt = false;
  game.players[1].isBankrupt = false;
  game.players[2].isBankrupt = false;
  assert.deepStrictEqual(game.getActivePlayers(), [
    {
      id: 1,
      name: "Luke Skywalker",
      position: 0,
      money: 1500,
      propertyIds: [],
      isBankrupt: false,
      isInJail: false,
      failedJailRolls: 0,
    },
    {
      id: 2,
      name: "Darth Vader",
      position: 0,
      money: 1500,
      propertyIds: [],
      isBankrupt: false,
      isInJail: false,
      failedJailRolls: 0,
    },
    {
      id: 3,
      name: "Leia Organa",
      position: 0,
      money: 1500,
      propertyIds: [],
      isBankrupt: false,
      isInJail: false,
      failedJailRolls: 0,
    },
  ]);

  game.players[0].isBankrupt = true;
  assert.deepStrictEqual(game.getActivePlayers(), [
    {
      id: 2,
      name: "Darth Vader",
      position: 0,
      money: 1500,
      propertyIds: [],
      isBankrupt: false,
      isInJail: false,
      failedJailRolls: 0,
    },
    {
      id: 3,
      name: "Leia Organa",
      position: 0,
      money: 1500,
      propertyIds: [],
      isBankrupt: false,
      isInJail: false,
      failedJailRolls: 0,
    },
  ]);

  game.players[1].isBankrupt = true;
  game.players[2].isBankrupt = true;
  assert.deepStrictEqual(game.getActivePlayers(), []);
});

test("countActivePlayers method returns the correct count of active players", () => {
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);

  game.players[0].isBankrupt = false;
  game.players[1].isBankrupt = false;
  game.players[2].isBankrupt = false;
  assert.strictEqual(game.countActivePlayers(), 3);

  game.players[2].isBankrupt = true;
  assert.strictEqual(game.countActivePlayers(), 2);

  game.players[0].isBankrupt = true;
  game.players[1].isBankrupt = true;
  assert.strictEqual(game.countActivePlayers(), 0);
});

test("nextActivePlayer method returns the next active player and updates currentPlayerId", () => {
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);

  game.players[0].isBankrupt = false;
  game.players[1].isBankrupt = false;
  game.players[2].isBankrupt = false;
  game.currentPlayerId = 2;
  assert.deepStrictEqual(game.nextActivePlayer(), {
    id: 3,
    name: "Leia Organa",
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false,
    isInJail: false,
    failedJailRolls: 0,
  });
  assert.strictEqual(game.currentPlayerId, 3);
  assert.deepStrictEqual(game.nextActivePlayer(), {
    id: 1,
    name: "Luke Skywalker",
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false,
    isInJail: false,
    failedJailRolls: 0,
  });
  assert.strictEqual(game.currentPlayerId, 1);

  game.players[0].isBankrupt = true;
  assert.deepStrictEqual(game.nextActivePlayer(), {
    id: 2,
    name: "Darth Vader",
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false,
    isInJail: false,
    failedJailRolls: 0,
  });
  assert.strictEqual(game.currentPlayerId, 2);
  assert.deepStrictEqual(game.nextActivePlayer(), {
    id: 3,
    name: "Leia Organa",
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false,
    isInJail: false,
    failedJailRolls: 0,
  });
  assert.strictEqual(game.currentPlayerId, 3);

  game.players[1].isBankrupt = true;
  game.players[2].isBankrupt = true;
  assert.strictEqual(game.nextActivePlayer(), false);
  assert.strictEqual(game.currentPlayerId, null);
});

test("nextActivePlayer method skips current player if they become bankrupt", () => {
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);

  game.players[0].isBankrupt = false;
  game.players[1].isBankrupt = false;
  game.players[2].isBankrupt = false;
  game.currentPlayerId = 1;
  game.players[0].isBankrupt = true;
  assert.deepStrictEqual(game.nextActivePlayer(), {
    id: 2,
    name: "Darth Vader",
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false,
    isInJail: false,
    failedJailRolls: 0,
  });
  assert.strictEqual(game.currentPlayerId, 2);
});
