/**
 * FinView PRO - Visual Personal Expense & Wealth Operating Platform
 * Enterprise Architecture with IndexedDB, NLP, Multi-Currency, Multi-Wallet,
 * Goals, Recurring Bills, Heatmap Calendar, Command Palette & PWA Support.
 */

// ==========================================================================
// 1. CONSTANTS, CURRENCIES & CATEGORY REGISTRY
// ==========================================================================
const STORAGE_KEYS = {
  BUDGET: "finview_budget",
  TRANSACTIONS: "finview_transactions",
  THEME: "finview_theme",
  CURRENCY: "finview_currency",
  GOALS: "finview_goals",
  RECURRING: "finview_recurring",
  ACCOUNTS: "finview_accounts",
  CATEGORY_BUDGETS: "finview_category_budgets",
  PIN: "finview_pin",
  ONBOARDED: "finview_onboarded",
  PRIVACY: "finview_privacy",
};

const CURRENCIES = {
  USD: { symbol: "$", rate: 1.0, label: "USD ($)" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { symbol: "£", rate: 0.79, label: "GBP (£)" },
  JPY: { symbol: "¥", rate: 152.0, label: "JPY (¥)" },
  CAD: { symbol: "$", rate: 1.38, label: "CAD ($)" },
  AUD: { symbol: "$", rate: 1.51, label: "AUD ($)" },
};

const CATEGORIES = {
  Food: { emoji: "🍔", color: "#f59e0b", defaultBudget: 600 },
  Rent: { emoji: "🏠", color: "#ec4899", defaultBudget: 1500 },
  Entertainment: { emoji: "🎮", color: "#8b5cf6", defaultBudget: 250 },
  Utilities: { emoji: "💡", color: "#06b6d4", defaultBudget: 300 },
  Miscellaneous: { emoji: "📦", color: "#64748b", defaultBudget: 200 },
  Salary: { emoji: "💰", color: "#10b981", defaultBudget: 0 },
  Investments: { emoji: "📈", color: "#3b82f6", defaultBudget: 0 },
  Freelance: { emoji: "💻", color: "#a855f7", defaultBudget: 0 },
};

const DEFAULT_ACCOUNTS = {
  bank: { name: "Checking Account", balance: 5420.0, icon: "🏦" },
  card: { name: "Credit Card", balance: -450.0, icon: "💳" },
  cash: { name: "Cash Wallet", balance: 280.0, icon: "💵" },
  crypto: { name: "Crypto Vault", balance: 3150.0, icon: "🪙" },
};

const DEFAULT_GOALS = [
  {
    id: "goal-1",
    title: "Emergency Safety Net",
    target: 10000,
    current: 6800,
    date: "2026-12-31",
  },
  {
    id: "goal-2",
    title: "Tokyo Tech Conference",
    target: 3500,
    current: 2400,
    date: "2027-04-15",
  },
];

const DEFAULT_RECURRING = [
  {
    id: "rec-1",
    title: "Netflix 4K Ultra",
    amount: 22.99,
    frequency: "monthly",
    category: "Entertainment",
    dueDate: "2026-10-28",
  },
  {
    id: "rec-2",
    title: "Apartment Lease",
    amount: 1450.0,
    frequency: "monthly",
    category: "Rent",
    dueDate: "2026-11-01",
  },
  {
    id: "rec-3",
    title: "Gym & Fitness Pass",
    amount: 45.0,
    frequency: "monthly",
    category: "Utilities",
    dueDate: "2026-11-05",
  },
];

// Seed realistic demo transactions across the active month
const SEED_TRANSACTIONS = [
  {
    id: "tx-1",
    description: "Apartment Monthly Rent",
    amount: 1450.0,
    type: "expense",
    category: "Rent",
    account: "bank",
    date: "2026-10-01",
    tags: "#housing",
    createdAt: Date.now() - 2000000,
  },
  {
    id: "tx-2",
    description: "Whole Foods Market",
    amount: 142.65,
    type: "expense",
    category: "Food",
    account: "card",
    date: "2026-10-04",
    tags: "#groceries",
    createdAt: Date.now() - 1800000,
  },
  {
    id: "tx-3",
    description: "Tech Corp Bi-Weekly Salary",
    amount: 3200.0,
    type: "income",
    category: "Salary",
    account: "bank",
    date: "2026-10-05",
    tags: "#salary",
    createdAt: Date.now() - 1700000,
  },
  {
    id: "tx-4",
    description: "Fiber Optic High-Speed Internet",
    amount: 85.0,
    type: "expense",
    category: "Utilities",
    account: "card",
    date: "2026-10-09",
    tags: "#utilities",
    createdAt: Date.now() - 1400000,
  },
  {
    id: "tx-5",
    description: "Steam Autumn Game Sale",
    amount: 64.99,
    type: "expense",
    category: "Entertainment",
    account: "card",
    date: "2026-10-13",
    tags: "#games",
    createdAt: Date.now() - 1100000,
  },
  {
    id: "tx-6",
    description: "Trader Joe Weekly Restock",
    amount: 89.4,
    type: "expense",
    category: "Food",
    account: "card",
    date: "2026-10-17",
    tags: "#food",
    createdAt: Date.now() - 800000,
  },
  {
    id: "tx-7",
    description: "Tech Corp Bi-Weekly Salary",
    amount: 3200.0,
    type: "income",
    category: "Salary",
    account: "bank",
    date: "2026-10-19",
    tags: "#salary",
    createdAt: Date.now() - 600000,
  },
  {
    id: "tx-8",
    description: "Electric Power Grid Bill",
    amount: 110.25,
    type: "expense",
    category: "Utilities",
    account: "bank",
    date: "2026-10-20",
    tags: "#power",
    createdAt: Date.now() - 400000,
  },
  {
    id: "tx-9",
    description: "Freelance Design Client Milestone",
    amount: 850.0,
    type: "income",
    category: "Freelance",
    account: "bank",
    date: "2026-10-22",
    tags: "#freelance",
    createdAt: Date.now() - 200000,
  },
  {
    id: "tx-10",
    description: "Cinema & Dinner Date",
    amount: 76.5,
    type: "expense",
    category: "Entertainment",
    account: "card",
    date: "2026-10-23",
    tags: "#dining",
    createdAt: Date.now() - 50000,
  },
];

// ==========================================================================
// 2. INDEXEDDB REPOSITORY WITH LOCALSTORAGE FALLBACK
// ==========================================================================
class IndexedDBService {
  static db = null;

  static async init() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn("IndexedDB not supported, falling back to localStorage");
        return resolve(false);
      }
      const request = indexedDB.open("FinViewDB", 2);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("transactions")) {
          db.createObjectStore("transactions", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("receipts")) {
          db.createObjectStore("receipts", { keyPath: "txId" });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(true);
      };
      request.onerror = () => resolve(false);
    });
  }

  static async saveReceipt(txId, base64Data) {
    if (!this.db) {
      try {
        localStorage.setItem(`receipt_${txId}`, base64Data);
      } catch (e) {}
      return;
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction("receipts", "readwrite");
      tx.objectStore("receipts").put({ txId, data: base64Data });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }

  static async getReceipt(txId) {
    if (!this.db) {
      return localStorage.getItem(`receipt_${txId}`);
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction("receipts", "readonly");
      const req = tx.objectStore("receipts").get(txId);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => resolve(null);
    });
  }
}

