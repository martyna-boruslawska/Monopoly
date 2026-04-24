# Homework: Add Go To Jail logic

Add support for the `Jail` and `Go To Jail` tiles. Implement:

- When a player lands on `Go To Jail`, move them directly to the `Jail` tile. Do not give them $200 for passing `Go`.
- Player is not in jail when it was a move to the `Jail` tile. The player is just visiting the jail, and can move out of it on the next turn
- When a player is in jail, they skip their turn and do not collect rent from other players. They can get out of jail by:
   - Paying $50 at the start of their turn, before rolling the dice, then they can move as normal.
   - Rolling doubles on the dice. If they succeed, they move out of jail and can move as normal. If they fail, they stay in jail for one more turn.
   - If a player fails to roll doubles for three consecutive turns, they must pay $50 to get out of jail or declare bankruptcy if they cannot pay.

#Logging

When a player is transferred to jail
```
Darth Vader is sent to jail for landing on Go To Jail.
```

When a player is in jail and cannot collect rent
```
Darth Maul is in jail and cannot collect rent from Obi-Wan.
```

When a player pays to get out of jail
```
Darth Sidious pays $50 to get out of jail.
```

When a player rolls doubles to get out of jail
```
Boba Fett rolls doubles and gets out of jail.
```

When a player fails to roll doubles to get out of jail
```
Luke Skywalker fails to roll doubles and remains in jail.
```

# Current Implementation

Players always pay $50 to exit the jail,  When they have enough funds

# Acceptance Criteria

- Landing on tile `Go To Jail` moves the player to tile `Jail`. The player does not receive `$200` for passing `Go`.
- The game logs a message indicating the player was sent to jail, stays in jail, or gets out of jail. Explained above.
- The player can get out of jail by paying $50 or rolling doubles. 
- If a player fails to roll doubles for three consecutive turns, they must pay $50 to get out of jail.
- If a player cannot pay $50 to get out of jail, they must declare bankruptcy.

# Notes

1. Implement tests first, and than the logic. Use the "red-green-refactor" cycle.
