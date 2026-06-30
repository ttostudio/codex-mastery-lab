const sampleShipments = [
  {
    name: "有機野菜セット",
    company: "青空急便",
    dueDate: "2026年7月1日",
    location: "東京ベース店",
    status: "配達中",
    statusKey: "delivering",
    memo: "午前中指定。保冷箱で玄関横に置き配予定。",
  },
  {
    name: "ノートPC用スタンド",
    company: "みどりロジスティクス",
    dueDate: "2026年7月2日",
    location: "大阪中継センター",
    status: "輸送中",
    statusKey: "delivering",
    memo: "会議室用の備品。到着後に総務へ連絡。",
  },
  {
    name: "書籍 TypeScript実践入門",
    company: "本町メール便",
    dueDate: "2026年6月30日",
    location: "最寄り配達店",
    status: "配達予定",
    statusKey: "scheduled",
    memo: "ポスト投函。雨天時は宅配ボックスへ変更。",
  },
  {
    name: "展示会サンプル品",
    company: "北斗カーゴ",
    dueDate: "2026年7月3日",
    location: "名古屋仕分け拠点",
    status: "確認待ち",
    statusKey: "hold",
    memo: "受取担当者の本人確認が必要。受付で保留中。",
  },
  {
    name: "コーヒー豆 定期便",
    company: "港町デリバリー",
    dueDate: "2026年6月29日",
    location: "自宅宅配ボックス",
    status: "配達完了",
    statusKey: "arrived",
    memo: "宅配ボックス3番に投函済み。暗証番号は通知済み。",
  },
];

const scenarioMessages = {
  offline: {
    title: "ネットワークに接続できません。",
    action: "通信環境を確認し、接続が戻ったら再試行してください。",
  },
  timeout: {
    title: "配送APIの応答が時間内に返りませんでした。",
    action: "混雑している可能性があります。少し待ってから再試行してください。",
  },
  "server-error": {
    title: "配送APIでサーバーエラーが発生しました。",
    action: "配送会社側の復旧を待つか、現在の表示を確認しながら再試行してください。",
  },
  empty: {
    title: "表示できる荷物がありません。",
    action: "検索条件を見直すか、配送データが追加されてから再試行してください。",
  },
};

const state = {
  scenario: "success",
  items: [],
  query: "",
  isLoading: false,
  lastError: null,
};

const elements = {
  scenarioButtons: Array.from(document.querySelectorAll(".scenario-button")),
  searchInput: document.querySelector("#search-input"),
  retryButton: document.querySelector("#retry-button"),
  messagePanel: document.querySelector("#message-panel"),
  summary: document.querySelector("#summary"),
  shipmentList: document.querySelector("#shipment-list"),
  syncDot: document.querySelector("#sync-dot"),
  syncStatus: document.querySelector("#sync-status"),
};

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(resolve, ms);

    if (!signal) {
      return;
    }

    if (signal.aborted) {
      window.clearTimeout(timeoutId);
      reject(new DOMException("処理が中断されました。", "AbortError"));
      return;
    }

    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeoutId);
        reject(new DOMException("処理が中断されました。", "AbortError"));
      },
      { once: true },
    );
  });
}

async function requestShipments({ scenario, signal }) {
  await wait(scenario === "timeout" ? 320 : 90, signal);

  if (scenario === "offline") {
    throw Object.assign(new Error("offline"), { code: "offline" });
  }

  if (scenario === "timeout") {
    throw Object.assign(new Error("timeout"), { code: "timeout" });
  }

  if (scenario === "server-error") {
    throw Object.assign(new Error("server-error"), { code: "server-error" });
  }

  if (scenario === "empty") {
    return [];
  }

  return sampleShipments.map((shipment) => ({ ...shipment }));
}

function normalizeText(value) {
  return value.toLocaleLowerCase("ja-JP").trim();
}

function getFilteredItems() {
  const query = normalizeText(state.query);

  if (!query) {
    return state.items;
  }

  return state.items.filter((item) => {
    const searchableText = normalizeText(`${item.name} ${item.company} ${item.memo}`);
    return searchableText.includes(query);
  });
}

