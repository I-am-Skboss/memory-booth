
// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved user preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
} else {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'dark');
    }
}

// Function to update canvas colors based on theme
function getThemeColors() {
    const isDark = body.getAttribute('data-theme') === 'dark';
    return {
        // Base color for lines (will be manipulated for opacity)
        line: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
    };
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// --- Interactive Background (Particles) ---
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

// Size canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
}
// Adjust radius for interaction
if (mouse.radius < 100) mouse.radius = 100;
if (mouse.radius > 150) mouse.radius = 150;


window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = ((canvas.height / 80) * (canvas.width / 80));
    if (mouse.radius < 100) mouse.radius = 100;
    init();
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
})

// Gen Z / Neon Palette for Particles
const colors = [
    '#ccff00', // Acid Green
    '#2563eb', // Electric Blue
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ff4d4d'  // Red/Orange
];

// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);

        ctx.save();
        ctx.globalAlpha = 0.4; // Low opacity for regular draw
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    // Check particle position, check mouse position, move the particle, draw the particle
    update() {
        // Check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Check collision detection - Mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Interaction: Push away from mouse
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;

        // Draw particle
        this.draw();
    }
}

// Create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1; // Speed
        let directionY = (Math.random() * 2) - 1;

        // Assign random color from palette
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect particles
function connect() {
    let opacityValue = 1;
    let themeColors = getThemeColors();

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);

                // Low opacity connection lines
                ctx.strokeStyle = themeColors.line.replace('0.05', opacityValue * 0.05);
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}


// Start Background
init();
animate();


// --- Existing Site Logic ---

// Scroll Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .section-header h2, .about p, .hero-content').forEach(el => {
    el.classList.add('fade-in-section');
    observer.observe(el);
});

// Glitch Text Hover Effect
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const h1 = document.querySelector('h1');

if (h1) {
    h1.onmouseover = event => {
        let iteration = 0;
        const interval = setInterval(() => {
            event.target.innerText = event.target.innerText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return event.target.dataset.text[index];
                    }
                    if (event.target.dataset.text[index] === " ") return " ";
                    return letters[Math.floor(Math.random() * 26)]
                })
                .join("");

            if (iteration >= event.target.dataset.text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);
    }
}
// --- Dynamic Projects Loader & Static Fallback Validator ---
async function loadProjects() {
    let slugs = ['boltex', 'mojiboom', 'restrauntpro', 'sportizen', 'anuvaish-creations', 'makeup-artist', 'dance-academy'];

    try {
        const manifestRes = await fetch('projects/manifest.json');
        if (manifestRes.ok) {
            const manifestData = await manifestRes.json();
            if (Array.isArray(manifestData) && manifestData.length > 0) {
                slugs = manifestData;
            }
        }
    } catch (e) {
        // Fallback to default slugs if manifest fetch fails (e.g., local file://)
    }

    const projects = [];

    for (const slug of slugs) {
        try {
            const res = await fetch(`projects/${slug}/project.json`);
            if (!res.ok) continue; // Folder or project.json missing
            const data = await res.json();
            data.folder = slug;
            projects.push(data);
        } catch (e) {
            // Skip missing project
        }
    }

    // If fetch failed completely (e.g., file:// protocol), keep static HTML
    if (projects.length === 0) {
        return;
    }

    // Sort projects by order property
    projects.sort((a, b) => (a.order || 99) - (b.order || 99));

    // 1. Render on Index Page if #projects-grid exists
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
        renderProjectCards(projectsGrid, projects);
    }

    // 2. Render Footer Links if .footer-links exists
    const footerLinks = document.querySelector('.footer-links');
    if (footerLinks) {
        renderFooterLinks(footerLinks, projects);
    }

    // 3. Render Privacy Page if #privacy-sections exists
    const privacySections = document.getElementById('privacy-sections');
    const policyNav = document.getElementById('policy-nav');
    if (privacySections) {
        renderPrivacyPage(privacySections, policyNav, projects);
    }
}

