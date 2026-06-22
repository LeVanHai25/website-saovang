/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — B2B Drawing Upload & Quote Form Submission Controller
   ════════════════════════════════════════════════════════════════ */

import { tracker } from './tracker.js';

export const quoteEngine = {
  init(formSelector = '#homeQuoteForm') {
    const forms = document.querySelectorAll(formSelector);
    forms.forEach(form => {
      // Bind file selection updates
      const fileInput = form.querySelector('input[type="file"]');
      const fileNameDisplay = form.querySelector('.file-name');
      
      if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', (e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            fileNameDisplay.textContent = files[0].name;
            fileNameDisplay.style.color = 'var(--gold-metallic)';
          } else {
            fileNameDisplay.textContent = 'Chưa chọn file nào';
            fileNameDisplay.style.color = '';
          }
        });
      }

      // Bind submission handler
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentForm = e.currentTarget;
        const submitBtn = currentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'GỬI YÊU CẦU';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Đang gửi...';
        }

        try {
          const formData = new FormData();
          const isModalForm = currentForm.id === 'modalQuoteForm';
          const prefix = isModalForm ? 'modal' : 'home';
          
          formData.append('name', currentForm.querySelector(`#${prefix}Name`)?.value || '');
          formData.append('phone', currentForm.querySelector(`#${prefix}Phone`)?.value || '');
          formData.append('province', currentForm.querySelector(`#${prefix}Address`)?.value || '');
          formData.append('note', currentForm.querySelector(`#${prefix}Note`)?.value || '');
          
          const selectedService = currentForm.querySelector(`#${prefix}Service`)?.value || 'yeu-cau-khac';
          formData.append('services', selectedService);

          const drawingFile = currentForm.querySelector('input[type="file"]')?.files[0];
          if (drawingFile) {
            formData.append('drawing', drawingFile);
          }

          const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData
          });

          const result = await response.json();

          if (response.ok && result.success) {
            alert(result.message || 'Gửi yêu cầu thành công!');
            tracker.trackEvent('Conversion', 'Submit Drawing Quote Form', selectedService, 25);
            currentForm.reset();
            if (fileNameDisplay) fileNameDisplay.textContent = 'Chưa chọn file nào';
            
            // Close active modal if form was inside one
            const activeModal = currentForm.closest('.modal-overlay');
            if (activeModal) {
              activeModal.classList.remove('active');
            }
          } else {
            alert(result.error || 'Có lỗi xảy ra, vui lòng thử lại.');
          }
        } catch (err) {
          console.error('Failed to submit quote request:', err);
          alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng.');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }
      });
    });

    // Bind modal overlays opening & closing actions
    this.bindModals();
  },

  bindModals() {
    // Quote trigger buttons
    document.querySelectorAll('.quote-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSector = e.currentTarget.getAttribute('data-sector') || 'all';
        const modal = document.querySelector('#b2bQuoteModal');
        if (modal) {
          // Pre-select service option based on sector if matches
          const serviceSelect = modal.querySelector('#homeService');
          if (serviceSelect) {
            if (targetSector === 'mechanical') {
              serviceSelect.value = 'co-khi-nghe-thuat';
            } else if (targetSector === 'facade') {
              serviceSelect.value = 'nhom-kinh-kien-truc';
            }
          }
          modal.classList.add('active');
        }
      });
    });

    // Close buttons and backdrop clicks
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      const closeBtn = modal.querySelector('.modal-close');
      closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });
  }
};
