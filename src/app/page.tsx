"use client";

import { useState, useCallback } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, getNextUserId } from "@/lib/firebase";
import {
  questions,
  computeScores,
  type TraitScores,
} from "@/lib/assessment-data";
import IntroScreen from "@/components/IntroScreen";
import QuestionCard from "@/components/QuestionCard";
import ResultPage from "@/components/ResultPage";
import ChapterTransition from "@/components/ChapterTransition";

type Phase = "intro" | "quiz" | "result";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [scores, setScores] = useState<TraitScores | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [nextQuestionIndex, setNextQuestionIndex] = useState(0);

  const handleStart = useCallback(() => {
    setPhase("quiz");
    setCurrentQuestion(0);
    setAnswers({});
    setScores(null);
  }, []);

  const handleSelect = useCallback(
    (choiceId: string) => {
      const q = questions[currentQuestion];
      const newAnswers = { ...answers, [q.id]: choiceId };
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        // 转场动画
        const nextIdx = currentQuestion + 1;
        setNextQuestionIndex(nextIdx);
        setTransitioning(true);
      } else {
        const finalScores = computeScores(newAnswers);
        setScores(finalScores);

        // Firebase はバックグラウンド保存
        getNextUserId()
          .then((userId) =>
            addDoc(collection(db, "assessment_results"), {
              userId,
              answers: newAnswers,
              scores: finalScores,
              completedAt: serverTimestamp(),
              userAgent: navigator.userAgent,
            })
          )
          .then(() => {
            console.log("✅ Firebase 保存成功");
          })
          .catch((err: Error) => {
            console.error("❌ Firebase 保存失敗:", err);
            alert(
              "データベース保存に失敗しました。\nFirebase ルールを確認してください。\n\n" +
                err.message
            );
          });

        setPhase("result");
      }
    },
    [currentQuestion, answers]
  );

  const handleTransitionComplete = useCallback(() => {
    setTransitioning(false);
    setCurrentQuestion(nextQuestionIndex);
  }, [nextQuestionIndex]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setCurrentQuestion(0);
    setAnswers({});
    setScores(null);
  }, []);

  return (
    <main className="min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 -z-10" />
      <div className="fixed inset-0 stars-bg -z-10" />

      <div className="relative z-10 flex flex-col items-center px-4 py-12">
        {phase === "intro" && <IntroScreen onStart={handleStart} />}

        {phase === "quiz" && (
          <div className="w-full max-w-2xl">
            <QuestionCard
              question={questions[currentQuestion]}
              currentIndex={currentQuestion}
              totalQuestions={questions.length}
              onSelect={handleSelect}
              onBack={handleBack}
              isVisible={!transitioning}
            />
          </div>
        )}

        {/* チャプター転場アニメーション */}
        <ChapterTransition
          isVisible={transitioning}
          chapterNumber={nextQuestionIndex + 1}
          chapterTitle={questions[nextQuestionIndex]?.title ?? ""}
          onComplete={handleTransitionComplete}
        />

        {phase === "result" && scores && (
          <ResultPage
            scores={scores}
            answers={answers}
            onRestart={handleRestart}
          />
        )}
      </div>
    </main>
  );
}