// ==========================================================================
// 3. STORAGE MANAGER
// ==========================================================================
class StorageManager {
  static getBudget() {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGET);
    return raw !== null ? Math.max(0, parseFloat(raw) || 0) : null;
  }

  static setBudget(amount) {
    const val = Math.max(0, parseFloat(amount) || 0);
    localStorage.setItem(STORAGE_KEYS.BUDGET, val.toString());
    return val;
  }

  static getTransactions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (!raw) return SEED_TRANSACTIONS;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : SEED_TRANSACTIONS;
    } catch (e) {
      return SEED_TRANSACTIONS;
    }
  }

  static saveTransactions(list) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list));
  }

  static getGoals() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
      return raw ? JSON.parse(raw) : DEFAULT_GOALS;
    } catch (e) {
      return DEFAULT_GOALS;
    }
  }

  static saveGoals(goals) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  static getRecurring() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RECURRING);
      return raw ? JSON.parse(raw) : DEFAULT_RECURRING;
    } catch (e) {
      return DEFAULT_RECURRING;
    }
  }

  static saveRecurring(items) {
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(items));
  }

  static getAccounts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return raw ? JSON.parse(raw) : DEFAULT_ACCOUNTS;
    } catch (e) {
      return DEFAULT_ACCOUNTS;
    }
  }

  static saveAccounts(accounts) {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }

  static getCategoryBudgets() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CATEGORY_BUDGETS);
      if (raw) return JSON.parse(raw);
      const defaults = {};
      Object.keys(CATEGORIES).forEach(
        (k) => (defaults[k] = CATEGORIES[k].defaultBudget),
      );
      return defaults;
    } catch (e) {
      return {};
    }
  }

  static saveCategoryBudgets(budgets) {
    localStorage.setItem(
      STORAGE_KEYS.CATEGORY_BUDGETS,
      JSON.stringify(budgets),
    );
  }
}

// ==========================================================================
// 4. MULTI-CURRENCY CONVERSION SERVICE
// ==========================================================================
class CurrencyService {
  static current = localStorage.getItem(STORAGE_KEYS.CURRENCY) || "USD";

  static setCurrency(curr) {
    if (CURRENCIES[curr]) {
      this.current = curr;
      localStorage.setItem(STORAGE_KEYS.CURRENCY, curr);
    }
  }

