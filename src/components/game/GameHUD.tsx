import React, { useEffect } from 'react';
import { useGameEngine } from '@/hooks/useGameEngine';
import { Bomb, Flag, Timer, Scan, Drill, FileText } from 'lucide-react';
import { AbilityType } from '@/config/gameConfig';
import { cn } from '@/lib/utils';
import { useHotkeys } from 'react-hotkeys-hook';
import { LORE_COUNT } from '@/data/lore';
const abilityIcons: { [key in AbilityType]: React.ReactNode } = {
  [AbilityType.SCANNER]: <Scan className="w-6 h-6" />,
  [AbilityType.DRILL]: <Drill className="w-6 h-6" />,
};
const abilityKeys = [AbilityType.DRILL, AbilityType.SCANNER];
export const GameHUD: React.FC = () => {
  const mineCount = useGameEngine((state) => state.mineCount);
  const flagsPlaced = useGameEngine((state) => state.flagsPlaced);
  const gameStatus = useGameEngine((state) => state.gameStatus);
  const elapsedTime = useGameEngine((state) => state.elapsedTime);
  const _updateElapsedTime = useGameEngine((state) => state._updateElapsedTime);
  const unlockedAbilities = useGameEngine((state) => state.unlockedAbilities);
  const activeAbility = useGameEngine((state) => state.activeAbility);
  const setActiveAbility = useGameEngine((state) => state.setActiveAbility);
  const collectedLoreCount = useGameEngine((state) => state.collectedLore.size);
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const interval = setInterval(() => {
      _updateElapsedTime();
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStatus, _updateElapsedTime]);
  useHotkeys('1', () => setActiveAbility(abilityKeys[0]), [setActiveAbility]);
  useHotkeys('2', () => setActiveAbility(abilityKeys[1]), [setActiveAbility]);
  useHotkeys('q', () => {
    const availableAbilities = abilityKeys.filter(ab => unlockedAbilities.has(ab));
    if (availableAbilities.length < 2) return;
    const currentIndex = activeAbility ? availableAbilities.indexOf(activeAbility) : -1;
    const nextIndex = (currentIndex - 1 + availableAbilities.length) % availableAbilities.length;
    setActiveAbility(availableAbilities[nextIndex]);
  }, [activeAbility, setActiveAbility, unlockedAbilities]);
  useHotkeys('e', () => {
    const availableAbilities = abilityKeys.filter(ab => unlockedAbilities.has(ab));
    if (availableAbilities.length < 2) return;
    const currentIndex = activeAbility ? availableAbilities.indexOf(activeAbility) : -1;
    const nextIndex = (currentIndex + 1) % availableAbilities.length;
    setActiveAbility(availableAbilities[nextIndex]);
  }, [activeAbility, setActiveAbility, unlockedAbilities]);
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none flex justify-center p-4 z-10">
      <div className="max-w-7xl w-full flex justify-between items-center p-4 font-press-start-2p text-xs text-cyan pointer-events-auto bg-black/50 backdrop-blur-sm border border-cyan/50 shadow-glow">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" title="Mines Remaining">
            <Bomb className="w-4 h-4" />
            <span>{Math.max(0, mineCount - flagsPlaced)}</span>
          </div>
          <div className="flex items-center gap-2" title="Flags Placed">
            <Flag className="w-4 h-4" />
            <span>{flagsPlaced}</span>
          </div>
          <div className="flex items-center gap-2" title="Lore Collected">
            <FileText className="w-4 h-4" />
            <span>{collectedLoreCount}/{LORE_COUNT}</span>
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          {unlockedAbilities.size > 0 && abilityKeys.map((ability, index) => {
            if (!unlockedAbilities.has(ability)) return null;
            return (
              <button
                key={ability}
                onClick={() => setActiveAbility(activeAbility === ability ? null : ability)}
                className={cn(
                  "p-2 border border-cyan/50 transition-all duration-200 hover:bg-cyan/20 hover:shadow-glow",
                  { "bg-cyan/30 shadow-glow ring-2 ring-cyan": activeAbility === ability }
                )}
                title={`${ability} (${index + 1})`}
              >
                {abilityIcons[ability]}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2" title="Elapsed Time">
          <Timer className="w-4 h-4" />
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </div>
    </div>
  );
};