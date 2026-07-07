import test from "node:test";
import assert from "node:assert/strict";
import { landingRules } from "../../../game/rules/landingRules.js";
import { createTestGame } from "../../helpers/createTestGame.js";

test("mortgageRules - attempt to rise funds to pay tax by mortgaging street, go bankrupt", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 4, money: 50, propertyIds: [1] },
    { name: "Darth Vader" }
  ]);

  //Mediterranean Avenue, price: 60, mortgageValue: 30

  landingRules(game);

  assert.strictEqual(game.currentPlayer().isBankrupt, true);
  assert.strictEqual(game.currentPlayer().money, 0);
  assert.strictEqual(game.board[1].isMortgaged, false);
  assert.strictEqual(game.board[1].ownerId, null);
  assert.deepStrictEqual(game.currentPlayer().propertyIds, []);
});

test("mortgageRules - rise funds to pay rent by mortgaging utility first", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 40, propertyIds: [3, 5, 6, 8, 9, 12] },
    { name: "Darth Vader", propertyIds: [39] }
  ]);
  const tenant = game.players[0];
  const owner = game.players[1];
  const rentedTile = game.board[39]; // Boardwalk, rent 50

  //Baltic Avenue, price: 60, mortgageValue: 30
  //Reading Railroad, price: 200, mortgageValue: 100
  //Electric Company, price: 150, mortgageValue: 75

  landingRules(game);

  assert.strictEqual(tenant.isBankrupt, false);
  assert.strictEqual(tenant.money, 40 + 75 - rentedTile.rent);
  assert.strictEqual(owner.money, 1500 + rentedTile.rent);
  assert.strictEqual(game.board[3].isMortgaged, false);
  assert.strictEqual(game.board[5].isMortgaged, false);
  assert.strictEqual(game.board[6].isMortgaged, false);
  assert.strictEqual(game.board[8].isMortgaged, false);
  assert.strictEqual(game.board[9].isMortgaged, false);
  assert.strictEqual(game.board[12].isMortgaged, true);
});

test("mortgageRules - rise funds to pay tax by mortgaging utility first, railroad second", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 4, money: 40, propertyIds: [3, 5, 6, 8, 9, 12] },
    { name: "Darth Vader" }
  ]);

  //Baltic Avenue, price: 60, mortgageValue: 30
  //Reading Railroad, price: 200, mortgageValue: 100
  //Electric Company, price: 150, mortgageValue: 75

  landingRules(game);

  assert.strictEqual(game.currentPlayer().isBankrupt, false);
  assert.strictEqual(game.currentPlayer().money, 40 + 75 + 100 - game.board[4].amount);
  assert.strictEqual(game.board[3].isMortgaged, false);
  assert.strictEqual(game.board[5].isMortgaged, true);
  assert.strictEqual(game.board[6].isMortgaged, false);
  assert.strictEqual(game.board[8].isMortgaged, false);
  assert.strictEqual(game.board[9].isMortgaged, false);
  assert.strictEqual(game.board[12].isMortgaged, true);
});

test("mortgageRules - rise funds to pay tax by mortgaging utility first, railroad second, out-of-set street third", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 4, money: 10, propertyIds: [3, 5, 6, 8, 9, 12] },
    { name: "Darth Vader" }
  ]);

  //Baltic Avenue, price: 60, mortgageValue: 30
  //Reading Railroad, price: 200, mortgageValue: 100
  //Electric Company, price: 150, mortgageValue: 75

  landingRules(game);

  assert.strictEqual(game.currentPlayer().isBankrupt, false);
  assert.strictEqual(game.currentPlayer().money, 10 + 75 + 100 + 30 - game.board[4].amount);
  assert.strictEqual(game.board[3].isMortgaged, true);
  assert.strictEqual(game.board[5].isMortgaged, true);
  assert.strictEqual(game.board[6].isMortgaged, false);
  assert.strictEqual(game.board[8].isMortgaged, false);
  assert.strictEqual(game.board[9].isMortgaged, false);
  assert.strictEqual(game.board[12].isMortgaged, true);
});

