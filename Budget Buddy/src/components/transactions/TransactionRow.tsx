import React from "react";
import { NEW_ACCOUNT_OPTION, NEW_CATEGORY_OPTION } from "../expenses/constants";

export interface Transaction {
  id: string;
  date: string;
  account: string;
  category: string;
  payee: string;
  amount: number; // positive = withdrawal, negative = deposit
}

interface Props {
  value: Transaction;
  categories: string[];
  accounts: string[];
  payeeSuggestions: string[];
  onChange: (id: string, patch: Partial<Transaction>) => void;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onNewCategoryRequested: (id: string) => void;
  onNewAccountRequested: (id: string) => void;
  lineBalance: number; // balance after this transaction
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #ced4da",
  borderRadius: 4,
  fontSize: 14,
};

const TransactionRow: React.FC<Props> = ({
  value,
  categories,
  accounts,
  onChange,
  onAdd,
  onRemove,
  onNewCategoryRequested,
  onNewAccountRequested,
  lineBalance,
  payeeSuggestions,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr 1fr 2fr 1fr auto auto",
        gap: 10,
        alignItems: "center",
        padding: 10,
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <input
        type="date"
        value={value.date || new Date().toISOString().split('T')[0]}
        onChange={(e) => {
          const newDate = e.target.value;
          if (newDate) {
            onChange(value.id, { date: newDate });
          }
        }}
        style={{
          ...inputStyle,
          color: '#000000',
          backgroundColor: '#ffffff'
        }}
        min="1900-01-01"
        max="2100-12-31"
      />

      <select
        value={value.account || accounts[0] || ''}
        onChange={(e) => {
          const v = e.target.value;
          if (v === NEW_ACCOUNT_OPTION) return onNewAccountRequested(value.id);
          onChange(value.id, { account: v });
        }}
        style={{
          ...inputStyle,
          color: '#000000',
          backgroundColor: '#ffffff'
        }}
      >
        <option value="">{accounts.length === 0 ? 'No accounts — add new…' : 'Select account'}</option>
        {accounts.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
        <option value={NEW_ACCOUNT_OPTION}>+ New account…</option>
      </select>

      <select
        value={value.category || categories[0] || ''}
        onChange={(e) => {
          const v = e.target.value;
          if (v === NEW_CATEGORY_OPTION) return onNewCategoryRequested(value.id);
          onChange(value.id, { category: v });
        }}
        style={{
          ...inputStyle,
          color: '#000000',
          backgroundColor: '#ffffff'
        }}
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value={NEW_CATEGORY_OPTION}>+ New category…</option>
      </select>

      <>
        <input
          type="text"
          placeholder="Payee"
          value={value.payee}
          onChange={(e) => onChange(value.id, { payee: e.target.value })}
          list={`payees-${value.id}`}
          style={{
            ...inputStyle,
            color: '#000000',
            backgroundColor: '#ffffff'
          }}
        />
        <datalist id={`payees-${value.id}`}>
          {payeeSuggestions.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </>

      <input
        type="number"
        placeholder="0.00"
        value={value.amount === 0 ? "" : value.amount || ""}
        onChange={(e) => onChange(value.id, { amount: parseFloat(e.target.value) || 0 })}
        style={inputStyle}
      />

      <div style={{ textAlign: "right", fontWeight: 600 }}>${lineBalance.toFixed(2)}</div>

      <div style={{ display: "flex", gap: 6 }}>
        {(() => {
          const isComplete = Boolean(
            value?.date && value?.account && value?.category && (value?.payee?.trim()?.length ?? 0) > 0 && (Number(value?.amount) || 0) > 0
          );
          return (
            <button
              onClick={() => onAdd(value.id)}
              title={isComplete ? "Add transaction" : "Fill date, account, category, payee, and amount to add"}
              disabled={!isComplete}
              aria-disabled={!isComplete}
              style={{
                background: isComplete ? "#16a34a" : "#9CA3AF",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                width: 36,
                height: 36,
                cursor: isComplete ? "pointer" : "not-allowed",
              }}
            >
              +
            </button>
          );
        })()}
        <button
          onClick={() => onRemove(value.id)}
          title="Remove transaction"
          style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, width: 36, height: 36 }}
        >
          −
        </button>
      </div>
    </div>
  );
};

export default TransactionRow;


