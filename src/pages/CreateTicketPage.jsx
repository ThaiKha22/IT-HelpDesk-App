import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, AlertCircle, Wifi, Monitor, HardDrive, TrendingUp, Shield, ChevronDown, Check } from 'lucide-react';
import { useTicketStore } from '../store';
import './CreateTicketPage.css';

const categories = [
  { key: 'network', label: 'Mạng & Internet', icon: Wifi, desc: 'WiFi, LAN, kết nối mạng' },
  { key: 'software', label: 'Phần mềm', icon: Monitor, desc: 'Cài đặt, lỗi ứng dụng' },
  { key: 'hardware', label: 'Phần cứng', icon: HardDrive, desc: 'Thiết bị, linh kiện' },
  { key: 'performance', label: 'Hiệu năng', icon: TrendingUp, desc: 'Máy chậm, lag' },
  { key: 'security', label: 'Bảo mật', icon: Shield, desc: 'Virus, bảo mật dữ liệu' },
];

const priorities = [
  { key: 'low', label: 'Thấp', color: 'green', desc: 'Không cấp bách' },
  { key: 'medium', label: 'Trung bình', color: 'cyan', desc: 'Trong vài ngày' },
  { key: 'high', label: 'Cao', color: 'orange', desc: 'Trong hôm nay' },
  { key: 'urgent', label: 'Khẩn cấp', color: 'red', desc: 'Cần giải quyết ngay' },
];

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const { addTicket } = useTicketStore();
  const [form, setForm] = useState({
    category: '',
    priority: 'medium',
    title: '',
    description: '',
    device: '',
    os: '',
  });
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCategory = categories.find(c => c.key === form.category);

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    addTicket({ ...form, status: 'pending', technician: null, price: null });
    setSubmitting(false);
    navigate('/tickets');
  };

  const canProceed = step === 1 ? form.category : step === 2 ? form.title && form.description : true;

  return (
    <div className="create-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="create-header">
        <h1 className="page-title">Tạo yêu cầu mới</h1>
        <p className="page-subtitle">Mô tả vấn đề của bạn để kỹ thuật viên hỗ trợ nhanh nhất</p>
      </div>

      {/* Stepper */}
      <div className="stepper">
        {['Danh mục', 'Chi tiết', 'Xác nhận'].map((label, i) => (
          <div key={label} className={`step ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : ''}`}>
            <div className="step-circle">{step > i + 1 ? '✓' : i + 1}</div>
            <span className="step-label">{label}</span>
            {i < 2 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="create-form">
        {/* Step 1: Category */}
        {step === 1 && (
          <div className="form-step animate-fadeInUp">
            <h2 className="step-title">Chọn danh mục vấn đề</h2>
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <div className="category-dropdown" ref={categoryRef}>
                <button
                  type="button"
                  className={`category-trigger ${categoryOpen ? 'open' : ''}`}
                  onClick={() => setCategoryOpen(!categoryOpen)}
                >
                  {selectedCategory ? (
                    <span className="category-trigger-selected">
                      <span className="category-trigger-icon"><selectedCategory.icon size={18} /></span>
                      <span>
                        <span className="category-trigger-label">{selectedCategory.label}</span>
                        <span className="category-trigger-desc">{selectedCategory.desc}</span>
                      </span>
                    </span>
                  ) : (
                    <span className="category-trigger-placeholder">Chọn danh mục vấn đề</span>
                  )}
                  <ChevronDown size={16} className="category-trigger-chevron" />
                </button>

                {categoryOpen && (
                  <div className="category-menu animate-fadeIn">
                    {categories.map(cat => (
                      <button
                        key={cat.key}
                        type="button"
                        className={`category-option ${form.category === cat.key ? 'selected' : ''}`}
                        onClick={() => { setForm({ ...form, category: cat.key }); setCategoryOpen(false); }}
                      >
                        <span className="category-option-icon"><cat.icon size={18} /></span>
                        <span className="category-option-text">
                          <span className="category-option-label">{cat.label}</span>
                          <span className="category-option-desc">{cat.desc}</span>
                        </span>
                        {form.category === cat.key && <Check size={16} className="category-option-check" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="priority-section">
              <label className="form-label">Mức độ ưu tiên</label>
              <div className="priority-grid">
                {priorities.map(p => (
                  <button
                    key={p.key}
                    className={`priority-card color-${p.color} ${form.priority === p.key ? 'selected' : ''}`}
                    onClick={() => setForm({ ...form, priority: p.key })}
                  >
                    <span className="priority-label">{p.label}</span>
                    <span className="priority-desc">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="form-step animate-fadeInUp">
            <h2 className="step-title">Mô tả chi tiết vấn đề</h2>

            <div className="form-group">
              <label className="form-label">Tiêu đề yêu cầu *</label>
              <input
                className="form-input"
                placeholder="VD: Máy tính không kết nối được WiFi sau khi update"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả chi tiết *</label>
              <textarea
                className="form-textarea"
                placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải: triệu chứng, khi nào bắt đầu, đã thử cách nào chưa..."
                rows={5}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Thiết bị</label>
                <input
                  className="form-input"
                  placeholder="VD: Dell XPS 15, iPhone 14..."
                  value={form.device}
                  onChange={e => setForm({ ...form, device: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hệ điều hành</label>
                <div className="select-wrap">
                  <select
                    className="form-select"
                    value={form.os}
                    onChange={e => setForm({ ...form, os: e.target.value })}
                  >
                    <option value="">Chọn OS</option>
                    <option value="windows11">Windows 11</option>
                    <option value="windows10">Windows 10</option>
                    <option value="macos">macOS</option>
                    <option value="ubuntu">Ubuntu</option>
                    <option value="ios">iOS</option>
                    <option value="android">Android</option>
                  </select>
                  <ChevronDown size={16} className="select-icon" />
                </div>
              </div>
            </div>

            <div className="upload-zone">
              <Upload size={24} />
              <p>Tải ảnh chụp màn hình hoặc video mô tả lỗi</p>
              <span>PNG, JPG, MP4 tối đa 50MB</span>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="form-step animate-fadeInUp">
            <h2 className="step-title">Xác nhận yêu cầu</h2>
            <div className="confirm-card">
              <div className="confirm-row">
                <span className="confirm-label">Danh mục</span>
                <span className="confirm-value">{categories.find(c => c.key === form.category)?.label}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">Ưu tiên</span>
                <span className={`priority-badge priority-${priorities.find(p => p.key === form.priority)?.color}`}>
                  {priorities.find(p => p.key === form.priority)?.label}
                </span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">Tiêu đề</span>
                <span className="confirm-value">{form.title}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">Mô tả</span>
                <span className="confirm-value">{form.description}</span>
              </div>
              {form.device && (
                <div className="confirm-row">
                  <span className="confirm-label">Thiết bị</span>
                  <span className="confirm-value">{form.device}</span>
                </div>
              )}
            </div>

            <div className="info-notice">
              <AlertCircle size={16} />
              <p>Sau khi gửi, kỹ thuật viên sẽ được phân công trong vòng <strong>5-15 phút</strong>. Bạn sẽ nhận thông báo qua ứng dụng và email.</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="form-actions">
          {step > 1 && (
            <button className="btn-secondary" onClick={() => setStep(step - 1)}>
              Quay lại
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <button
              className="btn-primary"
              disabled={!canProceed}
              onClick={() => setStep(step + 1)}
            >
              Tiếp theo
            </button>
          ) : (
            <button
              className="btn-primary btn-submit"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner" />
                  Đang gửi...
                </>
              ) : 'Gửi yêu cầu'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}