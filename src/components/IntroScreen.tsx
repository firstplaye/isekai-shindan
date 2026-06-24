"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface IntroScreenProps {
  onStart: () => void;
}

function ManaParticles({ count }: { count: number }) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 5,
      size: 2 + Math.random() * 3,
    }))
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            background: 'rgba(180,200,255,0.7)',
            boxShadow: `0 0 ${p.size * 2}px rgba(180,200,255,0.5)`,
            animation: `float-particle ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* マナ粒子 */}
      <ManaParticles count={30} />

      {/* ====== メイン魔法陣 ====== */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 1, type: "spring", stiffness: 60 }}
      >
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-rotate-magic" />
          <div className="absolute inset-2 rounded-full border border-amber-400/15 animate-rotate-magic-reverse" />
          <div className="absolute inset-6 rounded-full border border-dashed border-amber-500/10 animate-rotate-magic" />

          <svg
            className="absolute inset-0 w-full h-full animate-rotate-magic-reverse opacity-30"
            viewBox="0 0 200 200"
          >
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(180,150,90,0.3)" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(180,150,90,0.2)" strokeWidth="0.5" />
            {[0, 45, 90, 135].map((angle) => (
              <line
                key={angle}
                x1="100" y1="100"
                x2={100 + 85 * Math.cos((angle * Math.PI) / 180)}
                y2={100 + 85 * Math.sin((angle * Math.PI) / 180)}
                stroke="rgba(180,150,90,0.25)"
                strokeWidth="0.5"
              />
            ))}
          </svg>

          {/* 中央クリスタル */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/10 to-purple-500/10 animate-pulse-glow" />
              <span className="relative text-5xl md:text-6xl">💎</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ====== タイトル ====== */}
      <motion.div
        className="mb-6"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="rpg-border bg-gradient-to-b from-black/80 to-[#0a0a14]/90 px-8 py-6 md:px-12 md:py-8 backdrop-blur-sm">
          <h1
            className="text-3xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text 
                       bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 animate-text-shimmer"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            ― 異世界転生 ―
          </h1>
          <div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-2" />
          <p className="text-sm md:text-lg text-amber-200/80 tracking-[0.3em] uppercase">
            大学卒業直前の救世伝説
          </p>
          <div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mt-2" />
        </div>
      </motion.div>

      {/* ====== サブタイトル ====== */}
      <motion.p
        className="text-amber-300/70 text-xs md:text-sm tracking-[0.4em] mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        ― Story-based Personality Assessment ―
      </motion.p>

      {/* ====== あらすじ ====== */}
      <motion.div
        className="rpg-border bg-gradient-to-b from-black/70 to-[#0a0a14]/80 px-6 py-4 max-w-lg mb-10 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <p className="text-amber-100/80 text-xs md:text-sm leading-relaxed">
          目を覚ますと、そこは満天の星空が広がる神殿——
          <br />
          女神は告げる。「異世界の魂よ、世界を救う使命はあなたに託されました」
          <br />
          <span className="text-amber-400">全10の選択</span>が、あなたの魂の本質を明らかにする。
        </p>
      </motion.div>

      {/* ====== スタートボタン ====== */}
      <motion.button
        onClick={onStart}
        className="rpg-border relative group cursor-pointer
                   bg-gradient-to-b from-amber-900/60 to-amber-950/80 
                   hover:from-amber-800/60 hover:to-amber-900/80
                   px-10 py-4 transition-all duration-500"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 group-hover:via-amber-400/20 transition-all duration-500" />
        <span
          className="relative text-amber-200 text-base md:text-lg font-bold tracking-[0.3em]"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          ◆ 転 生 の 扉 を 開 く ◆
        </span>
      </motion.button>

      {/* フッター */}
      <motion.p
        className="mt-8 text-amber-500/30 text-[10px] tracking-[0.5em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        PROLOGUE
      </motion.p>
    </motion.div>
  );
}
