import React, { useState } from 'react';
import { User, Phone, Mail, Calendar, Edit2, Shield, Bell, CreditCard, ChevronRight, Star, Award } from 'lucide-react';
import { useAuthStore, useTicketStore } from '../store';
import './ProfilePage.css';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { tickets } = useTicketStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name, phone: user?.phone, email: user?.email });

  const completedTickets = tickets.filter(t => t.status === 'completed');
  const avgRating = completedTickets.filter(t => t.rating).reduce((sum, t, _, arr) => sum + t.rating / arr.length, 0);

  const settingGroups = [
    {
      title: 'Tài khoản',
      items: [
        { icon: Shield, label: 'Bảo mật & Mật khẩu', desc: 'Thay đổi mật khẩu, bảo mật 2 lớp' },
        { icon: Bell, label: 'Thông báo', desc: 'Email, push notification' },
        { icon: CreditCard, label: 'Phương thức thanh toán', desc: 'Quản lý ví và thẻ' },
      ]
    }
  ];

  return (
    <div className="profile-page">
      {/* Profile Hero */}
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            {user?.name?.charAt(0)}
          </div>
          <button className="avatar-edit-btn"><Edit2 size={14} /></button>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
          <div className="profile-badges">
            <span className="profile-badge">
              <Award size={12} /> Khách hàng thân thiết
            </span>
            <span className="profile-badge green">
              <Star size={12} /> Đánh giá 5.0
            </span>
          </div>
        </div>
        <button
          className={`edit-profile-btn ${editing ? 'save' : ''}`}
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Lưu thay đổi' : <><Edit2 size={16} /> Chỉnh sửa</>}
        </button>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        {[
          { label: 'Yêu cầu đã tạo', value: tickets.length, color: 'blue' },
          { label: 'Đã hoàn thành', value: completedTickets.length, color: 'green' },
          { label: 'Đánh giá TB', value: avgRating ? `${avgRating.toFixed(1)}⭐` : 'N/A', color: 'orange' },
          { label: 'Ngày tham gia', value: '15/01/2024', color: 'cyan' },
        ].map(stat => (
          <div key={stat.label} className={`profile-stat color-${stat.color}`}>
            <p className="profile-stat-val">{stat.value}</p>
            <p className="profile-stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="profile-grid">
        {/* Personal Info */}
        <div className="profile-card">
          <div className="card-header">
            <h2 className="card-title">Thông tin cá nhân</h2>
          </div>
          <div className="profile-fields">
            {[
              { icon: User, label: 'Họ và tên', key: 'name', value: formData.name },
              { icon: Mail, label: 'Email', key: 'email', value: formData.email },
              { icon: Phone, label: 'Số điện thoại', key: 'phone', value: formData.phone },
              { icon: Calendar, label: 'Ngày tham gia', key: null, value: '15/01/2024' },
            ].map(field => (
              <div key={field.label} className="profile-field">
                <div className="field-icon-wrap">
                  <field.icon size={16} />
                </div>
                <div className="field-content">
                  <label className="field-label">{field.label}</label>
                  {editing && field.key ? (
                    <input
                      className="field-input"
                      value={formData[field.key]}
                      onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                    />
                  ) : (
                    <p className="field-value">{field.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="profile-card">
          {settingGroups.map(group => (
            <div key={group.title}>
              <div className="card-header">
                <h2 className="card-title">{group.title}</h2>
              </div>
              <div className="settings-list">
                {group.items.map(item => (
                  <button key={item.label} className="setting-item">
                    <div className="setting-icon">
                      <item.icon size={18} />
                    </div>
                    <div className="setting-info">
                      <p className="setting-label">{item.label}</p>
                      <p className="setting-desc">{item.desc}</p>
                    </div>
                    <ChevronRight size={16} className="setting-arrow" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Danger Zone */}
          <div className="danger-zone">
            <button className="danger-btn">Đăng xuất</button>
          </div>
        </div>
      </div>
    </div>
  );
}