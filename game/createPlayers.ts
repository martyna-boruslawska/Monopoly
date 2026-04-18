import type { Player } from "./types.js";

export function createPlayers(names: string[]): Player[] {
  let id = 1;
  return names.map(name => createPlayer(name, id++));
}

function createPlayer(name: string, id: number): Player {
  return {
    id,
    name,
    position: 0,
    money: 1500,
    propertyIds: [],
    isBankrupt: false,
    isInJail: false,
    failedJailRolls: 0,
  };
}
