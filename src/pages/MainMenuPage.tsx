import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
const SAVE_GAME_KEY = 'minevania-savegame';
export function MainMenuPage() {
  const navigate = useNavigate();
  const [hasSave, setHasSave] = useState(false);
  useEffect(() => {
    const savedGame = localStorage.getItem(SAVE_GAME_KEY);
    setHasSave(!!savedGame);
  }, []);
  const handleNewGame = () => {
    navigate('/game', { state: { continueGame: false } });
  };
  const handleContinue = () => {
    if (hasSave) {
      navigate('/game', { state: { continueGame: true } });
    }
  };
  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + i * 0.2,
        type: 'spring',
        stiffness: 150,
      },
    }),
  };
  return (
    <main className="w-screen h-screen bg-black overflow-hidden select-none flex flex-col items-center justify-center text-center p-4">
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.5 } }}
        className="font-press-start-2p text-5xl md:text-7xl text-cyan mb-4"
        style={{ textShadow: '0 0 15px rgb(0 255 255 / 0.7)' }}
      >
        MINEVANIA
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.7, duration: 0.5 } }}
        className="font-vt323 text-lime text-2xl mb-12"
      >
        A Minesweeper Metroidvania
      </motion.p>
      <div className="flex flex-col items-center gap-6 font-press-start-2p text-lg">
        <motion.button
          custom={0}
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          onClick={handleNewGame}
          className="w-64 text-cyan border-2 border-cyan px-8 py-4 hover:bg-cyan/20 hover:shadow-glow transition-all duration-200"
        >
          NEW GAME
        </motion.button>
        <motion.button
          custom={1}
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          onClick={handleContinue}
          disabled={!hasSave}
          className="w-64 text-cyan border-2 border-cyan px-8 py-4 hover:bg-cyan/20 hover:shadow-glow transition-all duration-200 disabled:border-cyan/30 disabled:text-cyan/30 disabled:hover:bg-transparent disabled:hover:shadow-none disabled:cursor-not-allowed"
        >
          CONTINUE
        </motion.button>
      </div>
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
        className="absolute bottom-4 text-lime font-vt323 text-lg"
      >
        Built with ❤️ at Cloudflare
      </motion.footer>
    </main>
  );
}