  static format(usdAmount) {
    const info = CURRENCIES[this.current] || CURRENCIES.USD;
    const converted = usdAmount * info.rate;
    const prefix = info.symbol;
    const isNegative = converted < 0;
    const absVal = Math.abs(converted).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${isNegative ? "-" : ""}${prefix}${absVal}`;
  }
}

// ==========================================================================
// 5. NATURAL LANGUAGE SMART ENTRY PARSER
// ==========================================================================
class SmartNLPParser {
  static parse(text) {
    const raw = text.trim();
    if (!raw) return null;

    // Detect amounts: e.g. $45.50 or 45.50 or 45
    const amtMatch = raw.match(/(?:\$|\s|^)(\d+(?:\.\d{1,2})?)(?:\s|$)/);
    const amount = amtMatch ? parseFloat(amtMatch[1]) : null;

    // Detect Account: card, bank, cash, crypto
    let account = "card";
    if (/bank|checking/i.test(raw)) account = "bank";
    else if (/cash/i.test(raw)) account = "cash";
    else if (/crypto|btc|eth/i.test(raw)) account = "crypto";

    // Detect Date: yesterday, today
    let date = new Date().toISOString().split("T")[0];
    if (/yesterday/i.test(raw)) {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      date = d.toISOString().split("T")[0];
    }

    // Detect Type: income vs expense
    let type = "expense";
    if (/salary|paycheck|dividend|freelance|bonus|received|income/i.test(raw)) {
      type = "income";
    }

    // Auto-categorize category
    let category = "Miscellaneous";
    if (
      /coffee|starbucks|uber\s?eats|grocery|trader|whole\s?foods|burger|pizza|lunch|dinner|breakfast|food/i.test(
        raw,
      )
    )
      category = "Food";
    else if (/rent|apartment|lease|mortgage/i.test(raw)) category = "Rent";
    else if (
      /netflix|cinema|movie|game|steam|spotify|concert|arcade/i.test(raw)
    )
      category = "Entertainment";
    else if (/wifi|internet|electric|power|water|phone|att|verizon/i.test(raw))
      category = "Utilities";
    else if (/salary|paycheck|wages/i.test(raw)) category = "Salary";
    else if (/freelance|client|consulting/i.test(raw)) category = "Freelance";
    else if (/invest|dividend|stocks|crypto/i.test(raw))
      category = "Investments";

    // Extract description (clean away keywords)
    let desc = raw
      .replace(amtMatch ? amtMatch[0] : "", "")
      .replace(/on card|in bank|in cash|with cash|yesterday|today/gi, "")
      .trim();

    if (!desc) desc = `${category} Transaction`;

    return {
      description: desc,
      amount: amount || 0,
      type,
      category,
      account,
      date,
    };
  }
}

// ==========================================================================
// 6. TOAST NOTIFICATIONS WITH UNDO CAPABILITY
// ==========================================================================
class ToastManager {
  static container = document.getElementById("toastContainer");
  static lastDeletedItem = null;
  static onUndoCallback = null;

  static show(message, type = "info", undoItem = null, onUndo = null) {
    if (!this.container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let content = `<span>${message}</span>`;
    if (undoItem && onUndo) {
      this.lastDeletedItem = undoItem;
      this.onUndoCallback = onUndo;
      content += `<button type="button" class="btn-undo-toast" id="toastUndoBtn">Undo</button>`;
    }

    toast.innerHTML = content;
    this.container.appendChild(toast);

    if (undoItem && onUndo) {
      const undoBtn = toast.querySelector("#toastUndoBtn");
      undoBtn.addEventListener("click", () => {
        if (this.onUndoCallback && this.lastDeletedItem) {
          this.onUndoCallback(this.lastDeletedItem);
          this.lastDeletedItem = null;
          toast.remove();
        }
      });
    }

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
}

// ==========================================================================
// 7. CHART MANAGER (Chart.js Multi-Mode & Theme Sync)
// ==========================================================================
class ChartManager {
  constructor(onDrillDownCallback) {
    this.onDrillDown = onDrillDownCallback;
    this.doughnutChart = null;
    this.trendsChart = null;
    this.chartMode = "timeline"; // 'timeline' or 'mom'
    this.initCharts();
  }

  initCharts() {
    const categoryCtx = document.getElementById("categoryChart");
    const trendsCtx = document.getElementById("trendsChart");

    if (!categoryCtx || !trendsCtx || typeof Chart === "undefined") return;

    Chart.defaults.color = "#94a3b8";
    Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";

    // 1. Category Doughnut Chart with Segment Click Drill-Down
    this.doughnutChart = new Chart(categoryCtx, {
      type: "doughnut",
      data: {
        labels: Object.keys(CATEGORIES),
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: Object.values(CATEGORIES).map((c) => c.color),
            borderColor: "#1e293b",
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        onClick: (evt, elements) => {
          if (elements.length > 0 && this.onDrillDown) {
            const index = elements[0].index;
            const categoryName = Object.keys(CATEGORIES)[index];
            this.onDrillDown(categoryName);
          }
        },
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 10,
              padding: 10,
              font: { size: 11, weight: "600" },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.chart.data.datasets[0].data.reduce(
                  (a, b) => a + b,
                  0,
                );
                const pct =
                  total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
                return ` ${context.label}: ${CurrencyService.format(context.raw)} (${pct}%)`;
              },
            },
          },
        },
      },
    });

    // 2. Multi-Dataset Bar Chart: Income vs Outflow
    this.trendsChart = new Chart(trendsCtx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Outflow (Expenses)",
            data: [],
            backgroundColor: "rgba(239, 68, 68, 0.85)",
            borderRadius: 5,
            maxBarThickness: 24,
          },
          {
            label: "Inflow (Income)",
            data: [],
            backgroundColor: "rgba(16, 185, 129, 0.85)",
            borderRadius: 5,
            maxBarThickness: 24,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { color: "rgba(255, 255, 255, 0.05)" } },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { callback: (val) => CurrencyService.format(val) },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) =>
                ` ${ctx.dataset.label}: ${CurrencyService.format(ctx.raw)}`,
            },
          },
        },
      },
    });
  }

  update(metrics) {
    if (!this.doughnutChart || !this.trendsChart) return;

    // Update Category Doughnut
    const cats = Object.keys(CATEGORIES);
    const catData = cats.map((c) => metrics.categoryTotals[c] || 0);
    this.doughnutChart.data.datasets[0].data = catData;
    this.doughnutChart.update();

    // Update Top Category Pill
    const topEl = document.getElementById("topCategoryValue");
    if (topEl) {
      if (metrics.topCategory && metrics.topCategory !== "None") {
        const meta = CATEGORIES[metrics.topCategory] || {};
        topEl.textContent = `${meta.emoji || ""} ${metrics.topCategory}`;
        topEl.style.color = meta.color || "#fff";
      } else {
        topEl.textContent = "None";
        topEl.style.color = "#94a3b8";
      }
    }

    // Update Cashflow Trends Chart
    this.trendsChart.data.labels = metrics.trendLabels;
    this.trendsChart.data.datasets[0].data = metrics.trendExpenses;
    this.trendsChart.data.datasets[1].data = metrics.trendIncome;
    this.trendsChart.update();
  }
}

// ==========================================================================
// 8. TRANSACTION LEDGER CONTROLLER (PAGINATION, BULK, EDIT, FILTER)
// ==========================================================================
class LedgerController {
  constructor(app) {
    this.app = app;
    this.tbody = document.getElementById("ledgerTableBody");
    this.emptyState = document.getElementById("ledgerEmptyState");
    this.table = document.getElementById("ledgerTable");
    this.filterCategory = document.getElementById("filterCategory");
    this.filterType = document.getElementById("filterType");
    this.sortOrder = document.getElementById("sortOrder");
    this.searchFilter = document.getElementById("searchFilter");
    this.selectAllCb = document.getElementById("selectAllCheckbox");
    this.bulkToolbar = document.getElementById("bulkActionsToolbar");
    this.bulkCount = document.getElementById("bulkSelectedCount");
    this.bulkDeleteBtn = document.getElementById("bulkDeleteBtn");
    this.bulkRecatSelect = document.getElementById("bulkRecategorizeSelect");

    // Pagination
    this.currentPage = 1;
    this.pageSize = 10;
    this.selectedIds = new Set();

    this.bindEvents();
  }

  bindEvents() {
    this.filterCategory.addEventListener("change", () => {
      this.currentPage = 1;
      this.render();
    });
    this.filterType.addEventListener("change", () => {
      this.currentPage = 1;
      this.render();
    });
    this.sortOrder.addEventListener("change", () => {
      this.currentPage = 1;
      this.render();
    });
    this.searchFilter.addEventListener("input", () => {
      this.currentPage = 1;
      this.render();
    });

    document.getElementById("prevPageBtn").addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.render();
      }
    });
    document.getElementById("nextPageBtn").addEventListener("click", () => {
      this.currentPage++;
      this.render();
    });

    // Select all checkbox
    this.selectAllCb.addEventListener("change", (e) => {
      const visibleCheckboxes = this.tbody.querySelectorAll(".row-select-cb");
      visibleCheckboxes.forEach((cb) => {
        cb.checked = e.target.checked;
        const id = cb.getAttribute("data-id");
        if (e.target.checked) this.selectedIds.add(id);
        else this.selectedIds.delete(id);
      });
      this.updateBulkToolbar();
    });

    // Bulk Delete
    this.bulkDeleteBtn.addEventListener("click", () => {
      if (this.selectedIds.size === 0) return;
      const all = StorageManager.getTransactions().filter(
        (t) => !this.selectedIds.has(t.id),
      );
      StorageManager.saveTransactions(all);
      ToastManager.show(
        `Deleted ${this.selectedIds.size} transactions`,
        "danger",
      );
      this.selectedIds.clear();
      this.app.refreshAll();
    });

    // Bulk Re-categorize
    this.bulkRecatSelect.addEventListener("change", (e) => {
      const newCat = e.target.value;
      if (!newCat || this.selectedIds.size === 0) return;
      const all = StorageManager.getTransactions().map((t) => {
        if (this.selectedIds.has(t.id)) t.category = newCat;
        return t;
      });
      StorageManager.saveTransactions(all);
      ToastManager.show(
        `Re-categorized ${this.selectedIds.size} transactions to ${newCat}`,
        "success",
      );
      this.selectedIds.clear();
      this.bulkRecatSelect.selectedIndex = 0;
      this.app.refreshAll();
    });

    // Table Row Actions (Edit, Delete, View Receipt)
    this.tbody.addEventListener("click", async (e) => {
      const deleteBtn = e.target.closest(".btn-delete-row");
      const editBtn = e.target.closest(".btn-edit-row");
      const receiptBtn = e.target.closest(".btn-receipt-view");

      if (deleteBtn) {
        const id = deleteBtn.getAttribute("data-id");
        this.app.handleDeleteTransaction(id);
      } else if (editBtn) {
        const id = editBtn.getAttribute("data-id");
        this.app.handleEditTransaction(id);
      } else if (receiptBtn) {
        const id = receiptBtn.getAttribute("data-id");
        const imgData = await IndexedDBService.getReceipt(id);
        if (imgData) {
          document.getElementById("receiptFullImage").src = imgData;
          document.getElementById("receiptModal").classList.remove("hidden");
        }
      } else if (e.target.classList.contains("row-select-cb")) {
        const id = e.target.getAttribute("data-id");
        if (e.target.checked) this.selectedIds.add(id);
        else this.selectedIds.delete(id);
        this.updateBulkToolbar();
      }
    });
  }

  updateBulkToolbar() {
    if (this.selectedIds.size > 0) {
      this.bulkToolbar.classList.remove("hidden");
      this.bulkCount.textContent = this.selectedIds.size;
    } else {
      this.bulkToolbar.classList.add("hidden");
    }
  }

  render() {
    const rawTransactions = StorageManager.getTransactions();
    const catFilter = this.filterCategory.value;
    const typeFilter = this.filterType.value;
    const sortVal = this.sortOrder.value;
    const query = this.searchFilter.value.trim().toLowerCase();
    const accountFilter = document.getElementById("accountFilterSelect").value;

    // Filter
    let filtered = rawTransactions.filter((item) => {
      if (catFilter !== "ALL" && item.category !== catFilter) return false;
      if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
      if (accountFilter !== "ALL" && item.account !== accountFilter)
        return false;
      if (query) {
        const text =
          `${item.description} ${item.category} ${item.tags || ""}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortVal === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortVal === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortVal === "amount-desc") return b.amount - a.amount;
      if (sortVal === "amount-asc") return a.amount - b.amount;
      return 0;
    });

    // Update Counts & Summary Total
    const visibleTotal = filtered.reduce(
      (sum, item) =>
        sum + (item.type === "expense" ? -item.amount : item.amount),
      0,
    );
    document.getElementById("ledgerVisibleCount").textContent = filtered.length;
    document.getElementById("ledgerVisibleTotal").textContent =
      CurrencyService.format(visibleTotal);

    // Pagination slicing
    const totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    const startIdx = (this.currentPage - 1) * this.pageSize;
    const pagedItems = filtered.slice(startIdx, startIdx + this.pageSize);

    document.getElementById("pageStart").textContent =
      filtered.length === 0 ? 0 : startIdx + 1;
    document.getElementById("pageEnd").textContent = Math.min(
      startIdx + this.pageSize,
      filtered.length,
    );
    document.getElementById("pageTotal").textContent = filtered.length;
    document.getElementById("currentPageNum").textContent =
      `${this.currentPage} / ${totalPages}`;

    this.tbody.innerHTML = "";
    if (filtered.length === 0) {
      this.table.style.display = "none";
      this.emptyState.style.display = "flex";
      return;
    }

    this.table.style.display = "table";
    this.emptyState.style.display = "none";

    pagedItems.forEach((tx) => {
      const tr = document.createElement("tr");
      const catMeta = CATEGORIES[tx.category] || CATEGORIES.Miscellaneous;
      const isExpense = tx.type !== "income";
      const formattedAmount = `${isExpense ? "-" : "+"}${CurrencyService.format(tx.amount)}`;
      const isSelected = this.selectedIds.has(tx.id);

      tr.innerHTML = `
        <td class="td-checkbox">
          <input type="checkbox" class="row-select-cb" data-id="${tx.id}" ${isSelected ? "checked" : ""}>
        </td>
        <td class="td-date">${tx.date}</td>
        <td class="td-category">
          <span class="cat-badge cat-${tx.category}">
            <span>${catMeta.emoji || "📦"}</span>
            <span>${tx.category}</span>
          </span>
        </td>
        <td class="td-account">
          <span style="font-size:0.75rem; text-transform: capitalize; color: var(--text-secondary);">${tx.account || "card"}</span>
        </td>
        <td class="td-desc">
          <div class="td-desc-text">${this.escape(tx.description)}</div>
          ${tx.tags ? `<div class="td-tags-row"><span class="tag-badge">${this.escape(tx.tags)}</span></div>` : ""}
        </td>
        <td class="td-amount ${isExpense ? "amount-expense" : "amount-income"} metric-value">${formattedAmount}</td>
        <td class="th-receipt">
          ${tx.hasReceipt ? `<button type="button" class="btn-table-action btn-receipt-view" data-id="${tx.id}" title="View Receipt">📎</button>` : "-"}
        </td>
        <td class="td-action">
          <div class="table-action-btns">
            <button type="button" class="btn-table-action btn-edit-row" data-id="${tx.id}" title="Edit Transaction">✏️</button>
            <button type="button" class="btn-table-action btn-delete-row" data-id="${tx.id}" title="Delete Transaction">🗑️</button>
          </div>
        </td>
      `;
      this.tbody.appendChild(tr);
    });
  }

  escape(str) {
    return String(str || "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[m],
    );
  }
}

