/** Modal component */
const Modal = {
  open(opts = {}) {
    const { title = '', body = '', footer = '', wide = false, onClose } = opts;
    const box = document.getElementById('globalModalBox');
    const overlay = document.getElementById('globalModal');
    box.className = 'modal-box' + (wide ? ' modal-box-wide' : '');
    box.innerHTML = `
      <div class="modal-header">
        <span class="modal-title">${title}</span>
        <button class="modal-close btn-icon" id="modalCloseBtn">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">${body}</div>
      ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    `;
    overlay.classList.remove('hidden');
    document.getElementById('modalCloseBtn').onclick = () => Modal.close(onClose);
    overlay.onclick = (e) => { if (e.target === overlay) Modal.close(onClose); };
    document.addEventListener('keydown', Modal._escHandler);
  },

  close(cb) {
    document.getElementById('globalModal').classList.add('hidden');
    document.removeEventListener('keydown', Modal._escHandler);
    if (typeof cb === 'function') cb();
  },

  _escHandler(e) {
    if (e.key === 'Escape') Modal.close();
  },

  confirm(msg, onConfirm) {
    Modal.open({
      title: 'Xác nhận',
      body: `<p style="font-size:14px;color:var(--text-secondary);line-height:1.6">${msg}</p>`,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">Hủy</button>
        <button class="btn btn-danger" id="confirmOkBtn">Xác nhận xóa</button>
      `,
    });
    document.getElementById('confirmOkBtn').onclick = () => {
      Modal.close();
      if (typeof onConfirm === 'function') onConfirm();
    };
  },
};
window.Modal = Modal;
