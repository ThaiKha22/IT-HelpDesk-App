import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Ticket, MessageSquare, CreditCard, User,
  PlusCircle, ChevronLeft, ChevronRight, Shield, Zap
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { LogOut } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/home', icon: Home, label: 'Trang chủ' },
  { to: '/tickets', icon: Ticket, label: 'Yêu cầu' },
  { to: '/chat', icon: MessageSquare, label: 'Chat', badge: 1 },
  { to: '/payment', icon: CreditCard, label: 'Thanh toán' },
  { to: '/profile', icon: User, label: 'Hồ sơ' },
];

export default function Sidebar({ open, onToggle }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Shield size={20} />
          <Zap size={10} className="logo-zap" />
        </div>
        {open && (
          <div className="logo-text">
            <span className="logo-name">Cứu Hộ <span className="logo-it">IT</span></span>
            <span className="logo-tagline">Pro Support</span>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button className="sidebar-toggle" onClick={onToggle}>
        {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Create Button */}
      <div className="sidebar-create">
        <button
          className={`create-btn ${open ? 'full' : 'icon-only'}`}
          onClick={() => navigate('/tickets/new')}
        >
          <PlusCircle size={18} />
          {open && <span>Tạo yêu cầu</span>}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <div className="nav-icon-wrap">
              <Icon size={20} />
              {badge && <span className="nav-badge">{badge}</span>}
            </div>
            {open && <span className="nav-label">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User profile at bottom */}
      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name?.charAt(0) || 'U'}
        </div>
        {open && (
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">Khách hàng</p>
          </div>
        )}
        <div className="user-status" title="Đang hoạt động" />
        <button
          className="sidebar-logout-btn"
          title="Đăng xuất"
          onClick={logout}
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