// ==========================================================================
// 9. COMMAND PALETTE (CTRL+K) CONTROLLER
// ==========================================================================
class CommandPaletteController {
  constructor(app) {
    this.app = app;
    this.modal = document.getElementById("commandPaletteModal");
    this.input = document.getElementById("commandPaletteInput");
    this.list = document.getElementById("commandList");
    this.openBtn = document.getElementById("openCommandPaletteBtn");

    this.commands = [
      {
        title: "Add New Expense Transaction",
        icon: "💸",
        action: () => {
          this.app.setFormType("expense");
          document.getElementById("expenseDescription").focus();
        },
      },
      {
        title: "Add New Income Deposit",
        icon: "💰",
        action: () => {
          this.app.setFormType("income");
          document.getElementById("expenseDescription").focus();
        },
      },
      {
        title: "Toggle Privacy Blur Mode (P)",
        icon: "👁️",
        action: () => this.app.togglePrivacyMode(),
      },
      {
        title: "Switch to Cyber Neon Theme",
        icon: "⚡",
        action: () => this.app.themeManager.applyTheme("cyber-neon"),
      },
      {
        title: "Switch to Emerald Matrix Theme",
        icon: "🌲",
        action: () => this.app.themeManager.applyTheme("emerald-matrix"),
      },
      {
        title: "Switch to Sunset Crimson Theme",
        icon: "🌅",
        action: () => this.app.themeManager.applyTheme("sunset-crimson"),
      },
      {
        title: "Switch to Obsidian Gold Theme",
        icon: "👑",
        action: () => this.app.themeManager.applyTheme("luxury-gold"),
      },
      {
        title: "Switch to Clean Light Theme",
        icon: "☀️",
        action: () => this.app.themeManager.applyTheme("clean-light"),
      },
      {
        title: "Export Transactions as CSV",
        icon: "📊",
        action: () => this.app.exportCsv(),
      },
      {
        title: "Download Full JSON Backup",
        icon: "💾",
        action: () => this.app.downloadBackup(),
      },
      {
        title: "Printable PDF Monthly Report",
        icon: "🖨️",
        action: () => window.print(),
      },
      {
        title: "Configure Monthly Budget Ceiling",
        icon: "🎯",
        action: () => this.app.budgetModal.open(),
      },
    ];

    this.bindEvents();
  }

  bindEvents() {
    this.openBtn.addEventListener("click", () => this.open());
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.open();
      }
      if (e.key === "Escape" && !this.modal.classList.contains("hidden")) {
        this.close();
      }
    });

    this.input.addEventListener("input", () =>
      this.renderList(this.input.value),
    );
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  open() {
    this.modal.classList.remove("hidden");
    this.input.value = "";
    this.renderList("");
    setTimeout(() => this.input.focus(), 80);
  }

  close() {
    this.modal.classList.add("hidden");
  }

  renderList(filterText) {
    const q = filterText.toLowerCase();
    const matches = this.commands.filter((c) =>
      c.title.toLowerCase().includes(q),
    );
    this.list.innerHTML = "";
    matches.forEach((c) => {
      const item = document.createElement("div");
      item.className = "command-item";
      item.innerHTML = `<span>${c.icon} ${c.title}</span>`;
      item.addEventListener("click", () => {
        this.close();
        c.action();
      });
      this.list.appendChild(item);
    });
  }
}

// ==========================================================================
// 10. MAIN FINVIEW PRO APPLICATION ORCHESTRATOR
// ==========================================================================
class FinViewApp {
  constructor() {
    this.currentBudget = 0;
    this.activeMonth = "2026-10";
    this.formType = "expense";
    this.attachedReceiptBase64 = null;
  }

  async init() {
    // 1. Initialize IndexedDB
    await IndexedDBService.init();

    // 2. Initialize Subsystems
    this.chartManager = new ChartManager((drillCategory) => {
      document.getElementById("filterCategory").value = drillCategory;
      this.ledgerController.render();
      ToastManager.show(`Filtered ledger by ${drillCategory}`, "info");
    });

    this.ledgerController = new LedgerController(this);
    this.commandPalette = new CommandPaletteController(this);

    // 3. Theme Manager
    this.themeManager = {
      applyTheme: (themeName) => {
        if (themeName === "system-auto") {
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches;
          document.documentElement.setAttribute(
            "data-theme",
            prefersDark ? "midnight-slate" : "clean-light",
          );
        } else {
          document.documentElement.setAttribute("data-theme", themeName);
        }
        localStorage.setItem(STORAGE_KEYS.THEME, themeName);
        document.getElementById("themeSelect").value = themeName;
      },
    };
    const savedTheme =
      localStorage.getItem(STORAGE_KEYS.THEME) || "midnight-slate";
    this.themeManager.applyTheme(savedTheme);
    document
      .getElementById("themeSelect")
      .addEventListener("change", (e) =>
        this.themeManager.applyTheme(e.target.value),
      );

    // 4. Currency Switcher
    const currSelect = document.getElementById("currencySelect");
    currSelect.value = CurrencyService.current;
    currSelect.addEventListener("change", (e) => {
      CurrencyService.setCurrency(e.target.value);
      this.refreshAll();
    });

    // 5. Budget Modal Setup
    this.setupBudgetModal();

    // 6. Bind Keyboard Shortcuts (N, /, P)
    this.setupKeyboardShortcuts();

    // 7. Bind Transaction Form & Type Toggles
    this.setupTransactionForm();

    // 8. Bind Natural Language Entry Bar
    this.setupNLPBar();

    // 9. Bind Month Picker Navigation
    this.setupMonthPicker();

    // 10. Bind Import & Export Tools
    this.setupImportExport();

    // 11. Bind Goals & Recurring Modals
    this.setupGoalsAndRecurring();

    // 12. Bind Security PIN System
    this.setupPINSecurity();

    // 13. PWA Registration
    this.registerPWA();

    // Initial Budget Lifecycle check
    const stored = StorageManager.getBudget();
    if (stored === null) {
      this.currentBudget = 0;
      setTimeout(() => this.budgetModal.open(), 400);
    } else {
      this.currentBudget = stored;
    }

    // First Full Render
    this.refreshAll();
  }

