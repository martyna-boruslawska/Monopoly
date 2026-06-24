import test from "node:test";
import assert from "node:assert/strict";
import { createTestGame } from "../../helpers/createTestGame.js";
import { transferMoneyBetweenPlayers, subtractMoneyFromPlayer } from "../../../game/utils/transferMoney.js";

test("transferMoneyBetweenPlayers - transfers from one player to another", () => {
  const fromPlayer = { id: 1, name: "Luke Skywalker", money: 1500 };
  const toPlayer = { id: 2, name: "Darth Vader", money: 1500 };

  transferMoneyBetweenPlayers(fromPlayer, toPlayer, 200);

  assert.strictEqual(fromPlayer.money, 1300);
  assert.strictEqual(toPlayer.money, 1700);
});

test("transferMoneyBetweenPlayers - does nothing when the transfer amount is zero", () => {
  const fromPlayer = { id: 1, name: "Luke Skywalker", money: 1500 };
  const toPlayer = { id: 2, name: "Darth Vader", money: 1500 };

  transferMoneyBetweenPlayers(fromPlayer, toPlayer, 0);

  assert.strictEqual(fromPlayer.money, 1500);
  assert.strictEqual(toPlayer.money, 1500);
});

test("transferMoneyBetweenPlayers - does nothing when the transfer amount is negative", () => {
  const fromPlayer = { id: 1, name: "Luke Skywalker", money: 1500 };
  const toPlayer = { id: 2, name: "Darth Vader", money: 1500 };

  transferMoneyBetweenPlayers(fromPlayer, toPlayer, -50);

  assert.strictEqual(fromPlayer.money, 1500);
  assert.strictEqual(toPlayer.money, 1500);
});

test("transferMoneyBetweenPlayers - throws when fromPlayer is missing for a positive transfer", () => {
  const toPlayer = { id: 2, name: "Darth Vader", money: 1500 };

  assert.throws(
    () => transferMoneyBetweenPlayers(null, toPlayer, 100),
    { message: "fromPlayer must be a valid player object." },
  );
});

test("transferMoneyBetweenPlayers - throws when toPlayer is missing for a positive transfer", () => {
  const fromPlayer = { id: 1, name: "Luke Skywalker", money: 1500 };

  assert.throws(
    () => transferMoneyBetweenPlayers(fromPlayer, null, 100),
    { message: "toPlayer must be a valid player object." },
  );
});

test("subtractMoneyFromPlayer - subtracts amount from player", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", money: 1500 }
  ]);
  const player = game.players[0];

  subtractMoneyFromPlayer(player, 200, game);

  assert.strictEqual(player.money, 1300);
});

test("subtractMoneyFromPlayer - does nothing when the amount is zero", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", money: 1500 }
  ]);
  const player = game.players[0];

  subtractMoneyFromPlayer(player, 0, game);

  assert.strictEqual(player.money, 1500);
});

test("subtractMoneyFromPlayer - does nothing when the amount is negative", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", money: 1500 }
  ]);
  const player = game.players[0];

  subtractMoneyFromPlayer(player, -50, game);

  assert.strictEqual(player.money, 1500);
});

test("subtractMoneyFromPlayer - throws when player is missing", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", money: 1500 }
  ]);
  assert.throws(
    () => subtractMoneyFromPlayer(null, 100, game),
    { message: "player must be a valid player object." },
  );
});

test("subtractMoneyFromPlayer - cannot subtract more than player has, player goes bankrupt", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", money: 50 }
  ]);
  const player = game.players[0];

  subtractMoneyFromPlayer(player, 200, game);

  assert.strictEqual(player.money, 0);
});
