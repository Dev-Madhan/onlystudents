"use client";

import { Cursor } from "@/components/core/cursor";
import { motion } from "motion/react";
import { useIsDesktop } from "@/hooks/use-is-desktop";

export function Cursor1() {
  const isDesktop = useIsDesktop();

  if (!isDesktop) return null;

  return (
    <Cursor
      variants={{
        initial: { scale: 0.3, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.3, opacity: 0 },
      }}
      springConfig={{ bounce: 0.001 }}
      transition={{ ease: "easeInOut", duration: 0.15 }}
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
    >
      <motion.div
        animate={{ width: 16, height: 16 }}
        className="rounded-full bg-gray-500/40 backdrop-blur-md dark:bg-gray-300/40"
      />
    </Cursor>
  );
}
