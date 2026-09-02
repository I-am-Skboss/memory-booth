/**
 * ATELIER AURA — PORTFOLIO GALLERY & PROJECT DETAIL MODAL
 * Handles Category Filtering, Responsive Masonry Display, and Dynamic Detail Modal
 */

// Portfolio Projects Database
const portfolioData = {
  'project-1': {
    title: 'The Alabaster Glow · Vogue Editorial',
    category: 'Editorial',
    categoryLabel: 'Editorial & Haute Couture',
    mainImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=85',
    client: 'Vogue Australia / Fashion Collective',
    year: '2026',
    services: 'Creative Direction, Airbrush Complexion, Monochromatic Glow',
    palette: 'Warm Taupe, Alabaster Sheen, Glazed Nude',
    description: 'An ethereal exploration of negative space and radiant glass-skin texture captured under natural diffuse daylight. Crafted for the Spring Haute Couture visual issue.',
    testimonial: '"Atelier Aura elevated every frame with an unmistakable Parisian minimalism that lived breathlessly on film."'
  },
  'project-2': {
    title: 'Couture Reverie · Botanical Wedding',
    category: 'Bridal',
    categoryLabel: 'Bespoke Bridal Couture',
    mainImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    client: 'Private Estate Wedding, Yarra Valley',
    year: '2026',
    services: 'Bridal Artistry, Entourage Styling, Veil Calibration',
    palette: 'Champagne Shimmer, Rose Quartz, Velvet Cocoa',
    description: 'A bespoke modern bridal aesthetic designed to withstand 14 hours of celebration, transitions seamlessly from afternoon garden light to candlelit ballroom reception.',
    testimonial: '"My skin felt weightless yet looked immaculate in every single 8K photograph. Truly the pinnacle of luxury artistry."'
  },
  'project-3': {
    title: 'Lumière d’Automne · Runway Preview',
    category: 'Campaign',
    categoryLabel: 'Fashion Week & Runway',
    mainImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    client: 'Maison Silhouettes Spring/Summer Showcase',
    year: '2026',
    services: 'Lead Key Makeup Artist, 18-Model Backstage Team Lead',
    palette: 'Gilded Bronze, Espresso Liner, High-Gloss Lids',
    description: 'Sculptural cheekbones and hyper-reflective high-points designed under intense runway xenon spotlights. Minimalist structure meets opulent metallic finishes.',
    testimonial: '"Flawless execution backstage under strict 45-minute countdowns. Pure professionalism."'
  },
  'project-4': {
    title: 'Nocturne Gala · VIP Red Carpet',
    category: 'Red Carpet',
    categoryLabel: 'VIP & Red Carpet Concierge',
    mainImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    client: 'National Film Awards Gala',
    year: '2026',
    services: 'On-Location VIP Suite Artistry, Flash-Proof Setting',
    palette: 'Classic Crimson Velvet, Smoked Espresso, Silk Skin',
    description: 'A contemporary interpretation of Old Hollywood glamour. Features a custom hand-mixed crimson lip lacquer and flash-proof soft focus skin perfection.',
    testimonial: '"Not a single touch-up required throughout four hours under 1,000 flashbulbs."'
  },
  'project-5': {
    title: 'Solstice Essence · Beauty Brand Campaign',
    category: 'Campaign',
    categoryLabel: 'Commercial Brand Campaign',
    mainImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85',
    client: 'AURA Botanical Skincare Launch',
    year: '2026',
    services: 'Skincare Prep Artistry, Micro-Texture Retouching',
    palette: 'Honey Nectar, Terracotta Wash, Dewy Satin',
    description: 'A celebration of natural skin grain, subtle freckle enhancement, and organic skincare luminescence for an international brand rollout.',
    testimonial: '"Captured our brand philosophy of unmasked, effortless radiance perfectly."'
  },
  'project-6': {
    title: 'Château Intime · Destination Wedding',
    category: 'Bridal',
    categoryLabel: 'Destination Bridal Artistry',
    mainImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    client: 'Provence Chateau Wedding, France',
    year: '2026',
    services: 'Multi-Day Bridal Concierge, Rehearsal & Gala Looks',
    palette: 'Sun-Kissed Peach, Soft Charcoal, Sheer Rose Gold',
    description: 'An effortless, sun-kissed French Riviera bridal look carefully formulated for warm Mediterranean breezes and golden hour portraits.',
    testimonial: '"Having Atelier Aura travel with us for our destination wedding was the best investment we made."'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Portfolio Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 2. Project Detail Modal Handling
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const modalClose = modal.querySelector('.modal-close');
  const modalImg = modal.querySelector('#modalProjectImage');
  const modalTag = modal.querySelector('#modalProjectTag');
  const modalTitle = modal.querySelector('#modalProjectTitle');
  const modalDesc = modal.querySelector('#modalProjectDesc');
  const modalClient = modal.querySelector('#modalProjectClient');
  const modalYear = modal.querySelector('#modalProjectYear');
  const modalServices = modal.querySelector('#modalProjectServices');
  const modalPalette = modal.querySelector('#modalProjectPalette');
  const modalQuote = modal.querySelector('#modalProjectQuote');
  const modalBookBtn = modal.querySelector('#modalBookSimilarBtn');

  function openProjectModal(projectId) {
    const data = portfolioData[projectId];
    if (!data) return;

    modalImg.src = data.mainImage;
    modalImg.alt = data.title;
    modalTag.textContent = data.categoryLabel;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    modalClient.textContent = data.client;
    modalYear.textContent = data.year;
    modalServices.textContent = data.services;
    modalPalette.textContent = data.palette;
    modalQuote.textContent = data.testimonial;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Attach click listeners to portfolio cards
  portfolioItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = item.getAttribute('data-project-id');
      openProjectModal(projectId);
    });
  });

  // Close triggers
  if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeProjectModal();
    }
  });

  // Modal CTA opens booking modal with pre-selected service
  if (modalBookBtn) {
    modalBookBtn.addEventListener('click', () => {
      closeProjectModal();
      const bookingModal = document.getElementById('bookingModal');
      if (bookingModal) {
        setTimeout(() => {
          bookingModal.classList.add('is-open');
          document.body.style.overflow = 'hidden';
        }, 200);
      }
    });
  }
});