function setLoading(isLoading) {
  state.isLoading = isLoading;
  elements.retryButton.disabled = isLoading;
  elements.syncDot.className = "sync-dot";

  if (isLoading) {
    elements.syncStatus.textContent = "配送APIから取得中";
    return;
  }

  if (state.lastError) {
    elements.syncDot.classList.add("error");
    elements.syncStatus.textContent = "取得に失敗しました";
    return;
  }

  elements.syncDot.classList.add("success");
  elements.syncStatus.textContent = state.scenario === "empty" ? "空の応答を取得しました" : "一覧を取得しました";
}

function updateScenarioButtons() {
  elements.scenarioButtons.forEach((button) => {
    const isActive = button.dataset.scenario === state.scenario;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function showMessage(kind) {
  const message = scenarioMessages[kind];

  if (!message) {
    elements.messagePanel.hidden = true;
    elements.messagePanel.replaceChildren();
    elements.messagePanel.classList.remove("empty");
    return;
  }

  const title = document.createElement("p");
  title.className = "message-title";
  title.textContent = message.title;

  const action = document.createElement("p");
  action.className = "message-action";
  action.textContent = message.action;

  elements.messagePanel.replaceChildren(title, action);
  elements.messagePanel.hidden = false;
  elements.messagePanel.classList.toggle("empty", kind === "empty");
}

function renderSummary(filteredItems) {
  if (state.lastError) {
    elements.summary.textContent = `前回取得済み ${filteredItems.length}件 / 全${state.items.length}件を表示中`;
    return;
  }

  if (state.scenario === "empty") {
    elements.summary.textContent = "API応答は0件です";
    return;
  }

  elements.summary.textContent = `${filteredItems.length}件 / 全${state.items.length}件`;
}

function render() {
  const filteredItems = getFilteredItems();
  renderSummary(filteredItems);
  elements.shipmentList.replaceChildren(...filteredItems.map(createShipmentCard));
}

function createShipmentCard(item) {
  const card = document.createElement("article");
  card.className = "shipment-card";

  const main = document.createElement("div");

  const titleRow = document.createElement("div");
  titleRow.className = "shipment-title";

  const title = document.createElement("h3");
  title.textContent = item.name;

  const badge = document.createElement("span");
  badge.className = `badge ${item.statusKey}`;
  badge.textContent = item.status;

  titleRow.append(title, badge);

  const meta = document.createElement("dl");
  meta.className = "meta-grid";
  appendMeta(meta, "配送会社", item.company);
  appendMeta(meta, "予定日", item.dueDate);
  appendMeta(meta, "現在地", item.location);
  appendMeta(meta, "状態", item.status);

  main.append(titleRow, meta);

  const memo = document.createElement("p");
  memo.className = "memo";
  memo.textContent = item.memo;

  card.append(main, memo);
  return card;
}

function appendMeta(parent, label, value) {
  const wrapper = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  term.className = "meta-label";
  term.textContent = label;
  description.className = "meta-value";
  description.textContent = value;

  wrapper.append(term, description);
  parent.append(wrapper);
}

async function loadShipments() {
  const controller = new AbortController();
  const timeoutId =
    state.scenario === "timeout"
      ? window.setTimeout(() => controller.abort(), 120)
      : null;

  setLoading(true);
  showMessage(null);

  try {
    const items = await requestShipments({
      scenario: state.scenario,
      signal: controller.signal,
    });
    state.items = items;
    state.lastError = null;
    showMessage(items.length === 0 ? "empty" : null);
  } catch (error) {
    const code = error.name === "AbortError" ? "timeout" : error.code || "server-error";
    state.lastError = code;
    showMessage(code);
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    setLoading(false);
    render();
  }
}

elements.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

elements.retryButton.addEventListener("click", () => {
  loadShipments();
});

elements.scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.scenario = button.dataset.scenario;
    updateScenarioButtons();
    loadShipments();
  });
});

window.requestShipments = requestShipments;

updateScenarioButtons();
loadShipments();
