import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWallet } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {  FiTrendingUp, FiDollarSign, FiSettings, FiLogOut, FiPlusCircle, FiSend } from 'react-icons/fi';
import { FaWallet } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await getWallet();
      setWallet(response.data);
    } catch (error) {
      console.error('Failed to fetch wallet', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getProgressColor = () => {
    if (!wallet) return '#60a5fa';
    if (wallet.percentage_spent >= 90) return '#ef4444';
    if (wallet.percentage_spent >= 70) return '#f59e0b';
    return '#60a5fa';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="header-content">
          <h2>Hello, {user?.name?.split(' ')[0]}! 👋</h2>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
          </button>
        </div>
      </div>

      <div className="wallet-card fade-in">
        <div className="wallet-balance">
          <p className="balance-label">Total Balance</p>
          <h1 className="balance-amount">₹{wallet?.balance?.toFixed(2) || '0.00'}</h1>
        </div>

        {wallet?.monthly_limit > 0 && (
          <div className="spending-progress">
            <div className="progress-header">
              <span>Monthly Spending</span>
              <span className="progress-percentage">{wallet?.percentage_spent?.toFixed(1)}%</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width: `${Math.min(wallet?.percentage_spent, 100)}%`,
                  background: getProgressColor(),
                }}
              ></div>
            </div>
            <div className="progress-info">
              <span>₹{wallet?.spent_this_month?.toFixed(2)}</span>
              <span>of ₹{wallet?.monthly_limit?.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <button className="action-btn primary" onClick={() => navigate('/add-money')}>
          <FiPlusCircle />
          <span>Add Money</span>
        </button>
        <button className="action-btn secondary" onClick={() => navigate('/payment')}>
          <FiSend />
          <span>Pay</span>
        </button>
      </div>

      <div className="info-cards">
        <div className="info-card" onClick={() => navigate('/set-limit')}>
          <div className="info-icon blue">
            <FiTrendingUp />
          </div>
          <div className="info-content">
            <h4>Monthly Limit</h4>
            <p>₹{wallet?.monthly_limit?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="info-card" onClick={() => navigate('/transactions')}>
          <div className="info-icon purple">
            <FaWallet />
          </div>
          <div className="info-content">
            <h4>Transactions</h4>
            <p>View History</p>
          </div>
        </div>
      </div>

      {wallet && wallet.monthly_limit > 0 && wallet.percentage_spent >= 80 && (
        <div className={`alert-banner ${wallet.percentage_spent >= 90 ? 'danger' : 'warning'}`}>
          <p>
            {wallet.percentage_spent >= 90
              ? '⚠️ You\'ve spent 90% of your monthly limit!'
              : '⚡ You\'ve reached 80% of your monthly limit'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;