// Global state mirror from backend
let S = { xp: 0, games: 0, correct: 0, name: 'IP Explorer', email: '', school: '', ach: [] };

const LEVELS = [
  {min:0,   label:'Beginner',   icon:'🎓'},
  {min:200, label:'Apprentice', icon:'📚'},
  {min:500, label:'Scholar',    icon:'⭐'},
  {min:900, label:'Expert',     icon:'🏅'},
  {min:1400,label:'Master',     icon:'👑'},
];

function currentLevel(){ 
  for(let i=LEVELS.length-1; i>=0; i--) {
    if(S.xp >= LEVELS[i].min) return LEVELS[i]; 
  }
  return LEVELS[0]; 
}

// UI Helpers
function gotoSection(id){ document.getElementById(id).scrollIntoView({behavior:'smooth'}); }

function openModal(id){
  const el = document.getElementById(id);
  if(el) {
    el.classList.add('active');
    document.body.style.overflow='hidden';
  }
}

function closeModal(id){
  const el = document.getElementById(id);
  if(el) {
    el.classList.remove('active');
    document.body.style.overflow='';
  }
}

// Close modal when clicking overlay background
document.querySelectorAll('.modal-overlay').forEach(overlay=>{
  overlay.addEventListener('click', e=>{
    if(e.target === overlay) closeModal(overlay.id);
  });
});

function shuffle(a){ return [...a].sort(()=>Math.random()-.5); }

function toast(msg, type='t-ok'){
  let container = document.getElementById('toasts');
  if(!container) {
    container = document.createElement('div');
    container.id = 'toasts';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = msg;
  container.appendChild(t);
  setTimeout(()=>{ 
    t.style.opacity = '0'; 
    t.style.transition = 'opacity .4s'; 
    setTimeout(()=>t.remove(), 400); 
  }, 3200);
}

// Background stars
function createStars(){
  const c = document.getElementById('stars');
  if(!c) return;
  for(let i=0; i<80; i++){
    const d = document.createElement('div'); d.className='star';
    const s = Math.random()*2+1;
    d.style.cssText = `width:${s}px;height:${s}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-delay:${Math.random()*3}s;animation-duration:${2+Math.random()*3}s`;
    c.appendChild(d);
  }
}

// Initialize session state from token
async function initSession() {
  const token = localStorage.getItem('ipq_token');
  if (token) {
    const res = await api.getMe();
    if (res.success) {
      const user = res.data;
      S.name = user.name;
      S.email = user.email;
      S.school = user.school;
      S.xp = user.xp;
      S.games = user.gamesPlayed;
      S.correct = user.correctAnswers;
      S.ach = user.achievements || [];
      
      // Update UI for logged-in user
      const authLinks = document.getElementById('auth-links');
      if (authLinks) {
        authLinks.innerHTML = `
          <a href="learn.html">📖 Learn</a>
          <a href="dashboard.html">🎮 Dashboard</a>
          <a href="leaderboard.html">🏆 Leaderboard</a>
          <a class="nav-btn" href="#" onclick="logout()">Logout</a>
        `;
      }
    } else {
      localStorage.removeItem('ipq_token');
    }
  }
}

function logout() {
  localStorage.removeItem('ipq_token');
  window.location.href = 'index.html';
}

// Theme Toggle
function setupTheme() {
  const savedTheme = localStorage.getItem('ipq_theme') || 'dark';
  if (savedTheme === 'light') document.body.classList.add('light-mode');

  const nav = document.querySelector('nav');
  if (nav) {
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.innerHTML = savedTheme === 'light' ? '🌙' : '☀️';
    btn.style.cssText = 'background:transparent;border:none;font-size:1.4rem;cursor:pointer;margin-left:auto;margin-right:20px;transition:transform 0.2s;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.2));';
    btn.title = "Toggle Light/Dark Mode";
    btn.onclick = () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('ipq_theme', isLight ? 'light' : 'dark');
      btn.innerHTML = isLight ? '🌙' : '☀️';
      btn.style.transform = 'scale(0.8)';
      setTimeout(() => btn.style.transform = 'scale(1)', 150);
    };
    
    // Insert before the nav-links container so it sits nicely in the header
    const navLinks = nav.querySelector('.nav-links');
    if (navLinks) {
      nav.insertBefore(btn, navLinks);
    } else {
      nav.appendChild(btn);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  createStars();
  initSession();
});
