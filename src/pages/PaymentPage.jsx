import React, { useState } from 'react';
import { CreditCard, CheckCircle, Clock, AlertCircle, ChevronRight, Shield, Zap } from 'lucide-react';
import { useTicketStore } from '../store';
import './PaymentPage.css';

const paymentMethods = [
    { id: 'momo', label: 'MoMo', color: '#a50064', emoji: '💜', desc: 'Ví điện tử MoMo' },
    { id: 'vnpay', label: 'VNPay', color: '#e7222e', emoji: '🔴', desc: 'Cổng thanh toán VNPay' },
    { id: 'stripe', label: 'Thẻ quốc tế', color: '#635bff', emoji: '💳', desc: 'Visa / Mastercard' },
    { id: 'bank', label: 'Chuyển khoản', color: '#10b981', emoji: '🏦', desc: 'Internet Banking' },
];

export default function PaymentPage() {
    const { tickets } = useTicketStore();
    const [selectedMethod, setSelectedMethod] = useState('momo');
    const [payingId, setPayingId] = useState(null);
    const [paidIds, setPaidIds] = useState(['TK-2400']);

    const pendingPayments = tickets.filter(t => t.price && !paidIds.includes(t.id) && t.status !== 'cancelled');
    const completedPayments = tickets.filter(t => paidIds.includes(t.id));

    const handlePay = async (ticketId, price) => {
        setPayingId(ticketId);
        await new Promise(r => setTimeout(r, 2000));
        setPaidIds(prev => [...prev, ticketId]);
        setPayingId(null);
    };

    return (
        <div className="payment-page">
            <div className="payment-header">
                <h1 className="page-title">Thanh toán</h1>
                <p className="page-subtitle">Quản lý và thanh toán dịch vụ hỗ trợ IT</p>
            </div>

            <div className="payment-grid">
                {/* Left: Pending */}
                <div className="payment-main">
                    {/* Pending Payments */}
                    <div className="payment-section">
                        <h2 className="section-title">
                            <AlertCircle size={18} className="text-orange" />
                            Cần thanh toán
                            {pendingPayments.length > 0 && (
                                <span className="section-badge">{pendingPayments.length}</span>
                            )}
                        </h2>

                        {pendingPayments.length === 0 ? (
                            <div className="empty-payment">
                                <CheckCircle size={32} className="text-green" />
                                <p>Không có khoản thanh toán nào đang chờ</p>
                            </div>
                        ) : (
                            <div className="payment-list">
                                {pendingPayments.map(ticket => (
                                    <div key={ticket.id} className="payment-item">
                                        <div className="payment-item-info">
                                            <div className="payment-item-header">
                                                <span className="payment-ticket-id">{ticket.id}</span>
                                                <span className="payment-status-badge pending">Chờ thanh toán</span>
                                            </div>
                                            <p className="payment-title">{ticket.title}</p>
                                            <div className="payment-meta">
                                                {ticket.technician && <span>KTV: {ticket.technician.name}</span>}
                                                {ticket.estimatedTime && <span>· {ticket.estimatedTime}</span>}
                                            </div>
                                        </div>
                                        <div className="payment-item-right">
                                            <p className="payment-amount">{ticket.price?.toLocaleString('vi-VN')}đ</p>
                                            <button
                                                className={`pay-btn ${payingId === ticket.id ? 'paying' : ''}`}
                                                onClick={() => handlePay(ticket.id, ticket.price)}
                                                disabled={payingId === ticket.id}
                                            >
                                                {payingId === ticket.id ? (
                                                    <><span className="spinner" /> Đang xử lý...</>
                                                ) : (
                                                    <>Thanh toán <ChevronRight size={14} /></>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Payment History */}
                    <div className="payment-section">
                        <h2 className="section-title">
                            <Clock size={18} className="text-secondary" />
                            Lịch sử thanh toán
                        </h2>
                        <div className="payment-list">
                            {completedPayments.map(ticket => (
                                <div key={ticket.id} className="payment-item completed">
                                    <div className="payment-item-info">
                                        <div className="payment-item-header">
                                            <span className="payment-ticket-id">{ticket.id}</span>
                                            <span className="payment-status-badge done">Đã thanh toán</span>
                                        </div>
                                        <p className="payment-title">{ticket.title}</p>
                                        <div className="payment-meta">
                                            {ticket.technician && <span>KTV: {ticket.technician.name}</span>}
                                            {ticket.rating && <span>· ⭐ {ticket.rating}/5</span>}
                                        </div>
                                    </div>
                                    <div className="payment-item-right">
                                        <p className="payment-amount paid">{ticket.price?.toLocaleString('vi-VN')}đ</p>
                                        <div className="paid-check">
                                            <CheckCircle size={14} />
                                            <span>Thành công</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {completedPayments.length === 0 && (
                                <p className="text-muted" style={{ padding: '20px', textAlign: 'center', fontSize: '13px' }}>
                                    Chưa có lịch sử thanh toán
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Methods */}
                <div className="payment-sidebar">
                    <div className="method-card">
                        <h3 className="method-title">
                            <CreditCard size={16} />
                            Phương thức thanh toán
                        </h3>
                        <div className="method-list">
                            {paymentMethods.map(method => (
                                <button
                                    key={method.id}
                                    className={`method-item ${selectedMethod === method.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedMethod(method.id)}
                                >
                                    <span className="method-emoji">{method.emoji}</span>
                                    <div className="method-info">
                                        <p className="method-name">{method.label}</p>
                                        <p className="method-desc">{method.desc}</p>
                                    </div>
                                    {selectedMethod === method.id && (
                                        <CheckCircle size={16} className="text-cyan" style={{ marginLeft: 'auto' }} />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Security info */}
                        <div className="security-info">
                            <Shield size={14} />
                            <p>Thanh toán được mã hóa SSL 256-bit. Thông tin của bạn luôn được bảo mật tuyệt đối.</p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="summary-card">
                        <h3 className="method-title">
                            <Zap size={16} />
                            Tóm tắt
                        </h3>
                        <div className="summary-rows">
                            <div className="summary-row">
                                <span>Tổng dịch vụ đã dùng</span>
                                <span>{tickets.filter(t => t.price).length} dịch vụ</span>
                            </div>
                            <div className="summary-row">
                                <span>Đã thanh toán</span>
                                <span className="text-green">
                                    {completedPayments.reduce((sum, t) => sum + (t.price || 0), 0).toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                            <div className="summary-row">
                                <span>Còn lại</span>
                                <span className="text-orange">
                                    {pendingPayments.reduce((sum, t) => sum + (t.price || 0), 0).toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}