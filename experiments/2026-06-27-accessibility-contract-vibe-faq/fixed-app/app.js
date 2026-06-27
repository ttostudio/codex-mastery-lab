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

const form = document.querySelector("#search-form");
const searchInput = document.querySelector("#faq-search");
const list = document.querySelector("#faq-list");
const noResults = document.querySelector("#no-results");
const resultStatus = document.querySelector("#result-status");

function normalize(value) {
  return value.trim().toLowerCase();
}

function createFaqItem(faq, index) {
  const item = document.createElement("li");
  item.className = "faq-item";

  const button = document.createElement("button");
  button.className = "faq-toggle";
  button.type = "button";
  button.id = `faq-toggle-${index}`;
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", `faq-answer-${index}`);

  const question = document.createElement("span");
  question.textContent = faq.question;

  const icon = document.createElement("span");
  icon.className = "toggle-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "+";

  const answer = document.createElement("div");
  answer.className = "faq-answer";
  answer.id = `faq-answer-${index}`;
  answer.setAttribute("role", "region");
  answer.setAttribute("aria-labelledby", button.id);
  answer.hidden = true;

  const answerText = document.createElement("p");
  answerText.textContent = faq.answer;

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = faq.tag;

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    answer.hidden = isExpanded;
    icon.textContent = isExpanded ? "+" : "-";
  });

  button.append(question, icon);
  answer.append(answerText, tag);
  item.append(button, answer);
  return item;
}

function getMatches(query) {
  if (!query) {
    return faqs;
  }

  return faqs.filter((faq) => {
    const searchableText = `${faq.question} ${faq.answer} ${faq.tag}`.toLowerCase();
    return searchableText.includes(query);
  });
}

function updateStatus(count, query) {
  resultStatus.textContent = query
    ? `「${query}」に一致するFAQは${count}件です。`
    : `現在${count}件のFAQを表示しています。`;
}

function renderFaqs() {
  const query = normalize(searchInput.value);
  const matches = getMatches(query);

  list.replaceChildren(...matches.map(createFaqItem));
  noResults.hidden = matches.length > 0;
  updateStatus(matches.length, query);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

searchInput.addEventListener("input", renderFaqs);

renderFaqs();
