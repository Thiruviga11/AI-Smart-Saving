import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makePayment, getWallet } from '../services/api';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSend, FiAlertCircle } from 'react-icons/fi';
import './Transactions.css';

const Payment = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    if (wallet && amount) {
      const amountValue = parseFloat(amount);
      if (!isNaN(amountValue) && wallet.monthly_limit > 0) {
        const newSpent = wallet.spent_this_month + amountValue;
        const newPercentage = (newSpent / wallet.monthly_limit) * 100;
        setShowWarning(newPercentage >= 80);
      }
    }
  }, [amount, wallet]);

  const fetchWallet = async () => {
    try {
      const response = await getWallet();
      setWallet(response.data);
    } catch (error) {
      console.error('Failed to fetch wallet', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!pin || pin.length < 4) {
      toast.error('Please enter a valid PIN');
      return;
    }

    if (wallet && wallet.balance < amountValue) {
      toast.error('Insufficient balance');
      return;
    }

    if (wallet && wallet.monthly_limit > 0 && !wallet.can_transact) {
      toast.error('Monthly limit reached. Cannot make payment.');
      return;
    }

    setLoading(true);

    try {
      await makePayment({
        amount: amountValue,
        pin: pin,
        description: description || undefined,
      });
      toast.success(`Payment of ₹${amountValue} successful!`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FiArrowLeft />
        </button>
        <h2>Make Payment</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="transaction-content fade-in">
        <div className="amount-icon purple">
          <FiSend />
        </div>

        {wallet && (
          <div className="balance-display">
            <p>Available Balance</p>
            <h3>₹{wallet.balance.toFixed(2)}</h3>
          </div>
        )}

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

          <div className="input-group">
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-input"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength="6"
              className="text-input"
              required
            />
          </div>

          {showWarning && (
            <div className="warning-box">
              <FiAlertCircle />
              <p>This payment will exceed 80% of your monthly limit!</p>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn purple" 
            disabled={loading || (wallet && !wallet.can_transact)}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;