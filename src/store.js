import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const mapUser = (row) => row ? ({
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    role: row.role,
    phone: row.phone,
    joinDate: row.join_date,
}) : null;

const mapTechnician = (row) => row ? ({
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    rating: row.rating,
    online: row.online,
}) : null;

const mapTicket = (row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    category: row.category,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    technician: mapTechnician(row.technicians),
    estimatedTime: row.estimated_time,
    price: row.price,
    rating: row.rating,
});

const mapConversation = (row) => ({
    id: row.id,
    ticketId: row.ticket_id,
    ticketTitle: row.ticket_title,
    technician: mapTechnician(row.technicians),
    messages: (row.messages || [])
        .sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at))
        .map((message) => ({
            id: message.id,
            sender: message.sender,
            text: message.text,
            time: message.sent_at,
            read: message.read,
        })),
    lastMessage: row.last_message,
    unread: row.unread,
});

const mapNotification = (row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    time: row.created_at,
    read: row.read,
});

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });

        const { data: account, error: accountError } = await supabase
            .from('mock_accounts')
            .select('id, email, password, role')
            .eq('email', email)
            .eq('password', password)
            .single();

        if (accountError || !account) {
            set({ user: null, isAuthenticated: false, loading: false, error: 'Email hoặc mật khẩu không đúng' });
            return { success: false };
        }

        const { data: user, error: userError } = await supabase
            .from('app_users')
            .select('*')
            .eq('id', account.id)
            .single();

        if (userError || !user) {
            set({ user: null, isAuthenticated: false, loading: false, error: 'Không tìm thấy tài khoản' });
            return { success: false };
        }

        const mappedUser = mapUser(user);

        set({
            user: mappedUser,
            isAuthenticated: true,
            loading: false,
            error: null,
        });

        return { success: true, user: mappedUser };
    },

    fetchUser: async (id) => {
        set({ loading: true, error: null });

        const { data, error } = await supabase
            .from('app_users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            set({ loading: false, error: error.message });
            return null;
        }

        const user = mapUser(data);
        set({ user, isAuthenticated: true, loading: false });
        return user;
    },

    setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
    logout: () => set({ user: null, isAuthenticated: false, error: null }),
}));

export const useTicketStore = create((set, get) => ({
    tickets: [],
    loading: false,
    error: null,

    fetchTickets: async () => {
        set({ loading: true, error: null });

        const { data, error } = await supabase
            .from('tickets')
            .select('*, technicians(*)')
            .order('created_at', { ascending: false });

        if (error) {
            set({ loading: false, error: error.message });
            return [];
        }

        const tickets = data.map(mapTicket);
        set({ tickets, loading: false });
        return tickets;
    },

    addTicket: async (ticket) => {
        const ticketId = ticket.id || `TK-${Date.now()}`;
        const payload = {
            id: ticketId,
            title: ticket.title,
            description: ticket.description,
            status: ticket.status || 'pending',
            priority: ticket.priority || 'medium',
            category: ticket.category,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            technician_id: ticket.technicianId || null,
            estimated_time: ticket.estimatedTime || null,
            price: ticket.price || null,
            rating: ticket.rating || null,
        };

        const { data, error } = await supabase
            .from('tickets')
            .insert(payload)
            .select('*, technicians(*)')
            .single();

        if (error) {
            set({ error: error.message });
            return null;
        }

        const newTicket = mapTicket(data);
        set((state) => ({ tickets: [newTicket, ...state.tickets], error: null }));
        return newTicket;
    },

    updateTicket: async (id, updates) => {
        const payload = {
            title: updates.title,
            description: updates.description,
            status: updates.status,
            priority: updates.priority,
            category: updates.category,
            technician_id: updates.technicianId,
            estimated_time: updates.estimatedTime,
            price: updates.price,
            rating: updates.rating,
            updated_at: new Date().toISOString(),
        };

        Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

        const { data, error } = await supabase
            .from('tickets')
            .update(payload)
            .eq('id', id)
            .select('*, technicians(*)')
            .single();

        if (error) {
            set({ error: error.message });
            return null;
        }

        const updatedTicket = mapTicket(data);
        set((state) => ({
            tickets: state.tickets.map((ticket) => ticket.id === id ? updatedTicket : ticket),
            error: null,
        }));
        return updatedTicket;
    },

    getTicketById: (id) => get().tickets.find((ticket) => ticket.id === id),
}));

export const useChatStore = create((set, get) => ({
    conversations: [],
    activeConversation: null,
    loading: false,
    error: null,

    fetchConversations: async () => {
        set({ loading: true, error: null });

        const { data, error } = await supabase
            .from('conversations')
            .select('*, technicians(*), messages(*)')
            .order('id', { ascending: true });

        if (error) {
            set({ loading: false, error: error.message });
            return [];
        }

        const conversations = data.map(mapConversation);
        set({ conversations, loading: false });
        return conversations;
    },

    setActiveConversation: (id) => set((state) => ({
        activeConversation: state.conversations.find((conversation) => conversation.id === id) || null,
    })),

    sendMessage: async (convId, text) => {
        const newMessage = {
            id: `m-${Date.now()}`,
            conversation_id: convId,
            sender: 'client',
            text,
            sent_at: new Date().toISOString(),
            read: false,
        };

        const { data, error } = await supabase
            .from('messages')
            .insert(newMessage)
            .select('*')
            .single();

        if (error) {
            set({ error: error.message });
            return null;
        }

        await supabase
            .from('conversations')
            .update({ last_message: text })
            .eq('id', convId);

        const message = {
            id: data.id,
            sender: data.sender,
            text: data.text,
            time: data.sent_at,
            read: data.read,
        };

        set((state) => {
            const conversations = state.conversations.map((conversation) =>
                conversation.id === convId
                    ? { ...conversation, messages: [...conversation.messages, message], lastMessage: text }
                    : conversation
            );

            return {
                conversations,
                activeConversation: state.activeConversation?.id === convId
                    ? { ...state.activeConversation, messages: [...state.activeConversation.messages, message], lastMessage: text }
                    : state.activeConversation,
                error: null,
            };
        });

        return message;
    },

    getConversationById: (id) => get().conversations.find((conversation) => conversation.id === id),
}));

export const useNotificationStore = create((set) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,

    fetchNotifications: async () => {
        set({ loading: true, error: null });

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            set({ loading: false, error: error.message });
            return [];
        }

        const notifications = data.map(mapNotification);
        set({
            notifications,
            unreadCount: notifications.filter((notification) => !notification.read).length,
            loading: false,
        });
        return notifications;
    },

    markAllRead: async () => {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('read', false);

        if (error) {
            set({ error: error.message });
            return false;
        }

        set((state) => ({
            notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
            unreadCount: 0,
            error: null,
        }));
        return true;
    },
}));
