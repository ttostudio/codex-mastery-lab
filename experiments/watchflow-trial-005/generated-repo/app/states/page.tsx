import { StateView } from "@/components/ui/StateView";
import { ja } from "@/lib/i18n/ja";
import { getAuthState, getBillingState } from "@/lib/mocks/adapter";
import { authLabels, authMessages, billingLabels, billingMessages } from "@/lib/mocks/display";
import { getExternalAuthState, getExternalBillingState, getExternalNetworkState } from "@/lib/mocks/external";
import type { AuthState, BillingState } from "@/lib/mocks/types";

type StatesPageProps = {
  searchParams: Promise<{ auth?: string; billing?: string; network?: string }>;
};

const authStates: AuthState[] = ["anonymous", "logged_in", "premium", "session_expired"];
const billingStates: BillingState[] = ["free", "premium", "payment_failed"];

export default async function StatesPage({ searchParams }: StatesPageProps) {
  const params = await searchParams;
  const authState = params.auth ? getAuthState(params.auth) : await getExternalAuthState("anonymous");
  const billingState = params.billing ? getBillingState(params.billing) : await getExternalBillingState("free");
  const externalNetworkState = await getExternalNetworkState("online");
  const networkState = params.network === "offline" || params.network === "timeout" ? params.network : externalNetworkState;

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">状態表示カタログ</h1>
          <p className="muted">認証、課金、ネットワーク失敗時のユーザー体験を確認します。</p>
        </div>
      </div>
      <div className="mode-bar" aria-label="状態切り替え">
        {authStates.map((state) => (
          <a key={state} className="secondary-button" href={`/states?auth=${state}&billing=${billingState}&network=${networkState}`}>
            {authLabels[state]}
          </a>
        ))}
        {billingStates.map((state) => (
          <a key={state} className="secondary-button" href={`/states?auth=${authState}&billing=${state}&network=${networkState}`}>
            {billingLabels[state]}
          </a>
        ))}
        <a className="secondary-button" href={`/states?auth=${authState}&billing=${billingState}&network=offline`}>
          オフライン
        </a>
        <a className="secondary-button" href={`/states?auth=${authState}&billing=${billingState}&network=timeout`}>
          タイムアウト
        </a>
      </div>
      <div className="status-grid">
        <section className="panel status-panel" aria-label="認証状態">
          <p className="eyebrow">認証</p>
          <h2>{authLabels[authState]}</h2>
          <p>{authMessages[authState]}</p>
        </section>
        <section className="panel status-panel" aria-label="課金状態">
          <p className="eyebrow">課金</p>
          <h2>{billingLabels[billingState]}</h2>
          <p>{billingMessages[billingState]}</p>
        </section>
      </div>
      {networkState === "offline" ? (
        <StateView title={ja.offline} message="保存済みの表示を維持し、再接続後に自動更新する想定です。" />
      ) : null}
      {networkState === "timeout" ? (
        <StateView title={ja.timeout} message="処理が長引く場合も、再試行できる状態として扱います。" />
      ) : null}
    </main>
  );
}
