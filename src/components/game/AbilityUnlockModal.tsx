import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameEngine } from '@/hooks/useGameEngine';
import { AbilityType } from '@/config/gameConfig';
import { Scan, Drill, X } from 'lucide-react';
const abilityDetails = {
  [AbilityType.SCANNER]: {
    name: 'Area Scanner',
    description: 'Reveals a 3x3 area of tiles, ignoring flags. Consumes energy. Activate and click to use.',
    icon: <Scan className="w-16 h-16 text-cyan" />,
  },
  [AbilityType.DRILL]: {
    name: 'Resonance Drill',
    description: 'Allows breaking through Hard Rock formations. Equip the drill and click on hard rock to clear it.',
    icon: <Drill className="w-16 h-16 text-cyan" />,
  },
};
export const AbilityUnlockModal: React.FC = () => {
  const abilityToUnlock = useGameEngine((state) => state.showAbilityUnlockModal);
  const closeAbilityUnlockModal = useGameEngine((state) => state.closeAbilityUnlockModal);
  const details = abilityToUnlock ? abilityDetails[abilityToUnlock] : null;
  return (
    <AnimatePresence>
      {abilityToUnlock && details && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeAbilityUnlockModal}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { delay: 0.1, type: 'spring', stiffness: 200, damping: 20 } }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="w-full max-w-md bg-black border-2 border-cyan shadow-glow p-8 text-center font-vt323 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAbilityUnlockModal}
              className="absolute top-2 right-2 text-cyan hover:text-magenta transition-colors"
              aria-label="Close modal"
            >
              <X className="w-8 h-8" />
            </button>
            <h2 className="font-press-start-2p text-lime text-xl md:text-2xl mb-4">ABILITY UNLOCKED</h2>
            <div className="flex justify-center mb-6">{details.icon}</div>
            <h3 className="font-press-start-2p text-cyan text-lg md:text-xl mb-4">{details.name}</h3>
            <p className="text-lime text-lg md:text-xl mb-8">{details.description}</p>
            <button
              onClick={closeAbilityUnlockModal}
              className="font-press-start-2p text-xs bg-cyan/20 border border-cyan text-cyan px-6 py-3 hover:bg-cyan/40 hover:shadow-glow transition-all duration-200"
            >
              CONTINUE
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};