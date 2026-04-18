type SummaryPlayer = { name: string; money: number; propertyIds?: number[] };

export function showSummary(players: SummaryPlayer[]): void {
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
    const icon = player.money < 0 ? "💀" : player.money === maxMoney ? "🏆" : "💰";
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
