import React, { useEffect, useMemo, useState } from 'react';
import TransactionRow, { type Transaction } from './transactions/TransactionRow';
import { useLocalStorageList } from './expenses/useLocalStorageList';

const DiscretionaryExpenses: React.FC = () => {
  const [categories, setCategories] = useLocalStorageList('bb_categories', []);
  const [accounts, setAccounts] = useLocalStorageList('bb_accounts', ["Checking", "Savings", "Credit Card"]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [pendingRowForCategory, setPendingRowForCategory] = useState<string | null>(null);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState('');
  const [pendingRowForAccount, setPendingRowForAccount] = useState<string | null>(null);

  // Per-account starting balances (shared key across app)
  const [accountBalances, setAccountBalances] = useState<Record<string, number>>({});
  const [selectedBalanceAccount, setSelectedBalanceAccount] = useState<string>('Checking');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bb_account_balances');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') setAccountBalances(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('bb_account_balances', JSON.stringify(accountBalances)); } catch {}
  }, [accountBalances]);

  useEffect(() => {
    if (!selectedBalanceAccount || !accounts.includes(selectedBalanceAccount)) {
      setSelectedBalanceAccount(accounts.includes('Checking') ? 'Checking' : (accounts[0] ?? ''));
    }
  }, [accounts, selectedBalanceAccount]);

  const [rows, setRows] = useState<Transaction[]>([{
    id: 'dx-1',
    date: new Date().toISOString().split('T')[0],
    account: 'Checking',
    category: categories[0] ?? '',
    payee: '',
    amount: 0,
  }]);

  // load persisted rows
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bb_tx_discretionary');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setRows(parsed);
      }
    } catch {}
  }, []);

  // persist rows
  useEffect(() => {
    try { localStorage.setItem('bb_tx_discretionary', JSON.stringify(rows)); } catch {}
  }, [rows]);

  const payeeSuggestions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach(r => { if (r.payee?.trim()) set.add(r.payee.trim()); });
    return Array.from(set).slice(-25);
  }, [rows]);

  const runningBalances = useMemo(() => {
    const map = new Map<string, number>();
    accounts.forEach(a => map.set(a, Number(accountBalances[a] ?? 0)));
    return rows.map(r => {
      const prev = map.get(r.account) ?? 0;
      const next = prev - (Number(r.amount) || 0);
      map.set(r.account, next);
      return next;
    });
  }, [rows, accounts, accountBalances]);

  const addNewCategory = () => {
    const c = newCategory.trim();
    if (!c || categories.includes(c)) return;
    setCategories([...categories, c]);
    if (pendingRowForCategory) {
      setRows(prev => prev.map(r => r.id === pendingRowForCategory ? { ...r, category: c } : r));
      setPendingRowForCategory(null);
    }
    setNewCategory('');
    setShowAddCategory(false);
  };

  const addNewAccount = () => {
    const a = newAccount.trim();
    if (!a || accounts.includes(a)) return;
    setAccounts([...accounts, a]);
    setAccountBalances(prev => ({ ...prev, [a]: prev[a] ?? 0 }));
    if (pendingRowForAccount) {
      setRows(prev => prev.map(r => r.id === pendingRowForAccount ? { ...r, account: a } : r));
      setPendingRowForAccount(null);
    }
    setNewAccount('');
    setShowAddAccount(false);
  };

  const removeCategory = (name: string) => {
    if (!name) return;
    if (categories.length <= 1) return;
    if (rows.some(r => r.category === name)) return;
    setCategories(categories.filter(c => c !== name));
  };

  const removeAccount = (name: string) => {
    if (!name) return;
    if (accounts.length <= 1) return;
    if (rows.some(r => r.account === name)) return;
    setAccounts(accounts.filter(a => a !== name));
    setAccountBalances(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleChange = (id: string, patch: Partial<Transaction>) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const handleAdd = (afterId?: string) => {
    if (afterId) {
      const row = rows.find(r => r.id === afterId);
      if (row && row.account) {
        setAccountBalances(prev => ({
          ...prev,
          [row.account]: (Number(prev[row.account] ?? 0)) - (Number(row.amount) || 0),
        }));
      }
    }
    setRows(prev => ([...prev, {
      id: `dx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      account: (accounts.includes('Checking') ? 'Checking' : (accounts[0] ?? 'Checking')),
      category: categories[0] ?? '',
      payee: '',
      amount: 0,
    }]));
  };

  const handleRemove = (id: string) => {
    setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);
  };

  return (
    <div>
      <h2>Discretionary Expenses</h2>

      {/* Account balance editor */}
      {accounts.length > 0 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
          <strong>Account Balance:</strong>
          <select
            value={selectedBalanceAccount || ''}
            onChange={(e) => setSelectedBalanceAccount(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #ced4da', borderRadius: 6 }}
          >
            {accounts.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <input
            type="number"
            value={Number(accountBalances[selectedBalanceAccount] ?? 0)}
            onChange={(e) => setAccountBalances(prev => ({ ...prev, [selectedBalanceAccount]: parseFloat(e.target.value) || 0 }))}
            style={{ padding: '6px 10px', border: '1px solid #ced4da', borderRadius: 6, width: 140 }}
          />
        </div>
      )}

      {(showAddCategory || showAddAccount) && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {showAddCategory && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
              <span style={{ fontWeight: 600 }}>New category:</span>
              <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category name" style={{ padding: '6px 10px', border: '1px solid #ced4da', borderRadius: 6 }} onKeyDown={(e) => { if (e.key === 'Enter') addNewCategory(); if (e.key === 'Escape') setShowAddCategory(false); }} />
              <button onClick={addNewCategory} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#0ea5e9', color: '#fff' }}>Add</button>
              <button onClick={() => { setShowAddCategory(false); setPendingRowForCategory(null); }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb' }}>Cancel</button>
              <button onClick={() => removeCategory(newCategory.trim())} disabled={!newCategory.trim() || rows.some(r => r.category === newCategory.trim()) || categories.length <= 1} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#dc2626', color: '#fff' }}>Remove</button>
            </div>
          )}
          {showAddAccount && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
              <span style={{ fontWeight: 600 }}>New account:</span>
              <input type="text" value={newAccount} onChange={(e) => setNewAccount(e.target.value)} placeholder="Account name" style={{ padding: '6px 10px', border: '1px solid #ced4da', borderRadius: 6 }} onKeyDown={(e) => { if (e.key === 'Enter') addNewAccount(); if (e.key === 'Escape') setShowAddAccount(false); }} />
              <button onClick={addNewAccount} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#0ea5e9', color: '#fff' }}>Add</button>
              <button onClick={() => { setShowAddAccount(false); setPendingRowForAccount(null); }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb' }}>Cancel</button>
              <button onClick={() => removeAccount(newAccount.trim())} disabled={!newAccount.trim() || rows.some(r => r.account === newAccount.trim()) || accounts.length <= 1} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#dc2626', color: '#fff' }}>Remove</button>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gap: 8 }}>
        {rows.map((row, idx) => (
          <TransactionRow
            key={row.id}
            value={row}
            categories={categories}
            accounts={accounts}
            payeeSuggestions={payeeSuggestions}
            onChange={handleChange}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onNewCategoryRequested={(id) => { setPendingRowForCategory(id); setShowAddCategory(true); }}
            onNewAccountRequested={(id) => { setPendingRowForAccount(id); setShowAddAccount(true); }}
            lineBalance={runningBalances[idx] ?? 0}
          />
        ))}
      </div>
    </div>
  );
};

export default DiscretionaryExpenses;
