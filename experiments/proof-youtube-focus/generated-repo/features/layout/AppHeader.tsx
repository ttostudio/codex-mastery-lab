import { ja } from "@/lib/i18n/ja";
import { getAuthState } from "@/lib/mocks/adapter";
import { authLabels } from "@/lib/mocks/display";
import { Search, UserCircle } from "lucide-react";
import Link from "next/link";

export function AppHeader({ auth = "anonymous" }: { auth?: string }) {
  const state = getAuthState(auth);
  return (
    <header className="topbar">
      <Link href="/" className="brand" aria-label="StudyStream ホーム">
        <span className="brand-mark">S</span>
        <span>{ja.appName}</span>
      </Link>
      <form className="search-form" action="/search">
        <input
          name="q"
          type="search"
          placeholder={ja.searchPlaceholder}
          aria-label={ja.searchPlaceholder}
          suppressHydrationWarning
        />
        <button type="submit" aria-label={ja.searchButton}>
          <Search size={18} />
        </button>
      </form>
      <span className="user-pill">
        <UserCircle size={16} aria-hidden /> {authLabels[state]}
      </span>
    </header>
  );
}
