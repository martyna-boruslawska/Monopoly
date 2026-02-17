export function createPlayers(names) {
  let id = 1;
  return names.map( name => createPlayer(name, id++));
}

function createPlayer(name, id) {
  return {
    id,
    name,
    position: 0,
    money: 1500,
    properties: [],
    isBankrupt: false
  };
}
 