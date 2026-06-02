import { transferMoney } from "../../utils/transferMoney.js";
import { sendCurrentPlayerToJail } from "../jailRules.js";
import { landingRules } from "../landingRules.js";

const BOARD_SIZE = 40;
const RAILROAD_POSITIONS = [5, 15, 25, 35];
const UTILITY_POSITIONS = [12, 28];
const RAILROAD_RENT = [25, 50, 100, 200];

function findNearestPosition(currentPosition, positions) {
  let nearest = null;
  let minDistance = Infinity;
  for (const pos of positions) {
    const distance = (pos - currentPosition + BOARD_SIZE) % BOARD_SIZE;
    if (distance > 0 && distance < minDistance) {
      minDistance = distance;
      nearest = pos;
    }
  }
  return nearest;
}

function resolveCard(game, card, deck) {
  const player = game.currentPlayer();

  switch (card.type) {
    case "collect":
      player.money += card.value;
      console.log(`${player.name} collects $${card.value}. ${card.text}`);
      return true;

    case "pay":
      player.money -= card.value;
      console.log(`${player.name} pays $${card.value}. ${card.text}`);
      return true;

    case "gift-from-players":
      for (const other of game.players.filter((p) => p.id !== player.id)) {
        transferMoney(other, player, card.value);
      }
      console.log(`${player.name} collects $${card.value} from each player. ${card.text}`);
      return true;

    case "pay-each-player":
      for (const other of game.players.filter((p) => p.id !== player.id)) {
        transferMoney(player, other, card.value);
      }
      console.log(`${player.name} pays $${card.value} to each player. ${card.text}`);
      return true;

    case "get-out-jail":
      player.getOutOfJailCards.push({ card, deck });
      console.log(`${player.name} receives a Get Out of Jail Free card.`);
      return false;

    case "get-to-jail":
      console.log(`${player.name} goes to jail. ${card.text}`);
      sendCurrentPlayerToJail(game);
      return true;

    case "advance": {
      const locationName = card.location === "Go" ? "Start" : card.location;
      const targetTile = game.board.find((t) => t.name === locationName);
      const targetPosition = game.board.indexOf(targetTile);
      if (targetPosition < player.position) {
        player.money += 200;
        console.log(`${player.name} passes Start and collects $200.`);
      }
      player.position = targetPosition;
      console.log(`${player.name} advances to ${card.location}.`);
      return true;
    }

    case "advance-nearest-railroad": {
      const nearestRailroad = findNearestPosition(player.position, RAILROAD_POSITIONS);
      player.position = nearestRailroad;
      const railroadTile = game.board[nearestRailroad];
      console.log(`${player.name} advances to nearest railroad: ${railroadTile.name}.`);
      if (railroadTile.ownerId && railroadTile.ownerId !== player.id) {
        const owner = game.players.find((p) => p.id === railroadTile.ownerId);
        const railroadsOwned = game.countOwnedTilesOfType(owner, "railroad");
        const rent = RAILROAD_RENT[railroadsOwned - 1] * 2;
        transferMoney(player, owner, rent);
        console.log(`${player.name} pays ${owner.name} $${rent} (doubled railroad rent).`);
      }
      return true;
    }

    case "advance-nearest-utility": {
      const nearestUtility = findNearestPosition(player.position, UTILITY_POSITIONS);
      player.position = nearestUtility;
      const utilityTile = game.board[nearestUtility];
      console.log(`${player.name} advances to nearest utility: ${utilityTile.name}.`);
      if (utilityTile.ownerId && utilityTile.ownerId !== player.id) {
        const owner = game.players.find((p) => p.id === utilityTile.ownerId);
        const rent = game.lastRoll.total * 10;
        transferMoney(player, owner, rent);
        console.log(`${player.name} pays ${owner.name} $${rent} (10x dice roll).`);
      }
      return true;
    }

    case "go-back-3": {
      player.position = (player.position - 3 + BOARD_SIZE) % BOARD_SIZE;
      console.log(`${player.name} goes back 3 spaces to ${game.board[player.position].name}.`);
      landingRules(game);
      return true;
    }

    default:
      console.log(`Unknown card type: ${card.type}`);
      return true;
  }
}

function drawAndResolve(game, deck) {
  const card = deck.drawCard();
  console.log(`${game.currentPlayer().name} draws card: ${card.text}`);
  const returnToDeck = resolveCard(game, card, deck);
  if (returnToDeck) {
    deck.returnCard(card);
  }
}

export function handleChanceCard(game) {
  if (!game.chanceDeck) return;
  drawAndResolve(game, game.chanceDeck);
}

export function handleCommunityChestCard(game) {
  if (!game.communityChestDeck) return;
  drawAndResolve(game, game.communityChestDeck);
}
