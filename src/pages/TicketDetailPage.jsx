import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MessageSquare, CheckCircle, Clock, AlertCircle,
    User, Star, Phone, MapPin, ChevronRight, Wifi, Monitor,
    HardDrive, TrendingUp, Shield, Edit3, XCircle, RefreshCw
} from 'lucide-react';
import { useTicketStore, useChatStore } from '../store';
import './TicketDetailPage.css';

const statusConfig = {
    pending: { label: 'Chờ xử lý', color: 'orange', icon: Clock },
    in_progress: { label: 'Đang xử lý', color: 'cyan', icon: RefreshCw },
    completed: { label: 'Hoàn thành', color: 'green', icon: CheckCircle },
    cancelled: { label: 'Đã hủy', color: 'muted', icon: XCircle },
};

const priorityConfig = {
    urgent: { label: 'Khẩn cấp', color: 'red' },
    high: { label: 'Cao', color: 'orange' },
    medium: { label: 'Trung bình', color: 'cyan' },
    low: { label: 'Thấp', color: 'green' },
};

const categoryConfig = {
    network: { label: 'Mạng & Internet', icon: Wifi },
    software: { label: 'Phần mềm', icon: Monitor },
    hardware: { label: 'Phần cứng', icon: HardDrive },
    performance: { label: 'Hiệu năng', icon: TrendingUp },
    security: { label: 'Bảo mật', icon: Shield },
};

function formatDateTime(iso) {
    return new Date(iso).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function formatRelative(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    return `${Math.floor(diff / 86400000)} ngày trước`;
}

function StarRating({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    className={`star-btn ${n <= (hovered || value) ? 'filled' : ''}`}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange && onChange(n)}
                >
                    <Star size={22} />
                </button>
            ))}
        </div>
    );
}

