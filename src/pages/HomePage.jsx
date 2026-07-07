import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket, MessageSquare, CheckCircle, Clock,
  TrendingUp, ArrowRight, AlertCircle, Zap,
  Monitor, Wifi, HardDrive, Shield
} from 'lucide-react';
import { useTicketStore, useAuthStore } from '../store';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { tickets } = useTicketStore();

  return (
    <div className="home-page">
      <div className="home-hero animate-fadeInUp">
        <div className="hero-text">
          <p className="hero-greeting">Xin chào,</p>
          <h1 className="hero-name">{user?.name} 👋</h1>
          <p className="hero-subtitle">Hệ thống hỗ trợ kỹ thuật 24/7 — chúng tôi sẵn sàng giúp bạn.</p>
        </div>
        <button className="hero-cta" onClick={() => navigate('/tickets/new')}>
          <Zap size={18} />
          <span>Tạo yêu cầu ngay</span>
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="home-grid">
      </div>
    </div>
  );
}