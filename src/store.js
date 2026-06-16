import { create } from 'zustand';

// Auth Store
export const useAuthStore = create((set) => ({
    user: {
        id: 'u001',
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@email.com',
        avatar: null,
        role: 'client',
        phone: '0901234567',
        joinDate: '2024-01-15',
    },
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));

// Tickets Store
export const useTicketStore = create((set, get) => ({
    tickets: [
        {
            id: 'TK-2401',
            title: 'Máy tính không kết nối được WiFi',
            description: 'Laptop Dell XPS 15 không thể kết nối WiFi sau khi update Windows 11. Đã thử restart nhiều lần nhưng không được.',
            status: 'in_progress',
            priority: 'high',
            category: 'network',
            createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
            updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
            technician: { id: 't001', name: 'Trần Kỹ Thuật', avatar: null, rating: 4.9 },
            estimatedTime: '1-2 giờ',
            price: 150000,
        },
        {
            id: 'TK-2400',
            title: 'Cài đặt phần mềm kế toán',
            description: 'Cần cài đặt và cấu hình phần mềm MISA Accounting cho 3 máy tính văn phòng.',
            status: 'completed',
            priority: 'medium',
            category: 'software',
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            technician: { id: 't002', name: 'Lê Công Nghệ', avatar: null, rating: 4.7 },
            estimatedTime: '2-3 giờ',
            price: 300000,
            rating: 5,
        },
        {
            id: 'TK-2399',
            title: 'Màn hình xuất hiện sọc ngang',
            description: 'Màn hình Samsung 27 inch bị sọc ngang màu xanh khi khởi động.',
            status: 'pending',
            priority: 'urgent',
            category: 'hardware',
            createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
            updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
            technician: null,
            estimatedTime: null,
            price: null,
        },
        {
            id: 'TK-2398',
            title: 'Laptop chạy chậm, nóng máy',
            description: 'Laptop HP bị chậm và nóng bất thường, pin hao nhanh.',
            status: 'cancelled',
            priority: 'low',
            category: 'performance',
            createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
            technician: null,
            estimatedTime: null,
            price: null,
        },
    ],
    addTicket: (ticket) => set((state) => ({
        tickets: [{ ...ticket, id: `TK-${2402 + state.tickets.length}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...state.tickets]
    })),
    updateTicket: (id, updates) => set((state) => ({
        tickets: state.tickets.map(t => t.id === id ? { ...t, ...updates } : t)
    })),
    getTicketById: (id) => get().tickets.find(t => t.id === id),
}));

// Chat Store
export const useChatStore = create((set) => ({
    conversations: [
        {
            id: 'conv-001',
            ticketId: 'TK-2401',
            ticketTitle: 'Máy tính không kết nối được WiFi',
            technician: { id: 't001', name: 'Trần Kỹ Thuật', online: true },
            messages: [
                { id: 'm1', sender: 'technician', text: 'Xin chào! Tôi là kỹ thuật viên phụ trách ticket của bạn. Bạn có thể mô tả chi tiết vấn đề không?', time: new Date(Date.now() - 45 * 60000).toISOString(), read: true },
                { id: 'm2', sender: 'client', text: 'Laptop Dell XPS 15 của tôi không thể kết nối WiFi sau khi update Windows 11. Icon WiFi vẫn hiện nhưng không kết nối được.', time: new Date(Date.now() - 40 * 60000).toISOString(), read: true },
                { id: 'm3', sender: 'technician', text: 'Bạn thử mở Device Manager và kiểm tra Network Adapters xem có dấu chấm than vàng không?', time: new Date(Date.now() - 35 * 60000).toISOString(), read: true },
                { id: 'm4', sender: 'client', text: 'Có, tôi thấy dấu chấm than vàng trên Intel Wi-Fi 6 AX201', time: new Date(Date.now() - 30 * 60000).toISOString(), read: true },
                { id: 'm5', sender: 'technician', text: 'Rõ rồi! Driver WiFi bị lỗi sau khi update. Tôi sẽ hướng dẫn bạn rollback driver. Bạn chuẩn bị chưa?', time: new Date(Date.now() - 20 * 60000).toISOString(), read: false },
            ],
            lastMessage: 'Tôi sẽ hướng dẫn bạn rollback driver.',
            unread: 1,
        },
        {
            id: 'conv-002',
            ticketId: 'TK-2400',
            ticketTitle: 'Cài đặt phần mềm kế toán',
            technician: { id: 't002', name: 'Lê Công Nghệ', online: false },
            messages: [
                { id: 'm1', sender: 'technician', text: 'Đã hoàn thành cài đặt MISA cho 3 máy. Mọi thứ hoạt động tốt nhé!', time: new Date(Date.now() - 86400000).toISOString(), read: true },
                { id: 'm2', sender: 'client', text: 'Cảm ơn bạn rất nhiều! Rất chuyên nghiệp.', time: new Date(Date.now() - 82800000).toISOString(), read: true },
            ],
            lastMessage: 'Cảm ơn bạn rất nhiều!',
            unread: 0,
        },
    ],
    activeConversation: null,
    setActiveConversation: (id) => set((state) => ({
        activeConversation: state.conversations.find(c => c.id === id) || null,
    })),
    sendMessage: (convId, text) => set((state) => {
        const newMsg = { id: `m-${Date.now()}`, sender: 'client', text, time: new Date().toISOString(), read: false };
        return {
            conversations: state.conversations.map(c =>
                c.id === convId
                    ? { ...c, messages: [...c.messages, newMsg], lastMessage: text }
                    : c
            ),
            activeConversation: state.activeConversation?.id === convId
                ? { ...state.activeConversation, messages: [...state.activeConversation.messages, newMsg] }
                : state.activeConversation,
        };
    }),
}));

// Notification Store
export const useNotificationStore = create((set) => ({
    notifications: [
        { id: 'n1', type: 'ticket', title: 'Kỹ thuật viên đã nhận ticket TK-2399', time: new Date(Date.now() - 5 * 60000).toISOString(), read: false },
        { id: 'n2', type: 'chat', title: 'Trần Kỹ Thuật gửi tin nhắn mới', time: new Date(Date.now() - 20 * 60000).toISOString(), read: false },
        { id: 'n3', type: 'payment', title: 'Thanh toán TK-2400 thành công - 300,000đ', time: new Date(Date.now() - 86400000).toISOString(), read: true },
    ],
    markAllRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),
    unreadCount: 2,
}));