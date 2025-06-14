// 爱心飘落动画
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');
let hearts = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
function randomHeart() {
  return {
    x: Math.random() * canvas.width,
    y: -20,
    size: 16 + Math.random() * 16,
    speed: 1 + Math.random() * 2,
    alpha: 0.7 + Math.random() * 0.3,
    swing: Math.random() * 2 * Math.PI,
    swingSpeed: 0.01 + Math.random() * 0.02
  };
}
function drawHeart(x, y, size, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
  ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.8, x, y + size);
  ctx.bezierCurveTo(x, y + size * 0.8, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
  ctx.fillStyle = '#e25555';
  ctx.fill();
  ctx.restore();
}
function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (hearts.length < 30 && Math.random() < 0.3) {
    hearts.push(randomHeart());
  }
  for (let i = 0; i < hearts.length; i++) {
    let h = hearts[i];
    h.y += h.speed;
    h.x += Math.sin(h.swing) * 0.8;
    h.swing += h.swingSpeed;
    drawHeart(h.x, h.y, h.size, h.alpha);
  }
  hearts = hearts.filter(h => h.y < canvas.height + 30);
  requestAnimationFrame(animateHearts);
}
animateHearts();

// 动态祝福语切换
const blessings = [
  '亲爱的爸爸，祝您父亲节快乐，健康幸福每一天！',
  '感谢您的陪伴与教导，愿您笑口常开，心想事成！',
  '爸爸，您辛苦了，愿您永远年轻，幸福安康！',
  '父爱如山，愿您平安喜乐，万事顺意！',
  '愿时光慢些走，愿爸爸永远健康快乐！',
  '爸爸，您的爱是我最坚强的后盾，节日快乐！'
];
let blessingIndex = 0;
function showBlessing() {
  document.getElementById('blessing').textContent = blessings[blessingIndex];
}
function nextBlessing() {
  blessingIndex = (blessingIndex + 1) % blessings.length;
  showBlessing();
}
showBlessing();

// 留言功能（本地存储）
function getMessages() {
  return JSON.parse(localStorage.getItem('dad-messages') || '[]');
}
function saveMessages(msgs) {
  localStorage.setItem('dad-messages', JSON.stringify(msgs));
}
function renderMessages() {
  const list = document.getElementById('messageList');
  list.innerHTML = '';
  const msgs = getMessages();
  msgs.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = msg;
    list.appendChild(li);
  });
}
function addMessage() {
  const input = document.getElementById('messageInput');
  const val = input.value.trim();
  if (val) {
    const msgs = getMessages();
    msgs.unshift(val);
    saveMessages(msgs.slice(0, 10)); // 最多显示10条
    renderMessages();
    input.value = '';
  }
  return false;
}
renderMessages();

// 轮播图功能（自动播放+切换动画）
const photoList = [
  '1.jpg','2.jpg','3.kpg.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.jpg','12.jpg'
];
let photoIndex = 0;
let carouselTimer = null;
function showPhoto(anim = true) {
  const img = document.getElementById('carousel-img');
  if (anim) {
    img.classList.remove('show');
    img.classList.add('hide');
    setTimeout(() => {
      img.src = photoList[photoIndex];
      img.classList.remove('hide');
      img.classList.add('show');
    }, 300);
  } else {
    img.src = photoList[photoIndex];
    img.classList.add('show');
  }
  // 指示器
  const indicator = document.getElementById('carousel-indicator');
  indicator.innerHTML = photoList.map((_, i) => `<span class='${i===photoIndex?"active":""}'></span>`).join('');
}
function prevPhoto() {
  photoIndex = (photoIndex - 1 + photoList.length) % photoList.length;
  showPhoto();
  resetCarouselTimer();
}
function nextPhoto() {
  photoIndex = (photoIndex + 1) % photoList.length;
  showPhoto();
  resetCarouselTimer();
}
function autoPlayCarousel() {
  carouselTimer = setInterval(() => {
    nextPhoto();
  }, 3000);
}
function resetCarouselTimer() {
  if (carouselTimer) clearInterval(carouselTimer);
  autoPlayCarousel();
}
showPhoto(false);
autoPlayCarousel();

// 父亲节倒计时
function updateCountdown() {
  // 下一个父亲节（每年6月的第三个星期日）
  const now = new Date();
  let year = now.getFullYear();
  let fathersDay = getFathersDay(year);
  if (now > fathersDay) fathersDay = getFathersDay(year+1);
  const diff = fathersDay - now;
  const days = Math.ceil(diff/1000/60/60/24);
  document.getElementById('countdown').textContent = `距离下一个父亲节还有 ${days} 天`;
}
function getFathersDay(year) {
  // 6月1日是星期几
  const d = new Date(year,5,1);
  const firstDay = d.getDay();
  // 第一个星期日是几号
  const firstSunday = firstDay===0 ? 1 : 8-firstDay;
  // 第三个星期日
  return new Date(year,5,firstSunday+14);
}
updateCountdown();
setInterval(updateCountdown, 1000*60*60); // 每小时刷新

// 背景音乐功能
let music;
let isMusicPlaying = false;
document.addEventListener('DOMContentLoaded', function() {
  music = document.createElement('audio');
  music.src = 'https://www.w3school.com.cn/i/song.mp3'; // 官方测试BGM，兼容性好
  music.loop = true;
  music.volume = 0.5;
  document.body.appendChild(music);
});
function toggleMusic() {
  if (!music) return;
  if (isMusicPlaying) {
    music.pause();
    isMusicPlaying = false;
    document.getElementById('music-btn').textContent = '🎵';
  } else {
    music.play();
    isMusicPlaying = true;
    document.getElementById('music-btn').textContent = '⏸️';
  }
}

// 主题切换功能
let isDark = false;
function toggleTheme() {
  isDark = !isDark;
  if (isDark) {
    document.body.classList.add('dark-theme');
    document.getElementById('theme-btn').textContent = '☀️';
  } else {
    document.body.classList.remove('dark-theme');
    document.getElementById('theme-btn').textContent = '🌙';
  }
}

// 电子贺卡下载功能（简单截图主插画和祝福语）
function generateCard() {
  const blessing = encodeURIComponent(document.getElementById('blessing').textContent);
  window.open('card.html?blessing=' + blessing, '_blank');
}

// 彩蛋弹窗功能
function showEgg() {
  alert('🎉 你发现了彩蛋！祝老爸父亲节快乐，健康幸福！——王琪皓祝 🎉');
}