"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ChapterTransitionProps {
  isVisible: boolean;
  chapterNumber: number;
  chapterTitle: string;
  onComplete: () => void;
}

export default function ChapterTransition({
  isVisible,
  chapterNumber,
  chapterTitle,
  onComplete,
}: ChapterTransitionProps) {
  useEffect(() => {
    if (!isVisible) return;
    // 1.8秒後に自動で次の問題へ
    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 暗幕オーバーレイ */}
        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.8, times: [0, 0.15, 0.85, 1] }}
        />

        {/* コンテンツ */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* 魔法陣リング */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-6">
            <motion.div
              className="absolute inset-0 rounded-full border border-amber-500/30"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-3 rounded-full border border-amber-400/20"
              animate={{ rotate: -360, scale: [1, 0.9, 1] }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-6 rounded-full border border-dashed border-amber-500/15"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.8, ease: "linear" }}
            />
            {/* 中央アイコン */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-5xl md:text-6xl"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              >
                📜
              </motion.span>
            </div>
          </div>

          {/* チャプター番号 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span className="text-amber-500/70 text-xs tracking-[0.5em] uppercase">
              Chapter {String(chapterNumber).padStart(2, "0")}
            </span>
          </motion.div>

          {/* チャプタータイトル */}
          <motion.h2
            className="mt-3 text-xl md:text-2xl font-bold text-amber-200 tracking-wider"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {chapterTitle}
          </motion.h2>

          {/* 区切り線 */}
          <motion.div
            className="mt-4 w-24 h-px mx-auto bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
