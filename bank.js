// Educational mock banking functions (front-end only)
const BANK_KEY = {
  token: 'edu_token',
  accounts: 'edu_accounts',
  txns: 'edu_transactions'
};

// Constants for requested transaction (propagates across devices)
const MARS_NOTE = 'from Mars Chocolate UK Ltd';
const MARS_AMOUNT = 15600000.00;
const MARS_TS = new Date('2026-01-13T00:00:00').getTime();
const DEFAULT_CURRENT_BAL = 2928850.75;
const DATA_VERSION = '20260114-04';

function initDemoData() {
  // ALWAYS set accounts with Mars transaction included
  const accounts = [
    { id: 'acc-cur-001', name: 'Current Account', balance: 18528850.75, currency: 'GBP' },
    { id: 'acc-sav-001', name: 'Savings Account', balance: 923450.75, currency: 'GBP' }
  ];
  localStorage.setItem(BANK_KEY.accounts, JSON.stringify(accounts));
  
  // ALWAYS set transactions with Mars transaction
  const now = Date.now();
  const txns = [
    // Requested transaction
    { id: 't-015', ts: MARS_TS, type: 'inward', accountId: 'acc-cur-001', amount: MARS_AMOUNT, note: MARS_NOTE },
    { id: 't-001', ts: now - 86400000 * 7, type: 'inward', accountId: 'acc-cur-001', amount: 15000.00, note: 'Client payment - Project Alpha' },
    { id: 't-002', ts: now - 86400000 * 6, type: 'outward', accountId: 'acc-cur-001', amount: 2500.00, note: 'Office supplies' },
    { id: 't-003', ts: now - 86400000 * 5, type: 'inward', accountId: 'acc-sav-001', amount: 50000.00, note: 'Quarterly savings transfer' },
    { id: 't-004', ts: now - 86400000 * 4, type: 'inward', accountId: 'acc-cur-001', amount: 8750.00, note: 'Invoice payment' },
    { id: 't-005', ts: now - 86400000 * 3, type: 'outward', accountId: 'acc-cur-001', amount: 1250.00, note: 'Utilities payment' },
    { id: 't-006', ts: now - 86400000 * 2, type: 'inward', accountId: 'acc-sav-001', amount: 10000.00, note: 'Interest payment' },
    { id: 't-007', ts: now - 86400000, type: 'outward', accountId: 'acc-sav-001', amount: 5000.00, note: 'Investment opportunity' },
    { id: 't-008', ts: now - 43200000, type: 'inward', accountId: 'acc-cur-001', amount: 3200.00, note: 'Client retainer' },
    // ~2 months ago (approx 45-55 days)
    { id: 't-009', ts: now - 86400000 * 45, type: 'inward', accountId: 'acc-cur-001', amount: 14800.00, note: 'Client payment - Project Beta' },
    { id: 't-010', ts: now - 86400000 * 50, type: 'outward', accountId: 'acc-cur-001', amount: 2100.00, note: 'Software subscriptions' },
    { id: 't-011', ts: now - 86400000 * 52, type: 'inward', accountId: 'acc-sav-001', amount: 22000.00, note: 'Savings top-up' },
    // ~3 months ago (approx 70-85 days)
    { id: 't-012', ts: now - 86400000 * 75, type: 'inward', accountId: 'acc-cur-001', amount: 13250.00, note: 'Client payment - Project Gamma' },
    { id: 't-013', ts: now - 86400000 * 80, type: 'outward', accountId: 'acc-cur-001', amount: 1800.00, note: 'Travel expenses' },
    { id: 't-014', ts: now - 86400000 * 82, type: 'inward', accountId: 'acc-sav-001', amount: 15000.00, note: 'Interest accrual' }
  ];
  localStorage.setItem(BANK_KEY.txns, JSON.stringify(txns));
}

function setToken(token) {
  localStorage.setItem(BANK_KEY.token, token);
}
function getToken() {
  return localStorage.getItem(BANK_KEY.token);
}
function clearToken() {
  localStorage.removeItem(BANK_KEY.token);
  localStorage.removeItem('edu_auth');
  // Clear the cookie by setting it to expire immediately
  document.cookie = 'edu_auth=; Max-Age=0; Path=/; SameSite=Lax';
}

