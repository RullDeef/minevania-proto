import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
export const EndGameModal: React.FC = () => {
  const gameStatus = useGameEngine((state) => state.gameStatus);
  const resetGame = useGameEngine((state) => state.resetGame);
  const navigate = useNavigate();
  const isGameOver = gameStatus === 'lost';
  const isWin = gameStatus === 'won';
  const shouldShow = isGameOver || isWin;
  const handleRestart = () => {
    resetGame();
  };
  const handleMainMenu = () => {
    navigate('/');
  };
  const title = isWin ? "TRANSMISSION COMPLETE" : "CONNECTION TERMINATED";
  const message = isWin 
    ? "You have successfully cleared all network anomalies and silenced the echo. The world is at peace." 
    : "A critical error was encountered. The network has cascaded into failure. All data lost.";
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
            className={cn(
              "w-full max-w-md bg-black border-2 p-8 text-center font-vt323",
              isWin ? "border-lime shadow-glow-lime" : "border-magenta shadow-glow-magenta"
            )}
          >
            <h2 className={cn(
              "font-press-start-2p text-3xl mb-6",
              isWin ? "text-lime" : "text-magenta"
            )}>
              {title}
            </h2>
            <p className={cn(
              "text-xl mb-8",
              isWin ? "text-lime" : "text-cyan"
            )}>
              {message}
            </p>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleRestart}
                className="w-full font-press-start-2p text-sm bg-cyan/20 border border-cyan text-cyan px-6 py-3 hover:bg-cyan/40 hover:shadow-glow transition-all duration-200"
              >
                RESTART
              </button>
              <button
                onClick={handleMainMenu}
                className="w-full font-press-start-2p text-sm bg-cyan/20 border border-cyan text-cyan px-6 py-3 hover:bg-cyan/40 hover:shadow-glow transition-all duration-200"
              >
                MAIN MENU
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};