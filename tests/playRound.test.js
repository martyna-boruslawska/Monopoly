import test from "node:test";
import assert from "node:assert/strict";
import { playRound } from "../game/playRound.js";
import { createTestGame } from "./helpers/createTestGame.js";

test("skips players who are already bankrupt", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Martyna", position: 5 },
    { name: "Jarek" },
  ]);

  game.players[0].isBankrupt = true;

  const randomValues = [0, 0.2]; // dice: 1 and 2
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 5);
  assert.equal(game.players[1].position, 3);
});

test("plays one turn for a non-bankrupt player", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createTestGame([{ name: "Luke" }]);

  const randomValues = [0, 0.2];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 3);
});

test("gives another turn after rolling doubles", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createTestGame([{ name: "Luke" }]);

  const randomValues = [0, 0, 0.2, 0.4];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 7);
});

test("stops after three doubles", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createTestGame([{ name: "Luke" }]);

  const randomValues = [0, 0, 0, 0, 0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 6);
  assert.equal(index, 6);
});

test("stops extra turns when player becomes bankrupt after a double", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createTestGame([{ name: "Luke", position: 36, money: 50 }]);

  const randomValues = [0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 38);
  assert.equal(game.players[0].money, -50);
  assert.equal(game.players[0].isBankrupt, true);
  assert.equal(index, 2);
});

test("logs a message when a player is transferred to jail", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Darth Vader", position: 27 },
    { name: "Han Solo" },
  ]);

  const randomValues = 
  [
    0, 0.2,     0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail

  // Assert
  assert.equal(game.players[0].position, 10);
  assert(logMessages.some((msg) => msg.includes("is sent to jail for landing on Go To Jail")));
});

test("stops extra turns when player goes to jail after a double", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createTestGame([{ name: "Luke", position: 28 }]);

  const randomValues = [0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 10);
  assert.equal(game.players[0].inJail, true);
});

test("stops extra turns when player goes to jail after a second double", (context) => {
  // Arrange
  context.mock.method(console, "log", () => {});
  const game = createTestGame([{ name: "Luke", position: 26 }]);

  const randomValues = [0, 0, 0, 0, 0, 0];
  let index = 0;
  context.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);

  // Assert
  assert.equal(game.players[0].position, 10);
  assert.equal(game.players[0].inJail, true);
});

test("logs a message when a player is in jail they cannot collect rent", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Darth Maul", position: 28, propertyIds: [6] },
    { name: "Obi-Wan", position: 1 },
  ]);

  const randomValues = 
  [
    0, 0,     0.2, 0.4
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail
  
  // Assert
  assert.equal(game.players[0].money, 1500); // Should not pay rent because Darth Maul is in jail
  assert.equal(game.players[1].position, 6); // Should move to Oriental Avenue (id: 6)
  assert(logMessages.some((msg) => msg.includes("is in jail and cannot collect rent from")));
});

test("logs a message when a player pays $50 to get out of jail (player rolls non doubles before and after jail)", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Darth Sidious", position: 27, money: 50 },
    { name: "Han Solo", position: 6 },
  ]);

  const randomValues = 
  [
    0, 0.2,     0, 0.2, 
    0.6, 0.99
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail after rolling 1 and 2
  assert(logMessages.some((msg) => msg.includes("is sent to jail for landing on Go To Jail")));
  playRound(game);  // 1st player pays $50 and gets out of jail

  // Assert
  assert.equal(game.players[0].position, 20);
  assert.equal(game.players[0].money, 0);
  assert(logMessages.some((msg) => msg.includes("pays $50 to get out of jail")));
});

test("logs a message when a player pays $50 to get out of jail (player rolls doubles before jail and non doubles after)", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Darth Sidious", position: 28, money: 50 },
    { name: "Han Solo", position: 6 },
  ]);

  const randomValues = 
  [
    0, 0,     0, 0.2, 
    0.6, 0.99
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail
  assert(logMessages.some((msg) => msg.includes("is sent to jail for landing on Go To Jail")));
  playRound(game);  // his 1st pays $50 and gets out of jail

  // Assert
  assert.equal(game.players[0].position, 20);
  assert.equal(game.players[0].money, 0);
  assert(logMessages.some((msg) => msg.includes("pays $50 to get out of jail")));
});


