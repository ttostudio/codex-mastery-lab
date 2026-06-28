"use client";

import { Button } from "@/components/ui/Button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ja">
      <body>
        <main className="page">
          <div className="state" role="alert">
            <div>
              <h1>予期しないエラーが発生しました</h1>
              <p className="muted">状態をリセットして再読み込みできます。</p>
              <Button onClick={reset}>再試行</Button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