test("mortgageRules - rise funds to pay rent by mortgaging out-of-set street, then cheapest street from complete set", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 10, propertyIds: [3, 6, 8, 9] },
    { name: "Darth Vader", propertyIds: [39] }
  ]);
  const tenant = game.players[0];
  const owner = game.players[1];
  const rentedTile = game.board[39]; // Boardwalk, rent 50

  //Baltic Avenue, price: 60, mortgageValue: 30
  //Oriental Avenue, price: 100, mortgageValue: 50

  landingRules(game);

  assert.strictEqual(tenant.isBankrupt, false);
  assert.strictEqual(tenant.money, 10 + 30 + 50 - rentedTile.rent);
  assert.strictEqual(owner.money, 1500 + rentedTile.rent);
  assert.strictEqual(game.board[3].isMortgaged, true);
  assert.strictEqual(game.board[6].isMortgaged, true);
  assert.strictEqual(game.board[8].isMortgaged, false);
  assert.strictEqual(game.board[9].isMortgaged, false);
});

test("mortgageRules - rise funds to pay rent by mortgaging cheapest street from unimproved complete color set", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 10, propertyIds: [1, 3, 6, 8, 9] },
    { name: "Darth Vader", propertyIds: [39] }
  ]);
  const tenant = game.players[0];
  const owner = game.players[1];
  const rentedTile = game.board[39]; // Boardwalk, rent 50

  game.board[1].houses = 1;

  //Oriental Avenue, price: 100, mortgageValue: 50

  landingRules(game);

  assert.strictEqual(tenant.isBankrupt, false);
  assert.strictEqual(tenant.money, 10 + 50 - rentedTile.rent);
  assert.strictEqual(owner.money, 1500 + rentedTile.rent);
  assert.strictEqual(game.board[1].isMortgaged, false);
  assert.strictEqual(game.board[3].isMortgaged, false);
  assert.strictEqual(game.board[6].isMortgaged, true);
  assert.strictEqual(game.board[8].isMortgaged, false);
  assert.strictEqual(game.board[9].isMortgaged, false);
});

test("mortgageRules - rise funds to pay tax by mortgaging street, selling buildings from least improved set, mortgaging another street", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 4, money: 10, propertyIds: [1, 3, 6, 8, 9, 11, 13, 14] },
    { name: "Darth Vader" }
  ]);

  game.board[1].hasHotel = true;
  game.board[3].hasHotel = true;
  game.board[6].houses = 1;
  game.board[8].houses = 1;
  game.board[9].houses = 1;
  game.board[11].isMortgaged = true;
  game.board[13].isMortgaged = true;
  //Oriental Avenue, price: 100, mortgageValue: 50
  //Virginia Avenue, price: 160, mortgageValue: 80
  //houseCost = 50, refund for selling = 25

  landingRules(game);

  assert.strictEqual(game.currentPlayer().isBankrupt, false);
  assert.strictEqual(game.currentPlayer().money, 10 + 80 + (3*25) + 50 - game.board[4].amount);
  assert.strictEqual(game.board[1].hasHotel, true);
  assert.strictEqual(game.board[3].hasHotel, true);
  assert.strictEqual(game.board[6].houses, 0);
  assert.strictEqual(game.board[8].houses, 0);
  assert.strictEqual(game.board[9].houses, 0);
  assert.strictEqual(game.board[1].isMortgaged, false);
  assert.strictEqual(game.board[3].isMortgaged, false);
  assert.strictEqual(game.board[6].isMortgaged, true);
  assert.strictEqual(game.board[8].isMortgaged, false);
  assert.strictEqual(game.board[9].isMortgaged, false);
  assert.strictEqual(game.board[11].isMortgaged, true);
  assert.strictEqual(game.board[13].isMortgaged, true);
  assert.strictEqual(game.board[14].isMortgaged, true);
});

