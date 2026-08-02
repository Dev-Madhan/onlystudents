"use client";

import React, { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";

export function AnimatedMetric({ 
  value, 
  prefix, 
  format 
}: { 
  value: number; 
  prefix?: string; 
  format?: Intl.NumberFormatOptions;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Delay setting the value slightly so the animation triggers on mount
    const timeout = setTimeout(() => {
      setDisplayValue(value);
    }, 50);
    
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <span className="inline-block isolate relative">
      <NumberFlow 
        value={displayValue} 
        prefix={prefix} 
        format={format} 
      />
    </span>
  );
}
