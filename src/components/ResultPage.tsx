"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { TraitKey, TraitScores } from "@/lib/assessment-data";
import { TRAIT_LABELS } from "@/lib/assessment-data";
import { getResult } from "@/lib/personality-types";
import RadarChart from "@/components/RadarChart";

interface ResultPageProps {
  scores: TraitScores;
  answers: Record<number, string>;
  onRestart: () => void;
}

function ManaParticles({ count }: { count: number }) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 6,
      size: 1.5 + Math.random() * 2.5,
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
            bottom: '-8px',
            width: p.size,
            height: p.size,
            background: 'rgba(180,200,255,0.5)',
            animation: `float-particle ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function ResultPage({
  scores,
  answers: _answers,
  onRestart,
}: ResultPageProps) {
  const { primaryTrait, secondaryTrait, allTraits } = (() => {
    const entries = (Object.keys(scores) as TraitKey[]).map((key) => ({
      key,
      score: scores[key],
    }));
    const sorted = [...entries].sort((a, b) => b.score - a.score);
    return {
      primaryTrait: sorted[0].key,
      secondaryTrait: sorted[1].key,
      allTraits: sorted,
    };
  })();

  const result = getResult(primaryTrait, secondaryTrait, scores);
  const maxScore = Math.max(...allTraits.map((t) => Math.abs(t.score)), 1);

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto px-4 pb-16 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <ManaParticles count={20} />

      {/* ====== EPILOGUE ====== */}
      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-amber-500/50 text-[10px] tracking-[0.5em] uppercase">
          Epilogue
        </span>
      </motion.div>

      {/* ====== ジョブクラスカード ====== */}
      <motion.div
        className="rpg-border bg-gradient-to-b from-[#0a0a18]/95 to-[#050510]/98 
                   mb-6 relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="absolute top-0 left-6 -translate-y-1/2 px-4 py-1
                        bg-gradient-to-r from-amber-900/90 to-amber-800/80
                        border border-amber-600/40 text-amber-200 text-[10px] tracking-[0.3em] uppercase z-10">
          Job Class
        </div>

        <div className="p-6 pt-5 text-center">
          <div className="mb-3">
            <span className="text-5xl md:text-6xl">
              {TRAIT_LABELS[primaryTrait].icon}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-amber-200 mb-2 tracking-wider">
            {result.title}
          </h2>
          <p className="text-amber-400/60 text-xs md:text-sm tracking-widest">
            {result.subtitle}
          </p>
        </div>
      </motion.div>

      {/* ====== 性格説明 ====== */}
      <motion.div
        className="rpg-border bg-gradient-to-b from-[#0a0a18]/95 to-[#050510]/98 
                   mb-6 p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-amber-500/40 rotate-45" />
          <span className="text-amber-300 text-xs tracking-[0.3em] uppercase">Analysis</span>
        </div>
        <p className="text-amber-100/80 leading-loose text-sm md:text-base">
          {result.description}
        </p>
      </motion.div>

      {/* ====== アドバイス ====== */}
      <motion.div
        className="rpg-border bg-gradient-to-r from-amber-950/20 to-amber-900/10 
                   mb-6 p-5 relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400/60 to-amber-600/20 rounded-l-sm" />
        <div className="flex items-center gap-2 mb-2 pl-3">
          <span className="text-sm">⚜️</span>
          <span className="text-amber-300 text-xs tracking-[0.3em] uppercase">Oracle</span>
        </div>
        <p className="text-amber-100/70 text-sm leading-relaxed italic">
          「{result.advice}」
        </p>
      </motion.div>

      {/* ====== ステータスパネル（六角形レーダーチャート） ====== */}
      <motion.div
        className="rpg-border bg-gradient-to-b from-[#0a0a18]/95 to-[#050510]/98 
                   mb-6 p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-3 h-3 bg-amber-500/40 rotate-45" />
          <span className="text-amber-300 text-xs tracking-[0.3em] uppercase">Status</span>
        </div>

        {/* レーダーチャート */}
        <div className="flex justify-center mb-5">
          <RadarChart
            traits={allTraits}
            primaryTrait={primaryTrait}
            secondaryTrait={secondaryTrait}
            maxScore={maxScore}
          />
        </div>

        {/* 凡例 */}
        <div className="flex flex-wrap justify-center gap-3 text-xs">
          {allTraits.map(({ key, score }) => {
            const info = TRAIT_LABELS[key];
            const isPrimary = key === primaryTrait;
            const isSecondary = key === secondaryTrait;
            return (
              <div key={key} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: info.color }}
                />
                <span className="text-amber-200/80">{info.icon} {key}</span>
                <span className="text-amber-400/60 font-mono">{score}</span>
                {isPrimary && (
                  <span className="text-[8px] px-1 py-px border border-amber-500/30 
                                   bg-amber-500/10 text-amber-400 tracking-widest">MAIN</span>
                )}
                {isSecondary && !isPrimary && (
                  <span className="text-[8px] px-1 py-px border border-blue-400/30 
                                   bg-blue-400/10 text-blue-300 tracking-widest">SUB</span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ====== 仲間・クラス情報 ====== */}
      <motion.div
        className="rpg-border bg-gradient-to-b from-[#0a0a18]/95 to-[#050510]/98 
                   mb-8 p-5"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-3">
            <span className="text-amber-500 shrink-0 mt-0.5">⚔️</span>
            <div>
              <p className="text-amber-400/60 text-[10px] tracking-widest mb-0.5">CLASS</p>
              <p className="text-amber-100/80 text-sm">{result.class}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-amber-500 shrink-0 mt-0.5">🐾</span>
            <div>
              <p className="text-amber-400/60 text-[10px] tracking-widest mb-0.5">PARTNER</p>
              <p className="text-amber-100/80 text-sm">{result.companion}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ====== リセットボタン ====== */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <button
          onClick={onRestart}
          className="rpg-border relative group cursor-pointer
                     bg-gradient-to-b from-amber-900/40 to-amber-950/60 
                     hover:from-amber-800/50 hover:to-amber-900/60
                     px-8 py-3 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 
                          group-hover:via-amber-400/15 transition-all duration-500" />
          <span className="relative text-amber-300 text-sm tracking-[0.3em]">
            ◆ 再 転 生 ◆
          </span>
        </button>

        <p className="mt-6 text-amber-500/20 text-[10px] tracking-[0.5em]">
          — Fin —
        </p>
      </motion.div>
    </motion.div>
  );
}
