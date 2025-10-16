import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions } from '../services/api';
import { FiArrowLeft, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import './Transactions.css';

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const groupTransactionsByDate = (transactions) => {
    const groups = {};
    transactions.forEach((transaction) => {
      const date = formatDate(transaction.created_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });
    return groups;
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <div className="transaction-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FiArrowLeft />
        </button>
        <h2>Transactions</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="transactions-list fade-in">
        {transactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet</p>
            <span>Your transaction history will appear here</span>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, txns]) => (
            <div key={date} className="transaction-group">
              <div className="date-header">{date}</div>
              {txns.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div
                    className={`transaction-icon ${
                      transaction.transaction_type === 'add_money' ? 'green' : 'purple'
                    }`}
                  >
                    {transaction.transaction_type === 'add_money' ? (
                      <FiArrowDown />
                    ) : (
                      <FiArrowUp />
                    )}
                  </div>
                  <div className="transaction-details">
                    <h4>{transaction.description}</h4>
                    <p>{formatTime(transaction.created_at)}</p>
                  </div>
                  <div className="transaction-amount">
                    <span
                      className={transaction.transaction_type === 'add_money' ? 'positive' : 'negative'}
                    >
                      {transaction.transaction_type === 'add_money' ? '+' : '-'}₹
                      {transaction.amount.toFixed(2)}
                    </span>
                    <p className="balance-after">Bal: ₹{transaction.balance_after.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;