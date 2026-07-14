import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Zap, ArrowRight, Wifi, Monitor, HardDrive, Lock, Mail, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import './AuthPage.css';
import { useAuthStore } from '../store.js';

const FEATURES = [
  { icon: Wifi, text: 'Hỗ trợ mạng & Internet 24/7' },
  { icon: Monitor, text: 'Cài đặt & sửa lỗi phần mềm' },
  { icon: HardDrive, text: 'Bảo trì phần cứng tận nơi' },
];

function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 8,
    opacity: Math.random() * 0.4 + 0.1,
  }));
  return (
    <div className="particles">
      {particles.map(p => (
        <span
          key={p.id}
          className="particle"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

function GridLines() {
  return (
    <div className="grid-lines">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="grid-line-v" style={{ left: `${(i + 1) * 12.5}%` }} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="grid-line-h" style={{ top: `${(i + 1) * 16.66}%` }} />
      ))}
    </div>
  );
}

export default function AuthPage() {
  const { setUser } = useAuthStore();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register } = useAuthStore();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginForm.username || !loginForm.password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setLoading(true);

    try {
      const result = await login(loginForm.username, loginForm.password);

      if (!result.success) {
        setError('Tên người dùng hoặc mật khẩu không đúng.');
      }
    } catch (error) {
      setError('Không thể kết nối máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const { name, email, phone, password, confirm } = registerForm;
    if (!name || !email || !phone || !password) { setError('Vui lòng nhập đầy đủ thông tin.'); return; }
    if (password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
    if (password !== confirm) { setError('Mật khẩu xác nhận không khớp.'); return; }
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) { setError('Email không hợp lệ.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setSuccess('Đăng ký thành công! Đang đăng nhập...');
    await new Promise(r => setTimeout(r, 800));
    setUser({ id: `u-${Date.now()}`, name, email, phone, role: 'client', joinDate: new Date().toISOString() });
    setLoading(false);
  };

  return (
    <div className="auth-page">
      {/* Left Panel - Branding */}
      <div className="auth-left">
        <GridLines />
        <FloatingParticles />

        <div className="auth-left-content">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Shield size={28} />
              <Zap size={12} className="logo-zap-icon" />
            </div>
            <div>
              <h1 className="auth-brand-name">CứuHộ<span>IT</span></h1>
              <p className="auth-brand-tagline">Pro Support Platform</p>
            </div>
          </div>

          {/* Hero Text */}
          <div className="auth-hero-text">
            <h2 className="auth-hero-heading">
              Hỗ trợ kỹ thuật<br />
              <span className="auth-hero-gradient">nhanh chóng &amp;</span><br />
              chuyên nghiệp
            </h2>
            <p className="auth-hero-sub">
              Kết nối ngay với đội ngũ kỹ thuật viên giàu kinh nghiệm. Giải quyết mọi vấn đề IT trong vài phút.
            </p>
          </div>

          {/* Features */}
          <div className="auth-features">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="auth-feature-item">
                <div className="auth-feature-icon"><Icon size={16} /></div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="auth-stats">
            {[
              { val: '2,400+', label: 'Yêu cầu đã xử lý' },
              { val: '98%', label: 'Hài lòng' },
              { val: '<8 phút', label: 'Thời gian phản hồi' },
            ].map(s => (
              <div key={s.label} className="auth-stat">
                <p className="auth-stat-val">{s.val}</p>
                <p className="auth-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative circuit lines */}
        <svg className="circuit-svg" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 150 L80 150 L80 80 L200 80" stroke="rgba(0,212,255,0.12)" strokeWidth="1.5" />
          <circle cx="80" cy="150" r="4" fill="rgba(0,212,255,0.25)" />
          <circle cx="200" cy="80" r="3" fill="rgba(0,212,255,0.2)" />
          <path d="M400 300 L320 300 L320 400 L180 400" stroke="rgba(59,130,246,0.12)" strokeWidth="1.5" />
          <circle cx="320" cy="300" r="4" fill="rgba(59,130,246,0.2)" />
          <path d="M100 600 L100 480 L250 480 L250 380" stroke="hsla(190, 100%, 50%, 0.08)" strokeWidth="1" />
          <circle cx="250" cy="380" r="3" fill="rgba(0,212,255,0.15)" />
          <path d="M50 0 L50 120 L150 120 L150 200" stroke="rgba(139,92,246,0.1)" strokeWidth="1" />
        </svg>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          {/* Tab switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Đăng nhập
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Đăng ký
            </button>
            <div className={`auth-tab-indicator ${mode === 'register' ? 'right' : 'left'}`} />
          </div>

          {/* ─── LOGIN FORM ─── */}
          {mode === 'login' && (
            <form className="auth-form animate-fadeInUp" onSubmit={handleLogin}>
              <div className="form-top">
                <h2 className="form-title">Chào mừng trở lại</h2>
                <p className="form-subtitle">Đăng nhập để tiếp tục quản lý yêu cầu hỗ trợ của bạn.</p>
              </div>

              {error && (
                <div className="auth-alert error animate-fadeIn">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-field">
                <label className="field-label">Tên đăng nhập</label>
                <div className="input-wrap">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Nhập tên đăng nhập"
                    value={loginForm.username}
                    onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-field">
                <div className="field-label-row">
                  <label className="field-label">Mật khẩu</label>
                  <button type="button" className="forgot-link">Quên mật khẩu?</button>
                </div>
                <div className="input-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="auth-input with-toggle"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    autoComplete="current-password"
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <><span className="btn-spinner" /> Đang đăng nhập...</>
                ) : (
                  <>Đăng nhập <ArrowRight size={16} /></>
                )}
              </button>

              <div className="auth-divider"><span>hoặc đăng nhập với</span></div>

              <div className="social-btns">
                <button type="button" className="social-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                  Google
                </button>
                <button type="button" className="social-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  Facebook
                </button>
              </div>

              <p className="auth-switch-text">
                Chưa có tài khoản?{' '}
                <button type="button" className="switch-link" onClick={() => switchMode('register')}>
                  Đăng ký ngay
                </button>
              </p>
            </form>
          )}

          {/* ─── REGISTER FORM ─── */}
          {mode === 'register' && (
            <form className="auth-form animate-fadeInUp" onSubmit={handleRegister}>
              <div className="form-top">
                <h2 className="form-title">Tạo tài khoản mới</h2>
                <p className="form-subtitle">Tham gia ngay để nhận hỗ trợ kỹ thuật chuyên nghiệp.</p>
              </div>

              {error && (
                <div className="auth-alert error animate-fadeIn">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="auth-alert success animate-fadeIn">
                  <CheckCircle size={15} />
                  <span>{success}</span>
                </div>
              )}

              <div className="form-row-2">
                <div className="form-field">
                  <label className="field-label">Họ và tên *</label>
                  <div className="input-wrap">
                    <User size={16} className="input-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Nguyễn Văn A"
                      value={registerForm.name}
                      onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label className="field-label">Số điện thoại *</label>
                  <div className="input-wrap">
                    <Phone size={16} className="input-icon" />
                    <input
                      type="tel"
                      className="auth-input"
                      placeholder="0901 234 567"
                      value={registerForm.phone}
                      onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Email *</label>
                <div className="input-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="your@email.com"
                    value={registerForm.email}
                    onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label className="field-label">Mật khẩu *</label>
                  <div className="input-wrap">
                    <Lock size={16} className="input-icon" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="auth-input with-toggle"
                      placeholder="Tối thiểu 6 ký tự"
                      value={registerForm.password}
                      onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {/* Password strength */}
                  {registerForm.password && (
                    <div className="pass-strength">
                      {(() => {
                        const p = registerForm.password;
                        const score = [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
                        const labels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'];
                        const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
                        return (
                          <>
                            <div className="strength-bars">
                              {[1, 2, 3, 4].map(i => (
                                <div key={i} className="strength-bar" style={{ background: i <= score ? colors[score] : undefined }} />
                              ))}
                            </div>
                            <span style={{ color: colors[score] }}>{labels[score]}</span>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
                <div className="form-field">
                  <label className="field-label">Xác nhận mật khẩu *</label>
                  <div className="input-wrap">
                    <Lock size={16} className="input-icon" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      className={`auth-input with-toggle ${registerForm.confirm && registerForm.confirm !== registerForm.password ? 'input-error' : ''} ${registerForm.confirm && registerForm.confirm === registerForm.password ? 'input-success' : ''}`}
                      placeholder="Nhập lại mật khẩu"
                      value={registerForm.confirm}
                      onChange={e => setRegisterForm({ ...registerForm, confirm: e.target.value })}
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="terms-row">
                <input type="checkbox" id="terms" className="terms-checkbox" required />
                <label htmlFor="terms" className="terms-label">
                  Tôi đồng ý với <button type="button" className="terms-link">Điều khoản dịch vụ</button> và{' '}
                  <button type="button" className="terms-link">Chính sách bảo mật</button>
                </label>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <><span className="btn-spinner" /> Đang tạo tài khoản...</>
                ) : (
                  <>Tạo tài khoản <ArrowRight size={16} /></>
                )}
              </button>

              <p className="auth-switch-text">
                Đã có tài khoản?{' '}
                <button type="button" className="switch-link" onClick={() => switchMode('login')}>
                  Đăng nhập ngay
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
