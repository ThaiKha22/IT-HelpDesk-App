import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket, MessageSquare, CheckCircle, Clock,
  TrendingUp, ArrowRight, AlertCircle, Zap,
  Monitor, Wifi, HardDrive, Shield
} from 'lucide-react';
import { useTicketStore, useAuthStore } from '../store';
import './HomePage.css';

const categoryIcons = {
  network: Wifi,
  software: Monitor,
  hardware: HardDrive,
  performance: TrendingUp,
};

const statusColor = {
  pending: 'orange',
  in_progress: 'cyan',
  completed: 'green',
  cancelled: 'muted',
};

const statusLabel = {
  pending: 'Chờ xử lý',
  in_progress: 'Đang xử lý',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const priorityColors = {
  urgent: 'red',
  high: 'orange',
  medium: 'cyan',
  low: 'green',
};

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { tickets } = useTicketStore();

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'pending').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    completed: tickets.filter(t => t.status === 'completed').length,
  };

  const recentTickets = tickets.slice(0, 3);

  const quickActions = [
    { icon: Wifi, label: 'Mạng & Internet', color: 'cyan', category: 'network' },
    { icon: Monitor, label: 'Phần mềm', color: 'blue', category: 'software' },
    { icon: HardDrive, label: 'Phần cứng', color: 'purple', category: 'hardware' },
    { icon: Shield, label: 'Bảo mật', color: 'green', category: 'security' },
  ];

  return (
    <div className="home-page">
      {/* Hero Welcome */}
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

      {/* Stats Grid */}
      <div className="stats-grid">
        {[
          { label: 'Tổng yêu cầu', value: stats.total, icon: Ticket, color: 'blue', sub: 'Tất cả thời gian' },
          { label: 'Chờ xử lý', value: stats.pending, icon: Clock, color: 'orange', sub: 'Cần xử lý' },
          { label: 'Đang xử lý', value: stats.inProgress, icon: AlertCircle, color: 'cyan', sub: 'Đang tiến hành' },
          { label: 'Hoàn thành', value: stats.completed, icon: CheckCircle, color: 'green', sub: 'Đã giải quyết' },
        ].map((stat, i) => (
          <div key={stat.label} className="stat-card animate-fadeInUp" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className={`stat-icon-wrap color-${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div className="stat-info">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
            <p className="stat-sub">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="home-grid">
        {/* Recent Tickets */}
        <div className="home-card recent-tickets animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="card-header">
            <h2 className="card-title">Yêu cầu gần đây</h2>
            <button className="card-action" onClick={() => navigate('/tickets')}>
              Xem tất cả <ArrowRight size={14} />
            </button>
          </div>
          <div className="ticket-list">
            {recentTickets.map(ticket => {
              const CatIcon = categoryIcons[ticket.category] || Ticket;
              return (
                <div
                  key={ticket.id}
                  className="ticket-row"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <div className={`ticket-cat-icon color-${statusColor[ticket.status]}`}>
                    <CatIcon size={16} />
                  </div>
                  <div className="ticket-info">
                    <p className="ticket-row-title">{ticket.title}</p>
                    <div className="ticket-row-meta">
                      <span className="ticket-id">{ticket.id}</span>
                      <span className={`ticket-priority priority-${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <div className="ticket-row-right">
                    <span className={`status-badge status-${statusColor[ticket.status]}`}>
                      {statusLabel[ticket.status]}
                    </span>
                    {ticket.technician && (
                      <p className="ticket-tech">{ticket.technician.name}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="home-card quick-actions animate-fadeInUp" style={{ animationDelay: '0.28s' }}>
          <div className="card-header">
            <h2 className="card-title">Tạo nhanh</h2>
          </div>
          <div className="quick-grid">
            {quickActions.map(action => (
              <button
                key={action.label}
                className={`quick-item color-${action.color}`}
                onClick={() => navigate(`/tickets/new?category=${action.category}`)}
              >
                <action.icon size={24} />
                <span>{action.label}</span>
              </button>
            ))}
          </div>

          {/* Support Status */}
          <div className="support-status">
            <div className="status-live">
              <span className="live-dot" />
              <span>Hỗ trợ trực tuyến</span>
            </div>
            <div className="support-stats-row">
              <div className="support-stat">
                <p className="support-stat-val">12</p>
                <p className="support-stat-label">KTV online</p>
              </div>
              <div className="support-stat">
                <p className="support-stat-val">~8 phút</p>
                <p className="support-stat-label">Thời gian phản hồi</p>
              </div>
              <div className="support-stat">
                <p className="support-stat-val">98%</p>
                <p className="support-stat-label">Hài lòng</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="home-card activity-card animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
        <div className="card-header">
          <h2 className="card-title">Hoạt động gần đây</h2>
        </div>
        <div className="activity-timeline">
          {[
            { icon: MessageSquare, color: 'cyan', text: 'Trần Kỹ Thuật gửi tin nhắn về TK-2401', time: '20 phút trước' },
            { icon: AlertCircle, color: 'orange', text: 'TK-2399 đang chờ kỹ thuật viên', time: '30 phút trước' },
            { icon: CheckCircle, color: 'green', text: 'TK-2400 hoàn thành — Đánh giá 5⭐', time: '1 ngày trước' },
            { icon: Ticket, color: 'blue', text: 'Yêu cầu TK-2400 được tạo', time: '2 ngày trước' },
          ].map((item, i) => (
            <div key={i} className="activity-item">
              <div className={`activity-icon color-${item.color}`}>
                <item.icon size={14} />
              </div>
              <div className="activity-content">
                <p>{item.text}</p>
                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}