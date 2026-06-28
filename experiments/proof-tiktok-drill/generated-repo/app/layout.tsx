import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DrillSwipe",
  description: "短尺フィードで反復学習する日本語UIサンプル"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
