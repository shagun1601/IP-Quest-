// Shared submit progress function
async function submitGameProgress(gameType, score, xpEarned, correctAnswers, totalQuestions) {
  if (!localStorage.getItem('ipq_token')) return;
  try {
    const res = await api.saveProgress({ gameType, score, xpEarned, correctAnswers, totalQuestions });
    if (res.success) {
      // Sync local state with backend response
      S.xp = res.data.user.xp;
      S.games = res.data.user.gamesPlayed;
      S.correct = res.data.user.correctAnswers;
      S.ach = res.data.user.achievements;
    }
  } catch(err) {
    console.error("Failed to save progress", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if(!localStorage.getItem('ipq_token')) {
    window.location.href = 'login.html';
    return;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const gameType = urlParams.get('type');
  
  if(gameType) {
    const section = document.getElementById('game-' + gameType);
    if(section) {
      section.classList.add('active');
      if(gameType === 'quiz') startQuiz();
      else if(gameType === 'match') startMatch();
      else if(gameType === 'scenario') startScenario();
      else if(gameType === 'drag') startDrag();
      else if(gameType === 'tf') startTF();
    }
  }
});

// ══════════════════════════════════════════
// GAME 1 — QUIZ
// ══════════════════════════════════════════
const QUIZ=[
  {q:"What does 'copyright' protect?",
   a:"Original creative works like books, music, and art",
   o:["Only computer software","Only inventions","Any idea in your mind","Original creative works like books, music, and art"],
   ex:"Copyright automatically protects original creative works (art, music, writing) as soon as they are created — no registration needed!"},
  {q:"How long does copyright protection last in India?",
   a:"60 years after the author's death",
   o:["10 years","25 years","60 years after the author's death","Forever"],
   ex:"In India, copyright generally lasts the creator's lifetime plus 60 years after death."},
  {q:"A trademark is best described as:",
   a:"A symbol or word that identifies a brand",
   o:["A contract between companies","A government tax","A symbol or word that identifies a brand","A secret recipe"],
   ex:"Trademarks (™, ®) protect brand identity — logos, names, slogans — helping consumers identify the source of products."},
  {q:"Which of these can be patented?",
   a:"A new type of water-purification device",
   o:["A mathematical formula","A song you composed","A new type of water-purification device","The color blue"],
   ex:"Patents protect new inventions — devices, processes, compositions. Abstract ideas and formulas cannot be patented."},
  {q:"What is 'Fair Use' in copyright law?",
   a:"Limited use of copyrighted material without permission for education",
   o:["Paying a fair price","Copying freely from the internet","Limited use of copyrighted material without permission for education","Sharing music with friends"],
   ex:"Fair Use allows limited use of copyrighted material for education, news reporting, and commentary without needing permission."},
  {q:"Which symbol indicates a REGISTERED trademark?",
   a:"®",
   o:["©","™","®","℗"],
   ex:"® means officially registered trademark. ™ is unregistered. © is the copyright symbol. ℗ is for sound recordings."},
  {q:"A trade secret is:",
   a:"Confidential business information that gives a competitive advantage",
   o:["A government-issued number","Confidential business information that gives a competitive advantage","Any secret between two people","A product with a secret price"],
   ex:"Trade secrets are confidential business info (formulas, methods, strategies) that give companies a competitive edge — like Coca-Cola's recipe!"},
  {q:"If you create a drawing, who owns the copyright?",
   a:"You — the creator — automatically",
   o:["The government","Your school","You — the creator — automatically","Whoever sees it first"],
   ex:"You automatically own copyright on your creative work the moment you create it! No registration required."},
  {q:"Which is an example of copyright infringement?",
   a:"Copying a textbook and selling it",
   o:["Writing a book review","Copying a textbook and selling it","Singing a song to yourself","Borrowing a book from a library"],
   ex:"Copying and selling someone else's textbook without permission violates the author's exclusive rights — that's infringement!"},
  {q:"Intellectual Property rights are important because:",
   a:"They encourage innovation and reward creators",
   o:["They make products more expensive","They only benefit large corporations","They encourage innovation and reward creators","They prevent sharing of ideas"],
   ex:"IP rights balance protecting creators' work while encouraging sharing of knowledge — this drives innovation and creativity in society!"},
];

let qIdx=0, qScore=0, qAnswered=false, qQuestions=[], qCorrect=0;

function startQuiz(){
  qQuestions=shuffle(QUIZ);
  qIdx=0; qScore=0; qCorrect=0; qAnswered=false;
  document.getElementById('quiz-results').classList.remove('visible');
  document.getElementById('quiz-play').style.display='block';
  renderQ();
}

function renderQ(){
  const q=qQuestions[qIdx];
  document.getElementById('quizProg').style.width=`${(qIdx/10)*100}%`;
  document.getElementById('qNum').textContent=`Question ${qIdx+1} of 10`;
  document.getElementById('qScore').textContent=qScore;
  document.getElementById('qText').textContent=q.q;
  const fb=document.getElementById('qFeedback');
  fb.className='feedback-box'; fb.style.display='none';
  const nb=document.getElementById('qNextBtn');
  nb.className='next-btn'; nb.style.display='none';
  qAnswered=false;

  document.getElementById('optGrid').innerHTML=shuffle(q.o).map(o=>`
    <button class="option-btn" onclick="pickAnswer(this,'${o.replace(/'/g,"&#39;")}')">${o}</button>
  `).join('');
}

function pickAnswer(btn,chosen){
  if(qAnswered) return;
  qAnswered=true;
  const q=qQuestions[qIdx];
  const btns=document.querySelectorAll('#game-quiz .option-btn');
  btns.forEach(b=>{ b.disabled=true; if(b.textContent===q.a) b.classList.add('correct'); });
  if(chosen!==q.a) btn.classList.add('wrong');
  const isRight=chosen===q.a;
  if(isRight){ qScore+=20; qCorrect++; }
  const fb=document.getElementById('qFeedback');
  fb.className='feedback-box '+(isRight?'good':'bad')+' visible';
  fb.style.display='block';
  fb.innerHTML=(isRight?'✅ Correct! ':'❌ Not quite. ')+q.ex;
  document.getElementById('qScore').textContent=qScore;
  const nb=document.getElementById('qNextBtn');
  nb.className='next-btn visible'; nb.style.display='block';
}

function nextQuestion(){
  qIdx++;
  if(qIdx>=10){ endQuiz(); return; }
  renderQ();
}

async function endQuiz(){
  document.getElementById('quizProg').style.width='100%';
  document.getElementById('quiz-play').style.display='none';
  const res=document.getElementById('quiz-results');
  res.classList.add('visible');
  
  const xp=qScore; // Max 200 XP
  document.getElementById('qResFinal').textContent=qCorrect;
  document.getElementById('qResXP').textContent=xp;
  const emojis=['😅','🙂','😊','🎉','🏆'];
  const msgs=['Keep practising — you\'ll get there!','Good effort! Review what you missed.','Nice work! IP knowledge growing.','Great job! Almost an IP expert!','🏆 Perfect score! You\'re an IP Master!'];
  const i=Math.min(Math.floor(qCorrect/2),4);
  document.getElementById('qResEmoji').textContent=emojis[i];
  document.getElementById('qResMsg').textContent=msgs[i];
  
  await submitGameProgress('quiz', qCorrect, xp, qCorrect, 10);
}

// ══════════════════════════════════════════
// GAME 2 — MATCH
// ══════════════════════════════════════════
const MATCH_DATA=[
  {left:'Copyright ©',  right:'Protects original creative works like books and music'},
  {left:'Trademark ™',  right:'Identifies a brand using logos, names, or slogans'},
  {left:'Patent',       right:'Grants exclusive rights to an invention for 20 years'},
  {left:'Trade Secret', right:'Coca-Cola\'s formula kept confidential for over 100 years'},
  {left:'Fair Use',     right:'Limited use of copyrighted content for education'},
  {left:'Public Domain',right:'Works that are free for anyone to use — no IP protection'},
];

let matchSel=null, matchCount=0;

function startMatch(){
  matchSel=null; matchCount=0;
  document.getElementById('match-results').classList.remove('visible');
  document.getElementById('match-play').style.display='block';
  document.getElementById('matchCount').textContent='0';
  const fb=document.getElementById('matchFB');
  fb.className='feedback-box'; fb.style.display='none';

  const sL=shuffle(MATCH_DATA), sR=shuffle(MATCH_DATA);
  document.getElementById('matchLeft').innerHTML=sL.map((p,i)=>`
    <div class="match-item" data-id="${MATCH_DATA.indexOf(p)}" data-side="L" onclick="matchClick(this)">${p.left}</div>
  `).join('');
  document.getElementById('matchRight').innerHTML=sR.map((p,i)=>`
    <div class="match-item" data-id="${MATCH_DATA.indexOf(p)}" data-side="R" onclick="matchClick(this)">${p.right}</div>
  `).join('');
}

function matchClick(el){
  if(el.classList.contains('matched')) return;
  if(!matchSel){
    matchSel=el; el.classList.add('selected'); return;
  }
  if(matchSel===el){ el.classList.remove('selected'); matchSel=null; return; }
  if(matchSel.dataset.side===el.dataset.side){
    matchSel.classList.remove('selected'); matchSel=el; return;
  }
  const fb=document.getElementById('matchFB');
  if(matchSel.dataset.id===el.dataset.id){
    [matchSel,el].forEach(e=>{e.classList.remove('selected');e.classList.add('matched');});
    matchCount++;
    document.getElementById('matchCount').textContent=matchCount;
    fb.className='feedback-box good visible'; fb.style.display='block';
    fb.textContent='✅ Correct match!';
    if(matchCount===6){
      setTimeout(async ()=>{
        document.getElementById('match-play').style.display='none';
        document.getElementById('match-results').classList.add('visible');
        await submitGameProgress('match', 6, 150, 6, 6);
      },700);
    }
  } else {
    fb.className='feedback-box bad visible'; fb.style.display='block';
    fb.textContent='❌ Not a match — try again!';
    [matchSel,el].forEach(e=>{e.classList.add('flash-wrong');setTimeout(()=>e.classList.remove('flash-wrong'),400);});
  }
  matchSel.classList.remove('selected'); matchSel=null;
}

// ══════════════════════════════════════════
// GAME 3 — SCENARIOS
// ══════════════════════════════════════════
const SCEN=[
  {story:"Riya found a beautiful photo on Google Images. She wants to use it in her school project about climate change.",
   q:"What should Riya do?",
   opts:[
     {t:"Download and use it — it's on the internet, so it's free!",c:false,ex:"Wrong! Images on the internet are still protected by copyright. You must check the license before using any online image."},
     {t:"Check the license. Use only if it's labeled Creative Commons or free-to-use.",c:true,ex:"Correct! Always check the image license. Use platforms like Unsplash, Pexels, or look for Creative Commons licenses."},
     {t:"Ask her friend if it's okay to use.",c:false,ex:"Her friend doesn't own the photo — you need to check with the creator or verify the license yourself!"},
   ]},
  {story:"Karan wrote a hit song for his school talent show. His classmate copied the melody and posted it on social media without telling him.",
   q:"Whose rights were violated?",
   opts:[
     {t:"Nobody's — music is meant to be shared freely.",c:false,ex:"Not quite! Karan automatically owns copyright on his song the moment he creates it."},
     {t:"Karan's copyright, because he owns the song he created.",c:true,ex:"Exactly! Karan has copyright over his original song. His classmate needed permission to copy or post it."},
     {t:"The social media platform owns all content posted on it.",c:false,ex:"The platform didn't create the song — Karan did, so Karan holds the copyright."},
   ]},
  {story:"TechStart company invented a revolutionary new battery that lasts 10x longer. They want to ensure no one else can sell the same battery for 20 years.",
   q:"Which IP protection should they use?",
   opts:[
     {t:"Copyright",c:false,ex:"Copyright protects creative works, not inventions. A patent is the right choice here!"},
     {t:"Trademark",c:false,ex:"Trademark protects brand identity, not inventions."},
     {t:"Patent",c:true,ex:"Correct! A patent protects inventions and gives the company exclusive rights to their battery design for up to 20 years."},
   ]},
  {story:"SpiceWorld restaurant has a secret spice blend that makes their food famous worldwide. They don't want competitors to copy it.",
   q:"What's the best IP protection for this recipe?",
   opts:[
     {t:"Keep it as a Trade Secret and never disclose it.",c:true,ex:"Correct! Trade secrets protect confidential business information indefinitely. This is exactly how Coca-Cola protects its formula!"},
     {t:"Apply for a copyright on the recipe.",c:false,ex:"Copyright protects creative expression, not functional recipes. Trade secrets are much better for recipes!"},
     {t:"Post it publicly online to claim ownership first.",c:false,ex:"Publishing destroys the trade secret! Once it's public, anyone can use it. Keep it confidential!"},
   ]},
  {story:"A student wrote a book report about a novel and quoted two short paragraphs from it to support her analysis of the theme.",
   q:"Is this copyright infringement?",
   opts:[
     {t:"Yes — any use of copyrighted material without paying is illegal.",c:false,ex:"Not true! Fair use allows limited quotation for educational, commentary, and analytical purposes."},
     {t:"No — quoting small parts for analysis likely qualifies as Fair Use.",c:true,ex:"Correct! Quoting small portions for analysis or education is typically covered under 'Fair Use' provisions."},
     {t:"Only if the student paid for the book.",c:false,ex:"Purchasing a book gives you the right to read it, not reproduce it — but Fair Use applies here regardless of purchase."},
   ]},
  {story:"Aarav designed a cool logo and name for his school's science club. He wants to make sure no other club uses the same name and logo.",
   q:"What IP protection should he register?",
   opts:[
     {t:"Patent",c:false,ex:"Patents protect inventions, not logos or names."},
     {t:"Trademark",c:true,ex:"Correct! A trademark protects logos, names, and slogans that identify an organisation or brand."},
     {t:"Trade Secret",c:false,ex:"Trade secrets protect confidential info — logos are public-facing, so trademark is the right protection."},
   ]},
];

let sIdx=0, sScore=0, sCorrect=0, sAnswered=false;

function startScenario(){
  sIdx=0; sScore=0; sCorrect=0; sAnswered=false;
  document.getElementById('scen-results').classList.remove('visible');
  document.getElementById('scen-play').style.display='block';
  renderScen();
}

function renderScen(){
  const s=SCEN[sIdx];
  document.getElementById('scenProg').style.width=`${(sIdx/6)*100}%`;
  document.getElementById('scenNum').textContent=`Scenario ${sIdx+1} of 6`;
  document.getElementById('scenScore').textContent=sScore;
  document.getElementById('scenStory').textContent=s.story;
  document.getElementById('scenQ').textContent=s.q;
  const fb=document.getElementById('scenFB');
  fb.className='feedback-box'; fb.style.display='none';
  const nb=document.getElementById('scenNext');
  nb.className='next-btn'; nb.style.display='none';
  sAnswered=false;

  document.getElementById('scenOpts').innerHTML=s.opts.map((o,i)=>`
    <button class="scen-btn" onclick="pickScen(${i})">${o.t}</button>
  `).join('');
}

function pickScen(i){
  if(sAnswered) return;
  sAnswered=true;
  const s=SCEN[sIdx]; const opt=s.opts[i];
  const btns=document.querySelectorAll('#game-scenario .scen-btn');
  btns.forEach((b,j)=>{ b.disabled=true; if(s.opts[j].c) b.classList.add('correct'); });
  if(!opt.c) btns[i].classList.add('wrong');
  if(opt.c){ sScore+=29; sCorrect++; }
  const fb=document.getElementById('scenFB');
  fb.className='feedback-box '+(opt.c?'good':'bad')+' visible';
  fb.style.display='block';
  fb.innerHTML=opt.ex;
  document.getElementById('scenScore').textContent=sScore;
  const nb=document.getElementById('scenNext');
  nb.className='next-btn visible'; nb.style.display='block';
}

function nextScenario(){
  sIdx++;
  if(sIdx>=6){ endScenario(); return; }
  renderScen();
}

async function endScenario(){
  document.getElementById('scenProg').style.width='100%';
  document.getElementById('scen-play').style.display='none';
  const res=document.getElementById('scen-results');
  res.classList.add('visible');
  
  const xp=sScore; // Max 174 XP
  document.getElementById('scenFinal').textContent=sCorrect;
  document.getElementById('scenXP').textContent=xp;
  const msgs=['Keep learning! Real-world IP can be tricky.','Good try! Review the feedback for each scenario.','Solid understanding of real-world IP!','Excellent! You\'re an IP decision-maker!','🌍 Perfect! Real-world IP Hero!'];
  document.getElementById('scenMsg').textContent=msgs[Math.min(Math.floor(sCorrect*0.85),4)];
  
  await submitGameProgress('scenario', sCorrect, xp, sCorrect, 6);
}

// ══════════════════════════════════════════
// GAME 4 — FILL IN BLANKS
// ══════════════════════════════════════════
const FILL={
  words:['copyright','trademark','patent','trade secret','fair use','infringement','license','public domain'],
  sentences:[
    {before:'A ',blank:'copyright',after:' protects original creative works like books, music, and art automatically.'},
    {before:'The ® symbol means a ',blank:'trademark',after:' is officially registered with the government.'},
    {before:'An inventor can file a ',blank:'patent',after:' to protect their new invention for up to 20 years.'},
    {before:"Coca-Cola's formula has been kept as a ",blank:'trade secret',after:' for over 100 years.'},
    {before:'Using a small part of a book for a school essay may qualify as ',blank:'fair use',after:' under copyright law.'},
    {before:"Using someone's song without permission is called copyright ",blank:'infringement',after:' and can lead to legal action.'},
  ]
};

let fillSelected=null;

function startDrag(){
  fillSelected=null;
  const fb=document.getElementById('dragFB');
  fb.className='feedback-box'; fb.style.display='none';
  document.getElementById('drag-play').style.display='block';
  document.getElementById('drag-results').classList.remove('visible');
  document.getElementById('checkDragBtn').style.display='block';

  document.getElementById('wordBank').innerHTML=FILL.words.map(w=>`
    <div class="word-chip" data-word="${w}" onclick="pickWord(this)">${w}</div>
  `).join('');

  document.getElementById('fillSents').innerHTML=FILL.sentences.map((s,si)=>`
    <div class="fill-row">
      <span>${s.before}</span>
      <span class="drop-zone" data-idx="${si}" data-ans="${s.blank}" onclick="placeWord(this)">click to fill</span>
      <span>${s.after}</span>
    </div>
  `).join('');
}

function pickWord(chip){
  if(chip.classList.contains('used')) return;
  if(fillSelected){ fillSelected.classList.remove('active'); }
  if(fillSelected===chip){ fillSelected=null; return; }
  fillSelected=chip;
  chip.classList.add('active');
}

function placeWord(zone){
  if(zone.dataset.placed){
    const oldWord=zone.dataset.placed;
    const oldChip=document.querySelector(`.word-chip[data-word="${oldWord}"]`);
    if(oldChip){ oldChip.classList.remove('used'); }
    zone.textContent='click to fill';
    delete zone.dataset.placed;
    zone.classList.remove('filled','correct','wrong');
    return;
  }
  if(!fillSelected) return;
  const word=fillSelected.dataset.word;
  zone.textContent=word;
  zone.dataset.placed=word;
  zone.classList.add('filled');
  fillSelected.classList.add('used');
  fillSelected.classList.remove('active');
  fillSelected=null;
}

async function checkDrag(){
  const zones=document.querySelectorAll('.drop-zone');
  let correct=0;
  zones.forEach(z=>{
    if(!z.dataset.placed){ z.style.borderColor='var(--neon3)'; return; }
    if(z.dataset.placed===z.dataset.ans){ z.classList.add('correct'); correct++; }
    else { z.classList.add('wrong'); }
  });
  const xp=correct*20; // max 120
  
  document.getElementById('drag-play').style.display='none';
  document.getElementById('drag-results').classList.add('visible');
  document.getElementById('dragFinal').textContent = correct;
  document.getElementById('dragXP').textContent = xp;
  
  await submitGameProgress('drag', correct, xp, correct, 6);
}

// ══════════════════════════════════════════
// GAME 5 — TRUE/FALSE
// ══════════════════════════════════════════
const TF=[
  {s:"You automatically own copyright on a photo you take.",a:true,ex:"TRUE! Copyright is yours automatically the moment you capture the photo — no registration needed."},
  {s:"Copying a friend's homework is only plagiarism, NOT copyright infringement.",a:false,ex:"FALSE! Copying another person's written work without credit can be both plagiarism AND copyright infringement."},
  {s:"A patent lasts forever once granted.",a:false,ex:"FALSE! Patents typically last 20 years from the filing date, then the invention enters the public domain."},
  {s:"The ® symbol means a trademark is officially registered with the government.",a:true,ex:"TRUE! ® = registered trademark. ™ is used for unregistered marks."},
  {s:"You can freely use any image you find on Google Images.",a:false,ex:"FALSE! Images on the internet are still protected by copyright. Always check the image license before using it!"},
  {s:"Trade secrets remain protected indefinitely as long as they stay confidential.",a:true,ex:"TRUE! Unlike patents (which expire), trade secrets last as long as the information remains confidential."},
  {s:"You must officially register your work to have copyright protection.",a:false,ex:"FALSE! Copyright is automatic the moment you create original work — no registration required!"},
  {s:"Students can quote small parts of books in essays under Fair Use.",a:true,ex:"TRUE! Fair Use permits limited quotation for education, commentary, and analysis."},
  {s:"A company logo can be registered as a trademark.",a:true,ex:"TRUE! Logos, names, slogans, and symbols that identify a brand can all be trademarked."},
  {s:"Ideas themselves can be copyrighted.",a:false,ex:"FALSE! Copyright protects the expression of ideas (a book, a song, a painting) — NOT the ideas themselves."},
  {s:"Using copyrighted music in a YouTube video is always legal.",a:false,ex:"FALSE! Using copyrighted music without a license can result in takedowns, demonetization, or legal action."},
  {s:"Works in the public domain can be used freely by anyone.",a:true,ex:"TRUE! Public domain works (expired copyright, government works, etc.) are free for all to use without permission."},
];

let tfIdx=0, tfScore=0, tfCorrect=0, tfAnswered=false, tfTimer=null, tfTimeLeft=30, tfQuestions=[];

function startTF(){
  tfQuestions=shuffle(TF).slice(0,8);
  tfIdx=0; tfScore=0; tfCorrect=0; tfAnswered=false;
  document.getElementById('tf-results').classList.remove('visible');
  document.getElementById('tf-play').style.display='block';
  document.getElementById('tf-timer-display').style.display='block';
  document.getElementById('tf-timer-bar-wrap').style.display='block';
  enableTFBtns(true);
  renderTF(); startTFTimer();
}

function renderTF(){
  const q=tfQuestions[tfIdx];
  document.getElementById('tfNum').textContent=`Statement ${tfIdx+1} of 8`;
  document.getElementById('tfScore').textContent=tfScore;
  document.getElementById('tfText').textContent=q.s;
  const fb=document.getElementById('tfFB');
  fb.className='feedback-box'; fb.style.display='none';
  tfAnswered=false; tfTimeLeft=30;
  enableTFBtns(true);
}

function enableTFBtns(on){
  document.getElementById('tfTrueBtn').disabled=!on;
  document.getElementById('tfFalseBtn').disabled=!on;
}

function startTFTimer(){
  clearInterval(tfTimer);
  tfTimer=setInterval(()=>{
    tfTimeLeft--;
    document.getElementById('tfTimer').textContent=tfTimeLeft;
    document.getElementById('tfTimerBar').style.width=(tfTimeLeft/30*100)+'%';
    if(tfTimeLeft<=0){ clearInterval(tfTimer); autoAdvanceTF(); }
  },1000);
}

function tfAnswer(choice){
  if(tfAnswered) return;
  tfAnswered=true; clearInterval(tfTimer);
  enableTFBtns(false);
  const q=tfQuestions[tfIdx];
  const isRight=choice===q.a;
  if(isRight){ tfScore+=10; tfCorrect++; }
  const fb=document.getElementById('tfFB');
  fb.className='feedback-box '+(isRight?'good':'bad')+' visible';
  fb.style.display='block';
  fb.innerHTML=q.ex;
  document.getElementById('tfScore').textContent=tfScore;
  setTimeout(()=>autoAdvanceTF(),1800);
}

function autoAdvanceTF(){
  tfIdx++;
  if(tfIdx>=tfQuestions.length){ endTF(); return; }
  renderTF(); startTFTimer();
}

async function endTF(){
  clearInterval(tfTimer);
  document.getElementById('tf-play').style.display='none';
  document.getElementById('tf-timer-display').style.display='none';
  document.getElementById('tf-timer-bar-wrap').style.display='none';
  const res=document.getElementById('tf-results');
  res.classList.add('visible');
  
  const xp=Math.round(tfScore*0.8);
  document.getElementById('tfFinal').textContent=tfScore;
  document.getElementById('tfXP').textContent=xp;
  const msgs=['Keep practising!','Getting started!','Not bad at all!','Really good!','⚡ Lightning fast reflexes!'];
  document.getElementById('tfMsg').textContent=msgs[Math.min(Math.floor(tfCorrect/2),4)];
  
  await submitGameProgress('tf', tfScore, xp, tfCorrect, 8);
}
