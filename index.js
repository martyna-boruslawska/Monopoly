import { createPlayers } from "./game/createPlayers.js";

let players = createPlayers(["Martyna", "Jarek"]);
players[1].money=150;
players[1].position=12;
players[0].money+=200;
players[0].position=10;
console.log(players);
