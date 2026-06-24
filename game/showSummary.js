/**
 * Displays a summary of the game, showing each player's name, money, and properties.
 * Players are sorted by their money in descending order, with the richest player at the top.
 * The richest player is marked with a trophy icon (🏆), while players with negative money are marked with a skull icon (💀).
 * Each player's properties are listed with their IDs.
 * 
 * @param {Array<{id: number, name: string, money: number, propertyIds: number[]}>} players 
 */

export function showSummary(players) {
  console.log("=================================");
  console.log("🏁  Game Summary 🏁");
  console.log("=================================");
  console.log("");

  const maxMoney = Math.max(...players.map(player => player.money));
  const playersSortedByMoney = [...players].sort(
    (firstPlayer, secondPlayer) => secondPlayer.money - firstPlayer.money,
  );

  const summaryRows = playersSortedByMoney.map(player => {
    const moneyLabel = player.money < 0 ? `-$${Math.abs(player.money)}` : `$${player.money}`;
    const icon = player.isBankrupt ? "💀" : player.money === maxMoney ? "🏆" : "💰";
    const propertyIds = player.propertyIds || [];
    const propertiesLabel = `[${propertyIds.join(", ")}]`;
    const nameLabel = `${icon}  ${player.name}:`;

    return {
      nameLabel,
      moneyLabel,
      propertyIds,
      propertiesLabel,
    };
  });

  const nameColumnWidth = Math.max(...summaryRows.map(row => row.nameLabel.length));
  const moneyColumnWidth = Math.max(...summaryRows.map(row => row.moneyLabel.length));

  for (const row of summaryRows) {
    console.log(
      `${row.nameLabel.padEnd(nameColumnWidth)}  ${row.moneyLabel.padStart(moneyColumnWidth)} | 🏠  properties (${row.propertyIds.length}): ${row.propertiesLabel}`,
    );
  }
}
