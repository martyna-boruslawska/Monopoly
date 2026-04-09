import assert from "node:assert/strict";
import { createGame } from "../../game/createGame.js";

export function createTestGame(testPlayers) {
	const game = createGame(testPlayers.map(({ name }) => name));
	const propertyOwners = new Map();

	for (const [index, testPlayer] of testPlayers.entries()) {
		const player = game.players[index];
		if (!player) {
			continue;
		}

		applyPlayerOverrides(player, testPlayer);
		syncPropertyOwnership(game.board, player, propertyOwners);
	}

	game.currentPlayerId = game.players[0]?.id ?? null;

	return game;
}

function applyPlayerOverrides(player, testPlayer) {
	if ("position" in testPlayer) {
		player.position = testPlayer.position;
	}

	if ("money" in testPlayer) {
		player.money = testPlayer.money;
	}

	if ("propertyIds" in testPlayer) {
		player.propertyIds = [...testPlayer.propertyIds];
	}
}

function syncPropertyOwnership(board, player, propertyOwners) {
	const assignedPropertyIds = new Set();

	for (const propertyId of player.propertyIds) {
		assert.ok(
			!assignedPropertyIds.has(propertyId),
			`Player ${player.name} has duplicate propertyId ${propertyId}.`,
		);

		assignedPropertyIds.add(propertyId);

		const tile = board.find((location) => location.id === propertyId);
		assert.ok(tile, `Property ${propertyId} does not exist on the board.`);
		assert.ok(
			"ownerId" in tile,
			`Location ${propertyId} (${tile.name}) cannot be assigned to a player.`,
		);

		const existingOwnerName = propertyOwners.get(propertyId);
		assert.ok(
			!existingOwnerName,
			`Property ${propertyId} is assigned to multiple players: ${existingOwnerName} and ${player.name}.`,
		);

		propertyOwners.set(propertyId, player.name);
		tile.ownerId = player.id;
	}
}
