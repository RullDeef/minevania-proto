import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useNavigate } from 'react-router-dom';
export const PauseMenu: React.FC = () => {
  const isPaused = useGameEngine((state) => state.isPaused);
  const loreToShow = useGameEngine((state) => state.loreToShow);
  const togglePause = useGameEngine((state) => state.togglePause);
  const saveGame = useGameEngine((state) => state.saveGame);
  const navigate = useNavigate();
  const handleSave = () => {
    saveGame();
    // Maybe add a visual confirmation
  };
  const handleQuit = () => {
    saveGame();
    navigate('/');
  };
  // Don't show pause menu if a lore modal is active
  const shouldShow = isPaused && !loreToShow;
  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { delay: 0.1, type: 'spring', stiffness: 200, damping: 20 } }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="w-full max-w-sm bg-black border-2 border-cyan shadow-glow p-8 text-center font-vt323"
          >
            <h2 className="font-press-start-2p text-lime text-3xl mb-8">PAUSED</h2>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={togglePause}
                className="w-full font-press-start-2p text-sm bg-cyan/20 border border-cyan text-cyan px-6 py-3 hover:bg-cyan/40 hover:shadow-glow transition-all duration-200"
              >
                RESUME
              </button>
              <button
                onClick={handleSave}
                className="w-full font-press-start-2p text-sm bg-cyan/20 border border-cyan text-cyan px-6 py-3 hover:bg-cyan/40 hover:shadow-glow transition-all duration-200"
              >
                SAVE GAME
              </button>
              <button
                onClick={handleQuit}
                className="w-full font-press-start-2p text-sm bg-magenta/20 border border-magenta text-magenta px-6 py-3 hover:bg-magenta/40 hover:shadow-glow-magenta transition-all duration-200"
              >
                SAVE & QUIT
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};