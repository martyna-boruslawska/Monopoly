import { createPlayers } from "./createPlayers.js";
import { createBoard } from "./createBoard.js";
import { rollDice } from "../utils/rollDice.js";
import { playGame } from "../playGame.js";
import { getPlayerTile } from "../utils/gameUtils.js";

export function createGame(playerNames) {
  return {
    players: createPlayers(playerNames),
    board: createBoard(),
    rollDice: rollDice,
    currentPlayerId: null,
    lastRoll: null,
    play() {
      playGame(this);
    },
    currentPlayer() {
      return (
        this.players.find((player) => player.id === this.currentPlayerId) ??
        null
      );
    },
    getActivePlayers() {
      return this.players.filter((player) => !player.isBankrupt);
    },
    countActivePlayers() {
      return this.getActivePlayers().length;
    },
    nextActivePlayer() {
      const activePlayers = this.getActivePlayers();
      if (activePlayers.length === 0) {
        this.currentPlayerId = null;
        return false;
      }
      const player = this.currentPlayer();
      if (player === null) {
        this.currentPlayerId = activePlayers[0].id;
        return this.currentPlayer();
      }
      const currentIndex = activePlayers.findIndex(
        (player) => player.id === this.currentPlayerId,
      );
      const nextIndex = (currentIndex + 1) % activePlayers.length;
      this.currentPlayerId = activePlayers[nextIndex].id;
      return this.currentPlayer();
    },
    countOwnedTilesOfType(owner, tileType) {
      if (tileType !== "utility" && tileType !== "railroad")
        throw new Error(`Unsupported property type: ${tileType}`);
      const tiles = this.board.filter(
        (tile) => tile.type === tileType && tile.ownerId === owner.id,
      );
      return tiles.length;
    },
    getPlayerTile(player) {
      return getPlayerTile(player, this.board);
    }
  };
}
