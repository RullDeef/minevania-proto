import seedrandom from 'seedrandom';
import { CHUNK_SIZE, MINE_DENSITY, TileType, AbilityType, RADAR_RADIUS } from '@/config/gameConfig';
import { TileData } from '@/hooks/useGameEngine';
import { LORE_COUNT } from '@/data/lore';
const simpleNoise = (x: number, y: number, seed: string) => {
  const rng = seedrandom(`${seed}:noise:${x}:${y}`);
  return rng();
};
const ABILITY_SHRINE_DRILL_POS = { x: 20, y: 20 };
const LORE_PROBABILITY = 0.005; // 0.5% chance per tile
const RADAR_PROBABILITY = 0.003; // 0.3% chance per tile
const isMineAt = (x: number, y: number, seed: string): boolean => {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    const rng = seedrandom(`${seed}:${chunkX}:${chunkY}`);
    const localX = x - chunkX * CHUNK_SIZE;
    const localY = y - chunkY * CHUNK_SIZE;
    // Fast-forward RNG to the specific tile
    for (let i = 0; i < localY * CHUNK_SIZE + localX; i++) {
        rng();
    }
    // Check for special non-mineable tiles first
    if (x === ABILITY_SHRINE_DRILL_POS.x && y === ABILITY_SHRINE_DRILL_POS.y) return false;
    const noiseVal = simpleNoise(x, y, seed);
    if (noiseVal > 0.85 && Math.abs(x) > 10 && Math.abs(y) > 10) return false; // Hard rock
    if (Math.abs(x) < 5 && Math.abs(y) < 5) { // Safe starting zone
        return rng() < MINE_DENSITY;
    }
    // Check for lore and radar tiles which also can't be mines
    const tileRng = rng(); // This is the mine check roll
    const specialTileRng = seedrandom(`${seed}:special:${x}:${y}`);
    if (specialTileRng() < LORE_PROBABILITY + RADAR_PROBABILITY) return false;
    return tileRng < MINE_DENSITY;
}
export const generateChunk = (chunkX: number, chunkY: number, seed: string): Map<string, TileData> => {
  const chunkData = new Map<string, TileData>();
  const rng = seedrandom(`${seed}:${chunkX}:${chunkY}`);
  const specialRng = seedrandom(`${seed}:special:${chunkX}:${chunkY}`);
  for (let y = 0; y < CHUNK_SIZE; y++) {
    for (let x = 0; x < CHUNK_SIZE; x++) {
      const worldX = chunkX * CHUNK_SIZE + x;
      const worldY = chunkY * CHUNK_SIZE + y;
      const key = `${worldX},${worldY}`;
      if (worldX === ABILITY_SHRINE_DRILL_POS.x && worldY === ABILITY_SHRINE_DRILL_POS.y) {
        chunkData.set(key, {
          x: worldX,
          y: worldY,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
          type: TileType.ABILITY_SHRINE,
          ability: AbilityType.DRILL,
        });
        continue;
      }
      let type = TileType.NORMAL;
      const noiseVal = simpleNoise(worldX, worldY, seed);
      if (noiseVal > 0.85 && Math.abs(worldX) > 10 && Math.abs(worldY) > 10) {
        type = TileType.HARD_ROCK;
      }
      if (Math.abs(worldX) < 5 && Math.abs(worldY) < 5) {
        type = TileType.NORMAL;
      }
      const isMine = type !== TileType.NORMAL ? false : rng() < MINE_DENSITY;
      // Place special tiles (lore, radar)
      const specialRoll = specialRng();
      if (type === TileType.NORMAL && !isMine && (Math.abs(worldX) > 10 || Math.abs(worldY) > 10)) {
        if (specialRoll < LORE_PROBABILITY) {
            type = TileType.LORE;
            const loreRng = seedrandom(`${seed}:lore:${worldX}:${worldY}`);
            const loreId = Math.floor(loreRng() * LORE_COUNT) + 1;
            chunkData.set(key, { x: worldX, y: worldY, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0, type, loreId });
            continue;
        } else if (specialRoll < LORE_PROBABILITY + RADAR_PROBABILITY) {
            type = TileType.RADAR;
        }
      }
      chunkData.set(key, {
        x: worldX,
        y: worldY,
        isMine: type === TileType.NORMAL ? isMine : false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
        type,
      });
    }
  }
  // Calculate adjacent mines and radar counts
  for (const [key, tile] of chunkData.entries()) {
    if (tile.isMine) continue;
    let adjacentMineCount = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        if (isMineAt(tile.x + dx, tile.y + dy, seed)) {
          adjacentMineCount++;
        }
      }
    }
    tile.adjacentMines = adjacentMineCount;
    if (tile.type === TileType.RADAR) {
      let radarMineCount = 0;
      for (let dy = -RADAR_RADIUS; dy <= RADAR_RADIUS; dy++) {
        for (let dx = -RADAR_RADIUS; dx <= RADAR_RADIUS; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (isMineAt(tile.x + dx, tile.y + dy, seed)) {
            radarMineCount++;
          }
        }
      }
      tile.radarMineCount = radarMineCount;
    }
  }
  return chunkData;
};