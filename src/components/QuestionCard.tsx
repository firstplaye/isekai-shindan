"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Question, Choice } from "@/lib/assessment-data";

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onSelect: (choiceId: string) => void;
  onBack: () => void;
  isVisible: boolean;
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

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  onSelect,
  onBack,
  isVisible,
}: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full max-w-2xl mx-auto relative"
        >
        <ManaParticles count={15} />

        {/* ====== 戻るボタン ====== */}
        {currentIndex > 0 && (
          <motion.button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-amber-500/60 hover:text-amber-400 
                       text-xs tracking-widest transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            ◂ 前の選択に戻る
          </motion.button>
        )}

        {/* ====== チャプター表示 ====== */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-amber-500/60 text-[10px] tracking-[0.5em] uppercase">
            Chapter {String(currentIndex + 1).padStart(2, '0')}
          </span>
        </motion.div>

        {/* ====== HP/MP 風 進捗バー ====== */}
        <div className="mb-6 px-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-amber-300/80 text-xs tracking-widest flex items-center gap-2">
              <span className="text-red-400">❤️</span> PROGRESS
            </span>
            <span
              className="text-amber-400/80 text-xs font-mono"
            >
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>
          <div className="rpg-stat-bar">
            <motion.div
              className="h-full bg-gradient-to-r from-red-800 via-red-600 to-amber-500"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20 pointer-events-none" />
          </div>
        </div>

        {/* ====== タイトル（装飾付き） ====== */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
            <h2 className="text-xl md:text-2xl font-bold text-amber-200 tracking-wider">
              {question.title}
            </h2>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
        </motion.div>

        {/* ====== ストーリー（VN風ダイアログボックス） ====== */}
        <motion.div
          className="rpg-border bg-gradient-to-b from-[#0a0a18]/95 to-[#050510]/98 
                     mb-6 relative"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* VN風ネームプレート */}
          <div className="absolute top-0 left-6 -translate-y-1/2 px-4 py-1 
                          bg-gradient-to-r from-amber-900/90 to-amber-800/80 
                          border border-amber-600/40 text-amber-200 text-[10px] tracking-[0.3em] uppercase">
            Narration
          </div>

          <div className="p-6 pt-5">
            <p className="text-amber-100/90 leading-loose text-sm md:text-base">
              {question.story}
            </p>
          </div>

          {/* VN風三角マーカー */}
          <div className="absolute bottom-3 right-4 flex items-center gap-1">
            {[0, 0.3, 0.6].map((d, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-amber-400/60 rotate-45"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: d }}
              />
            ))}
          </div>
        </motion.div>

        {/* ====== 選択肢（コマンド風） ====== */}
        <div className="space-y-2.5">
          {question.choices.map((choice, idx) => (
            <ChoiceCommand
              key={choice.id}
              choice={choice}
              index={idx}
              onSelect={onSelect}
            />
          ))}
        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChoiceCommand({
  choice,
  index,
  onSelect,
}: {
  choice: Choice;
  index: number;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.button
      onClick={() => onSelect(choice.id)}
      className="rpg-border w-full text-left group cursor-pointer relative
                 bg-gradient-to-r from-[#0d0d1a]/90 to-[#0a0a14]/90
                 hover:from-amber-950/30 hover:to-amber-900/20
                 transition-all duration-300"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.08 }}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.985 }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 
                    group-hover:via-amber-400/10 transition-all duration-500"
      />

      <div className="relative flex items-center gap-4 p-4">
        <div className="shrink-0 w-10 h-10 flex items-center justify-center
                        bg-gradient-to-br from-amber-900/50 to-amber-950/60
                        border border-amber-700/30">
          <span className="text-amber-400 font-bold text-sm">{choice.id}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-amber-100 font-semibold text-sm md:text-base mb-0.5">
            {choice.label}
          </p>
          <p className="text-amber-300/60 text-xs md:text-sm leading-relaxed">
            {choice.text}
          </p>
        </div>

        <motion.span
          className="shrink-0 text-amber-500/40 text-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ▶
        </motion.span>
      </div>
    </motion.button>
  );
}
