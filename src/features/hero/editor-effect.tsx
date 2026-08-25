"use client"

import { motion } from "motion/react"

export function EditorEffect() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-[#0d1117]/80 shadow-2xl shadow-primary/10 backdrop-blur-md sm:w-[500px]"
    >
      {/* Mac window header */}
      <div className="flex items-center gap-2 border-b border-border/40 bg-white/[0.02] px-4 py-3">
        <div className="size-3 rounded-full bg-[#ff5f56]"></div>
        <div className="size-3 rounded-full bg-[#ffbd2e]"></div>
        <div className="size-3 rounded-full bg-[#27c93f]"></div>
        <div className="ml-4 font-mono text-[11px] text-muted-foreground/80 tracking-wider">
          developer-profile.tsx
        </div>
      </div>

      {/* Code content */}
      <div className="p-5 font-mono text-sm sm:text-base leading-loose">
        <div>
          <span className="text-[#ff7b72]">const</span> <span className="text-[#79c0ff]">Developer</span> <span className="text-[#ff7b72]">=</span> <span className="text-[#d2a8ff]">()</span> <span className="text-[#ff7b72]">=&gt;</span> <span className="text-[#e3b341]">{`{`}</span>
        </div>
        <div className="pl-4">
          <span className="text-[#ff7b72]">return</span> <span className="text-[#79c0ff]">&lt;</span><span className="text-[#e3b341]">Engineer</span>
        </div>
        <div className="pl-8">
          <span className="text-[#79c0ff]">name</span><span className="text-[#ff7b72]">=</span><span className="text-[#a5d6ff]">"Juan Ignacio"</span>
        </div>
        <div className="pl-8">
          <span className="text-[#79c0ff]">roles</span><span className="text-[#ff7b72]">=</span><span className="text-[#e3b341]">{`{`}</span><span className="text-[#a5d6ff]">[</span>
          <span className="text-[#a5d6ff]">'Freelance'</span><span className="text-[#c9d1d9]">, </span>
          <span className="text-[#a5d6ff]">'Full-Stack'</span><span className="text-[#c9d1d9]">, </span>
          <span className="text-[#a5d6ff]">'AI Systems'</span>
          <span className="text-[#a5d6ff]">]</span><span className="text-[#e3b341]">{`}`}</span>
        </div>
        <div className="pl-8">
          <span className="text-[#79c0ff]">availability</span><span className="text-[#ff7b72]">=</span><span className="text-[#e3b341]">{`{`}</span><span className="text-[#79c0ff]">true</span><span className="text-[#e3b341]">{`}`}</span>
        </div>
        <div className="pl-4">
          <span className="text-[#79c0ff]">/&gt;</span>
        </div>
        <div>
          <span className="text-[#e3b341]">{`}`}</span>
        </div>
      </div>
    </motion.div>
  )
}
