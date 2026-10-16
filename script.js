/* =========================================================
   FAVORITE PERSON GALLERY — MAIN SCRIPT
   ========================================================= */

/* ---------------------------------------------------------
   1. KONFIGURASI — UBAH DI SINI
   --------------------------------------------------------- */
const CONFIG = {
  // Jumlah total foto
  totalPhotos: 20,

  // Path gambar — pakai folder "Assets" (A kapital)
  photoUrls: [
    'Assets/fq.jpg',
    'Assets/fw.jpg',
    'Assets/fe.jpg',
    'Assets/fr.jpg',
    'Assets/ft.jpg',
    'Assets/fy.jpg',
    'Assets/fu.jpg',
    'Assets/fi.jpg',
    'Assets/fo.jpg',
    'Assets/fa.jpg',
    'Assets/fs.jpg',
    'Assets/fd.jpg',
    'Assets/ff.jpg',
    'Assets/fg.jpg',
    'Assets/fh.jpg',
    'Assets/fj.jpg',
    'Assets/fk.jpg',
    'Assets/fl.jpg',
    'Assets/fz.jpg',
    'Assets/fz.jpg',
  ],

  // Caption untuk tiap foto (opsional, akan di-loop kalau kurang)
  captions: [
    'Beautiful Moment', 'Precious Memory', 'Sweet Smile',
    'Golden Hour', 'Forever Yours', 'Timeless',
    'Radiant', 'Dreamy', 'Sparkling', 'Cherished',
    'Unforgettable', 'Wonderful', 'Graceful', 'Joyful',
    'Stunning', 'Adorable', 'Heavenly', 'Breathtaking',
    'Magical', 'Perfect',
  ],
};

/* ---------------------------------------------------------
   2. GENERATE GALLERY ITEMS
   --------------------------------------------------------- */
(function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < CONFIG.totalPhotos; i++) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.index = i;

    const url = CONFIG.photoUrls[i];
    const caption = CONFIG.captions[i % CONFIG.captions.length];
    const num = String(i + 1).padStart(2, '0');

    if (url) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = `Photo ${i + 1} — ${caption}`;
      img.loading = 'lazy';
      img.onerror = function () {
        this.replaceWith(makePlaceholder());
      };
      item.appendChild(img);
    } else {
      item.appendChild(makePlaceholder());
    }

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
      <span class="num">${num}</span>
      <div class="caption">${caption}</div>
    `;
    item.appendChild(overlay);

    item.addEventListener('click', () => {
      if (url) openLightbox(i);
    });

    fragment.appendChild(item);
  }

  grid.appendChild(fragment);
})();

function makePlaceholder() {
  const div = document.createElement('div');
  div.className = 'placeholder';
  div.textContent = '🖼️';
  return div;
}

/* ---------------------------------------------------------
   3. SCROLL REVEAL
   --------------------------------------------------------- */
(function setupReveal() {
  const elements = document.querySelectorAll('.reveal, .gallery-item');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('gallery-item')) {
            const index = Number(entry.target.dataset.index) || 0;
            const delay = (index % 4) * 80;
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, delay);
          } else {
            entry.target.classList.add('active');
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ---------------------------------------------------------
   4. NAVBAR — scroll effect & mobile menu
   --------------------------------------------------------- */
(function setupNavbar() {
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    },
    { passive: true }
  );

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active')
      ? 'hidden'
      : '';
  });

  mobileMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();

/* ---------------------------------------------------------
   5. LIGHTBOX
   --------------------------------------------------------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const url = CONFIG.photoUrls[currentIndex];
  const caption = CONFIG.captions[currentIndex % CONFIG.captions.length];
  if (!url) return;
  lightboxImg.src = url;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = `${String(currentIndex + 1).padStart(2, '0')} · ${caption}`;
}

function nextPhoto() {
  currentIndex = (currentIndex + 1) % CONFIG.totalPhotos;
  let tries = 0;
  while (!CONFIG.photoUrls[currentIndex] && tries < CONFIG.totalPhotos) {
    currentIndex = (currentIndex + 1) % CONFIG.totalPhotos;
    tries++;
  }
  updateLightbox();
}

function prevPhoto() {
  currentIndex =
    (currentIndex - 1 + CONFIG.totalPhotos) % CONFIG.totalPhotos;
  let tries = 0;
  while (!CONFIG.photoUrls[currentIndex] && tries < CONFIG.totalPhotos) {
    currentIndex =
      (currentIndex - 1 + CONFIG.totalPhotos) % CONFIG.totalPhotos;
    tries++;
  }
  updateLightbox();
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', nextPhoto);
lightboxPrev.addEventListener('click', prevPhoto);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextPhoto();
  if (e.key === 'ArrowLeft') prevPhoto();
});

/* ---------------------------------------------------------
   6. BACKSOUND — autoplay + toggle
   --------------------------------------------------------- */
(function setupMusic() {
  const music = document.getElementById('bgMusic');
  const toggle = document.getElementById('musicToggle');
  if (!music || !toggle) return;

  music.volume = 0.5;

  const setPlayingUI = (playing) => {
    toggle.classList.toggle('playing', playing);
    toggle.setAttribute(
      'aria-label',
      playing ? 'Pause music' : 'Play music'
    );
    toggle.title = playing ? 'Pause music' : 'Play music';
  };

  const tryPlay = () => {
    const p = music.play();
    if (p && typeof p.then === 'function') {
      p.then(() => setPlayingUI(true)).catch(() => {
        setPlayingUI(false);
      });
    }
  };

  tryPlay();

  // Fallback: coba lagi saat user interaksi pertama
  const onFirstInteraction = () => {
    if (music.paused) tryPlay();
    document.removeEventListener('click', onFirstInteraction);
    document.removeEventListener('touchstart', onFirstInteraction);
    document.removeEventListener('keydown', onFirstInteraction);
  };
  document.addEventListener('click', onFirstInteraction);
  document.addEventListener('touchstart', onFirstInteraction);
  document.addEventListener('keydown', onFirstInteraction);

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (music.paused) {
      music.play().then(() => setPlayingUI(true));
    } else {
      music.pause();
      setPlayingUI(false);
    }
  });

  music.addEventListener('play', () => setPlayingUI(true));
  music.addEventListener('pause', () => setPlayingUI(false));
})();

/* ---------------------------------------------------------
   7. FOOTER YEAR
   --------------------------------------------------------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   8. SMOOTH SCROLL untuk anchor
   --------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id.length <= 1) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------------------------------------------------------
   9. LOG
   --------------------------------------------------------- */
console.log(
  '%c💜 Favorite Person Gallery',
  'background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;padding:6px 12px;border-radius:8px;font-weight:bold;font-size:14px;',
  '\nMade with love.'
);
