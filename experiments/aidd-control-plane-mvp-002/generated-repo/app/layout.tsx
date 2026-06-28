import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIDD JSON Contract Checker",
  description: "AIDD-Spec成果物のJSON契約をローカルで検査するMVP"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
