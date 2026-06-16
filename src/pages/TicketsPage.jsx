import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, Ticket, Wifi, Monitor, HardDrive, TrendingUp, User, Clock } from 'lucide-react';
import { useTicketStore } from '../store';
import './TicketsPage.css';

const statusLabel = { pending: 'Chờ xử lý', in_progress: 'Đang xử lý', completed: 'Hoàn thành', cancelled: 'Đã hủy' };
const statusColor = { pending: 'orange', in_progress: 'cyan', completed: 'green', cancelled: 'muted' };
const priorityLabel = { urgent: 'Khẩn cấp', high: 'Cao', medium: 'Trung bình', low: 'Thấp' };
const priorityColors = { urgent: 'red', high: 'orange', medium: 'cyan', low: 'green' };
const categoryIcons = { network: Wifi, software: Monitor, hardware: HardDrive, performance: TrendingUp };

const FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xử lý' },
  { key: 'in_progress', label: 'Đang xử lý' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
];

function formatTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
  return `${Math.floor(diff / 86400000)} ngày trước`;
}

export default function TicketsPage() {
  const navigate = useNavigate();
  const { tickets } = useTicketStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = tickets.filter(t => {
    const matchFilter = filter === 'all' || t.status === filter;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="tickets-page">
      {/* Page header */}
      <div className="tickets-header">
        <div>
          <h1 className="page-title">Yêu cầu hỗ trợ</h1>
          <p className="page-subtitle">{tickets.length} yêu cầu tổng cộng</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/tickets/new')}>
          <Plus size={18} />
          Tạo yêu cầu mới
        </button>
      </div>

      {/* Controls */}
      <div className="tickets-controls">
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="filter-count">
                {f.key === 'all' ? tickets.length : tickets.filter(t => t.status === f.key).length}
              </span>
            </button>
          ))}
        </div>
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Tìm kiếm yêu cầu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="tickets-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Ticket size={48} />
            <h3>Không có yêu cầu nào</h3>
            <p>Thử thay đổi bộ lọc hoặc tạo yêu cầu mới</p>
            <button className="btn-primary" onClick={() => navigate('/tickets/new')}>
              <Plus size={16} /> Tạo yêu cầu
            </button>
          </div>
        ) : (
          filtered.map((ticket, i) => {
            const CatIcon = categoryIcons[ticket.category] || Ticket;
            return (
              <div
                key={ticket.id}
                className="ticket-card animate-fadeInUp"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <div className={`ticket-card-icon color-${statusColor[ticket.status]}`}>
                  <CatIcon size={20} />
                </div>
                <div className="ticket-card-body">
                  <div className="ticket-card-top">
                    <span className="ticket-card-id">{ticket.id}</span>
                    <span className={`status-badge status-${statusColor[ticket.status]}`}>
                      {statusLabel[ticket.status]}
                    </span>
                    <span className={`priority-badge priority-${priorityColors[ticket.priority]}`}>
                      {priorityLabel[ticket.priority]}
                    </span>
                  </div>
                  <h3 className="ticket-card-title">{ticket.title}</h3>
                  <p className="ticket-card-desc">{ticket.description}</p>
                  <div className="ticket-card-footer">
                    <div className="ticket-card-meta">
                      <Clock size={12} />
                      <span>{formatTime(ticket.createdAt)}</span>
                    </div>
                    {ticket.technician && (
                      <div className="ticket-card-meta">
                        <User size={12} />
                        <span>{ticket.technician.name}</span>
                      </div>
                    )}
                    {ticket.price && (
                      <div className="ticket-card-price">
                        {ticket.price.toLocaleString('vi-VN')}đ
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}