test("logs a message when a player pays $50 to get out of jail (player rolls non doubles before jail and doubles after)", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Darth Sidious", position: 27, money: 50 },
    { name: "Han Solo", position: 6 },
  ]);

  const randomValues = 
  [
    0, 0.2,     0, 0.2, 
    0.8, 0.8,   0, 0.2,
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail after rolling 1 and 2
  assert(logMessages.some((msg) => msg.includes("is sent to jail for landing on Go To Jail")));
  playRound(game);  // 1st player pays $50 and gets out of jail

  // Assert
  assert.equal(game.players[0].position, 23);
  assert.equal(game.players[0].money, 0);
  assert(logMessages.some((msg) => msg.includes("pays $50 to get out of jail")));
});

test("logs a message when a player pays $50 to get out of jail (player rolls doubles before and after jail)", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Darth Sidious", position: 28, money: 50 },
    { name: "Han Solo", position: 6 },
  ]);

  const randomValues = 
  [
    0, 0,     0, 0.2, 
    0.8, 0.8,   0, 0.2,
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail after rolling 1 and 2
  assert(logMessages.some((msg) => msg.includes("is sent to jail for landing on Go To Jail")));
  playRound(game);  // 1st player pays $50 and gets out of jail

  // Assert
  assert.equal(game.players[0].position, 23);
  assert.equal(game.players[0].money, 0);
  assert(logMessages.some((msg) => msg.includes("pays $50 to get out of jail")));
});

test("logs a message when a player rolls doubles to get out of jail in 1st jail round", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Boba Fett", position: 28, money: 49 },
    { name: "Han Solo", position: 6 },
  ]);

  const randomValues = 
    [
    0, 0,   0, 0.2, 
    0, 0,   0, 0.2,
    0, 0.2, 0, 0.2,
    ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail
  playRound(game);  // his 1st attempt to get out of jail - succeeds

  // Assert
  assert.equal(game.players[0].position, 12);
  assert(logMessages.some((msg) => msg.includes("rolls doubles and gets out of jail")));
});

test("logs a message when a player rolls doubles to get out of jail in 2nd jail round", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Boba Fett", position: 28, money: 49 },
    { name: "Han Solo", position: 6 },
  ]);

  const randomValues = 
  [
    0, 0, 0, 0.2, 
    0, 0.2, 0, 0.2,
    0, 0, 0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail
  playRound(game);  // his 1st attempt to get out of jail - fails
  playRound(game);  // his 2nd attempt to get out of jail - succeeds

  // Assert
  assert.equal(game.players[0].position, 12);       
  assert(logMessages.some((msg) => msg.includes("rolls doubles and gets out of jail")));
});

test("logs a message when a player rolls doubles to get out of jail in 3rd jail round", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Boba Fett", position: 28, money: 49 },
    { name: "Han Solo", position: 6 },
  ]);

  const randomValues = 
  [
    0, 0,   0, 0.2, 
    0, 0.2, 0, 0.2,
    0, 0.2, 0, 0.2,
    0, 0,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail
  playRound(game);  // his 1st attempt to get out of jail - fails
  playRound(game);  // his 2nd attempt to get out of jail - fails
  playRound(game);  // his 3rd attempt to get out of jail - succeeds

  // Assert
  assert.equal(game.players[0].position, 12);       
  assert(logMessages.some((msg) => msg.includes("rolls doubles and gets out of jail")));
});

