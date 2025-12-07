'use client';
import { Cursor } from '@/components/core/cursor';
import { motion } from 'motion/react';

export function Cursor1() {
  return (
    <Cursor
      // Removed attachToParent so it works globally
      variants={{
        initial: { scale: 0.3, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.3, opacity: 0 },
      }}
      springConfig={{
        bounce: 0.001,
      }}
      transition={{
        ease: 'easeInOut',
        duration: 0.15,
      }}
    >
      <motion.div
        animate={{
          width: 16,
          height: 16,
        }}
        className='flex items-center justify-center rounded-[24px] bg-gray-500/40 backdrop-blur-md dark:bg-gray-300/40'
      />
    </Cursor>
  );
}