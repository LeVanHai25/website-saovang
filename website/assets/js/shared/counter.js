/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — Stats Counter Animation Controller
   ════════════════════════════════════════════════════════════════ */

export const statsCounter = {
  animate(element) {
    const targetValue = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic function
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * targetValue);

      element.textContent = `${currentValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = `${targetValue}${suffix}`;
      }
    }

    requestAnimationFrame(updateCounter);
  }
};
