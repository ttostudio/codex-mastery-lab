import { AppHeader } from "@/features/layout/AppHeader";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyStream",
  description: "日本語UIの学習動画キューWebアプリ実験"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="shell">
          <AppHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
