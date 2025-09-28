import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameEngine } from '@/hooks/useGameEngine';
import { X } from 'lucide-react';
export const LoreModal: React.FC = () => {
  const loreToShow = useGameEngine((state) => state.loreToShow);
  const closeLoreModal = useGameEngine((state) => state.closeLoreModal);
  return (
    <AnimatePresence>
      {loreToShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeLoreModal}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { delay: 0.1, type: 'spring', stiffness: 200, damping: 20 } }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="w-full max-w-2xl bg-black border-2 border-cyan shadow-glow p-8 font-vt323 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLoreModal}
              className="absolute top-2 right-2 text-cyan hover:text-magenta transition-colors"
              aria-label="Close modal"
            >
              <X className="w-8 h-8" />
            </button>
            <h2 className="font-press-start-2p text-lime text-xl md:text-2xl mb-4 text-center">LORE FRAGMENT</h2>
            <h3 className="font-press-start-2p text-cyan text-lg md:text-xl mb-6">{loreToShow.title}</h3>
            <p className="text-lime text-xl md:text-2xl whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto pr-4">
              {loreToShow.text}
            </p>
            <div className="text-center mt-8">
              <button
                onClick={closeLoreModal}
                className="font-press-start-2p text-xs bg-cyan/20 border border-cyan text-cyan px-6 py-3 hover:bg-cyan/40 hover:shadow-glow transition-all duration-200"
              >
                CONTINUE
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};