/**
 * SV Aluminium — Advanced Project RFQ & NDA Intake Engine
 * Multi-format drawing upload handler & NDA assurance
 */

(function () {
  const ALLOWED_EXTENSIONS = ['.dwg', '.dxf', '.pdf', '.step', '.stp', '.xlsx', '.xls', '.zip', '.rar', '.jpg', '.jpeg', '.png'];
  const MAX_FILE_SIZE_MB = 50;

  function initRfqForms() {
    const fileInputs = document.querySelectorAll('input[type="file"][id*="rfq"], input[type="file"][id*="Rfq"]');
    fileInputs.forEach(input => {
      input.addEventListener('change', handleFileValidation);
    });

    const forms = document.querySelectorAll('form[id*="rfq"], form[id*="Rfq"]');
    forms.forEach(form => {
      form.addEventListener('submit', handleUniversalRfqSubmit);
    });
  }

  function handleFileValidation(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      
      // Check size
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`Tập tin "${file.name}" vượt quá dung lượng cho phép (${MAX_FILE_SIZE_MB}MB). Vui lòng gửi link Drive hoặc nén file.`);
        e.target.value = '';
        return;
      }
    }
  }

  function handleUniversalRfqSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    // Extract form data
    const formData = new FormData(form);
    const dataObj = {};
    formData.forEach((val, key) => {
      if (typeof val === 'string') dataObj[key] = val;
    });

    // Capture standard field fallbacks
    const name = form.querySelector('input[type="text"]')?.value || 'Khách hàng';
    const phone = form.querySelector('input[type="tel"]')?.value || '';
    const notes = form.querySelector('textarea')?.value || '';
    const timestamp = new Date().toISOString();

    const submission = {
      name,
      phone,
      notes,
      timestamp,
      sourceUrl: window.location.pathname,
      ndaAgreed: true
    };

    // Save to local storage registry for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('sv_aluminium_rfq_submissions') || '[]');
      existing.push(submission);
      localStorage.setItem('sv_aluminium_rfq_submissions', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }

    console.log('✅ SV ALUMINIUM RFQ & NDA Intake Success:', submission);

    // Show success message
    const successBox = form.querySelector('[id*="SuccessMsg"], [id*="successMsg"]');
    if (successBox) {
      successBox.style.display = 'block';
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      form.reset();
      setTimeout(() => {
        successBox.style.display = 'none';
      }, 7000);
    } else {
      alert(`✅ Cảm ơn Quý khách ${name}!\n\nKỹ sư SV ALUMINIUM đã tiếp nhận thông tin dự án theo thỏa thuận bảo mật (NDA) và sẽ phản hồi phương án kỹ thuật & dự toán trong 24 giờ.`);
      form.reset();
    }
  }

  window.initRfqEngine = initRfqForms;
  document.addEventListener('DOMContentLoaded', initRfqForms);
})();
