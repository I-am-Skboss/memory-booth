/**
 * ATELIER AURA — BOOKING CONSULTATION & INQUIRY MODAL
 * Handles Modal Triggers, Date Constraints, Validation, and Confirmation Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  const bookingModal = document.getElementById('bookingModal');
  if (!bookingModal) return;

  const modalClose = bookingModal.querySelector('.modal-close');
  const bookingForm = document.getElementById('bookingForm');
  const dateInput = document.getElementById('eventDate');

  // Set minimum date to tomorrow
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  function openBookingModal(preselectedService = null) {
    if (preselectedService) {
      const serviceSelect = document.getElementById('serviceSelect');
      if (serviceSelect) {
        serviceSelect.value = preselectedService;
      }
    }
    bookingModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    bookingModal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Find all triggers with data-booking-trigger
  const triggers = document.querySelectorAll('[data-booking-trigger]');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = trigger.getAttribute('data-service');
      openBookingModal(serviceName);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeBookingModal);
  }

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      closeBookingModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('is-open')) {
      closeBookingModal();
    }
  });

  // Handle Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Show submitting state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; display: inline-block;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Securing Concierge...</span>
      `;

      // Simulate luxury concierge API submission
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        bookingForm.reset();
        closeBookingModal();

        // Show Luxury Toast Confirmation
        window.showToast(
          'Inquiry Received',
          'Our artistry director will review your event date and contact you within 24 hours with a personalized proposal.'
        );
      }, 1100);
    });
  }

  // Newsletter Form Handler in Footer
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        input.value = '';
        window.showToast(
          'Welcome to the AURA Atelier Circle',
          'You are now subscribed to our private seasonal previews and editorial lookbooks.'
        );
      }
    });
  }
});
