import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Check, CheckCheck, Paperclip, Smile, ArrowLeft } from 'lucide-react';
import { useChatStore, useAuthStore } from '../store';
import './ChatPage.css';

function formatTime(iso) {
    return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return 'Hôm nay';
    if (diff < 172800000) return 'Hôm qua';
    return d.toLocaleDateString('vi-VN');
}

export default function ChatPage() {
    const { conversations, activeConversation, setActiveConversation, sendMessage } = useChatStore();
    const { user } = useAuthStore();
    const [input, setInput] = useState('');
    const [mobileChatOpen, setMobileChatOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!activeConversation && conversations.length > 0) {
            setActiveConversation(conversations[0].id);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation?.messages]);

    const handleSend = () => {
        if (!input.trim() || !activeConversation) return;
        sendMessage(activeConversation.id, input.trim());
        setInput('');
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={`chat-page ${mobileChatOpen ? 'mobile-chat-open' : ''}`}>
            {/* Conversation List */}
            <div className="conv-list">
                <div className="conv-list-header">
                    <h2>Tin nhắn</h2>
                    <span className="conv-count">{conversations.length}</span>
                </div>
                <div className="conv-items">
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            className={`conv-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                            onClick={() => { setActiveConversation(conv.id); setMobileChatOpen(true); }}
                        >
                            <div className="conv-avatar">
                                {conv.technician.name.charAt(0)}
                                {conv.technician.online && <span className="online-dot" />}
                            </div>
                            <div className="conv-info">
                                <div className="conv-top">
                                    <span className="conv-name">{conv.technician.name}</span>
                                    <span className="conv-time">
                                        {formatTime(conv.messages[conv.messages.length - 1]?.time)}
                                    </span>
                                </div>
                                <div className="conv-bottom">
                                    <span className="conv-ticket">{conv.ticketId}</span>
                                    {conv.unread > 0 && <span className="conv-unread">{conv.unread}</span>}
                                </div>
                                <p className="conv-last">{conv.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            {activeConversation ? (
                <div className="chat-window">
                    {/* Chat Header */}
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <button className="chat-back-btn" onClick={() => setMobileChatOpen(false)}>
                                <ArrowLeft size={18} />
                            </button>
                            <div className="chat-avatar">
                                {activeConversation.technician.name.charAt(0)}
                                {activeConversation.technician.online && <span className="online-dot" />}
                            </div>
                            <div>
                                <p className="chat-name">{activeConversation.technician.name}</p>
                                <p className="chat-status">
                                    <span className={`status-dot ${activeConversation.technician.online ? 'online' : 'offline'}`} />
                                    {activeConversation.technician.online ? 'Đang hoạt động' : 'Ngoại tuyến'}
                                    <span className="chat-ticket-ref"> · {activeConversation.ticketId}</span>
                                </p>
                            </div>
                        </div>
                        <div className="chat-actions">
                            <button className="chat-action-btn" title="Gọi thoại"><Phone size={18} /></button>
                            <button className="chat-action-btn" title="Gọi video"><Video size={18} /></button>
                            <button className="chat-action-btn"><MoreVertical size={18} /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="messages-area">
                        <div className="date-divider">
                            <span>{formatDate(activeConversation.messages[0]?.time)}</span>
                        </div>

                        {activeConversation.messages.map((msg, i) => {
                            const isClient = msg.sender === 'client';
                            const prevMsg = activeConversation.messages[i - 1];
                            const showAvatar = !prevMsg || prevMsg.sender !== msg.sender;

                            return (
                                <div key={msg.id} className={`message-wrap ${isClient ? 'outgoing' : 'incoming'}`}>
                                    {!isClient && showAvatar && (
                                        <div className="msg-avatar">{activeConversation.technician.name.charAt(0)}</div>
                                    )}
                                    {!isClient && !showAvatar && <div className="msg-avatar-spacer" />}

                                    <div className={`message ${isClient ? 'msg-out' : 'msg-in'}`}>
                                        <p>{msg.text}</p>
                                        <div className="msg-meta">
                                            <span>{formatTime(msg.time)}</span>
                                            {isClient && (
                                                msg.read
                                                    ? <CheckCheck size={12} className="read-icon" />
                                                    : <Check size={12} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Typing indicator */}
                        {activeConversation.technician.online && (
                            <div className="message-wrap incoming">
                                <div className="msg-avatar">{activeConversation.technician.name.charAt(0)}</div>
                                <div className="typing-indicator">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chat-input-area">
                        <button className="input-action-btn" title="Đính kèm tệp"><Paperclip size={18} /></button>
                        <div className="input-box">
                            <textarea
                                placeholder="Nhập tin nhắn... (Enter để gửi)"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                rows={1}
                            />
                            <button className="emoji-btn"><Smile size={16} /></button>
                        </div>
                        <button
                            className={`send-btn ${input.trim() ? 'active' : ''}`}
                            onClick={handleSend}
                            disabled={!input.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="chat-empty">
                    <div className="chat-empty-content">
                        <div className="chat-empty-icon">💬</div>
                        <h3>Chọn cuộc trò chuyện</h3>
                        <p>Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu</p>
                    </div>
                </div>
            )}
        </div>
    );
}