import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "異世界転生 - ストーリー型性格診断",
  description:
    "全10問の異世界転生ストーリーであなたの本当の性格を診断。冒険の選択が明かす、魂の本質とは？",
  openGraph: {
    title: "異世界転生 - ストーリー型性格診断",
    description: "全10問の異世界転生ストーリーであなたの本当の性格を診断。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
