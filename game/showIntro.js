export function showIntro(players) {
console.log(`Players in the game: ${players.map(player => player.name).join(", ")}.
=================================
🎲  MONOPOLY GAME STARTED! 🎲
=================================
`);
}