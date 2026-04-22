const ACH=[
  {id:'first',   icon:'🎯',name:'First Steps',    desc:'Complete your first game', xp:50},
  {id:'correct5',icon:'📝',name:'Quiz Rookie',     desc:'Get 5+ correct answers total', xp:75},
  {id:'match',   icon:'🔗',name:'Connector',       desc:'Complete Match the Rights', xp:100},
  {id:'xp200',   icon:'⭐',name:'Rising Star',     desc:'Earn 200+ total XP', xp:50},
  {id:'xp500',   icon:'🌟',name:'IP Scholar',      desc:'Earn 500+ total XP', xp:100},
  {id:'scenario',icon:'🌍',name:'Real World Hero', desc:'Complete all 6 scenarios', xp:125},
  {id:'master',  icon:'👑',name:'IP Master',       desc:'Reach Master level (1400+ XP)', xp:200},
  {id:'games5',  icon:'🔥',name:'On Fire',         desc:'Play 5 games total', xp:75},
];

document.addEventListener('DOMContentLoaded', async () => {
  if(!localStorage.getItem('ipq_token')) {
    window.location.href = 'login.html';
    return;
  }
  
  // Wait for initSession to complete
  setTimeout(() => {
    updateProfileUI();
    renderAch();
  }, 500);
});

function updateProfileUI(){
  const lvl=currentLevel();
  const idx=LEVELS.indexOf(lvl);
  const nextLvl=LEVELS[idx+1]||{min:S.xp,label:'MAX'};
  const range=nextLvl.min-lvl.min; const done=S.xp-lvl.min;
  const pct=range>0?Math.min(100,Math.round(done/range*100)):100;

  document.getElementById('profileName').textContent=S.name;
  document.getElementById('profileLevel').textContent=`${lvl.icon} Level ${idx+1} — ${lvl.label}`;
  document.getElementById('profileAvatar').textContent=lvl.icon;
  document.getElementById('statXP').textContent=S.xp;
  document.getElementById('statGames').textContent=S.games;
  document.getElementById('statCorrect').textContent=S.correct;
  document.getElementById('xpLabel').textContent=`${S.xp} / ${nextLvl.min} XP to ${nextLvl.label}`;
  document.getElementById('xpPct').textContent=pct+'%';
  
  setTimeout(()=>document.getElementById('xpFill').style.width=pct+'%',400);
}

function renderAch(){
  const grid = document.getElementById('ach-grid');
  if(!grid) return;
  
  grid.innerHTML=ACH.map(a=>{
    const got=S.ach.includes(a.id);
    return`<div class="ach-card ${got?'':'locked'}">
      <span class="ach-icon">${a.icon}</span>
      <div class="ach-name">${a.name}</div>
      <div class="ach-desc">${a.desc}</div>
      <div class="ach-xp">+${a.xp} XP</div>
    </div>`;
  }).join('');
}

/* ── Delete Account Functions ── */
function openDeleteModal() {
  const modal = document.getElementById('deleteModal');
  modal.style.display = 'flex';
  document.getElementById('deleteConfirmEmail').value = '';
  checkDeleteConfirm();
  // Close on background click
  modal.onclick = (e) => { if (e.target === modal) closeDeleteModal(); };
}

function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none';
}

function checkDeleteConfirm() {
  const input = document.getElementById('deleteConfirmEmail').value.trim().toLowerCase();
  const userEmail = (S.email || '').toLowerCase();
  const btn = document.getElementById('confirmDeleteBtn');
  // Allow confirm if email typed matches stored email, OR if email not stored (fallback: any non-empty email)
  const valid = input.length > 0 && (userEmail ? input === userEmail : input.includes('@'));
  btn.disabled = !valid;
  btn.style.opacity = valid ? '1' : '0.5';
  btn.style.cursor = valid ? 'pointer' : 'not-allowed';
  btn.style.background = valid ? 'rgba(244,63,94,0.9)' : 'rgba(244,63,94,0.2)';
  btn.style.color = valid ? '#fff' : '#F43F5E';
  btn.style.borderColor = valid ? '#F43F5E' : 'rgba(244,63,94,0.4)';
}

async function doDeleteAccount() {
  const btn = document.getElementById('confirmDeleteBtn');
  btn.textContent = '⏳ Deleting...';
  btn.disabled = true;
  btn.style.cursor = 'not-allowed';

  try {
    const res = await api.deleteAccount();
    if (res.success) {
      toast('✅ Account deleted successfully. Goodbye!', 't-ok');
      setTimeout(() => {
        localStorage.removeItem('ipq_token');
        localStorage.removeItem('ipq_theme');
        window.location.href = 'index.html';
      }, 1800);
    } else {
      toast('❌ Failed to delete: ' + (res.error || 'Unknown error'), 't-err');
      btn.textContent = '🗑️ Yes, Delete';
      btn.disabled = false;
    }
  } catch (e) {
    toast('❌ Network error. Please try again.', 't-err');
    btn.textContent = '🗑️ Yes, Delete';
    btn.disabled = false;
  }
}
