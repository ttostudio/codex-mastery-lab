const shipments = [
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
    name: "書籍『TypeScript実践入門』",
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

const state = {
  items: [],
  query: "",
};

const list = document.querySelector("#shipment-list");
const summary = document.querySelector("#summary");
const searchInput = document.querySelector("#search-input");
const emptyState = document.querySelector("#empty-state");
const syncStatus = document.querySelector("#sync-status");
const syncDot = document.querySelector(".sync-dot");
const statusStrip = document.querySelector("#status-strip");
const reloadButton = document.querySelector("#reload-button");

function mockFetchShipments() {
  setLoading(true);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        ok: true,
        updatedAt: new Date(),
        data: shipments,
      });
    }, 450);
  });
}

function setLoading(isLoading) {
  reloadButton.disabled = isLoading;
  syncDot.classList.toggle("ready", !isLoading);
  syncStatus.textContent = isLoading ? "APIに接続中..." : "API同期済み";
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

function render() {
  const filteredItems = getFilteredItems();

  summary.textContent = `${filteredItems.length}件 / 全${state.items.length}件`;
  emptyState.hidden = filteredItems.length > 0;
  list.replaceChildren(...filteredItems.map(createShipmentCard));
  renderStatusStrip(filteredItems);
}

function renderStatusStrip(items) {
  const counts = items.reduce((result, item) => {
    result[item.status] = (result[item.status] ?? 0) + 1;
    return result;
  }, {});

  const statuses = ["配達中", "輸送中", "配達予定", "確認待ち", "配達完了"];
  const tiles = statuses
    .filter((status) => counts[status])
    .map((status) => {
      const tile = document.createElement("article");
      tile.className = "status-tile";
      tile.innerHTML = `<strong>${counts[status]}</strong><span>${status}</span>`;
      return tile;
    });

  statusStrip.replaceChildren(...tiles);
}

function createShipmentCard(item) {
  const card = document.createElement("article");
  card.className = "shipment-card";

  card.innerHTML = `
    <div class="shipment-main">
      <div class="shipment-title">
        <h3></h3>
        <span class="badge ${item.statusKey}"></span>
      </div>
      <dl class="meta-grid">
        <div class="meta-item">
          <dt class="meta-label">配送会社</dt>
          <dd class="meta-value company"></dd>
        </div>
        <div class="meta-item">
          <dt class="meta-label">予定日</dt>
          <dd class="meta-value due-date"></dd>
        </div>
        <div class="meta-item">
          <dt class="meta-label">現在地</dt>
          <dd class="meta-value location"></dd>
        </div>
        <div class="meta-item">
          <dt class="meta-label">状態</dt>
          <dd class="meta-value status"></dd>
        </div>
      </dl>
    </div>
    <p class="memo"></p>
  `;

  card.querySelector("h3").textContent = item.name;
  card.querySelector(".badge").textContent = item.status;
  card.querySelector(".company").textContent = item.company;
  card.querySelector(".due-date").textContent = item.dueDate;
  card.querySelector(".location").textContent = item.location;
  card.querySelector(".status").textContent = item.status;
  card.querySelector(".memo").textContent = item.memo;

  return card;
}

async function loadShipments() {
  summary.textContent = "読み込み中";
  list.replaceChildren();

  try {
    const response = await mockFetchShipments();
    if (!response.ok) {
      throw new Error("配送APIの応答に失敗しました。");
    }

    state.items = response.data;
    render();
  } catch (error) {
    summary.textContent = "取得失敗";
    list.replaceChildren();
    emptyState.hidden = false;
    emptyState.textContent = error.message;
  } finally {
    setLoading(false);
  }
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

reloadButton.addEventListener("click", () => {
  loadShipments();
});

loadShipments();
