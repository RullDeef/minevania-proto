import React from 'react';
import { useGameEngine } from '@/hooks/useGameEngine';
import { TILE_SIZE, NUMBER_COLORS, TileType, AbilityType } from '@/config/gameConfig';
import { cn } from '@/lib/utils';
import { Flag, Bomb, Gem, Drill, FileText, Radar } from 'lucide-react';
interface TileProps {
  x: number;
  y: number;
}
const TileComponent: React.FC<TileProps> = ({ x, y }) => {
  const tileData = useGameEngine((state) => state.grid.get(`${x},${y}`));
  const revealTile = useGameEngine((state) => state.revealTile);
  const toggleFlag = useGameEngine((state) => state.toggleFlag);
  const gameStatus = useGameEngine((state) => state.gameStatus);
  const activeAbility = useGameEngine((state) => state.activeAbility);
  if (!tileData) return null;
  const { isRevealed, isFlagged, isMine, adjacentMines, type, radarMineCount } = tileData;
  const handleClick = (e: React.MouseEvent) => {
    if (e.altKey) return; // Panning
    if (gameStatus !== 'playing') return;
    revealTile(x, y);
  };
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing') return;
    toggleFlag(x, y);
  };
  const renderContent = () => {
    if (isFlagged) {
      return <Flag className="w-4 h-4 text-magenta" />;
    }
    if (isRevealed) {
      if (isMine) {
        return <Bomb className="w-4 h-4 text-red-500 animate-pulse" />;
      }
      if (type === TileType.ABILITY_SHRINE) {
        return <Gem className="w-5 h-5 text-lime animate-pulse" />;
      }
      if (type === TileType.LORE) {
        return <FileText className="w-5 h-5 text-lime" />;
      }
      if (type === TileType.RADAR) {
        return (
          <div className="flex items-center justify-center gap-1 text-magenta font-press-start-2p text-sm">
            <Radar className="w-3 h-3" />
            <span>{radarMineCount}</span>
          </div>
        );
      }
      if (adjacentMines > 0) {
        return (
          <span className={cn('font-press-start-2p text-sm', NUMBER_COLORS[adjacentMines])}>
            {adjacentMines}
          </span>
        );
      }
    } else {
      // Content for unrevealed tiles
      if (type === TileType.HARD_ROCK) {
        return <div className="w-2 h-2 bg-cyan/50 rounded-full" />;
      }
      if (type === TileType.ABILITY_SHRINE) {
        return <Gem className="w-5 h-5 text-cyan/50 animate-pulse" />;
      }
      if (type === TileType.LORE) {
        return <FileText className="w-5 h-5 text-cyan/50 animate-pulse" />;
      }
      if (type === TileType.RADAR) {
        return <Radar className="w-5 h-5 text-cyan/50 animate-pulse" />;
      }
    }
    return null;
  };
  const isDrillable = type === TileType.HARD_ROCK && activeAbility === AbilityType.DRILL;
  const isScannable = activeAbility === AbilityType.SCANNER;
  return (
    <div
      className={cn(
        "absolute flex items-center justify-center transition-colors duration-200",
        { "cursor-pointer": isDrillable || isScannable || type === TileType.NORMAL || type === TileType.LORE || type === TileType.ABILITY_SHRINE || type === TileType.RADAR }
      )}
      style={{
        left: x * TILE_SIZE,
        top: y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        borderWidth: isRevealed ? '0.5px' : '1px',
        borderColor: isRevealed
          ? 'rgba(0, 255, 255, 0.2)'
          : type === TileType.HARD_ROCK
            ? 'rgba(255, 0, 255, 0.4)'
            : 'rgba(0, 255, 255, 0.4)',
        backgroundColor: isRevealed
          ? 'transparent'
          : type === TileType.HARD_ROCK
            ? 'rgba(255, 0, 255, 0.05)'
            : 'rgba(0, 255, 255, 0.05)',
      }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {!isRevealed && !isFlagged && (
        <div className={cn(
          "w-full h-full transition-colors duration-150",
          { "hover:bg-cyan/20": type === TileType.NORMAL || isScannable },
          { "hover:bg-magenta/20": type === TileType.HARD_ROCK && isDrillable },
          { "hover:bg-lime/20": type === TileType.ABILITY_SHRINE || type === TileType.LORE || type === TileType.RADAR }
        )} />
      )}
      {renderContent()}
    </div>
  );
};
export const Tile = React.memo(TileComponent);