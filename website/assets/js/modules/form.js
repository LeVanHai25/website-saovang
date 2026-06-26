/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/form.js  v1.0
   Xử lý toàn bộ form liên hệ / báo giá:
     · Validate real-time (required, email, phone VN)
     · Toast notification thay vì alert()
     · Submit FormData lên /api/contact
     · Loading state (disable button, spinner)
     · Reset form sau khi gửi thành công

   Dùng cho: #contactForm (lien-he.html), #homeQuoteForm (index.html)
════════════════════════════════════════════════════════════════ */

(function initForm() {
  'use strict';

  /* ─── Toast notifications ──────────────────────────────────── */
  const toastStyles = `
    #svToastContainer {
      position: fixed; bottom: 24px; right: 24px; z-index: 20000;
      display: flex; flex-direction: column; gap: 10px;
      pointer-events: none;
    }
    .sv-toast {
      background: #1a1a1a; color: #fff;
      padding: 14px 20px 14px 16px;
      border-radius: 8px; font-size: 14px;
      display: flex; align-items: center; gap: 10px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.25);
      max-width: 340px;
      pointer-events: all;
      animation: svToastIn 0.3s ease both;
      border-left: 4px solid #ccc;
    }
    .sv-toast.success { border-left-color: #2a7a2a; }
    .sv-toast.error   { border-left-color: #c0392b; }
    .sv-toast.info    { border-left-color: #C9A227; }
    .sv-toast.fading  { animation: svToastOut 0.3s ease forwards; }
    .sv-toast-icon { flex-shrink: 0; width: 20px; height: 20px; }
    @keyframes svToastIn  { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:none; } }
    @keyframes svToastOut { to   { opacity:0; transform:translateX(20px); } }
    .form-field-error {
      font-size: 12px; color: #c0392b;
      margin-top: 4px; display: block;
      animation: svToastIn 0.2s ease both;
    }
    .form-input-invalid { border-color: #c0392b !important; }
  `;

  (function injectStyles() {
    if (document.getElementById('svFormStyles')) return;
    const s = document.createElement('style');
    s.id = 'svFormStyles';
    s.textContent = toastStyles;
    document.head.appendChild(s);
  })();

  function showToast(message, type = 'info', duration = 5000) {
    let container = document.getElementById('svToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'svToastContainer';
      document.body.appendChild(container);
    }

    const icons = {
      success: `<svg class="sv-toast-icon" viewBox="0 0 24 24" fill="none" stroke="#2a7a2a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
      error:   `<svg class="sv-toast-icon" viewBox="0 0 24 24" fill="none" stroke="#c0392b" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      info:    `<svg class="sv-toast-icon" viewBox="0 0 24 24" fill="none" stroke="#C9A227" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    };

    const toast = document.createElement('div');
    toast.className = `sv-toast ${type}`;
    toast.innerHTML = (icons[type] || icons.info) + `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fading');
      setTimeout(() => toast.remove(), 320);
    }, duration);
  }

  /* ─── Validation helpers ───────────────────────────────────── */
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function isValidPhoneVN(val) {
    return /^(0|\+84)[3-9]\d{8}$/.test(val.replace(/\s/g, ''));
  }

  function setFieldError(field, message) {
    field.classList.add('form-input-invalid');
    let err = field.parentElement.querySelector('.form-field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'form-field-error';
      field.parentElement.appendChild(err);
    }
    err.textContent = message;
  }

  function clearFieldError(field) {
    field.classList.remove('form-input-invalid');
    const err = field.parentElement?.querySelector('.form-field-error');
    if (err) err.remove();
  }

  function validateField(field) {
    const val  = field.value.trim();
    const type = field.type;
    const name = field.name || field.id;

    clearFieldError(field);

    if (field.required && !val) {
      setFieldError(field, 'Trường này không được để trống.');
      return false;
    }
    if (type === 'email' && val && !isValidEmail(val)) {
      setFieldError(field, 'Email không hợp lệ.');
      return false;
    }
    if ((name === 'phone' || name === 'sdt') && val && !isValidPhoneVN(val)) {
      setFieldError(field, 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0 hoặc +84).');
      return false;
    }
    return true;
  }

  /* ─── Submit handler ───────────────────────────────────────── */
  async function handleSubmit(form, e) {
    e.preventDefault();

    // Validate all fields
    const fields   = [...form.querySelectorAll('input, textarea, select')];
    const allValid = fields.map(f => validateField(f)).every(Boolean);
    if (!allValid) {
      showToast('Vui lòng kiểm tra lại các trường bị lỗi.', 'error');
      return;
    }

    const btn     = form.querySelector('[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.disabled  = true;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 0.8s linear infinite"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-opacity="0.3"/><path d="M21 12a9 9 0 00-9-9"/></svg> Đang gửi...`;

    try {
      const formData = new FormData(form);

      // Attach file if present
      const fileInput = form.querySelector('input[type="file"]');
      if (fileInput?.files[0]) formData.set('drawing', fileInput.files[0]);

      // Default source identifier
      if (!formData.get('source')) {
        formData.set('source', form.dataset.source || 'website_form');
      }

      const res    = await fetch('/api/contact', { method: 'POST', body: formData });
      const result = await res.json();

      if (result.success) {
        showToast(result.message || 'Đã gửi thành công! Chúng tôi sẽ phản hồi trong 2 giờ.', 'success', 7000);
        form.reset();
        // Reset file label
        const fileLabel = form.querySelector('.file-name');
        if (fileLabel) fileLabel.textContent = 'Chưa chọn file nào';
      } else {
        showToast(result.error || 'Có lỗi xảy ra, vui lòng thử lại.', 'error');
      }
    } catch (err) {
      console.error('[form.js] Submit error:', err);
      showToast('Lỗi kết nối. Vui lòng thử lại sau.', 'error');
    } finally {
      btn.disabled  = false;
      btn.innerHTML = origHTML;
    }
  }

  /* ─── Real-time validation ─────────────────────────────────── */
  function bindRealtimeValidation(form) {
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('form-input-invalid')) validateField(field);
      });
    });
  }

  /* ─── File upload label ────────────────────────────────────── */
  function bindFileUploads(form) {
    form.querySelectorAll('input[type="file"]').forEach(input => {
      const label = input.closest('.file-upload-wrapper')?.querySelector('.file-name');
      if (!label) return;
      input.addEventListener('change', () => {
        label.textContent = input.files[0]?.name || 'Chưa chọn file nào';
      });
    });
  }

  /* ─── Bind all matching forms ──────────────────────────────── */
  function setupForms() {
    const selectors = ['#contactForm', '#homeQuoteForm', '[data-sv-form]'];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(form => {
        if (form._svFormBound) return;
        form._svFormBound = true;
        form.addEventListener('submit', e => handleSubmit(form, e));
        bindRealtimeValidation(form);
        bindFileUploads(form);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupForms);
  } else {
    setupForms();
  }

  /* ─── Expose toast API for other scripts ───────────────────── */
  window.SV = window.SV || {};
  window.SV.toast = showToast;

})();