  setupBudgetModal() {
    const modal = document.getElementById("budgetModalBackdrop");
    const input = document.getElementById("monthlyBudgetInput");
    const form = document.getElementById("budgetForm");

    this.budgetModal = {
      open: () => {
        modal.classList.remove("hidden");
        input.value = this.currentBudget > 0 ? this.currentBudget : "";
        setTimeout(() => input.focus(), 100);
      },
      close: () => modal.classList.add("hidden"),
    };

    document
      .getElementById("openBudgetBtn")
      .addEventListener("click", () => this.budgetModal.open());
    document
      .getElementById("closeBudgetModalBtn")
      .addEventListener("click", () => this.budgetModal.close());
    document
      .getElementById("cancelBudgetBtn")
      .addEventListener("click", () => this.budgetModal.close());

    document.querySelectorAll(".suggestion-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        input.value = btn.getAttribute("data-preset");
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = parseFloat(input.value);
      if (isNaN(val) || val <= 0) return;
      StorageManager.setBudget(val);
      this.currentBudget = val;
      this.budgetModal.close();
      this.refreshAll();
      ToastManager.show(
        `Budget target updated to ${CurrencyService.format(val)}`,
        "success",
      );
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Don't intercept when user is typing inside input or textarea
      if (
        ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)
      )
        return;

      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        document.getElementById("expenseDescription").focus();
      } else if (e.key === "/") {
        e.preventDefault();
        document.getElementById("searchFilter").focus();
      } else if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        this.togglePrivacyMode();
      }
    });

    document
      .getElementById("togglePrivacyBtn")
      .addEventListener("click", () => this.togglePrivacyMode());
  }

  togglePrivacyMode() {
    document.body.classList.toggle("privacy-mode");
    const isPrivacy = document.body.classList.contains("privacy-mode");
    ToastManager.show(
      `Privacy Mode ${isPrivacy ? "Enabled (Balances Hidden)" : "Disabled"}`,
      "info",
    );
  }

  setupTransactionForm() {
    const expBtn = document.getElementById("typeExpenseBtn");
    const incBtn = document.getElementById("typeIncomeBtn");

    expBtn.addEventListener("click", () => this.setFormType("expense"));
    incBtn.addEventListener("click", () => this.setFormType("income"));

    // Receipt File Attachment
    const receiptInput = document.getElementById("receiptFileInput");
    const receiptPreview = document.getElementById("receiptPreviewBox");
    const receiptImg = document.getElementById("receiptPreviewImg");
    const removeReceiptBtn = document.getElementById("removeReceiptBtn");
    const promptBox = document.getElementById("dropzonePrompt");

    receiptInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          this.attachedReceiptBase64 = re.target.result;
          receiptImg.src = this.attachedReceiptBase64;
          receiptPreview.classList.remove("hidden");
          promptBox.classList.add("hidden");
        };
        reader.readAsDataURL(file);
      }
    });

    removeReceiptBtn.addEventListener("click", () => {
      this.attachedReceiptBase64 = null;
      receiptInput.value = "";
      receiptPreview.classList.add("hidden");
      promptBox.classList.remove("hidden");
    });

    // Form submission
    const form = document.getElementById("expenseForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const desc = document.getElementById("expenseDescription").value.trim();
      const amount = parseFloat(document.getElementById("expenseAmount").value);
      const category = document.getElementById("expenseCategory").value;
      const account = document.getElementById("expenseAccount").value;
      const date = document.getElementById("expenseDate").value;
      const tags = document.getElementById("expenseTags").value.trim();
      const editId = document.getElementById("editTransactionId").value;

      if (!desc || isNaN(amount) || amount <= 0 || !date) {
        ToastManager.show("Please complete all required fields.", "danger");
        return;
      }

      const all = StorageManager.getTransactions();

      if (editId) {
        // Editing existing transaction
        const idx = all.findIndex((t) => t.id === editId);
        if (idx !== -1) {
          all[idx] = {
            ...all[idx],
            description: desc,
            amount: Number(amount.toFixed(2)),
            category,
            account,
            date,
            tags,
            type: this.formType,
          };
          StorageManager.saveTransactions(all);
          ToastManager.show("Transaction updated successfully", "success");
        }
      } else {
        // New transaction
        const newTx = {
          id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          description: desc,
          amount: Number(amount.toFixed(2)),
          type: this.formType,
          category,
          account,
          date,
          tags,
          hasReceipt: !!this.attachedReceiptBase64,
          createdAt: Date.now(),
        };

        if (this.attachedReceiptBase64) {
          await IndexedDBService.saveReceipt(
            newTx.id,
            this.attachedReceiptBase64,
          );
        }

        all.unshift(newTx);
        StorageManager.saveTransactions(all);
        ToastManager.show(
          `Recorded ${CurrencyService.format(newTx.amount)} for ${newTx.description}`,
          "success",
        );
      }

      this.resetTransactionForm();
      this.refreshAll();
    });

    document
      .getElementById("cancelEditBtn")
      .addEventListener("click", () => this.resetTransactionForm());
  }

  setFormType(type) {
    this.formType = type;
    document
      .getElementById("typeExpenseBtn")
      .classList.toggle("active", type === "expense");
    document
      .getElementById("typeIncomeBtn")
      .classList.toggle("active", type === "income");
    document.getElementById("submitBtnText").textContent =
      type === "income" ? "Record Income Deposit" : "Record Expense";
  }

  resetTransactionForm() {
    document.getElementById("expenseForm").reset();
    document.getElementById("editTransactionId").value = "";
    document.getElementById("cancelEditBtn").classList.add("hidden");
    document.getElementById("formHeaderTitle").textContent = "Log Transaction";
    document.getElementById("expenseDate").value = new Date()
      .toISOString()
      .split("T")[0];
    this.attachedReceiptBase64 = null;
    document.getElementById("receiptPreviewBox").classList.add("hidden");
    document.getElementById("dropzonePrompt").classList.remove("hidden");
    this.setFormType("expense");
  }

  handleEditTransaction(id) {
    const tx = StorageManager.getTransactions().find((t) => t.id === id);
    if (!tx) return;
    document.getElementById("editTransactionId").value = tx.id;
    document.getElementById("expenseDescription").value = tx.description;
    document.getElementById("expenseAmount").value = tx.amount;
    document.getElementById("expenseCategory").value = tx.category;
    document.getElementById("expenseAccount").value = tx.account || "bank";
    document.getElementById("expenseDate").value = tx.date;
    document.getElementById("expenseTags").value = tx.tags || "";
    this.setFormType(tx.type || "expense");
    document.getElementById("cancelEditBtn").classList.remove("hidden");
    document.getElementById("formHeaderTitle").textContent = "Edit Transaction";
    document.getElementById("expenseDescription").focus();
  }

  handleDeleteTransaction(id) {
    const all = StorageManager.getTransactions();
    const deleted = all.find((t) => t.id === id);
    const filtered = all.filter((t) => t.id !== id);
    StorageManager.saveTransactions(filtered);
    this.refreshAll();
    ToastManager.show("Transaction deleted", "danger", deleted, (restored) => {
      filtered.unshift(restored);
      StorageManager.saveTransactions(filtered);
      this.refreshAll();
      ToastManager.show("Transaction restored!", "success");
    });
  }

  setupNLPBar() {
    const input = document.getElementById("nlpQuickInput");
    const submitBtn = document.getElementById("nlpSubmitBtn");
    const voiceBtn = document.getElementById("voiceInputBtn");

    const handleSmartAdd = () => {
      const parsed = SmartNLPParser.parse(input.value);
      if (!parsed || parsed.amount <= 0) {
        ToastManager.show(
          'Could not parse natural language amount. Try "Lunch 15 on card".',
          "danger",
        );
        return;
      }
      const newTx = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        ...parsed,
        createdAt: Date.now(),
      };
      const all = StorageManager.getTransactions();
      all.unshift(newTx);
      StorageManager.saveTransactions(all);
      input.value = "";
      this.refreshAll();
      ToastManager.show(
        `Smart Add: ${parsed.description} (${CurrencyService.format(parsed.amount)}) to ${parsed.category}`,
        "success",
      );
    };

    submitBtn.addEventListener("click", handleSmartAdd);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSmartAdd();
    });

    // Voice Input Speech-to-Text
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.onstart = () => voiceBtn.classList.add("recording");
      recognizer.onend = () => voiceBtn.classList.remove("recording");
      recognizer.onresult = (e) => {
        input.value = e.results[0][0].transcript;
        handleSmartAdd();
      };
      voiceBtn.addEventListener("click", () => recognizer.start());
    } else {
      voiceBtn.style.display = "none";
    }
  }

  setupMonthPicker() {
    const prev = document.getElementById("prevMonthBtn");
    const next = document.getElementById("nextMonthBtn");
    const display = document.getElementById("currentMonthDisplay");
    const hidden = document.getElementById("hiddenMonthInput");

    const updateDisplay = () => {
      const [year, month] = this.activeMonth.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      display.textContent = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      this.refreshAll();
    };

    prev.addEventListener("click", () => {
      const [y, m] = this.activeMonth.split("-").map(Number);
      const prevDate = new Date(y, m - 2, 1);
      this.activeMonth = prevDate.toISOString().slice(0, 7);
      updateDisplay();
    });

    next.addEventListener("click", () => {
      const [y, m] = this.activeMonth.split("-").map(Number);
      const nextDate = new Date(y, m, 1);
      this.activeMonth = nextDate.toISOString().slice(0, 7);
      updateDisplay();
    });

    display.addEventListener("click", () =>
      hidden.showPicker ? hidden.showPicker() : hidden.click(),
    );
    hidden.addEventListener("change", (e) => {
      if (e.target.value) {
        this.activeMonth = e.target.value;
        updateDisplay();
      }
    });

    document
      .getElementById("accountFilterSelect")
      .addEventListener("change", () => this.refreshAll());
  }

  setupImportExport() {
    document
      .getElementById("exportCsvBtn")
      .addEventListener("click", () => this.exportCsv());
    document
      .getElementById("exportJsonBtn")
      .addEventListener("click", () => this.downloadBackup());
    document
      .getElementById("printReportBtn")
      .addEventListener("click", () => window.print());

    // CSV Import Modal
    const csvModal = document.getElementById("csvImportModal");
    document
      .getElementById("importCsvBtn")
      .addEventListener("click", () => csvModal.classList.remove("hidden"));
    document
      .getElementById("closeCsvModalBtn")
      .addEventListener("click", () => csvModal.classList.add("hidden"));
    document
      .getElementById("cancelCsvBtn")
      .addEventListener("click", () => csvModal.classList.add("hidden"));

    const fileInput = document.getElementById("csvFileInput");
    let csvRows = [];
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (re) => {
        const text = re.target.result;
        const lines = text.split("\n").filter((l) => l.trim().length > 0);
        if (lines.length > 1) {
          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().replace(/^"|"$/g, ""));
          csvRows = lines
            .slice(1)
            .map((l) =>
              l.split(",").map((c) => c.trim().replace(/^"|"$/g, "")),
            );

          // Populate mapper selects
          [
            "mapDateCol",
            "mapDescCol",
            "mapAmountCol",
            "mapCategoryCol",
          ].forEach((selId) => {
            const sel = document.getElementById(selId);
            sel.innerHTML =
              '<option value="">(None)</option>' +
              headers
                .map((h, i) => `<option value="${i}">${h}</option>`)
                .join("");
          });

          // Auto-guess columns
          headers.forEach((h, i) => {
            const low = h.toLowerCase();
            if (low.includes("date"))
              document.getElementById("mapDateCol").value = i;
            if (
              low.includes("desc") ||
              low.includes("name") ||
              low.includes("payee")
            )
              document.getElementById("mapDescCol").value = i;
            if (
              low.includes("amount") ||
              low.includes("total") ||
              low.includes("debit")
            )
              document.getElementById("mapAmountCol").value = i;
            if (low.includes("cat"))
              document.getElementById("mapCategoryCol").value = i;
          });

          document
            .getElementById("csvMappingContainer")
            .classList.remove("hidden");
          document
            .getElementById("executeCsvImportBtn")
            .removeAttribute("disabled");
        }
      };
      reader.readAsText(file);
    });

    document
      .getElementById("executeCsvImportBtn")
      .addEventListener("click", () => {
        const dateIdx = parseInt(document.getElementById("mapDateCol").value);
        const descIdx = parseInt(document.getElementById("mapDescCol").value);
        const amtIdx = parseInt(document.getElementById("mapAmountCol").value);
        const catIdx = parseInt(
          document.getElementById("mapCategoryCol").value,
        );

        if (isNaN(dateIdx) || isNaN(descIdx) || isNaN(amtIdx)) {
          ToastManager.show(
            "Please map Date, Description, and Amount columns.",
            "danger",
          );
          return;
        }

        const imported = [];
        csvRows.forEach((row) => {
          const rawAmt = parseFloat(row[amtIdx]);
          if (!isNaN(rawAmt)) {
            const isNeg = rawAmt < 0;
            imported.push({
              id: `tx-imp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              date: row[dateIdx] || new Date().toISOString().split("T")[0],
              description: row[descIdx] || "Imported Transaction",
              amount: Math.abs(rawAmt),
              type: isNeg ? "expense" : "income",
              category:
                !isNaN(catIdx) && row[catIdx] ? row[catIdx] : "Miscellaneous",
              account: "bank",
              createdAt: Date.now(),
            });
          }
        });

        const current = StorageManager.getTransactions();
        StorageManager.saveTransactions([...imported, ...current]);
        csvModal.classList.add("hidden");
        this.refreshAll();
        ToastManager.show(
          `Successfully imported ${imported.length} transactions!`,
          "success",
        );
      });
  }

  exportCsv() {
    const list = StorageManager.getTransactions();
    const headers = [
      "Date",
      "Description",
      "Amount",
      "Type",
      "Category",
      "Account",
      "Tags",
    ];
    const rows = list.map((t) => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      t.category,
      t.account || "card",
      `"${(t.tags || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `finview_export_${this.activeMonth}.csv`;
    link.click();
    ToastManager.show("Exported CSV successfully", "success");
  }

  downloadBackup() {
    const backup = {
      version: "2.0",
      timestamp: new Date().toISOString(),
      budget: StorageManager.getBudget(),
      transactions: StorageManager.getTransactions(),
      goals: StorageManager.getGoals(),
      recurring: StorageManager.getRecurring(),
      accounts: StorageManager.getAccounts(),
      categoryBudgets: StorageManager.getCategoryBudgets(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `finview_backup_${Date.now()}.json`;
    link.click();
    ToastManager.show("Downloaded JSON platform backup", "success");
  }

  setupGoalsAndRecurring() {
    // Goals Modal
    const goalModal = document.getElementById("goalModal");
    document
      .getElementById("addNewGoalBtn")
      .addEventListener("click", () => goalModal.classList.remove("hidden"));
    document
      .getElementById("closeGoalModalBtn")
      .addEventListener("click", () => goalModal.classList.add("hidden"));
    document
      .getElementById("cancelGoalBtn")
      .addEventListener("click", () => goalModal.classList.add("hidden"));

    document.getElementById("goalForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("goalNameInput").value;
      const target = parseFloat(
        document.getElementById("goalTargetInput").value,
      );
      const current =
        parseFloat(document.getElementById("goalCurrentInput").value) || 0;
      const date = document.getElementById("goalDateInput").value;

      const goals = StorageManager.getGoals();
      goals.push({ id: `goal-${Date.now()}`, title, target, current, date });
      StorageManager.saveGoals(goals);
      goalModal.classList.add("hidden");
      this.refreshAll();
      ToastManager.show(`Created savings goal: ${title}`, "success");
    });

    // Recurring Subscriptions Modal
    const recModal = document.getElementById("recurringModal");
    document
      .getElementById("addRecurringBtn")
      .addEventListener("click", () => recModal.classList.remove("hidden"));
    document
      .getElementById("closeRecurringModalBtn")
      .addEventListener("click", () => recModal.classList.add("hidden"));
    document
      .getElementById("cancelRecBtn")
      .addEventListener("click", () => recModal.classList.add("hidden"));

    document.getElementById("recurringForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("recTitleInput").value;
      const amount = parseFloat(
        document.getElementById("recAmountInput").value,
      );
      const frequency = document.getElementById("recFrequencySelect").value;
      const category = document.getElementById("recCategorySelect").value;
      const dueDate = document.getElementById("recDueDateInput").value;

      const items = StorageManager.getRecurring();
      items.push({
        id: `rec-${Date.now()}`,
        title,
        amount,
        frequency,
        category,
        dueDate,
      });
      StorageManager.saveRecurring(items);
      recModal.classList.add("hidden");
      this.refreshAll();
      ToastManager.show(`Added recurring subscription: ${title}`, "success");
    });

    // Settings Modal
    const settingsModal = document.getElementById("settingsModal");
    document
      .getElementById("openSettingsBtn")
      .addEventListener("click", () =>
        settingsModal.classList.remove("hidden"),
      );
    document
      .getElementById("closeSettingsModalBtn")
      .addEventListener("click", () => settingsModal.classList.add("hidden"));
    document
      .getElementById("downloadBackupBtn")
      .addEventListener("click", () => this.downloadBackup());

    document
      .getElementById("restoreBackupInput")
      .addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (re) => {
          try {
            const data = JSON.parse(re.target.result);
            if (data.transactions)
              StorageManager.saveTransactions(data.transactions);
            if (data.budget) StorageManager.setBudget(data.budget);
            if (data.goals) StorageManager.saveGoals(data.goals);
            if (data.recurring) StorageManager.saveRecurring(data.recurring);
            this.refreshAll();
            settingsModal.classList.add("hidden");
            ToastManager.show("Backup restored successfully!", "success");
          } catch (err) {
            ToastManager.show("Invalid backup JSON format", "danger");
          }
        };
        reader.readAsText(file);
      });

    // Close receipt modal
    document
      .getElementById("closeReceiptModalBtn")
      .addEventListener("click", () => {
        document.getElementById("receiptModal").classList.add("hidden");
      });

    // Onboarding Dismissal
    const onboardModal = document.getElementById("onboardingModal");
    if (!localStorage.getItem(STORAGE_KEYS.ONBOARDED)) {
      setTimeout(() => onboardModal.classList.remove("hidden"), 500);
    }
    document
      .getElementById("dismissOnboardingBtn")
      .addEventListener("click", () => {
        localStorage.setItem(STORAGE_KEYS.ONBOARDED, "true");
        onboardModal.classList.add("hidden");
      });
  }

  setupPINSecurity() {
    const savedPin = localStorage.getItem(STORAGE_KEYS.PIN);
    const overlay = document.getElementById("pinLockOverlay");
    const dots = document.getElementById("pinDots").children;

    if (savedPin) {
      overlay.classList.remove("hidden");
      let entered = "";

      document.querySelectorAll(".pin-key[data-key]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (entered.length < 4) {
            entered += btn.getAttribute("data-key");
            updateDots();
            if (entered.length === 4) {
              if (entered === savedPin) {
                overlay.classList.add("hidden");
                ToastManager.show("Vault Unlocked", "success");
              } else {
                ToastManager.show("Incorrect PIN code", "danger");
                entered = "";
                updateDots();
              }
            }
          }
        });
      });

      document.getElementById("pinClearBtn").addEventListener("click", () => {
        entered = "";
        updateDots();
      });
      document.getElementById("pinBackBtn").addEventListener("click", () => {
        entered = entered.slice(0, -1);
        updateDots();
      });

      function updateDots() {
        for (let i = 0; i < 4; i++) {
          dots[i].classList.toggle("filled", i < entered.length);
        }
      }
    }

    document.getElementById("savePinBtn").addEventListener("click", () => {
      const pin = document.getElementById("setPinInput").value.trim();
      if (pin.length === 4) {
        localStorage.setItem(STORAGE_KEYS.PIN, pin);
        ToastManager.show("4-Digit Security PIN configured", "success");
      } else if (pin.length === 0) {
        localStorage.removeItem(STORAGE_KEYS.PIN);
        ToastManager.show("Security PIN disabled", "info");
      } else {
        ToastManager.show("PIN must be exactly 4 digits", "danger");
      }
    });
  }

  registerPWA() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./sw.js")
        .catch((err) => console.log("SW registration non-critical:", err));
    }
  }

  refreshAll() {
    const transactions = StorageManager.getTransactions();
    const goals = StorageManager.getGoals();
    const recurring = StorageManager.getRecurring();
    const categoryBudgets = StorageManager.getCategoryBudgets();

    // 1. Calculate Financial Metrics
    let totalSpent = 0;
    let totalIncome = 0;
    const categoryTotals = {};
    const dailyExpenses = {};
    const dailyIncome = {};

    transactions.forEach((t) => {
      const amt = parseFloat(t.amount) || 0;
      if (t.type === "income") {
        totalIncome += amt;
        dailyIncome[t.date] = (dailyIncome[t.date] || 0) + amt;
      } else {
        totalSpent += amt;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
        dailyExpenses[t.date] = (dailyExpenses[t.date] || 0) + amt;
      }
    });

    const netCashflow = totalIncome - totalSpent;
    const remaining = this.currentBudget - totalSpent;
    const savingsRatio =
      totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0;

    // Top Spent Category
    let topCategory = "None";
    let maxSpent = -1;
    for (const [c, sum] of Object.entries(categoryTotals)) {
      if (sum > maxSpent) {
        maxSpent = sum;
        topCategory = c;
      }
    }

    // Daily Timeline Data for Charts
    const allDates = Array.from(
      new Set([...Object.keys(dailyExpenses), ...Object.keys(dailyIncome)]),
    ).sort();
    const trendLabels = allDates.map((d) => d.slice(5)); // MM-DD
    const trendExpenses = allDates.map((d) => dailyExpenses[d] || 0);
    const trendIncome = allDates.map((d) => dailyIncome[d] || 0);

    // 2. Render KPI Cards
    document.getElementById("navBudgetValue").textContent =
      CurrencyService.format(this.currentBudget);
    document.getElementById("totalSpentAmount").textContent =
      CurrencyService.format(totalSpent);
    document.getElementById("totalIncomeAmount").textContent =
      CurrencyService.format(totalIncome);
    document.getElementById("budgetRemainingAmount").textContent =
      CurrencyService.format(remaining);

    // Burn rate calculation (current day of month)
    const today = new Date();
    const dayOfMonth = Math.max(1, today.getDate());
    const dailyBurnRate = totalSpent / dayOfMonth;
    const projectedMonthEnd = dailyBurnRate * 31;
    document.getElementById("dailyBurnRateLabel").textContent =
      `Burn: ${CurrencyService.format(dailyBurnRate)}/day`;
    document.getElementById("projectedMonthEndLabel").textContent =
      `Proj: ${CurrencyService.format(projectedMonthEnd)}`;

    const spentPct =
      this.currentBudget > 0 ? (totalSpent / this.currentBudget) * 100 : 0;
    document.getElementById("spentProgressFill").style.width =
      `${Math.min(spentPct, 100)}%`;
    document.getElementById("spentProgressLabel").textContent =
      `${spentPct.toFixed(1)}% of ceiling spent`;

    // Net cashflow label
    document.getElementById("netCashflowLabel").textContent =
      `Net: ${CurrencyService.format(netCashflow)}`;
    const cashBadge = document.getElementById("cashflowBadge");
    if (netCashflow >= 0) {
      cashBadge.className = "status-badge badge-healthy";
      cashBadge.textContent = "Surplus";
    } else {
      cashBadge.className = "status-badge badge-exceeded";
      cashBadge.textContent = "Deficit";
    }

    // Savings Rate & Net Worth
    document.getElementById("savingsRatioAmount").textContent =
      `${Math.max(0, savingsRatio).toFixed(1)}%`;
    const accounts = StorageManager.getAccounts();
    let netWorth = 0;
    Object.values(accounts).forEach((a) => (netWorth += a.balance));
    document.getElementById("netWorthAmount").textContent =
      CurrencyService.format(netWorth);

    // 3. Render Wallets Scroller
    const walletsContainer = document.getElementById("walletsGridContainer");
    walletsContainer.innerHTML = "";
    Object.entries(accounts).forEach(([key, acc]) => {
      const card = document.createElement("div");
      card.className = "wallet-card";
      card.innerHTML = `
        <div class="wallet-icon">${acc.icon}</div>
        <div class="wallet-info">
          <span class="wallet-name">${acc.name}</span>
          <span class="wallet-balance metric-value">${CurrencyService.format(acc.balance)}</span>
        </div>
      `;
      walletsContainer.appendChild(card);
    });

    // 4. Render Calendar Heatmap
    const heatmapGrid = document.getElementById("calendarHeatmap");
    heatmapGrid.innerHTML = "";
    const daysInMonth = 31;
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `2026-10-${String(day).padStart(2, "0")}`;
      const spend = dailyExpenses[dateStr] || 0;
      let heatClass = "heat-0";
      if (spend > 300) heatClass = "heat-3";
      else if (spend > 100) heatClass = "heat-2";
      else if (spend > 0) heatClass = "heat-1";

      const cell = document.createElement("div");
      cell.className = `calendar-day-cell ${dateStr === "2026-10-23" ? "today" : ""}`;
      cell.innerHTML = `
        <span class="cell-day-num">${day}</span>
        <span class="cell-day-spent ${heatClass}" style="padding: 2px; border-radius: 3px;">${spend > 0 ? CurrencyService.format(spend) : "-"}</span>
      `;
      heatmapGrid.appendChild(cell);
    }

    // 5. Render Category Budget Progress with 80%/100% Alerts
    const catBudgetsBox = document.getElementById("categoryBudgetsContainer");
    catBudgetsBox.innerHTML = "";
    Object.entries(CATEGORIES).forEach(([catName, meta]) => {
      const spent = categoryTotals[catName] || 0;
      const budget = categoryBudgets[catName] || meta.defaultBudget;
      if (budget > 0) {
        const pct = (spent / budget) * 100;
        let fillClass = "cat-fill-normal";
        let alertBadge = "";
        if (pct >= 100) {
          fillClass = "cat-fill-danger";
          alertBadge = `<span class="status-badge badge-exceeded">100% Exceeded</span>`;
        } else if (pct >= 80) {
          fillClass = "cat-fill-warning";
          alertBadge = `<span class="status-badge badge-warning">80% Warning</span>`;
        }

        const row = document.createElement("div");
        row.className = "cat-budget-row";
        row.innerHTML = `
          <div class="cat-budget-meta">
            <span>${meta.emoji} ${catName} ${alertBadge}</span>
            <span class="metric-value">${CurrencyService.format(spent)} / ${CurrencyService.format(budget)}</span>
          </div>
          <div class="cat-budget-bar">
            <div class="cat-budget-fill ${fillClass}" style="width: ${Math.min(pct, 100)}%;"></div>
          </div>
        `;
        catBudgetsBox.appendChild(row);
      }
    });

    // 6. Render Goals
    const goalsContainer = document.getElementById("goalsContainer");
    goalsContainer.innerHTML = "";
    goals.forEach((g) => {
      const pct = Math.min(100, (g.current / g.target) * 100);
      const card = document.createElement("div");
      card.className = "goal-card";
      card.innerHTML = `
        <div class="goal-top-row">
          <span class="goal-title">🎯 ${g.title}</span>
          <span class="goal-date">Target: ${g.date}</span>
        </div>
        <div class="goal-bar"><div class="goal-fill" style="width: ${pct}%;"></div></div>
        <div class="goal-numbers">
          <span class="metric-value">${CurrencyService.format(g.current)} (${pct.toFixed(0)}%)</span>
          <span class="metric-value">Goal: ${CurrencyService.format(g.target)}</span>
        </div>
      `;
      goalsContainer.appendChild(card);
    });

    // 7. Render Recurring Items & Subscriptions
    const recContainer = document.getElementById("recurringListContainer");
    recContainer.innerHTML = "";
    recurring.forEach((r) => {
      const item = document.createElement("div");
      item.className = "recurring-item";
      item.innerHTML = `
        <div class="recurring-meta">
          <span class="recurring-title">${r.title}</span>
          <span class="recurring-sub">Due ${r.dueDate} • ${r.frequency}</span>
        </div>
        <span class="recurring-amount metric-value">${CurrencyService.format(r.amount)}</span>
      `;
      recContainer.appendChild(item);
    });

    // 8. Update Charts
    if (this.chartManager) {
      this.chartManager.update({
        categoryTotals,
        topCategory,
        trendLabels,
        trendExpenses,
        trendIncome,
      });
    }

    // 9. Update Ledger
    if (this.ledgerController) {
      this.ledgerController.render();
    }
  }
}

// ==========================================================================
// APPLICATION BOOTSTRAP
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const app = new FinViewApp();
  app.init();
});
