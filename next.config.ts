import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages（プロジェクトサイト）用。リポジトリ名を入れてください
  // 例: リポジトリ名が "isekai-assessment" なら "/isekai-assessment"
  basePath: "/isekai-shindan",
  // 画像最適化は静的出力では使えないので無効化
  images: { unoptimized: true },
};

export default nextConfig;
