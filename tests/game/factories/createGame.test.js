import test from "node:test";
import assert from "node:assert/strict";
import { createGame } from "../../../game/factories/createGame.js";
import { createBoard } from "../../../game/factories/createBoard.js";

test("creates game with expected structure and defaults", () => {
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);
  
  assert.deepStrictEqual(game.players, [
    { id: 1, name: "Luke Skywalker", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 },
    { id: 2, name: "Darth Vader", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 },
    { id: 3, name: "Leia Organa", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 },
  ]);
  
  assert.deepStrictEqual(game.board, createBoard());
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
  
  assert.deepStrictEqual(game.nextActivePlayer(), { id: 1, name: "Luke Skywalker", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 });
  assert.strictEqual(game.currentPlayerId, 1);
});

test("currentPlayer method returns the correct player based on currentPlayerId", () => {
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);
  
  game.currentPlayerId = 1;
  assert.deepStrictEqual(game.currentPlayer(), { id: 1, name: "Luke Skywalker", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 });
});

test("getActivePlayers method returns an array of active players", () => {
  const game = createGame(["Luke Skywalker", "Darth Vader", "Leia Organa"]);
  
  game.players[0].isBankrupt = false;
  game.players[1].isBankrupt = false;
  game.players[2].isBankrupt = false;
  assert.deepStrictEqual(game.getActivePlayers(), [
    { id: 1, name: "Luke Skywalker", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 },
    { id: 2, name: "Darth Vader", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 },
    { id: 3, name: "Leia Organa", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 },
  ]);
  
  game.players[0].isBankrupt = true;
  assert.deepStrictEqual(game.getActivePlayers(), [
    { id: 2, name: "Darth Vader", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 },
    { id: 3, name: "Leia Organa", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 },
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
  assert.deepStrictEqual(game.nextActivePlayer(), { id: 3, name: "Leia Organa", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 });
  assert.strictEqual(game.currentPlayerId, 3);
  assert.deepStrictEqual(game.nextActivePlayer(), { id: 1, name: "Luke Skywalker", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 });
  assert.strictEqual(game.currentPlayerId, 1);
  
  game.players[0].isBankrupt = true;
  assert.deepStrictEqual(game.nextActivePlayer(), { id: 2, name: "Darth Vader", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 });
  assert.strictEqual(game.currentPlayerId, 2);
  assert.deepStrictEqual(game.nextActivePlayer(), { id: 3, name: "Leia Organa", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 });
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
  assert.deepStrictEqual(game.nextActivePlayer(), { id: 2, name: "Darth Vader", position: 0, money: 1500, propertyIds: [], isBankrupt: false, isInJail: false, failedJailRolls: 0 });
  assert.strictEqual(game.currentPlayerId, 2);
});
