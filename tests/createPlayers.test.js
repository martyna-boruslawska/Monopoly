import test from "node:test";
import assert from "node:assert/strict";
import { createPlayers } from "../game/createPlayers.js";

test("created players use expected object shape and defaults", () => {
  const players = createPlayers(["Martyna", "Jarek"]);

  assert.equal(players.length, 2);

  assert.deepEqual(players[0], {
    id: 1,
    name: "Martyna",
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false,
  });

  assert.deepEqual(players[1], {
    id: 2,
    name: "Jarek",
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false,
  });
});

test("returns an empty list when no player names are provided", () => {
  const players = createPlayers([]);

  assert.deepEqual(players, []);
});

test("creates independent player objects and property lists", () => {
  const players = createPlayers(["Martyna", "Jarek"]);

  players[0].propertyIds.push(99);
  players[0].money = 1200;
  players[0].position = 7;

  assert.deepEqual(players[0].propertyIds, [99]);
  assert.deepEqual(players[1].propertyIds, []);
  assert.equal(players[0].money, 1200);
  assert.equal(players[1].money, 1500);
  assert.equal(players[0].position, 7);
  assert.equal(players[1].position, 0);
});

test("preserves input order and assigns sequential ids", () => {
  const players = createPlayers(["Leia", "Luke", "Han"]);

  assert.equal(players[0].name, "Leia");
  assert.equal(players[0].id, 1);
  assert.equal(players[1].name, "Luke");
  assert.equal(players[1].id, 2);
  assert.equal(players[2].name, "Han");
  assert.equal(players[2].id, 3);
});

test("keeps provided names unchanged", () => {
  const players = createPlayers(["", "  Leia  ", "R2-D2"]);

  assert.equal(players[0].name, "");
  assert.equal(players[1].name, "  Leia  ");
  assert.equal(players[2].name, "R2-D2");
});

