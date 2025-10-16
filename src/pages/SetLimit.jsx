import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setMonthlyLimit, getWallet } from '../services/api';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiTrendingUp } from 'react-icons/fi';
import './Transactions.css';

const SetLimit = () => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(0);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await getWallet();
      setCurrentLimit(response.data.monthly_limit);
      setLimit(response.data.monthly_limit.toString());
    } catch (error) {
      console.error('Failed to fetch wallet', error);
    }
  };

  const quickLimits = [5000, 10000, 20000, 50000];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const limitValue = parseFloat(limit);
    if (isNaN(limitValue) || limitValue < 0) {
      toast.error('Please enter a valid limit');
      return;
    }

    setLoading(true);

    try {
      await setMonthlyLimit(limitValue);
      toast.success(`Monthly limit set to ₹${limitValue}!`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to set limit');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLimit = (value) => {
    setLimit(value.toString());
  };

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FiArrowLeft />
        </button>
        <h2>Monthly Limit</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="transaction-content fade-in">
        <div className="amount-icon blue">
          <FiTrendingUp />
        </div>

        <div className="balance-display">
          <p>Current Monthly Limit</p>
          <h3>₹{currentLimit.toFixed(2)}</h3>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="amount-input-wrapper">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              placeholder="0.00"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="amount-input"
              required
            />
          </div>

          <div className="quick-amounts">
            <p className="quick-label">Suggested Limits</p>
            <div className="quick-buttons">
              {quickLimits.map((value) => (
                <button
                  key={value}
                  type="button"
                  className="quick-btn"
                  onClick={() => handleQuickLimit(value)}
                >
                  ₹{value}
                </button>
              ))}
            </div>
          </div>

          <div className="info-text">
            <p>Set a monthly spending limit to track your expenses. You'll be notified when you reach 80% of your limit.</p>
          </div>

          <button type="submit" className="submit-btn blue" disabled={loading}>
            {loading ? 'Updating...' : 'Set Limit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetLimit;