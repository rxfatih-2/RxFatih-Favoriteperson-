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
  document.getElementById('photoWrapper').classList.add('show');
  document.getElementById('heroText').classList.add('show');
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal, .timeline-item, blockquote');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.15 });
revealElements.forEach(el => revealObserver.observe(el));

// ===== BACKSOUND AUTOPLAY =====
const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.5;

// Cek apakah elemen audio ketemu
console.log('🎵 Elemen audio:', bgMusic);
console.log('🎵 Sumber MP3:', bgMusic.querySelector('source')?.src);

// Fungsi play musik
function playMusic() {
  const playPromise = bgMusic.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log('✅ Musik berhasil diputar!');
      })
      .catch(err => {
        console.log('❌ Gagal play:', err.name, '-', err.message);
      });
  }
}

// Coba play saat halaman load
window.addEventListener('load', playMusic);
window.addEventListener('DOMContentLoaded', playMusic);
document.addEventListener('click', playMusic, { once: true });
document.addEventListener('touchstart', playMusic, { once: true });
document.addEventListener('scroll', playMusic, { once: true });
document.addEventListener('keydown', playMusic, { once: true });

// Cek status audio setiap 2 detik
setInterval(() => {
  console.log('📊 Status musik → paused:', bgMusic.paused, '| currentTime:', bgMusic.currentTime.toFixed(2), '| readyState:', bgMusic.readyState);
}, 2000);
