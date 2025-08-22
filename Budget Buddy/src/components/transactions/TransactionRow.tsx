import React, { useState } from 'react';
import { type Transaction } from '../../types';

interface TransactionRowProps {
  value: Transaction;
  categories: string[];
  accounts: string[];
  payeeSuggestions: string[];
  onChange: (id: string, patch: Partial<Transaction>) => void;
  onAdd: (afterId?: string) => void;
  onRemove: (id: string) => void;
  onNewCategoryRequested: (id: string) => void;
  onNewAccountRequested: (id: string) => void;
  lineBalance: number;
}

const TransactionRow: React.FC<TransactionRowProps> = ({
  value,
  categories,
  accounts,
  payeeSuggestions,
  onChange,
  onAdd,
  onRemove,
  onNewCategoryRequested,
  onNewAccountRequested,
  lineBalance
}) => {
  const [showPayeeSuggestions, setShowPayeeSuggestions] = useState(false);

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === '++') {
      onNewCategoryRequested(value.id);
    } else {
      onChange(value.id, { category: newCategory });
    }
  };

  const handleAccountChange = (newAccount: string) => {
    if (newAccount === '++') {
      onNewAccountRequested(value.id);
    } else {
      onChange(value.id, { account: newAccount });
    }
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr auto auto', 
      gap: 8, 
      alignItems: 'center',
      padding: '8px',
      border: '1px solid #e5e7eb',
      borderRadius: 6,
      backgroundColor: '#fff'
    }}>
      {/* Date */}
      <input
        type="date"
        value={value.date}
        onChange={(e) => onChange(value.id, { date: e.target.value })}
        style={{ padding: '6px 8px', border: '1px solid #ced4da', borderRadius: 4, fontSize: '14px' }}
      />
      
      {/* Account */}
      <select
        value={value.account}
        onChange={(e) => handleAccountChange(e.target.value)}
        style={{ padding: '6px 8px', border: '1px solid #ced4da', borderRadius: 4, fontSize: '14px' }}
      >
        {accounts.map(account => (
          <option key={account} value={account}>{account}</option>
        ))}
        <option value="++">+ Add Account</option>
      </select>
      
      {/* Category */}
      <select
        value={value.category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        style={{ padding: '6px 8px', border: '1px solid #ced4da', borderRadius: 4, fontSize: '14px' }}
      >
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
        <option value="++">+ Add Category</option>
      </select>
      
      {/* Payee */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={value.payee}
          onChange={(e) => onChange(value.id, { payee: e.target.value })}
          onFocus={() => setShowPayeeSuggestions(true)}
          onBlur={() => setTimeout(() => setShowPayeeSuggestions(false), 200)}
          placeholder="Payee"
          style={{ padding: '6px 8px', border: '1px solid #ced4da', borderRadius: 4, fontSize: '14px', width: '100%' }}
        />
        {showPayeeSuggestions && payeeSuggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #ced4da',
            borderRadius: 4,
            maxHeight: '150px',
            overflowY: 'auto',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {payeeSuggestions.map(suggestion => (
              <div
                key={suggestion}
                onClick={() => {
                  onChange(value.id, { payee: suggestion });
                  setShowPayeeSuggestions(false);
                }}
                style={{
                  padding: '6px 8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f1f3f4'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Amount */}
      <input
        type="number"
        step="0.01"
        value={value.amount}
        onChange={(e) => onChange(value.id, { amount: parseFloat(e.target.value) || 0 })}
        style={{ padding: '6px 8px', border: '1px solid #ced4da', borderRadius: 4, fontSize: '14px', textAlign: 'right' }}
      />
      
      {/* Running Balance */}
      <div style={{ 
        fontSize: '14px', 
        fontWeight: '500',
        color: lineBalance < 0 ? '#dc2626' : lineBalance > 0 ? '#059669' : '#6b7280',
        textAlign: 'right',
        minWidth: '80px'
      }}>
        ${lineBalance.toFixed(2)}
      </div>
      
      {/* Actions */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={() => onAdd(value.id)}
          style={{ 
            padding: '4px 8px', 
            background: '#0ea5e9', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 4, 
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Add row after this one"
        >
          +
        </button>
        <button
          onClick={() => onRemove(value.id)}
          style={{ 
            padding: '4px 8px', 
            background: '#dc2626', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 4, 
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Remove this row"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default TransactionRow;
