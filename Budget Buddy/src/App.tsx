import "./App.css";
import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import MonthlyOverviewBar from "./components/MonthlyOverviewBar";
import SpendingByCategoryPie from "./components/SpendingByCategoryPie";
import SavingGoal from "./components/SavingsGoal";
import DiscretionaryExpenses from "./components/DiscretionaryExpense";
import FixedExpenses from "./components/FixedExpenses";
import Income from "./components/Income";
// Transactions view removed from main toggle per user request
import type { ExpenseCategory, CategoryTotal } from "./types";
import { LocalStorage } from "./components/LocalStorage";
import type { Transaction } from "./components/transactions/TransactionRow";

function App() {
  const [txVersion, setTxVersion] = useState(0);

  useEffect(() => {
    const onUpdated = () => setTxVersion(v => v + 1);
    window.addEventListener('bb:transactions-updated', onUpdated);
    return () => window.removeEventListener('bb:transactions-updated', onUpdated);
  }, []);

  function loadTransactions(): Transaction[] {
    try {
      const fx = JSON.parse(localStorage.getItem("bb_tx_fixed") || "[]");
      const dx = JSON.parse(localStorage.getItem("bb_tx_discretionary") || "[]");
      const rows = ([] as Transaction[]).concat(
        Array.isArray(fx) ? fx : [],
        Array.isArray(dx) ? dx : []
      );
      return rows;
    } catch {
      return [];
    }
  }

  function aggregateByCategory(items: Transaction[]): CategoryTotal[] {
    const categoryToTotal = new Map<ExpenseCategory, number>();
    for (const item of items) {
      const raw = (item.category ?? "") as string;
      const category = (raw && raw.trim() ? raw.trim() : "Other") as ExpenseCategory;
      const amount = Number(item.amount) || 0;
      const existing = categoryToTotal.get(category) ?? 0;
      categoryToTotal.set(category, existing + Math.max(amount, 0));
    }
    return Array.from(categoryToTotal.entries()).map(([category, amount]) => ({ category, amount }));
  }

  const transactions = useMemo(() => loadTransactions(), [txVersion]);
  const totalsByCategory = useMemo(() => aggregateByCategory(transactions), [transactions]);
  const totalIncome = (LocalStorage.getIncome() || []).reduce(
    (sum, inc) => sum + (Number(inc.amount) || 0),
    0
  );

  return (
    <div className="main-container">
      <Header />
      <MonthlyOverviewBar />
      <div style={{
        padding: 16,
        marginTop: 16,
        background: '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.06)'
      }}>
        <SpendingByCategoryPie
          data={totalsByCategory}
          title="Spending by Category"
          denominatorTotal={totalIncome}
          centerValue={totalIncome - totalsByCategory.reduce((s, c) => s + c.amount, 0)}
        />
      </div>
      <Income />
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: '20px', 
        padding: '16px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <FixedExpenses />
        <DiscretionaryExpenses />
      </div>
      <SavingGoal 
        name="Emergency Fund"
        target={10000}
        current={2500}
      />
    </div>
  );
}

export default App;