export default function TicketDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tickets, updateTicket } = useTicketStore();
    const { setActiveConversation, conversations } = useChatStore();
    const [rating, setRating] = useState(0);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const [cancelConfirm, setCancelConfirm] = useState(false);

    const ticket = tickets.find(t => t.id === id);

    if (!ticket) {
        return (
            <div className="ticket-not-found">
                <AlertCircle size={48} />
                <h2>Không tìm thấy yêu cầu</h2>
                <p>Yêu cầu <strong>{id}</strong> không tồn tại hoặc đã bị xóa.</p>
                <button className="btn-primary" onClick={() => navigate('/tickets')}>
                    <ArrowLeft size={16} /> Quay lại danh sách
                </button>
            </div>
        );
    }

    const status = statusConfig[ticket.status] || statusConfig.pending;
    const priority = priorityConfig[ticket.priority] || priorityConfig.medium;
    const category = categoryConfig[ticket.category] || { label: ticket.category, icon: Monitor };
    const StatusIcon = status.icon;
    const CategoryIcon = category.icon;

    const relatedConv = conversations.find(c => c.ticketId === ticket.id);

    const handleOpenChat = () => {
        if (relatedConv) {
            setActiveConversation(relatedConv.id);
            navigate('/chat');
        }
    };

    const handleCancel = () => {
        updateTicket(ticket.id, { status: 'cancelled' });
        setCancelConfirm(false);
    };

    const handleRatingSubmit = () => {
        updateTicket(ticket.id, { rating });
        setRatingSubmitted(true);
    };

    // Build timeline
    const timeline = [
        { label: 'Yêu cầu được tạo', time: ticket.createdAt, color: 'blue', done: true },
        { label: 'Kỹ thuật viên được phân công', time: ticket.technician ? ticket.createdAt : null, color: 'cyan', done: !!ticket.technician },
        { label: 'Đang xử lý', time: ticket.status === 'in_progress' || ticket.status === 'completed' ? ticket.updatedAt : null, color: 'orange', done: ticket.status === 'in_progress' || ticket.status === 'completed' },
        { label: 'Hoàn thành', time: ticket.status === 'completed' ? ticket.updatedAt : null, color: 'green', done: ticket.status === 'completed' },
    ];

    return (
        <div className="ticket-detail-page">
            {/* Header */}
            <div className="detail-header">
                <button className="back-btn" onClick={() => navigate('/tickets')}>
                    <ArrowLeft size={16} /> Quay lại
                </button>
                <div className="detail-header-right">
                    {ticket.status === 'pending' && (
                        <button className="btn-danger-outline" onClick={() => setCancelConfirm(true)}>
                            <XCircle size={15} /> Hủy yêu cầu
                        </button>
                    )}
                    {relatedConv && ticket.status === 'in_progress' && (
                        <button className="btn-chat" onClick={handleOpenChat}>
                            <MessageSquare size={15} /> Mở chat
                            {relatedConv.unread > 0 && <span className="chat-badge">{relatedConv.unread}</span>}
                        </button>
                    )}
                </div>
            </div>

            {/* Cancel Confirm Modal */}
            {cancelConfirm && (
                <div className="modal-overlay animate-fadeIn" onClick={() => setCancelConfirm(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3>Xác nhận hủy yêu cầu?</h3>
                        <p>Bạn có chắc muốn hủy yêu cầu <strong>{ticket.id}</strong>? Hành động này không thể hoàn tác.</p>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setCancelConfirm(false)}>Không</button>
                            <button className="btn-danger" onClick={handleCancel}>Xác nhận hủy</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="detail-grid">
                {/* Main Content */}
                <div className="detail-main">
                    {/* Title Card */}
                    <div className="detail-card title-card animate-fadeInUp">
                        <div className="ticket-detail-top">
                            <span className="ticket-id-badge">{ticket.id}</span>
                            <span className={`status-badge-lg status-${status.color}`}>
                                <StatusIcon size={13} />
                                {status.label}
                            </span>
                            <span className={`priority-badge priority-${priority.color}`}>
                                {priority.label}
                            </span>
                        </div>
                        <h1 className="ticket-detail-title">{ticket.title}</h1>
                        <p className="ticket-detail-desc">{ticket.description}</p>

                        <div className="ticket-meta-row">
                            <div className="meta-chip">
                                <CategoryIcon size={14} />
                                {category.label}
                            </div>
                            <div className="meta-chip">
                                <Clock size={14} />
                                {formatDateTime(ticket.createdAt)}
                            </div>
                            {ticket.estimatedTime && (
                                <div className="meta-chip">
                                    <RefreshCw size={14} />
                                    Ước tính: {ticket.estimatedTime}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rating Card — only if completed and not yet rated */}
                    {ticket.status === 'completed' && !ticket.rating && !ratingSubmitted && (
                        <div className="detail-card rating-card animate-fadeInUp">
                            <h3 className="card-section-title">
                                <Star size={16} className="text-orange" />
                                Đánh giá dịch vụ
                            </h3>
                            <p className="rating-prompt">Bạn hài lòng như thế nào với dịch vụ lần này?</p>
                            <StarRating value={rating} onChange={setRating} />
                            {rating > 0 && (
                                <button className="btn-primary rating-submit" onClick={handleRatingSubmit}>
                                    Gửi đánh giá
                                </button>
                            )}
                        </div>
                    )}

                    {(ticket.rating || ratingSubmitted) && (
                        <div className="detail-card rating-done-card animate-fadeInUp">
                            <CheckCircle size={18} className="text-green" />
                            <div>
                                <p className="rating-done-title">Cảm ơn bạn đã đánh giá!</p>
                                <StarRating value={ticket.rating || rating} />
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="detail-card animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <h3 className="card-section-title">
                            <Clock size={16} />
                            Lịch sử tiến trình
                        </h3>
                        <div className="timeline">
                            {timeline.map((item, i) => (
                                <div key={i} className={`timeline-item ${item.done ? 'done' : 'pending'}`}>
                                    <div className={`timeline-dot color-${item.done ? item.color : 'muted'}`} />
                                    {i < timeline.length - 1 && (
                                        <div className={`timeline-line ${item.done && timeline[i + 1].done ? 'active' : ''}`} />
                                    )}
                                    <div className="timeline-content">
                                        <p className="timeline-label">{item.label}</p>
                                        {item.time ? (
                                            <span className="timeline-time">{formatDateTime(item.time)}</span>
                                        ) : (
                                            <span className="timeline-time pending-text">Đang chờ...</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Preview */}
                    {relatedConv && (
                        <div className="detail-card chat-preview-card animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                            <div className="chat-preview-header">
                                <h3 className="card-section-title" style={{ margin: 0 }}>
                                    <MessageSquare size={16} />
                                    Tin nhắn gần đây
                                </h3>
                                <button className="btn-link" onClick={handleOpenChat}>
                                    Mở chat đầy đủ <ChevronRight size={14} />
                                </button>
                            </div>
                            <div className="chat-preview-messages">
                                {relatedConv.messages.slice(-3).map(msg => (
                                    <div key={msg.id} className={`preview-msg ${msg.sender === 'client' ? 'out' : 'in'}`}>
                                        <p>{msg.text}</p>
                                        <span>{formatRelative(msg.time)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="detail-sidebar">
                    {/* Technician Card */}
                    <div className={`detail-card tech-card animate-fadeInUp ${!ticket.technician ? 'no-tech' : ''}`}>
                        <h3 className="card-section-title">
                            <User size={16} />
                            Kỹ thuật viên
                        </h3>
                        {ticket.technician ? (
                            <div className="tech-info">
                                <div className="tech-avatar">
                                    {ticket.technician.name.charAt(0)}
                                    <span className="tech-online-dot" />
                                </div>
                                <div className="tech-details">
                                    <p className="tech-name">{ticket.technician.name}</p>
                                    <div className="tech-rating">
                                        <Star size={12} fill="currentColor" />
                                        <span>{ticket.technician.rating}</span>
                                    </div>
                                </div>
                                <div className="tech-actions">
                                    <button className="tech-action-btn" title="Gọi điện">
                                        <Phone size={16} />
                                    </button>
                                    <button className="tech-action-btn chat" onClick={handleOpenChat} title="Chat">
                                        <MessageSquare size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="no-tech-info">
                                <div className="no-tech-icon">
                                    <User size={24} />
                                </div>
                                <p>Đang tìm kỹ thuật viên phù hợp...</p>
                                <div className="searching-dots">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price Card */}
                    {ticket.price !== null && ticket.price !== undefined && (
                        <div className="detail-card price-card animate-fadeInUp" style={{ animationDelay: '0.08s' }}>
                            <h3 className="card-section-title">
                                <Edit3 size={16} />
                                Chi phí dịch vụ
                            </h3>
                            <div className="price-display">
                                <p className="price-amount">{ticket.price.toLocaleString('vi-VN')}<span>đ</span></p>
                                {ticket.status === 'completed' ? (
                                    <span className="price-paid"><CheckCircle size={13} /> Đã thanh toán</span>
                                ) : (
                                    <button className="btn-pay" onClick={() => navigate('/payment')}>
                                        Thanh toán ngay <ChevronRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Info Card */}
                    <div className="detail-card info-card animate-fadeInUp" style={{ animationDelay: '0.12s' }}>
                        <h3 className="card-section-title">
                            <AlertCircle size={16} />
                            Thông tin chi tiết
                        </h3>
                        <div className="info-rows">
                            <div className="info-row">
                                <span className="info-label">Mã yêu cầu</span>
                                <span className="info-val mono">{ticket.id}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Danh mục</span>
                                <span className="info-val">{category.label}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Mức ưu tiên</span>
                                <span className={`info-val priority-text priority-${priority.color}`}>{priority.label}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Trạng thái</span>
                                <span className={`info-val status-text color-text-${status.color}`}>{status.label}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Tạo lúc</span>
                                <span className="info-val">{formatDateTime(ticket.createdAt)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Cập nhật</span>
                                <span className="info-val">{formatRelative(ticket.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}