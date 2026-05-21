Issue: Forced mortgage on player-to-player money transfers

Every money transfer from one player to another can leave the payer without enough cash. When that happens the engine must attempt to raise funds through a deterministic forced-mortgage strategy before declaring bankruptcy. This issue adds the forced-mortgage decision layer that sits between a payment obligation and the existing bankruptcy path.

1. Trigger forced mortgage on every player-to-player transfer
   - After any transfer where `fromPlayer.money` drops below zero, run the forced-mortgage strategy before checking bankruptcy
   - Applies to rent payments (streets, railroads, utilities), card-driven transfers, and any future player-to-player payment
   - Transfers to the Bank (taxes, jail bail) already bypass this because the Bank is not a player creditor that receives property on bankruptcy
2. Raise cash by selling buildings for half price
   - A player may sell a house back to the Bank for half of its `houseCost`
   - A hotel counts as five houses; selling a hotel converts it to four houses (returns half of one `houseCost`), or the player may sell all five levels at once for half of 5× `houseCost`
   - Even-building rules apply in reverse: a player may only sell a house from the street with the most buildings in the color set
   - Sell buildings before mortgaging any property in the same color set
3. Raise cash by mortgaging properties
   - Use the same mortgage eligibility rules from the mortgage issue: a street may only be mortgaged when its color set has no buildings
   - Selling all buildings from a set makes its streets eligible for mortgage
4. Define a deterministic forced-mortgage strategy
   - Phase 1 — Sell buildings from streets that are not part of a complete color set (orphan improved streets should not exist under even-building rules, but guard against edge cases)
   - Phase 2 — Mortgage properties that are not part of a complete color set, cheapest first:
     1. utilities
     2. railroads
     3. street properties outside complete sets
   - Phase 3 — Sell all buildings from the least valuable complete color set (by total street purchase price), then mortgage those streets cheapest first
   - Phase 4 — Repeat Phase 3 for each remaining complete set in ascending total value
   - After each individual sale or mortgage, check whether the player now has enough cash to cover the debt; stop as soon as the debt is covered
   - If all eligible assets are exhausted and the player still cannot pay, proceed to bankruptcy
5. Handle bankruptcy transfer to the creditor player
   - When forced mortgage cannot cover the debt, the debtor is bankrupt
   - All remaining properties (including mortgaged ones) transfer to the creditor player, not back to the Bank
   - The creditor inherits mortgaged properties and must immediately pay 10% interest on each inherited mortgage or choose to unmortgage by paying the full unmortgage cost
   - Use a deterministic strategy for the creditor: unmortgage only if the creditor has more than $500 cash after paying the unmortgage cost; otherwise pay the 10% interest to keep the property mortgaged
   - Buildings do not transfer — they were sold during the forced-mortgage phase; transferred properties are always unimproved
6. Keep the implementation local to the existing engine
   - Extend `transferMoney` or wrap it with a debt-resolution step rather than introducing a general action queue
   - Reuse existing mortgage functions from the mortgage issue
   - Do not add human prompts or multi-strategy selection in this issue

# Acceptance Criteria

- [ ] A player-to-player rent payment that drops the payer below zero triggers the forced-mortgage strategy before bankruptcy.
- [ ] Buildings are sold for half their `houseCost`, respecting reverse even-building rules.
- [ ] A hotel sale returns four houses (or sells all five levels) for the correct half-price amount.
- [ ] Properties outside complete color sets are mortgaged before any complete set is touched.
- [ ] Within the non-complete-set category, utilities are mortgaged first, then railroads, then streets.
- [ ] Complete sets are dismantled in order of ascending total street value.
- [ ] The strategy stops as soon as the player has enough cash to cover the debt.
- [ ] When forced mortgage cannot cover the debt the player goes bankrupt and the creditor receives all remaining properties.
- [ ] The creditor inherits mortgaged properties and pays 10% interest or unmortgages based on the $500 surplus rule.
- [ ] Card-driven player-to-player transfers also trigger forced mortgage when needed.

# Suggested Tests

1. A rent payment leaves the payer at negative cash; selling one house covers the debt and no further sales or mortgages occur.
2. Reverse even-building: the strategy sells a house from the street with the most buildings first.
3. A player with no buildings but owned properties outside a complete set mortgages the cheapest utility, then railroad, then street.
4. A player with one complete set and one incomplete set mortgages the incomplete-set properties first.
5. Dismantling a complete set: buildings are sold first, then the now-unimproved streets are mortgaged.
6. Complete sets are dismantled in ascending total value order.
7. The strategy stops mid-sequence as soon as cash covers the debt.
8. Full bankruptcy: all assets exhausted, creditor receives all properties including mortgaged ones.
9. Creditor unmortgages an inherited property when they have more than $500 surplus after the unmortgage cost.
10. Creditor pays only 10% interest on an inherited mortgage when cash is tight.

# Notes

- This issue depends on the mortgage issue being completed first (mortgage state, `mortgageValue`, and basic mortgage/unmortgage functions must exist).
- This issue depends on the houses-hotels issue being completed first (building state, `houseCost`, and sell-building logic).
- Out of scope: auctions on bankruptcy to the Bank, proactive mortgaging to fund building, and trading negotiations.
- The deterministic strategy is intentionally simple; computer-player strategy variations belong to a later issue.
