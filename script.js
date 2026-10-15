// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== HERO ANIMATION ON LOAD =====
window.addEventListener('load', () => {
  document.getElementById('heroText').classList.add('show');
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal, blockquote');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== BACKGROUND MUSIC AUTOPLAY =====
const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.5;

console.log('🎵 Audio element:', bgMusic);

function playMusic() {
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => console.log('✅ Music is playing!'))
      .catch(err => console.log('❌ Failed to play:', err.name, '-', err.message));
  }
}

// Try to play on page load
window.addEventListener('load', playMusic);
document.addEventListener('DOMContentLoaded', playMusic);

// Fallback: play on first user interaction
['click', 'touchstart', 'scroll', 'keydown', 'mousemove'].forEach(evt => {
  document.addEventListener(evt, playMusic, { once: true, passive: true });
});

// ===== LIGHTBOX (CLICK PHOTO TO ENLARGE) =====
const galeriItems = document.querySelectorAll('.galeri-item');

galeriItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.overlay span').textContent;

    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <span class="lightbox-close">&times;</span>
        <img src="${img.src}" alt="${caption}">
        <p>${caption}</p>
      </div>
    `;
    document.body.appendChild(lightbox);

    // Animate in
    requestAnimationFrame(() => lightbox.classList.add('show'));

    // Close lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('show');
      setTimeout(() => lightbox.remove(), 300);
    };

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        closeLightbox();
      }
    });

    // Close with ESC
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeLightbox();
        document.removeEventListener('keydown', escHandler);
      }
    });
  });
});

// ===== LIGHTBOX CSS (AUTO-INJECT) =====
const lightboxStyle = document.createElement('style');
lightboxStyle.textContent = `
  .lightbox {
    position: fixed;
    inset: 0;
    background: rgba(74, 44, 94, 0.95);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 20px;
  }
  .lightbox.show { opacity: 1; }
  .lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    text-align: center;
  }
  .lightbox-content img {
    max-width: 100%;
    max-height: 75vh;
    border-radius: 15px;
    border: 4px solid #fff;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    transform: scale(0.8);
    transition: transform 0.4s ease;
  }
  .lightbox.show .lightbox-content img {
    transform: scale(1);
  }
  .lightbox-content p {
    color: #fff;
    margin-top: 15px;
    font-size: 1.2rem;
    font-weight: 600;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }
  .lightbox-close {
    position: absolute;
    top: -50px;
    right: 0;
    color: #fff;
    font-size: 40px;
    cursor: pointer;
    line-height: 1;
    transition: transform 0.3s ease;
  }
  .lightbox-close:hover {
    transform: rotate(90deg) scale(1.2);
    color: #ff8fc7;
  }
`;
document.head.appendChild(lightboxStyle);
