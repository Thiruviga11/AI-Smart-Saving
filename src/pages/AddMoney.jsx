import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMoney } from '../services/api';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiDollarSign } from 'react-icons/fi';
import './Transactions.css';

const AddMoney = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      await addMoney(amountValue);
      toast.success(`₹${amountValue} added successfully!`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add money');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FiArrowLeft />
        </button>
        <h2>Add Money</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="transaction-content fade-in">
        <div className="amount-icon">
          <FiDollarSign />
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="amount-input-wrapper">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-input"
              required
            />
          </div>

          <div className="quick-amounts">
            <p className="quick-label">Quick Add</p>
            <div className="quick-buttons">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  className="quick-btn"
                  onClick={() => handleQuickAmount(value)}
                >
                  ₹{value}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Money'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMoney;