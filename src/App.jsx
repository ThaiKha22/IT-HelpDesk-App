import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import TicketsPage from './pages/TicketsPage';
import CreateTicketPage from './pages/CreateTicketPage';
import ChatPage from './pages/ChatPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import TicketDetailPage from './pages/TicketDetailPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <ProtectedRoute>
        <div className="app-layout">
          <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/tickets/new" element={<CreateTicketPage />} />
                <Route path="/tickets/:id" element={<TicketDetailPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </BrowserRouter>
  );
}