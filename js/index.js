// ========== YOUTUBE PLAYER ==========
let player;
let isMusicPlaying = false;
const musicBtn = document.getElementById('musicBtn');
const surpriseBtn = document.getElementById('surpriseBtn');

// YouTube IFrame API Ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtubePlayer', {
    height: '1',
    width: '1',
    videoId: '8nTvRXRkb00',
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'loop': 1,
      'playlist': '8nTvRXRkb00',
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  console.log("YouTube player is ready!");
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    player.playVideo();
  }
  if (event.data == YT.PlayerState.PLAYING) {
    isMusicPlaying = true;
    musicBtn.textContent = '🔊';
    musicBtn.style.animation = 'musicPulse 2s ease-in-out infinite';
  }
  if (event.data == YT.PlayerState.PAUSED) {
    isMusicPlaying = false;
    musicBtn.textContent = '🔇';
    musicBtn.style.animation = 'none';
  }
}

// Music control button
musicBtn.addEventListener('click', () => {
  if (!player || !player.playVideo) {
    alert("Player is loading, please wait...");
    return;
  }
  
  if (isMusicPlaying) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
});

// ========== START BUTTON ==========
const startBtn = document.getElementById('startBtn');
const startStage = document.getElementById('startStage');
const birthdayHeader = document.getElementById('birthdayHeader');
const birthdayContent = document.getElementById('birthdayContent');

startBtn.addEventListener('click', () => {
  // Hide start button
  startStage.classList.add('hidden');
  
  // Animate header in
  birthdayHeader.classList.add('show');
  
  // Show content after header animation
  setTimeout(() => {
    birthdayContent.classList.add('show');
  }, 600);
  
  // Start confetti
  startConfetti();
  
  // Show music button and surprise button after 2 seconds
  setTimeout(() => {
    musicBtn.classList.add('show');
    surpriseBtn.classList.add('show');
    
    // Auto play music after user clicked start button
    if (player && player.playVideo) {
      player.playVideo();
    }
  }, 2000);
});

// ========== CONFETTI (both sides, 5 seconds) ==========
const confettiCanvas = document.getElementById('confettiCanvas');
const myConfetti = confetti.create(confettiCanvas, {
  resize: true,
  useWorker: true
});

function startConfetti() {
  const duration = 5000;
  const end = Date.now() + duration;
  const colors = ['#ff6ec7', '#ffa26b', '#ffd166', '#7afcff', '#b28dff', '#88ff5a', '#fcff42'];

  (function frame() {
    myConfetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: colors
    });
    myConfetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// ========== SHOOTING STARS ==========
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateStars();
}

// Static stars
let stars = [];

function generateStars() {
  stars = [];
  const numStars = Math.floor((canvas.width * canvas.height) / 4000);
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.3 + 0.5,
      alpha: Math.random() * 0.6 + 0.4,
      twinkleSpeed: Math.random() * 0.001 + 0.0005
    });
  }
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Shooting stars
const shootingStars = [];

function createShootingStar() {
  const side = Math.floor(Math.random() * 4);
  let startX, startY, angle;
  
  switch(side) {
    case 0:
      startX = Math.random() * canvas.width;
      startY = -50;
      angle = (45 + Math.random() * 90) * Math.PI / 180;
      break;
    case 1:
      startX = canvas.width + 50;
      startY = Math.random() * canvas.height;
      angle = (135 + Math.random() * 90) * Math.PI / 180;
      break;
    case 2:
      startX = Math.random() * canvas.width;
      startY = canvas.height + 50;
      angle = (225 + Math.random() * 90) * Math.PI / 180;
      break;
    case 3:
      startX = -50;
      startY = Math.random() * canvas.height;
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

function animate(time) {
  const dt = 0.016;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  stars.forEach(star => {
    star.alpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * star.twinkleSpeed));
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const star = shootingStars[i];
    star.life += dt;
    star.x += star.vx * dt;
    star.y += star.vy * dt;
    
    star.trail.push({ x: star.x, y: star.y });
    if (star.trail.length > 80) star.trail.shift();
    
    if (star.trail.length > 1) {
      const gradient = ctx.createLinearGradient(
        star.trail[0].x, star.trail[0].y,
        star.x, star.y
      );
      gradient.addColorStop(0, 'rgba(158, 203, 255, 0)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      for (let j = star.trail.length - 1; j >= 0; j--) {
        ctx.lineTo(star.trail[j].x, star.trail[j].y);
      }
      ctx.stroke();
    }
    
    const headGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 12);
    headGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    headGradient.addColorStop(0.5, 'rgba(158, 203, 255, 0.6)');
    headGradient.addColorStop(1, 'rgba(158, 203, 255, 0)');
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    if (star.life > star.maxLife ||
        star.x < -100 || star.x > canvas.width + 100 ||
        star.y < -100 || star.y > canvas.height + 100) {
      shootingStars.splice(i, 1);
    }
  }
  
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

setInterval(() => {
  createShootingStar();
}, 1500 + Math.random() * 1500);

for (let i = 0; i < 3; i++) {
  setTimeout(() => createShootingStar(), i * 400);
}