test("mortgageRules - rise funds to pay tax by selling 1 building from most improved street", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 4, money: 190, propertyIds: [1, 3] },
    { name: "Darth Vader" }
  ]);

  game.board[1].houses = 3;
  game.board[3].houses = 2;
  //houseCost = 50, refund for selling = 25

  landingRules(game);

  assert.strictEqual(game.currentPlayer().isBankrupt, false);
  assert.strictEqual(game.currentPlayer().money, 190 + 25 - game.board[4].amount);
  assert.strictEqual(game.board[1].houses, 2);
  assert.strictEqual(game.board[3].houses, 2);
  assert.strictEqual(game.board[1].isMortgaged, false);
  assert.strictEqual(game.board[3].isMortgaged, false);  
});

test("mortgageRules - rise funds to pay tax by selling buildings evenly, including hotels", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 4, money: 10, propertyIds: [1, 3] },
    { name: "Darth Vader" }
  ]);

  game.board[1].hasHotel = true;
  game.board[3].hasHotel = true;
  //houseCost = 50, refund for selling = 25

  landingRules(game);

  assert.strictEqual(game.currentPlayer().isBankrupt, false);
  assert.strictEqual(game.currentPlayer().money, 10 + (8*25) - game.board[4].amount);
  assert.strictEqual(game.board[1].hasHotel, false);
  assert.strictEqual(game.board[3].hasHotel, false);
  assert.strictEqual(game.board[1].houses, 1);
  assert.strictEqual(game.board[3].houses, 1);
  assert.strictEqual(game.board[1].isMortgaged, false);
  assert.strictEqual(game.board[3].isMortgaged, false);  
});

test("mortgageRules - attempt to rise funds to pay rent by mortgaging street, go bankrupt, rich owner (>500$ after fees) takes assets and removes mortgage", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 10, propertyIds: [1] },
    { name: "Darth Vader", money: 494, propertyIds: [39] }
  ]);
  const tenant = game.players[0];
  const owner = game.players[1];
  const rentedTile = game.board[39]; // Boardwalk, rent 50

  //Mediterranean Avenue, price: 60, mortgageValue: 30

  landingRules(game);

  assert.strictEqual(tenant.isBankrupt, true);
  assert.strictEqual(tenant.money, 0);
  assert.deepStrictEqual(tenant.propertyIds, []);
  assert.strictEqual(owner.money, 494 + 10 + 30 - 1.1*0.5*game.board[1].price);//534-33=501
  assert.strictEqual(game.board[1].isMortgaged, false);
  assert.strictEqual(game.board[1].ownerId, 2);
  assert.deepStrictEqual(owner.propertyIds, [39, 1]);
});

test("mortgageRules - attempt to rise funds to pay rent by mortgaging street, go bankrupt, rich owner (>500$ after fees) takes assets and removes mortgage from 1 street", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 10, propertyIds: [1, 3] },
    { name: "Darth Vader", money: 467, propertyIds: [37, 39] }
  ]);
  const tenant = game.players[0];
  const owner = game.players[1];
  const rentedTile = game.board[39]; // Boardwalk, rent1House 200
  game.board[37].houses = 1;
  game.board[39].houses = 1;

  //Mediterranean Avenue, price: 60, mortgageValue: 30
  //Baltic Avenue, price: 60, mortgageValue: 30

  landingRules(game);

  assert.strictEqual(tenant.isBankrupt, true);
  assert.strictEqual(tenant.money, 0);
  assert.deepStrictEqual(tenant.propertyIds, []);
  assert.strictEqual(owner.money, 467 + 10 + 2*30 - 1.1*0.5*game.board[1].price - 0.1*0.5*game.board[3].price);//467+70-33-3=501
  assert.strictEqual(game.board[1].isMortgaged, false);
  assert.strictEqual(game.board[3].isMortgaged, true);
  assert.strictEqual(game.board[1].ownerId, 2);
  assert.strictEqual(game.board[3].ownerId, 2);
  assert.deepStrictEqual(owner.propertyIds, [37, 39, 1, 3]);
});