test("logs a message when a player fails to roll doubles to get out of jail", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Luke Skywalker", position: 28, money: 49 },
    { name: "Han Solo", position: 6 },
  ]);

  const randomValues = 
  [
    0, 0,     0, 0.2, 
    0, 0.2,   0, 0.2,
    0, 0.2,   0, 0.2,
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player goes to jail
  playRound(game);  // 1st attempt to get out of jail - fails
  playRound(game);  // 2nd attempt to get out of jail - fails
  playRound(game);  // 3rd attempt to get out of jail - fails

  // Assert
  assert.equal(game.players[0].position, 10);       
  assert.ok(game.players[0].isBankrupt); // Player should be bankrupt after failing to roll doubles 3 times in jail with only $49
  assert(logMessages.some((msg) => msg.includes("fails to roll doubles and remains in jail")));
});

test("player moves on after landing on Jail tile", (ctx) => {
  // Arrange
  ctx.mock.method(console, "log", () => {});
  const game = createTestGame([
    { name: "Leia", position: 7 },
    { name: "Han Solo", position: 6 },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2, 
    0, 0.2,   0, 0.2,
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on Jail tile
  playRound(game);  // 1st player moves out of jail tile

  // Assert
  assert.equal(game.players[0].position, 13); 
});

test("player gets another turn after landing on Jail tile and rolling doubles", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Leia", position: 7 },
    { name: "Han Solo", position: 6 },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2, 
    0, 0,     
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on Jail tile
  playRound(game);  // 1st player rolls doubles and moves out of jail
  
  // Assert
  assert.equal(game.players[0].position, 15); 
});

test("player gets another turn after landing on Jail tile and rolling doubles twice", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Leia", position: 7 },
    { name: "Han Solo", position: 6 },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2, 
    0, 0,     
    0, 0,
    0, 0.2,   0, 0
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on Jail tile
  playRound(game);  // 1st player rolls doubles twice and moves out of jail tile
  
  // Assert
  assert.equal(game.players[0].position, 17); 
});

test("player gets another turn after landing on Jail tile and rolling doubles 3 times", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Leia", position: 7 },
    { name: "Han Solo", position: 6 },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2, 
    0, 0,     
    0, 0,
    0, 0,     0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on Jail tile
  playRound(game);  // 1st player rolls doubles 3 times and moves out of jail tile
  
  // Assert
  assert.equal(game.players[0].position, 16); 
});

test("player lands on free utility and buys it", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Obi-Wan", position: 9 },
    { name: "Luke" },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player buys Electric Company
  
  // Assert
  assert.strictEqual(game.players[0].position, 12);
  assert.strictEqual(game.players[0].money, 1500 - 150);
  assert.strictEqual(game.board[12].ownerId, game.players[0].id);
  assert.deepStrictEqual(game.players[0].propertyIds, [12]);
  assert(logMessages.some((msg) => msg.includes("Obi-Wan bought Electric Company for $150")));
});

test("player lands on free railroad and buys it", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Rey", position: 2 },
    { name: "Kylo" },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player buys Reading Railroad
  
  // Assert
  assert.strictEqual(game.players[0].position, 5);
  assert.strictEqual(game.players[0].money, 1500 - 200);
  assert.strictEqual(game.board[5].ownerId, game.players[0].id);
  assert.deepStrictEqual(game.players[0].propertyIds, [5]);
  assert(logMessages.some((msg) => msg.includes("bought Reading Railroad for $200")));
});

test("player lands on his own utility - no rent charged", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Obi-Wan", position: 9, propertyIds: [12] },
    { name: "Luke" },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on his own Electric Company
  
  // Assert
  assert.strictEqual(game.players[0].position, 12);
  assert.strictEqual(game.players[0].money, 1500);
  assert(logMessages.some((msg) => !msg.includes("Obi-Wan pays")));
});

test("player lands on his own railroad - no rent charged", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Rey", position: 2, propertyIds: [5] },
    { name: "Kylo" },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on his own railroad
  
  // Assert
  assert.strictEqual(game.players[0].position, 5);
  assert.strictEqual(game.players[0].money, 1500);
  assert(logMessages.some((msg) => !msg.includes("Rey pays")));
});