function renderProjectCards(container, projects) {
    container.innerHTML = '';
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card project-card fade-in-section';

        let bannerHtml = '';
        if (project.bannerImage) {
            const bannerClass = project.bannerClass ? ` ${project.bannerClass}` : '';
            bannerHtml = `
                <div class="project-card-banner${bannerClass}">
                    <img src="projects/${project.folder}/${project.bannerImage}" alt="${project.name} Banner">
                </div>
            `;
        } else if (project.bannerGradient) {
            bannerHtml = `
                <div class="project-card-banner" style="background: ${project.bannerGradient}; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center; color: #fff; padding: 2rem;">
                        <span style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em; background: ${project.bannerTextColor || 'currentColor'}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${project.bannerText || project.name}</span>
                        ${project.bannerSubtext ? `<p style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.25rem;">${project.bannerSubtext}</p>` : ''}
                    </div>
                </div>
            `;
        }

        let iconHtml = '';
        if (project.iconImage) {
            iconHtml = `<img src="projects/${project.folder}/${project.iconImage}" alt="${project.name} Icon" class="project-card-icon">`;
        }

        let primaryCtaHtml = '';
        if (project.primaryAction) {
            primaryCtaHtml = `<a href="${project.primaryAction.url}" target="${project.primaryAction.target || '_self'}" class="cta-button">${project.primaryAction.text}</a>`;
        }

        let privacyCtaHtml = '';
        if (project.privacyPolicy) {
            privacyCtaHtml = `<a href="privacy.html#${project.id}" class="cta-button secondary">Privacy Policy</a>`;
        }

        card.innerHTML = `
            ${bannerHtml}
            <div class="project-card-content">
                <div class="project-card-header">
                    ${iconHtml}
                    <div class="project-card-title-group">
                        <h3>${project.name}</h3>
                        ${project.tagline ? `<p class="tagline">${project.tagline}</p>` : ''}
                    </div>
                </div>
                <p class="description">${project.description || ''}</p>
                <div class="project-card-ctas">
                    ${primaryCtaHtml}
                    ${privacyCtaHtml}
                </div>
            </div>
        `;

        container.appendChild(card);
        if (typeof observer !== 'undefined') {
            observer.observe(card);
        }
    });
}

function renderFooterLinks(container, projects) {
    let linksHtml = '';
    projects.forEach((project, idx) => {
        const marginLeft = idx > 0 ? ' style="margin-left: 20px;"' : '';
        if (project.privacyPolicy) {
            linksHtml += `<a href="privacy.html#${project.id}"${marginLeft}>${project.name} Privacy Policy</a>`;
        } else if (project.primaryAction && project.primaryAction.url) {
            const targetAttr = project.primaryAction.target ? ` target="${project.primaryAction.target}"` : '';
            linksHtml += `<a href="${project.primaryAction.url}"${targetAttr}${marginLeft}>${project.name}</a>`;
        }
    });
    linksHtml += `<a href="#legal" style="margin-left: 20px;">Legal</a>`;
    container.innerHTML = linksHtml;
}

async function renderPrivacyPage(sectionsContainer, navContainer, projects) {
    sectionsContainer.innerHTML = '';
    if (navContainer) navContainer.innerHTML = '';

    const projectsWithPrivacy = projects.filter(p => p.privacyPolicy);

    for (let i = 0; i < projectsWithPrivacy.length; i++) {
        const project = projectsWithPrivacy[i];

        if (navContainer) {
            const navLink = document.createElement('a');
            navLink.href = `#${project.id}`;
            navLink.className = 'policy-nav-link';
            navLink.textContent = `${project.name} Privacy Policy`;
            navContainer.appendChild(navLink);
        }

        try {
            const res = await fetch(`projects/${project.folder}/${project.privacyPolicy}`);
            if (!res.ok) continue;
            const htmlSnippet = await res.text();

            const privacyDiv = document.createElement('div');
            privacyDiv.className = 'privacy-container';
            privacyDiv.id = project.id;
            privacyDiv.innerHTML = htmlSnippet;

            sectionsContainer.appendChild(privacyDiv);

            if (i < projectsWithPrivacy.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'policy-divider';
                sectionsContainer.appendChild(divider);
            }
        } catch (e) {
            console.error(`Failed to load privacy policy for ${project.id}:`, e);
        }
    }
}

// Automatic Card & Footer Link Visibility Toggle based on Image/Folder Existence
function validateProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const imgs = card.querySelectorAll('img');
        if (imgs.length === 0) return;

        imgs.forEach(img => {
            function updateVisibility() {
                const isBroken = img.complete && img.naturalWidth === 0;
                const link = card.querySelector('a[href*="projects/"]');
                let folderSlug = null;
                if (link) {
                    const match = link.getAttribute('href').match(/projects\/([^\/]+)/);
                    if (match) folderSlug = match[1];
                }

                if (isBroken) {
                    card.style.display = 'none';
                    if (folderSlug) {
                        document.querySelectorAll(`.footer-links a[href*="${folderSlug}"]`).forEach(fl => {
                            fl.style.display = 'none';
                        });
                    }
                } else {
                    card.style.display = '';
                    if (folderSlug) {
                        document.querySelectorAll(`.footer-links a[href*="${folderSlug}"]`).forEach(fl => {
                            fl.style.display = '';
                        });
                    }
                }
            }

            img.addEventListener('load', updateVisibility);
            img.addEventListener('error', updateVisibility);

            if (img.complete) {
                updateVisibility();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    validateProjectCards();
});

