import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, X } from 'lucide-react';
import { useNotificationStore } from '../../store';
import './Header.css';

const pageTitles = {
    '/home': 'Trang chủ',
    '/tickets': 'Yêu cầu hỗ trợ',
    '/tickets/new': 'Tạo yêu cầu mới',
    '/chat': 'Tin nhắn',
    '/payment': 'Thanh toán',
    '/profile': 'Hồ sơ cá nhân',
};

export default function Header({ onMenuClick }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { notifications, markAllRead, unreadCount } = useNotificationStore();
    const [showNotifs, setShowNotifs] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchVal, setSearchVal] = useState('');

    const title = pageTitles[location.pathname] || 'Cứu Hộ IT';

    const handleNotifClick = () => {
        setShowNotifs(!showNotifs);
        if (!showNotifs) markAllRead();
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="header-menu-btn" onClick={onMenuClick}>
                    <Menu size={20} />
                </button>
                {!searchOpen && (
                    <div className="header-title">
                        <h1>{title}</h1>
                        <div className="header-breadcrumb">
                            <span>Cứu Hộ IT</span>
                            <span className="breadcrumb-sep">/</span>
                            <span>{title}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="header-right">
                {searchOpen ? (
                    <div className="header-search-expanded">
                        <Search size={16} className="search-icon-inner" />
                        <input
                            autoFocus
                            placeholder="Tìm kiếm yêu cầu, tin nhắn..."
                            value={searchVal}
                            onChange={e => setSearchVal(e.target.value)}
                        />
                        <button onClick={() => { setSearchOpen(false); setSearchVal(''); }}>
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <button className="header-icon-btn" onClick={() => setSearchOpen(true)}>
                        <Search size={18} />
                    </button>
                )}

                <div className="notif-wrap">
                    <button className="header-icon-btn notif-btn" onClick={handleNotifClick}>
                        <Bell size={18} />
                        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                    </button>

                    {showNotifs && (
                        <div className="notif-dropdown animate-fadeIn">
                            <div className="notif-header">
                                <span>Thông báo</span>
                                <button onClick={markAllRead} className="notif-clear">Đánh dấu đã đọc</button>
                            </div>
                            <div className="notif-list">
                                {notifications.map(n => (
                                    <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                                        <div className={`notif-dot ${n.type}`} />
                                        <div className="notif-content">
                                            <p>{n.title}</p>
                                            <span>{new Date(n.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}