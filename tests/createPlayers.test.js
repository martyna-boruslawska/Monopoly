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
