import { gameUtils } from "../../utils/gameUtils.js";
import { sendCurrentPlayerToJail } from "../jailRules.js";

export function handleCardDraw(game, cardType) {
  const player = game.currentPlayer();
  const tile = game.getPlayerTile(player);

  if (!tile || (tile.type !== "chance" && tile.type !== "community-chest")) {
    return false;
  }

  const deck = cardType === "chance" ? game.chanceDeck : game.communityChestDeck;
  const card = deck.drawCard();

  console.log(`${player.name} drew ${cardType} card: ${card.text}`);
  resolveCard(game, player, card, deck);
  return true;
}

function resolveCard(game, player, card, deck) {
  switch (card.type) {
    case "advance":
      handleAdvance(game, player, card.location);
      break;
    case "advance-nearest-railroad":
      handleAdvanceNearestRailroad(game, player);
      break;
    case "advance-nearest-utility":
      handleAdvanceNearestUtility(game, player);
      break;
    case "collect":
      player.money += card.value;
      break;
    case "pay":
      player.money -= card.value;
      break;
    case "pay-each-player":
      handlePayEachPlayer(game, player, card.value);
      break;
    case "gift-from-players":
      handleCollectFromPlayers(game, player, card.value);
      break;
    case "get-out-jail":
      player.hasGetOutOfJailFreeCard = true;
      break;
    case "get-to-jail":
      sendCurrentPlayerToJail(game);
      break;
    case "go-back-3":
      player.position = Math.max(0, player.position - 3);
      break;
    case "property-repairs":
    case "street-repairs":
      handleRepairs(game, player, card.type);
      break;
    default:
      console.warn(`Unknown card type: ${card.type}`);
  }

  if (card.type !== "get-out-jail") {
    deck.returnCard(card);
  }
}

function handleAdvance(game, player, location) {
  const targetTile = game.board.find(t => t.name === location);
  if (!targetTile) return;

  const oldPosition = player.position;
  player.position = targetTile.id;

  if (player.position < oldPosition) {
    player.money += 200;
  }
}

function handleAdvanceNearestRailroad(game, player) {
  const railroads = game.board.map((t, i) => ({ ...t, index: i })).filter(t => t.type === "railroad");
  let nearest = null, minDist = Infinity;

  for (const rr of railroads) {
    let d = rr.index - player.position;
    if (d <= 0) d += game.board.length;
    if (d < minDist) { minDist = d; nearest = rr; }
  }

  if (nearest) {
    const oldPos = player.position;
    player.position = nearest.index;
    if (player.position < oldPos) player.money += 200;
  }
}

function handleAdvanceNearestUtility(game, player) {
  const utils = game.board.map((t, i) => ({ ...t, index: i })).filter(t => t.type === "utility");
  let nearest = null, minDist = Infinity;

  for (const u of utils) {
    let d = u.index - player.position;
    if (d <= 0) d += game.board.length;
    if (d < minDist) { minDist = d; nearest = u; }
  }

  if (nearest) {
    const oldPos = player.position;
    player.position = nearest.index;
    if (player.position < oldPos) player.money += 200;
  }
}

function handlePayEachPlayer(game, player, amount) {
  for (const p of game.players.filter(p => p.id !== player.id)) {
    p.money += amount;
    player.money -= amount;
  }
}

function handleCollectFromPlayers(game, player, amount) {
  for (const p of game.players.filter(p => p.id !== player.id)) {
    p.money -= amount;
    player.money += amount;
  }
}

function handleRepairs(game, player, repairType) {
  const costPerHouse = repairType === "street-repairs" ? 40 : 25;
  const costPerHotel = repairType === "street-repairs" ? 115 : 100;
  let total = 0;

  for (const prop of game.board.filter(t => t.type === "property")) {
    if (prop.owner === player.id) {
      total += (prop.houses || 0) * costPerHouse + (prop.hotels || 0) * costPerHotel;
    }
  }
  player.money -= total;
}

export { resolveCard };
