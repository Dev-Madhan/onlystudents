"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator asChild data-slot="progress-indicator">
        <motion.div
          className="h-full w-full flex-1 bg-primary"
          initial={{ x: "-100%" }}
          animate={{ x: `-${100 - (value || 0)}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.8 }}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