test("mortgageRules - attempt to rise funds to pay rent by selling buildings and mortgaging streets, go bankrupt, poor owner (<=500$ after fees) takes assets and keeps mortgage", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 10, propertyIds: [1, 3] },
    { name: "Darth Vader", money: 416, propertyIds: [37, 39] }
  ]);
  const tenant = game.players[0];
  const owner = game.players[1];
  const rentedTile = game.board[39]; // Boardwalk, rent1House 200
  game.board[1].houses = 1;
  game.board[3].houses = 1;
  game.board[37].houses = 1;
  game.board[39].houses = 1;

  //houseCost = 50, refund for selling = 25
  //Mediterranean Avenue, price: 60, mortgageValue: 30
  //Baltic Avenue, price: 60, mortgageValue: 30

  landingRules(game);

  assert.strictEqual(tenant.isBankrupt, true);
  assert.strictEqual(tenant.money, 0);
  assert.deepStrictEqual(tenant.propertyIds, []);
  assert.strictEqual(owner.money, 416 + (10 + 2*25 + 2*30) - 0.1*0.5*game.board[1].price - 0.1*0.5*game.board[3].price);//after fees 416+120-3-3=530 & 530-30=500
  assert.strictEqual(game.board[1].houses, 0);
  assert.strictEqual(game.board[3].houses, 0);
  assert.strictEqual(game.board[1].isMortgaged, true);
  assert.strictEqual(game.board[3].isMortgaged, true);
  assert.strictEqual(game.board[1].ownerId, 2);
  assert.strictEqual(game.board[3].ownerId, 2);
  assert.deepStrictEqual(owner.propertyIds, [37, 39, 1, 3]);
});

test("mortgageRules - bankrupt tenant transfers mortgaged assets to owner who also goes bankrupt unable to pay transfer fees", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  // Railroads (ids: 5,15,25,35) mortgageValue: 4*100=400
  // Streets: purple (ids: 11,13,14) mortgageValue: 70+70+80=220
  // orange (ids: 16,18,19) mortgageValue: 90+90+100=280
  // red (ids: 21,23,24) mortgageValue: 110+110+120=340
  // yellow (ids: 26,27,29) mortgageValue: 130+130+140=400
  // green (ids: 31,32,34) mortgageValue: 150+150+160=460
  // Total mortgageValue=2100, totalBasicFees=210
  // Owner has only Boardwalk (id: 39) mortgageValue: 200, money=0 — mortgages Boardwalk, but 200 < 210 → goes bankrupt
  
  const tenantPropertyIds = [5, 11, 13, 14, 15, 16, 18, 19, 21, 23, 24, 25, 26, 27, 29, 31, 32, 34, 35];
  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 0, propertyIds: tenantPropertyIds },
    { name: "Darth Vader", money: 0, propertyIds: [39] }
  ]);
  const tenant = game.players[0];
  const owner = game.players[1];

  for (const id of tenantPropertyIds) {
    game.board[id].isMortgaged = true;
  }

  landingRules(game);

  assert.strictEqual(tenant.isBankrupt, true);
  assert.strictEqual(tenant.money, 0);
  assert.deepStrictEqual(tenant.propertyIds, []);
  assert.strictEqual(owner.isBankrupt, true);
  assert.strictEqual(owner.money, 0);
  assert.deepStrictEqual(owner.propertyIds, []);
  assert.strictEqual(game.board[5].isMortgaged, false);
  assert.strictEqual(game.board[39].isMortgaged, false);
  assert.strictEqual(game.board[5].ownerId, null);
  assert.strictEqual(game.board[39].ownerId, null);
});