test("player lands on railroad - owner has 1 railroad", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Kylo", position: 2 },
    { name: "Rey", position: 17, propertyIds: [5] },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on a railroad owned by another player
  
  // Assert
  assert.strictEqual(game.players[0].position, 5);
  assert.strictEqual(game.players[0].money, 1500 - 25);
  assert.strictEqual(game.players[1].money, 1500 + 25);
  assert(logMessages.some((msg) => msg.includes("Kylo pays Rey $25 for landing on Reading Railroad (1 railroad owned)")));
});

test("player lands on railroad - owner has 2 railroads", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Kylo", position: 2 },
    { name: "Rey", position: 17, propertyIds: [5, 15] },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on a railroad owned by another player
  
  // Assert
  assert.strictEqual(game.players[0].position, 5);
  assert.strictEqual(game.players[0].money, 1500 - 50);
  assert.strictEqual(game.players[1].money, 1500 + 50);
  assert(logMessages.some((msg) => msg.includes("Kylo pays Rey $50 for landing on Reading Railroad (2 railroads owned)")));
});

test("player lands on railroad - owner has 3 railroads", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Kylo", position: 2 },
    { name: "Rey", position: 17, propertyIds: [5, 15, 25] },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on a railroad owned by another player
  
  // Assert
  assert.strictEqual(game.players[0].position, 5);
  assert.strictEqual(game.players[0].money, 1500 - 100);
  assert.strictEqual(game.players[1].money, 1500 + 100);
  assert(logMessages.some((msg) => msg.includes("Kylo pays Rey $100 for landing on Reading Railroad (3 railroads owned)")));
});

test("player lands on railroad - owner has 4 railroads", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Kylo", position: 2 },
    { name: "Rey", position: 17, propertyIds: [5, 15, 25, 35] },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on a railroad owned by another player
  
  // Assert
  assert.strictEqual(game.players[0].position, 5);
  assert.strictEqual(game.players[0].money, 1500 - 200);
  assert.strictEqual(game.players[1].money, 1500 + 200);
  assert(logMessages.some((msg) => msg.includes("Kylo pays Rey $200 for landing on Reading Railroad (4 railroads owned)")));
});

test("player lands on utility - owner has 1 utility", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Luke", position: 9 },
    { name: "Obi-Wan", position: 17, propertyIds: [12] },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on his own Electric Company
  
  // Assert
  assert.strictEqual(game.players[0].position, 12);
  assert.strictEqual(game.players[0].money, 1500 - (4*3)); // Should pay 4*3 = $12 for landing on Electric Company with 1 utility owned by the owner
  assert.strictEqual(game.players[1].money, 1500 + (4*3)); // Owner should receive the rent paid by the player
  assert(logMessages.some((msg) => msg.includes("Luke pays Obi-Wan $12 for landing on Electric Company (1 utility owned)")));
});

test("player lands on utility - owner has 2 utilities", (ctx) => {
  // Arrange
  const logMessages = [];
  ctx.mock.method(console, "log", (message) => logMessages.push(message));
  const game = createTestGame([
    { name: "Luke", position: 9 },
    { name: "Obi-Wan", position: 17, propertyIds: [12, 28] },
  ]);

  const randomValues = 
  [
    0, 0.2,   0, 0.2
  ];
  let index = 0;
  ctx.mock.method(Math, "random", () => randomValues[index++] ?? 0);

  // Act
  playRound(game);  // 1st player lands on his own Electric Company
  
  // Assert
  assert.strictEqual(game.players[0].position, 12);
  assert.strictEqual(game.players[0].money, 1500 - (10*3)); // Should pay 10*3 = $30 for landing on Electric Company with 2 utilities owned by the owner
  assert.strictEqual(game.players[1].money, 1500 + (10*3)); // Owner should receive the rent paid by the player
  assert(logMessages.some((msg) => msg.includes("Luke pays Obi-Wan $30 for landing on Electric Company (2 utilities owned)")));
});
