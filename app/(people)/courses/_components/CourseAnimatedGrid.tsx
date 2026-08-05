"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

export function CourseAnimatedGrid({ children }: { children: React.ReactNode }) {
    return (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {children}
            </AnimatePresence>
        </motion.div>
    );
}

export function CourseAnimatedGridItem({ children, id }: { children: React.ReactNode, id: string }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0 }}
            key={id}
        >
            {children}
        </motion.div>
    );
}