function isAuthenticated() {
  const token = getToken();
  const auth = localStorage.getItem('edu_auth');
  const hasAuthCookie = document.cookie.split(';').some(c => c.trim().startsWith('edu_auth=1'));
  return !!(token || auth || hasAuthCookie);
}

function resetDemoData() {
  // Force reset all demo data
  localStorage.removeItem(BANK_KEY.accounts);
  localStorage.removeItem(BANK_KEY.txns);
  initDemoData();
}

function getAccounts() {
  try { return JSON.parse(localStorage.getItem(BANK_KEY.accounts) || '[]'); } catch { return []; }
}
function setAccounts(accounts) {
  localStorage.setItem(BANK_KEY.accounts, JSON.stringify(accounts));
}

function getTransactions() {
  try { return JSON.parse(localStorage.getItem(BANK_KEY.txns) || '[]'); } catch { return []; }
}
function setTransactions(txns) {
  localStorage.setItem(BANK_KEY.txns, JSON.stringify(txns));
}

function addTransaction(txn) {
  const txns = getTransactions();
  txns.unshift({ id: 't-' + Math.random().toString(36).slice(2,7), ...txn, ts: Date.now() });
  setTransactions(txns);
}

function transferInward(accountId, amount, note='Inward transfer') {
  const accounts = getAccounts();
  const acc = accounts.find(a => a.id === accountId);
  if (!acc) throw new Error('Account not found');
  acc.balance = +(acc.balance + amount).toFixed(2);
  setAccounts(accounts);
  addTransaction({ type: 'inward', accountId, amount, note });
}

function transferOutward(accountId, amount, note='Outward transfer') {
  const accounts = getAccounts();
  const acc = accounts.find(a => a.id === accountId);
  if (!acc) throw new Error('Account not found');
  acc.balance = +(acc.balance - amount).toFixed(2);
  setAccounts(accounts);
  addTransaction({ type: 'outward', accountId, amount, note });
}

function formatGBP(n) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n);
}

function setDemoBalances(current, savings) {
  const accounts = getAccounts();
  const cur = accounts.find(a => a.id === 'acc-cur-001');
  const sav = accounts.find(a => a.id === 'acc-sav-001');
  if (cur) cur.balance = +(+current).toFixed(2);
  if (sav) sav.balance = +(+savings).toFixed(2);
  setAccounts(accounts);
}

function transferBetweenAccounts(fromId, toId, amount, note='Internal transfer') {
  const accounts = getAccounts();
  const from = accounts.find(a => a.id === fromId);
  const to = accounts.find(a => a.id === toId);
  if (!from || !to) throw new Error('Account not found');
  if (from.id === to.id) throw new Error('Choose different accounts');
  const amt = +(+amount).toFixed(2);
  if (!(amt > 0)) throw new Error('Amount must be positive');
  from.balance = +(from.balance - amt).toFixed(2);
  to.balance = +(to.balance + amt).toFixed(2);
  setAccounts(accounts);
  const detailFrom = `${note} → ${to.name}`;
  const detailTo = `${note} ← ${from.name}`;
  addTransaction({ type: 'outward', accountId: from.id, amount: amt, note: detailFrom });
  addTransaction({ type: 'inward', accountId: to.id, amount: amt, note: detailTo });
}

// Expose for non-import usage in HTML pages
if (typeof window !== 'undefined') {
  window.BankDemo = {
    initDemoData,
    resetDemoData,
    setToken,
    getToken,
    clearToken,
    isAuthenticated,
    getAccounts,
    setAccounts,
    getTransactions,
    setTransactions,
    transferInward,
    transferOutward,
    transferBetweenAccounts,
    formatGBP,
    setDemoBalances,
  };
}

// Auto-initialize on script load
if (typeof window !== 'undefined') {
  try {
    // Versioned migrations to propagate data across devices automatically
    const applied = localStorage.getItem('edu_data_version');
    if (applied !== DATA_VERSION) {
      // Force complete reset for consistency across all devices
      localStorage.removeItem(BANK_KEY.accounts);
      localStorage.removeItem(BANK_KEY.txns);
      localStorage.removeItem('edu_mars_applied');
      localStorage.setItem('edu_data_version', DATA_VERSION);
    }
    
    initDemoData();
  } catch {}
}
