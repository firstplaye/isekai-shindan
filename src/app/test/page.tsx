"use client";

import { useState } from "react";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FirebaseTestPage() {
  const [status, setStatus] = useState<"idle" | "testing" | "ok" | "fail">("idle");
  const [message, setMessage] = useState("");
  const [docId, setDocId] = useState("");

  const runTest = async () => {
    setStatus("testing");
    setMessage("接続テスト中…");

    try {
      // 1. 書き込みテスト
      const ref = await addDoc(collection(db, "_connection_test"), {
        status: "ok",
        testedAt: serverTimestamp(),
      });
      setDocId(ref.id);

      // 2. 読み取りテスト
      const snap = await getDocs(collection(db, "_connection_test"));
      const count = snap.docs.length;

      setStatus("ok");
      setMessage(`✅ 接続成功！テストドキュメントID: ${ref.id}（コレクション内 ${count} 件）`);
    } catch (err: unknown) {
      setStatus("fail");
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(`❌ 接続失敗: ${msg}`);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-4">🔥 Firebase 接続テスト</h1>

        <button
          onClick={runTest}
          disabled={status === "testing"}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 
                     text-white font-bold rounded-lg transition mb-4 cursor-pointer"
        >
          {status === "testing" ? "テスト中…" : "接続テストを実行"}
        </button>

        {message && (
          <p
            className={`text-sm leading-relaxed p-4 rounded-lg ${
              status === "ok"
                ? "bg-green-900/40 text-green-400"
                : status === "fail"
                  ? "bg-red-900/40 text-red-400"
                  : "bg-gray-800 text-gray-300"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

