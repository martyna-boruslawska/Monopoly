export function transferMoney(fromPlayer, toPlayer, amount) {
  if (amount <= 0) return;

  if (!fromPlayer) throw new Error("fromPlayer must be a valid player object.");
  if (!toPlayer) throw new Error("toPlayer must be a valid player object.");

  fromPlayer.money -= amount;
  toPlayer.money += amount;
}
