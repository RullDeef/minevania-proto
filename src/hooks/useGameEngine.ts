import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { generateChunk } from '@/lib/procedural';
import { CHUNK_SIZE, TileType, AbilityType } from '@/config/gameConfig';
import { LORE_DATA, LORE_COUNT } from '@/data/lore';
export type GameStatus = 'playing' | 'won' | 'lost';
export interface TileData {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  type: TileType;
  ability?: AbilityType;
  loreId?: number;
  radarMineCount?: number;
}
interface GameState {
  grid: Map<string, TileData>;
  gameStatus: GameStatus;
  mineCount: number;
  flagsPlaced: number;
  startTime: number | null;
  elapsedTime: number;
  seed: string;
  generatedChunks: Set<string>;
  unlockedAbilities: Set<AbilityType>;
  activeAbility: AbilityType | null;
  showAbilityUnlockModal: AbilityType | null;
  isPaused: boolean;
  collectedLore: Set<number>;
  loreToShow: { id: number; title: string; text: string } | null;
}
interface GameActions {
  initializeGame: (seed?: string) => void;
  resetGame: () => void;
  revealTile: (x: number, y: number) => void;
  toggleFlag: (x: number, y: number) => void;
  getTile: (x: number, y: number) => TileData;
  setActiveAbility: (ability: AbilityType | null) => void;
  unlockAbility: (ability: AbilityType) => void;
  closeAbilityUnlockModal: () => void;
  togglePause: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
  closeLoreModal: () => void;
  _generateChunkIfNeeded: (x: number, y: number) => void;
  _updateElapsedTime: () => void;
}
const getTileKey = (x: number, y: number) => `${x},${y}`;
const getChunkKey = (chunkX: number, chunkY: number) => `${chunkX},${chunkY}`;
const SAVE_GAME_KEY = 'minevania-savegame';
export const useGameEngine = create<GameState & GameActions>()(
  immer((set, get) => ({
    grid: new Map(),
    gameStatus: 'playing',
    mineCount: 0,
    flagsPlaced: 0,
    startTime: null,
    elapsedTime: 0,
    seed: 'minevania',
    generatedChunks: new Set(),
    unlockedAbilities: new Set([AbilityType.SCANNER]),
    activeAbility: null,
    showAbilityUnlockModal: null,
    isPaused: false,
    collectedLore: new Set(),
    loreToShow: null,
    initializeGame: (seed = 'minevania-final') => {
      set((state) => {
        state.grid = new Map();
        state.gameStatus = 'playing';
        state.mineCount = 0;
        state.flagsPlaced = 0;
        state.seed = seed;
        state.generatedChunks = new Set();
        state.startTime = Date.now();
        state.elapsedTime = 0;
        state.unlockedAbilities = new Set([AbilityType.SCANNER]);
        state.activeAbility = null;
        state.showAbilityUnlockModal = null;
        state.isPaused = false;
        state.collectedLore = new Set();
        state.loreToShow = null;
      });
      get()._generateChunkIfNeeded(0, 0);
      get()._generateChunkIfNeeded(20, 20);
    },
    resetGame: () => {
      get().initializeGame(get().seed);
    },
    _updateElapsedTime: () => {
      if (get().gameStatus === 'playing' && !get().isPaused && get().startTime) {
        set({ elapsedTime: Date.now() - get().startTime! });
      }
    },
    getTile: (x, y) => {
      get()._generateChunkIfNeeded(x, y);
      return get().grid.get(getTileKey(x, y))!;
    },
    _generateChunkIfNeeded: (x, y) => {
      const chunkX = Math.floor(x / CHUNK_SIZE);
      const chunkY = Math.floor(y / CHUNK_SIZE);
      const chunkKey = getChunkKey(chunkX, chunkY);
      if (!get().generatedChunks.has(chunkKey)) {
        set((state) => {
          const newChunkData = generateChunk(chunkX, chunkY, state.seed);
          newChunkData.forEach((tile, key) => {
            state.grid.set(key, tile);
            if (tile.isMine) state.mineCount++;
          });
          state.generatedChunks.add(chunkKey);
        });
      }
    },
    revealTile: (x, y) => {
      if (get().gameStatus !== 'playing' || get().isPaused) return;
      if (get().activeAbility === AbilityType.SCANNER) {
        set(state => {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              get()._generateChunkIfNeeded(nx, ny);
              const tileToScan = state.grid.get(getTileKey(nx, ny));
              if (tileToScan && !tileToScan.isMine) {
                tileToScan.isRevealed = true;
              }
            }
          }
        });
        return;
      }
      const tile = get().getTile(x, y);
      if (!tile || tile.isRevealed || tile.isFlagged) return;
      if (tile.type === TileType.HARD_ROCK) {
        if (get().activeAbility === AbilityType.DRILL) {
          set(state => {
            const currentTile = state.grid.get(getTileKey(x, y))!;
            currentTile.isRevealed = true;
            currentTile.type = TileType.NORMAL;
          });
        }
        return;
      }
      if (tile.type === TileType.ABILITY_SHRINE && tile.ability) {
        get().unlockAbility(tile.ability);
        set(state => { state.grid.get(getTileKey(x, y))!.isRevealed = true; });
        return;
      }
      if (tile.type === TileType.LORE && tile.loreId) {
        const loreId = tile.loreId;
        set(state => {
          state.grid.get(getTileKey(x, y))!.isRevealed = true;
          if (!state.collectedLore.has(loreId)) {
            state.collectedLore.add(loreId);
            state.loreToShow = { id: loreId, ...LORE_DATA[loreId] };
            state.isPaused = true;
          }
          if (state.collectedLore.size === LORE_COUNT) {
            state.gameStatus = 'won';
          }
        });
        return;
      }
      set((state) => {
        const currentTile = state.grid.get(getTileKey(x, y))!;
        currentTile.isRevealed = true;
        if (currentTile.isMine) {
          state.gameStatus = 'lost';
          state.grid.forEach(t => { if (t.isMine) t.isRevealed = true; });
          return;
        }
        if (currentTile.adjacentMines === 0 && currentTile.type === TileType.NORMAL) {
          const queue: [number, number][] = [[x, y]];
          const visited = new Set([getTileKey(x, y)]);
          while (queue.length > 0) {
            const [cx, cy] = queue.shift()!;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = cx + dx;
                const ny = cy + dy;
                const neighborKey = getTileKey(nx, ny);
                if (visited.has(neighborKey)) continue;
                get()._generateChunkIfNeeded(nx, ny);
                const neighborTile = state.grid.get(neighborKey);
                if (neighborTile && !neighborTile.isRevealed && !neighborTile.isFlagged && (neighborTile.type === TileType.NORMAL || neighborTile.type === TileType.RADAR)) {
                  neighborTile.isRevealed = true;
                  visited.add(neighborKey);
                  if (neighborTile.adjacentMines === 0 && neighborTile.type === TileType.NORMAL) queue.push([nx, ny]);
                }
              }
            }
          }
        }
      });
    },
    toggleFlag: (x, y) => {
      if (get().gameStatus !== 'playing' || get().isPaused) return;
      const tile = get().getTile(x, y);
      if (!tile || tile.isRevealed) return;
      set((state) => {
        const currentTile = state.grid.get(getTileKey(x, y))!;
        currentTile.isFlagged = !currentTile.isFlagged;
        state.flagsPlaced += currentTile.isFlagged ? 1 : -1;
      });
    },
    setActiveAbility: (ability) => set({ activeAbility: ability }),
    unlockAbility: (ability) => {
      set(state => {
        if (!state.unlockedAbilities.has(ability)) {
          state.unlockedAbilities.add(ability);
          state.showAbilityUnlockModal = ability;
          state.activeAbility = ability;
        }
      });
    },
    closeAbilityUnlockModal: () => set({ showAbilityUnlockModal: null }),
    togglePause: () => {
      if (get().gameStatus !== 'playing') return;
      const wasPaused = get().isPaused;
      if (wasPaused) {
        const pauseDuration = Date.now() - (get().startTime! + get().elapsedTime);
        set(state => {
          state.startTime = state.startTime! + pauseDuration;
        });
      }
      set(state => { state.isPaused = !state.isPaused; });
    },
    closeLoreModal: () => {
      if (!get().loreToShow) return;
      const pauseDuration = Date.now() - (get().startTime! + get().elapsedTime);
      set(state => {
        state.loreToShow = null;
        state.isPaused = false;
        state.startTime = state.startTime! + pauseDuration;
      });
    },
    saveGame: () => {
      const state = get();
      const serializableState = {
        grid: Array.from(state.grid.entries()),
        gameStatus: state.gameStatus,
        mineCount: state.mineCount,
        flagsPlaced: state.flagsPlaced,
        elapsedTime: state.elapsedTime,
        seed: state.seed,
        generatedChunks: Array.from(state.generatedChunks),
        unlockedAbilities: Array.from(state.unlockedAbilities),
        collectedLore: Array.from(state.collectedLore),
      };
      localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(serializableState));
    },
    loadGame: () => {
      const savedGame = localStorage.getItem(SAVE_GAME_KEY);
      if (!savedGame) return false;
      const loadedState = JSON.parse(savedGame);
      set(state => {
        state.grid = new Map(loadedState.grid);
        state.gameStatus = loadedState.gameStatus;
        state.mineCount = loadedState.mineCount;
        state.flagsPlaced = loadedState.flagsPlaced;
        state.elapsedTime = loadedState.elapsedTime;
        state.seed = loadedState.seed;
        state.generatedChunks = new Set(loadedState.generatedChunks);
        state.unlockedAbilities = new Set(loadedState.unlockedAbilities);
        state.collectedLore = new Set(loadedState.collectedLore);
        state.startTime = Date.now() - loadedState.elapsedTime;
        state.isPaused = false;
        state.loreToShow = null;
        state.showAbilityUnlockModal = null;
      });
      return true;
    },
  }))
);