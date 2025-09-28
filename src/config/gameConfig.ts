export const TILE_SIZE = 32; // in pixels
export const CHUNK_SIZE = 16; // in tiles
export const MINE_DENSITY = 0.15; // 15% chance of a tile being a mine
export const REVEAL_RADIUS = 2; // Extra tiles to render around the viewport for smoother panning
export const RADAR_RADIUS = 2; // 5x5 grid (center + 2 tiles in each direction)
export enum TileType {
  NORMAL = 'normal',
  HARD_ROCK = 'hard_rock',
  ABILITY_SHRINE = 'ability_shrine',
  LORE = 'lore',
  RADAR = 'radar',
}
export enum AbilityType {
  SCANNER = 'scanner',
  DRILL = 'drill',
}
export const NUMBER_COLORS: { [key: number]: string } = {
  1: 'text-cyan',
  2: 'text-lime',
  3: 'text-red-500',
  4: 'text-blue-400',
  5: 'text-orange-500',
  6: 'text-teal-300',
  7: 'text-purple-400',
  8: 'text-gray-400',
};