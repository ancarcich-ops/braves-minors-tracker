'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Bold, on-brand gradient "scenes" that crossfade over time. No external
// images (keeps it fast and reliable), pure Braves navy / red / gold.
const SCENES = [
  'radial-gradient(75rem 55rem at 82% -12%, rgba(206,17,65,0.30), transparent 60%),' +
    'radial-gradient(70rem 60rem at -12% 112%, rgba(19,39,79,0.95), transparent 60%),' +
    'linear-gradient(160deg, #0a0f1e, #070b16)',
  'radial-gradient(70rem 50rem at 12% -12%, rgba(234,170,0,0.22), transparent 55%),' +
    'radial-gradient(80rem 70rem at 105% 105%, rgba(206,17,65,0.28), transparent 60%),' +
    'linear-gradient(160deg, #0b1430, #070b16)',
  'radial-gradient(95rem 70rem at 50% -22%, rgba(206,17,65,0.32), transparent 60%),' +
    'radial-gradient(60rem 60rem at -5% 105%, rgba(19,39,79,0.9), transparent 55%),' +
    'linear-gradient(160deg, #0a0f1e, #05070f)',
];

export default function BackgroundFX() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return; // honor reduced-motion: hold on the first scene
    const id = setInterval(() => setIndex((i) => (i + 1) % SCENES.length), 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-900">
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{ backgroundImage: SCENES[index] }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 2.4, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* slow drifting gold glow for life/depth */}
      <motion.div
        className="absolute -inset-1/4"
        style={{
          backgroundImage:
            'radial-gradient(45rem 32rem at 50% 50%, rgba(234,170,0,0.07), transparent 70%)',
        }}
        animate={{ x: ['-8%', '8%', '-8%'], y: ['-5%', '6%', '-5%'] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* vignette to keep content legible */}
      <div className="absolute inset-0 bg-[radial-gradient(120rem_80rem_at_50%_-20%,transparent,rgba(0,0,0,0.45))]" />
    </div>
  );
}
