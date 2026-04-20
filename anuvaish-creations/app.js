// ===== Page Navigation =====
function showPage(name) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Deactivate all nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show target page
  document.getElementById('page-' + name).classList.add('active');
  // Activate nav item
  const navBtn = document.getElementById('nav-' + name);
  if (navBtn) navBtn.classList.add('active');

  // Scroll to top
  window.scrollTo(0, 0);
  document.getElementById('page-' + name).scrollTop = 0;
}

// ===== Contact Form =====
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  if (!name || !email) {
    alert('Please fill in your name and email.');
    return;
  }
  alert('Thank you, ' + name + '! We will get back to you shortly.');
  this.reset();
});

// ===== Trust Bar auto-scroll animation =====
(function() {
  const bar = document.querySelector('.trust-bar');
  if (!bar) return;
  let pos = 0;
  // Only animate if content overflows (mobile)
  function tick() {
    if (bar.scrollWidth > bar.clientWidth) {
      pos += 0.5;
      if (pos >= bar.scrollWidth / 2) pos = 0;
      bar.scrollLeft = pos;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ===== Wishlist toggle =====
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('dblclick', function() {
    this.style.outline = '2px solid #D4AF37';
    setTimeout(() => { this.style.outline = ''; }, 400);
  });
});
