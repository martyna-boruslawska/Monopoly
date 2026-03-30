import { createBoard } from "../game/createBoard.js";
import { createPlayers } from "../game/createPlayers.js";
import { rollDice } from "../game/rollDice.js";

export function createGame(playerNames) {
    const players = createPlayers(playerNames);
    const board = createBoard();
    const currentPlayerId = null;
    
    return {
        players,
        board,
        rollDice,
        currentPlayerId,
        currentPlayer() {
            return this.players.find(p => p.id === this.currentPlayerId) ?? null;
        },
        countActivePlayers() {
            return this.players.filter(p => !p.isBankrupt).length;
        },
        getActivePlayers() {
            return this.players.filter(p => !p.isBankrupt);
        },
        nextActivePlayer() {
            const activePlayers = this.getActivePlayers();
            if (activePlayers.length === 0) {
                this.currentPlayerId = null;
        
                return null;
            }
            const currentIndex = activePlayers.findIndex(p => p.id === this.currentPlayerId);
            const nextIndex = (currentIndex + 1) % activePlayers.length;
            this.currentPlayerId = activePlayers[nextIndex].id;
        
            return this.currentPlayer();
        }
    }

}
