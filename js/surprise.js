// ========== SHOOTING STARS BACKGROUND ==========
const starsCanvas = document.getElementById('starsCanvas');
const starsCtx = starsCanvas.getContext('2d');

function resizeStarsCanvas() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
  generateStars();
}

let stars = [];

function generateStars() {
  stars = [];
  const numStars = Math.floor((starsCanvas.width * starsCanvas.height) / 5000);
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      radius: Math.random() * 1.2 + 0.4,
      alpha: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.001 + 0.0005
    });
  }
}

resizeStarsCanvas();
window.addEventListener('resize', resizeStarsCanvas);

const shootingStars = [];

function createShootingStar() {
  const side = Math.floor(Math.random() * 4);
  let startX, startY, angle;
 
  switch(side) {
    case 0:
      startX = Math.random() * starsCanvas.width;
      startY = -50;
      angle = (45 + Math.random() * 90) * Math.PI / 180;
      break;
    case 1:
      startX = starsCanvas.width + 50;
      startY = Math.random() * starsCanvas.height;
      angle = (135 + Math.random() * 90) * Math.PI / 180;
      break;
    case 2:
      startX = Math.random() * starsCanvas.width;
      startY = starsCanvas.height + 50;
      angle = (225 + Math.random() * 90) * Math.PI / 180;
      break;
    case 3:
      startX = -50;
      startY = Math.random() * starsCanvas.height;
      angle = (315 + Math.random() * 90) * Math.PI / 180;
      break;
  }
 
  const speed = 250 + Math.random() * 150;
 
  shootingStars.push({
    x: startX,
    y: startY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 0,
    maxLife: 2.5 + Math.random() * 1.5,
    trail: []
  });
}

function animateStars(time) {
  const dt = 0.016;
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
 
  stars.forEach(star => {
    star.alpha = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(time * star.twinkleSpeed));
    starsCtx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    starsCtx.fill();
  });
 
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const star = shootingStars[i];
    star.life += dt;
    star.x += star.vx * dt;
    star.y += star.vy * dt;
   
    star.trail.push({ x: star.x, y: star.y });
    if (star.trail.length > 80) star.trail.shift();
   
    if (star.trail.length > 1) {
      const gradient = starsCtx.createLinearGradient(
        star.trail[0].x, star.trail[0].y,
        star.x, star.y
      );
      gradient.addColorStop(0, 'rgba(158, 203, 255, 0)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');
     
      starsCtx.strokeStyle = gradient;
      starsCtx.lineWidth = 2;
      starsCtx.beginPath();
      starsCtx.moveTo(star.x, star.y);
      for (let j = star.trail.length - 1; j >= 0; j--) {
        starsCtx.lineTo(star.trail[j].x, star.trail[j].y);
      }
      starsCtx.stroke();
    }
   
    const headGradient = starsCtx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 12);
    headGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    headGradient.addColorStop(0.5, 'rgba(158, 203, 255, 0.6)');
    headGradient.addColorStop(1, 'rgba(158, 203, 255, 0)');
    starsCtx.fillStyle = headGradient;
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, 8, 0, Math.PI * 2);
    starsCtx.fill();
   
    if (star.life > star.maxLife ||
        star.x < -100 || star.x > starsCanvas.width + 100 ||
        star.y < -100 || star.y > starsCanvas.height + 100) {
      shootingStars.splice(i, 1);
    }
  }
 
  requestAnimationFrame(animateStars);
}

requestAnimationFrame(animateStars);

setInterval(() => {
  createShootingStar();
}, 1500 + Math.random() * 1500);

for (let i = 0; i < 3; i++) {
  setTimeout(() => createShootingStar(), i * 400);
}

// ========== BUTTERFLIES (BEHIND SLIDER) ==========
const particlesCanvas = document.getElementById('particlesCanvas');
const particlesCtx = particlesCanvas.getContext('2d');

function resizeParticlesCanvas() {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
}

resizeParticlesCanvas();
window.addEventListener('resize', resizeParticlesCanvas);

// Butterfly class
class Butterfly {
  constructor(side) {
    this.reset(side);
    this.y = Math.random() * particlesCanvas.height;
  }
  
