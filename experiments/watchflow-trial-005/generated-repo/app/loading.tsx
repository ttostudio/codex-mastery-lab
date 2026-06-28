import { ja } from "@/lib/i18n/ja";

export default function Loading() {
  return (
    <main className="page">
      <div className="state" aria-live="polite">
        <h1>{ja.loading}</h1>
      </div>
    </main>
  );
}
