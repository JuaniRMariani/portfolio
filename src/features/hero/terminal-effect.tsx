"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"

export function TerminalEffect() {
  const codeString = `> const engineer = await hire("Juan Ignacio");\n> engineer.deployFreelanceProject();`
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= codeString.length) {
        setDisplayedText(codeString.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 40) // typing speed
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-8 rounded-md border border-border bg-card/40 p-4 font-mono text-sm text-primary shadow-lg sm:text-base">
      <div className="mb-2 flex items-center gap-2 border-b border-border/50 pb-2">
        <div className="size-2.5 rounded-full bg-destructive/80"></div>
        <div className="size-2.5 rounded-full bg-yellow-500/80"></div>
        <div className="size-2.5 rounded-full bg-green-500/80"></div>
        <span className="ml-2 text-[10px] text-muted-foreground uppercase tracking-wider">Terminal</span>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre-wrap leading-relaxed"
      >
        {displayedText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2 bg-primary/70 ml-1"
        >
          &nbsp;
        </motion.span>
      </motion.div>
    </div>
  )
}
