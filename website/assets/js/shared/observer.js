/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — Scroll Reveal IntersectionObserver Controller
   ════════════════════════════════════════════════════════════════ */

export const scrollObserver = {
  observer: null,

  init(options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15,
      ...options
    };

    this.observer = new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          // Trigger animations specifically if element has custom callbacks
          if (entry.target.dataset.onReveal) {
            this.executeCallback(entry.target.dataset.onReveal, entry.target);
          }
          
          self.unobserve(entry.target); // Trigger only once
        }
      });
    }, defaultOptions);

    this.scan();
  },

  scan() {
    if (!this.observer) return;
    const items = document.querySelectorAll('[data-reveal]');
    items.forEach(item => {
      this.observer.observe(item);
    });
  },

  callbacks: {},

  registerCallback(name, fn) {
    this.callbacks[name] = fn;
  },

  executeCallback(name, element) {
    if (typeof this.callbacks[name] === 'function') {
      this.callbacks[name](element);
    }
  }
};
