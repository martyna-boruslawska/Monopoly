export function createPlayers(names) {
  return names.map(createPlayer);
}

function createPlayer(name) {
  return {
    name,
    position: 0,
    money: 1500,
    properties: [],
    isBankrupt: false
  };
}
 