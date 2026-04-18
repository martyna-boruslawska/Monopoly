import type { Player } from "./types.js";

export function showIntro(players: Player[]): void {
  console.log(`Players in the game: ${players.map(player => player.name).join(", ")}.
=================================
🎲  MONOPOLY GAME STARTED! 🎲
=================================
`);
}
