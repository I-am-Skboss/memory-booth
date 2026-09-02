/**
 * ATELIER AURA — BEFORE / AFTER COMPARISON SLIDER
 * Supports Mouse Drag, Touch Swipe, and Keyboard Accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('comparisonSlider');
  if (!container) return;

  const afterImage = container.querySelector('.comparison-slider-image--after');
  const handle = container.querySelector('.comparison-slider-handle');

  let isDragging = false;
  let currentPercentage = 50; // Initial split at 50%

  function setSliderPosition(percentage) {
    // Constrain percentage between 2% and 98%
    const bounded = Math.max(2, Math.min(98, percentage));
    currentPercentage = bounded;

    // Apply clip path to top image
    afterImage.style.clipPath = `polygon(0 0, ${bounded}% 0, ${bounded}% 100%, 0 100%)`;
    // Move divider handle
    handle.style.left = `${bounded}%`;
  }

  function getPositionFromEvent(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const width = rect.width;
    return (x / width) * 100;
  }

  function onPointerDown(e) {
    isDragging = true;
    container.classList.add('is-dragging');
    setSliderPosition(getPositionFromEvent(e));
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    setSliderPosition(getPositionFromEvent(e));
  }

  function onPointerUp() {
    if (isDragging) {
      isDragging = false;
      container.classList.remove('is-dragging');
    }
  }

  // Mouse Listeners
  container.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  // Touch Listeners
  container.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Keyboard accessibility
  container.setAttribute('tabindex', '0');
  container.setAttribute('role', 'slider');
  container.setAttribute('aria-label', 'Before and After Image Comparison');
  container.setAttribute('aria-valuemin', '0');
  container.setAttribute('aria-valuemax', '100');
  container.setAttribute('aria-valuenow', '50');

  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition(currentPercentage - 4);
      container.setAttribute('aria-valuenow', Math.round(currentPercentage));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition(currentPercentage + 4);
      container.setAttribute('aria-valuenow', Math.round(currentPercentage));
    }
  });

  // Initialize
  setSliderPosition(50);
});
