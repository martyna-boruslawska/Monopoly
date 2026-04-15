
# Short-Term Plans

1. Working with branches.
2. GitHub Pull Requests.
3. Extendable Rules System.
4. End-of-game handling and the main loop.
5. Folder restructuring.
6. Chance and Community Chest cards, including:
  - handle payments to the bank and payouts from the bank
  - handle gift cards: payments from all players to one player (the active player)
  - handle move-to-location cards, including passing Go
  - handle going to jail
  - handle property repairs
  - handle moving to a utility with double payment
  - preserve the "Get Out of Jail Free" card
7. Buying houses and rent - Simple **STRATEGY**, with the following rules:
  - allow switching between different strategies
  - players always buy houses evenly across all of their complete property sets
  - if a player previously developed one full set and now gets a second set, they first equalize the number of houses in the new set and only then continue developing all sets evenly together
  - a player buys a house only if they have at least $300 cash plus the house price
  - example:
  - simplified rent calculation: full rent table
8. GitHub Actions - running tests, introduction to the CI/CD process.


# Longer-Term Plans

1. Mortgaging properties - Simple **STRATEGY**, with the following rules:
  - allow switching between different strategies
  - mortgaging properties is handled at the start of the player's turn (raising money to buy houses) or at payment time when cash is missing (handled in a separate task)
  - at the start of their turn, when a player has at least one complete property set and can build houses on it, but does not have enough cash to buy a house
  - the player calculates the value of their potential assets, meaning all properties excluding complete property sets and excluding railroads if they own 3 or 4 railroad lines
  - the player calculates the value of all mortgaged properties
  - the player may mortgage at most 50% of the value of their free properties in order to buy a house
  - mortgage order:
    - utilities
    - railroads if the player owns 1 railroad line
    - free properties
    - railroads if the player owns 2 railroad lines
  - the cheapest property that is not part of a complete set is mortgaged first
  - a player cannot build a 3rd house if they have mortgaged properties; they must first repay the debt with interest
  - the player repays the debt and restores the full property at the start of their turn if they have at least $300 plus the debt repayment value with interest
  - [definition] free property: a property that is not part of a complete property set, or a utility or railroad, but only if the player owns 1 or 2 railroad lines
2. Full bankruptcy handling, including:
  - handle not having enough money to pay rent or a fee to the bank or another player
  - if a player does not have enough money to pay:
    - the player pays all available cash
    - the player mortgages free properties, in order, until they collect the full amount due
    - the player sells houses starting from the cheapest ones in one of the sets until they collect the full amount due
    - if the player has sold all houses and hotels in a property set, they then mortgage those properties one by one until they collect the amount due
    - after selling houses and hotels in one set and mortgaging its properties, the player does the same for the next property set: first houses and hotels, then properties
    - if the player has no more houses or properties to mortgage and still has not collected the full amount, they go bankrupt
    - in bankruptcy in favour of another player, they transfer all of their properties to that player
3. Property exchange market.
4. Property trading.
5. React visualization.
6. Migrating tests to Jest engine.


# Logs Maintained In Parallel

1. Recording technical debt
2. Identifying critical paths and maintaining test coverage
