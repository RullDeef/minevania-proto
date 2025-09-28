import React, { useEffect } from 'react';
import { GameView } from '@/components/game/GameView';
import { GameHUD } from '@/components/game/GameHUD';
import { useGameEngine } from '@/hooks/useGameEngine';
import { AbilityUnlockModal } from '@/components/game/AbilityUnlockModal';
import { PauseMenu } from '@/components/game/PauseMenu';
import { LoreModal } from '@/components/game/LoreModal';
import { EndGameModal } from '@/components/game/EndGameModal';
import { useLocation } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
export function HomePage() {
  const initializeGame = useGameEngine((state) => state.initializeGame);
  const loadGame = useGameEngine((state) => state.loadGame);
  const togglePause = useGameEngine((state) => state.togglePause);
  const loreToShow = useGameEngine((state) => state.loreToShow);
  const gameStatus = useGameEngine((state) => state.gameStatus);
  const location = useLocation();
  useEffect(() => {
    if (location.state?.continueGame) {
      const success = loadGame();
      if (!success) {
        initializeGame();
      }
    } else {
      initializeGame();
    }
  }, [initializeGame, loadGame, location.state]);
  useHotkeys('esc', () => {
    if (!loreToShow && gameStatus === 'playing') {
      togglePause();
    }
  }, [togglePause, loreToShow, gameStatus]);
  return (
    <main className="w-screen h-screen bg-black overflow-hidden select-none">
      <GameView />
      <GameHUD />
      <AbilityUnlockModal />
      <PauseMenu />
      <LoreModal />
      <EndGameModal />
      <div className="fixed top-4 left-4 font-press-start-2p text-cyan text-2xl z-20 pointer-events-none">
        <h1>MINEVANIA</h1>
      </div>
      <div className="fixed top-12 left-4 font-vt323 text-lime text-lg z-20 pointer-events-none">
        <p>Pan: Middle-Mouse / Alt+Click</p>
        <p>Flag: Right-Click</p>
        <p>Pause: ESC</p>
      </div>
    </main>
  );
}