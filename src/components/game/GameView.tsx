import React, { useEffect, useState } from 'react';
import { usePan } from '@/hooks/usePan';
import { useGameEngine } from '@/hooks/useGameEngine';
import { Tile } from './Tile';
import { TILE_SIZE, REVEAL_RADIUS } from '@/config/gameConfig';
import { useWindowSize } from 'react-use';
export const GameView: React.FC = () => {
  const { viewOffset, panHandlers } = usePan();
  const getTile = useGameEngine((state) => state.getTile);
  const { width, height } = useWindowSize();
  const [visibleTiles, setVisibleTiles] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    const tiles = [];
    const startCol = Math.floor(-viewOffset.x / TILE_SIZE) - 1 - REVEAL_RADIUS;
    const endCol = Math.floor((-viewOffset.x + width) / TILE_SIZE) + 1 + REVEAL_RADIUS;
    const startRow = Math.floor(-viewOffset.y / TILE_SIZE) - 1 - REVEAL_RADIUS;
    const endRow = Math.floor((-viewOffset.y + height) / TILE_SIZE) + 1 + REVEAL_RADIUS;
    for (let y = startRow; y <= endRow; y++) {
      for (let x = startCol; x <= endCol; x++) {
        const tileData = getTile(x, y);
        if (tileData) {
          tiles.push(<Tile key={`${x},${y}`} x={x} y={y} />);
        }
      }
    }
    setVisibleTiles(tiles);
  }, [viewOffset, width, height, getTile]);
  return (
    <div
      className="w-full h-full absolute top-0 left-0 overflow-hidden bg-[#0a0a0a]"
      {...panHandlers}
    >
      <div
        className="absolute"
        style={{
          transform: `translate(${viewOffset.x}px, ${viewOffset.y}px)`,
          willChange: 'transform',
        }}
      >
        {visibleTiles}
      </div>
    </div>
  );
};