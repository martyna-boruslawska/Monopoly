import { createPlayers } from "./createPlayers.js";
import { createBoard } from "./createBoard.js";
import { rollDice } from "./rollDice.js";
import type { Game, Player } from "./types.js";

export function createGame(playerNames: string[]): Game {
  return {
    players: createPlayers(playerNames),
    board: createBoard(),
    rollDice: rollDice,
    currentPlayerId: null,
    lastRoll: null,
    currentPlayer(): Player | null {
      return this.players.find((player: Player) => player.id === this.currentPlayerId) ?? null;
    },
    getActivePlayers(): Player[] {
      return this.players.filter((player: Player) => !player.isBankrupt);
    },
    countActivePlayers(): number {
      return this.getActivePlayers().length;
    },
    nextActivePlayer(): Player | false {
      const activePlayers = this.getActivePlayers();
      if (activePlayers.length === 0) {
        this.currentPlayerId = null;
        return false;
      }
      const player = this.currentPlayer();
      if (player === null) {
        this.currentPlayerId = activePlayers[0].id;
        return this.currentPlayer() as Player;
      }
      const currentIndex = activePlayers.findIndex((p: Player) => p.id === this.currentPlayerId);
      const nextIndex = (currentIndex + 1) % activePlayers.length;
      this.currentPlayerId = activePlayers[nextIndex].id;
      return this.currentPlayer() as Player;
    },
  };
}
