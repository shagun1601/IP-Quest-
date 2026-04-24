document.addEventListener('DOMContentLoaded', async () => {
  await fetchLeaderboard();
});

async function fetchLeaderboard() {
  try {
    const res = await api.getLeaderboard(10);
    if(res.success) {
      renderLB(res.data);
    }
  } catch(err) {
    document.getElementById('lb-list').innerHTML = `<div style="padding:20px;text-align:center;color:var(--neon3)">Failed to load leaderboard</div>`;
  }
}

function renderLB(entries) {
  const rClass=['r1','r2','r3']; 
  const rIco=['🥇','🥈','🥉'];
  
  if(entries.length === 0) {
    document.getElementById('lb-list').innerHTML = `<div style="padding:20px;text-align:center;">No players yet. Be the first!</div>`;
    return;
  }

  document.getElementById('lb-list').innerHTML=entries.map((e,i)=>`
    <div class="lb-row">
      <div class="lb-rank ${rClass[i]||''}">${i<3?rIco[i]:i+1}</div>
      <div class="lb-avatar">${i<3?'👑':'⭐'}</div>
      <div><div class="lb-name">${e.name}</div><div class="lb-school">${e.school || 'Unknown School'}</div></div>
      <div class="lb-xp">${e.xp} XP</div>
    </div>`).join('');
}
