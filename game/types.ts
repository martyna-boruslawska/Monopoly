export type LocationType =
  | "start"
  | "property"
  | "railroad"
  | "utility"
  | "tax"
  | "chance"
  | "community-chest"
  | "jail"
  | "go-to-jail"
  | "free-parking";

export type PropertyColor =
  | "dark-purple"
  | "light-blue"
  | "purple"
  | "orange"
  | "red"
  | "yellow"
  | "green"
  | "dark-blue";

export interface StartLocation {
  id: number;
  name: string;
  type: "start";
}

export interface JailLocation {
  id: number;
  name: string;
  type: "jail";
}

export interface GoToJailLocation {
  id: number;
  name: string;
  type: "go-to-jail";
}

export interface FreeParkingLocation {
  id: number;
  name: string;
  type: "free-parking";
}

export interface ChanceLocation {
  id: number;
  name: string;
  type: "chance";
}

export interface CommunityChestLocation {
  id: number;
  name: string;
  type: "community-chest";
}

export interface TaxLocation {
  id: number;
  name: string;
  type: "tax";
  amount: number;
}

export interface PropertyLocation {
  id: number;
  name: string;
  type: "property";
  color: PropertyColor;
  price: number;
  rent: number;
  ownerId: number | null;
  houses: number;
  hasHotel: boolean;
}

export interface RailroadLocation {
  id: number;
  name: string;
  type: "railroad";
  price: number;
  rent: number;
  ownerId: number | null;
}

export interface UtilityLocation {
  id: number;
  name: string;
  type: "utility";
  price: number;
  ownerId: number | null;
}

export type BoardLocation =
  | StartLocation
  | JailLocation
  | GoToJailLocation
  | FreeParkingLocation
  | ChanceLocation
  | CommunityChestLocation
  | TaxLocation
  | PropertyLocation
  | RailroadLocation
  | UtilityLocation;

export type OwnableLocation = PropertyLocation | RailroadLocation | UtilityLocation;

export type Board = BoardLocation[];

export function isOwnableLocation(tile: BoardLocation): tile is OwnableLocation {
  return tile.type === "property" || tile.type === "railroad" || tile.type === "utility";
}

export interface Player {
  id: number;
  name: string;
  position: number;
  money: number;
  propertyIds: number[];
  isBankrupt: boolean;
  isInJail: boolean;
  failedJailRolls: number;
}

export interface DiceRoll {
  dice1: number;
  dice2: number;
  total: number;
  isDouble: boolean;
}

export interface Game {
  players: Player[];
  board: Board;
  rollDice: () => DiceRoll;
  currentPlayerId: number | null;
  lastRoll: DiceRoll | null;
  currentPlayer(): Player | null;
  getActivePlayers(): Player[];
  countActivePlayers(): number;
  nextActivePlayer(): Player | false;
}

export interface JailResult {
  canMove: boolean;
  roll: DiceRoll | null;
  usedJailRoll: boolean;
}

export type TestPlayerInput = {
  name: string;
  position?: number;
  money?: number;
  propertyIds?: number[];
};