  reset(side) {
    this.side = side || this.side;
    if (this.side === 'left') {
      this.x = -30;
    } else {
      this.x = particlesCanvas.width + 30;
    }
    this.targetY = Math.random() * particlesCanvas.height;
    this.size = Math.random() * 18 + 12;
    this.speedX = (Math.random() * 1.2 + 0.8) * (this.side === 'left' ? 1 : -1);
    this.speedY = (Math.random() - 0.5) * 1.5;
    this.wingPhase = Math.random() * Math.PI * 2;
    this.wingSpeed = Math.random() * 0.12 + 0.08;
    this.hue = Math.random() * 60 + 280;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.wingPhase += this.wingSpeed;
    
    this.y += Math.sin(this.wingPhase * 0.5) * 0.8;
    
    if (this.y < 0 || this.y > particlesCanvas.height) {
      this.speedY *= -1;
    }
    
    if (this.side === 'left' && this.x > particlesCanvas.width) {
      this.reset('left');
    } else if (this.side === 'right' && this.x < 0) {
      this.reset('right');
    }
  }
  
  draw() {
    const wingScale = Math.abs(Math.sin(this.wingPhase));
    
    particlesCtx.save();
    particlesCtx.translate(this.x, this.y);
    
    particlesCtx.shadowBlur = 15;
    particlesCtx.shadowColor = `hsla(${this.hue}, 80%, 70%, 0.8)`;
    
    particlesCtx.fillStyle = `hsla(${this.hue}, 80%, 70%, 0.8)`;
    
    particlesCtx.beginPath();
    particlesCtx.ellipse(-this.size * 0.3, 0, this.size * wingScale, this.size * 0.7, -0.3, 0, Math.PI * 2);
    particlesCtx.fill();
    
    particlesCtx.beginPath();
    particlesCtx.ellipse(this.size * 0.3, 0, this.size * wingScale, this.size * 0.7, 0.3, 0, Math.PI * 2);
    particlesCtx.fill();
    
    particlesCtx.shadowBlur = 5;
    particlesCtx.fillStyle = `hsla(${this.hue - 20}, 60%, 40%, 0.9)`;
    particlesCtx.beginPath();
    particlesCtx.ellipse(0, 0, this.size * 0.15, this.size * 0.5, 0, 0, Math.PI * 2);
    particlesCtx.fill();
    
    particlesCtx.restore();
  }
}

const butterflies = [];

for (let i = 0; i < 12; i++) {
  butterflies.push(new Butterfly('left'));
  butterflies.push(new Butterfly('right'));
}

function animateParticles() {
  particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
  
  butterflies.forEach(butterfly => {
    butterfly.update();
    butterfly.draw();
  });
  
  requestAnimationFrame(animateParticles);
}

// ===== Background Audio =====
const bgAudio = document.getElementById('bgAudio');
const musicBtn = document.getElementById('musicBtn');

// আরামদায়ক ভলিউম
bgAudio.volume = 0.7;

// প্রথম ইউজার ইন্টারঅ্যাকশনে প্লে (অটোপ্লে পলিসি সেফ)
let audioStarted = false;
function startBgAudio() {
  if (audioStarted) return;
  audioStarted = true;
  bgAudio.play().then(() => {
    if (musicBtn) musicBtn.textContent = '🔊';
  }).catch(() => {
    // যদি ব্রাউজার ব্লক করে, বাটনের অবস্থা প্লে দেখাও
    if (musicBtn) musicBtn.textContent = '▶️';
  });
}

// পেজ লোডের পর প্রথম ক্লিক/টাচ/কীপ্রেসে চালু
['click','touchstart','keydown'].forEach(evt => {
  window.addEventListener(evt, startBgAudio, { once:true, passive:true });
});

// বাটন টগল (ঐচ্ছিক)
if (musicBtn) {
  musicBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      if (bgAudio.paused) {
        await bgAudio.play();
        musicBtn.textContent = '🔊';
      } else {
        bgAudio.pause();
        musicBtn.textContent = '▶️';
      }
    } catch (err) {
      // অনুমতি চাইতে হতে পারে
      alert('Please allow audio to play');
    }
  });
}

animateParticles();

// ========== ENHANCED 3D COVERFLOW SWIPER SLIDER ==========
const swiper = new Swiper('.swiper', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 45,
    stretch: 0,
    depth: 350,
    modifier: 1.5,
    slideShadows: true,
  },
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  speed: 1200,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
