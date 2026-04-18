import test from "node:test";
import assert from "node:assert/strict";
import { createPlayers } from "../game/createPlayers.js";

test("createPlayers - created players use expected object shape and defaults", () => {
  const players = createPlayers(["Luke Skywalker", "Darth Vader"]);

  assert.strictEqual(players.length, 2);

  assert.deepStrictEqual(players[0], {
    id: 1,
    name: "Luke Skywalker",
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false,
    isInJail: false,
    failedJailRolls: 0,
  });

  assert.deepStrictEqual(players[1], {
    id: 2,
    name: "Darth Vader",
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false,
    isInJail: false,
    failedJailRolls: 0,
  });
});

test("createPlayers - returns an empty list when no player names are provided", () => {
  const players = createPlayers([]);

  assert.deepStrictEqual(players, []);
});

test("createPlayers - creates independent player objects and property lists", () => {
  const players = createPlayers(["Luke Skywalker", "Darth Vader"]);

  players[0].propertyIds.push(99);
  players[0].money = 1200;
  players[0].position = 7;

  assert.deepStrictEqual(players[0].propertyIds, [99]);
  assert.deepStrictEqual(players[1].propertyIds, []);
  assert.strictEqual(players[0].money, 1200);
  assert.strictEqual(players[1].money, 1500);
  assert.strictEqual(players[0].position, 7);
  assert.strictEqual(players[1].position, 0);
});

test("createPlayers - preserves input order and assigns sequential ids", () => {
  const players = createPlayers(["Leia Organa", "Luke Skywalker", "Darth Vader"]);

  assert.strictEqual(players[0].name, "Leia Organa");
  assert.strictEqual(players[0].id, 1);
  assert.strictEqual(players[1].name, "Luke Skywalker");
  assert.strictEqual(players[1].id, 2);
  assert.strictEqual(players[2].name, "Darth Vader");
  assert.strictEqual(players[2].id, 3);
});

test("createPlayers - keeps provided names unchanged", () => {
  const players = createPlayers(["", "  Leia Organa  ", "R2-D2"]);

  assert.strictEqual(players[0].name, "");
  assert.strictEqual(players[1].name, "  Leia Organa  ");
  assert.strictEqual(players[2].name, "R2-D2");
});
