const faqs = [
  {
    question: "チームメンバーを招待するには？",
    answer: "設定画面の「メンバー」から、相手の仕事用メールアドレスに招待を送れます。招待前に管理者、編集者、閲覧者などの権限を選べます。",
    tag: "チーム"
  },
  {
    question: "シングルサインオンは使えますか？",
    answer: "はい。ビジネスプラン以上でSAML方式のSSOを利用できます。管理者が会社ドメインを確認した後、設定画面から有効化します。",
    tag: "セキュリティ"
  },
  {
    question: "請求情報はどこで変更できますか？",
    answer: "請求管理者は、設定画面の「請求」から支払い方法、請求先メール、請求書情報を変更できます。",
    tag: "請求"
  },
  {
    question: "データのエクスポート方法を知りたいです",
    answer: "ワークスペース管理者は、レポート画面からCSV形式でプロジェクト情報をエクスポートできます。大きなデータは準備完了後にメールで通知されます。",
    tag: "データ"
  },
  {
    question: "Slack通知に対応していますか？",
    answer: "はい。外部連携画面からSlackを接続し、通知先チャンネルと通知したいイベントを選択できます。",
    tag: "外部連携"
  },
  {
    question: "削除したプロジェクトは復元できますか？",
    answer: "削除後30日以内であれば復元できます。設定画面の「ゴミ箱」から対象プロジェクトを選んで復元してください。",
    tag: "プロジェクト"
  },
  {
    question: "通知設定はどこで変更できますか？",
    answer: "プロフィールメニューの「通知」から、メール通知、デスクトップ通知、週次ダイジェストをワークスペースごとに調整できます。",
    tag: "アカウント"
  },
  {
    question: "ユーザー権限には何がありますか？",
    answer: "ワークスペースには、オーナー、管理者、編集者、閲覧者の権限があります。権限ごとに請求、メンバー管理、プロジェクト変更の可否が変わります。",
    tag: "権限"
  },
  {
    question: "監査ログは確認できますか？",
    answer: "エンタープライズプランでは、ログイン、権限変更、エクスポート、請求、外部連携の変更履歴を検索できる監査ログを利用できます。",
    tag: "監査"
  }
];

const searchInput = document.querySelector("#faq-search");
const list = document.querySelector("#faq-list");
const emptyState = document.querySelector("#empty-state");
const resultCount = document.querySelector("#result-count");

function createFaqItem(faq) {
  const details = document.createElement("details");
  details.className = "faq-item";

  const summary = document.createElement("summary");
  summary.textContent = faq.question;

  const answer = document.createElement("p");
  answer.textContent = faq.answer;

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = faq.tag;

  details.append(summary, answer, tag);
  return details;
}

function renderFaqs(items) {
  list.replaceChildren(...items.map(createFaqItem));
  emptyState.hidden = items.length > 0;
  resultCount.textContent = `${items.length}件の回答`;
}

function filterFaqs() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = faqs.filter((faq) => {
    const text = `${faq.question} ${faq.answer} ${faq.tag}`.toLowerCase();
    return text.includes(query);
  });

  renderFaqs(matches);
}

searchInput.addEventListener("input", filterFaqs);
renderFaqs(faqs);
