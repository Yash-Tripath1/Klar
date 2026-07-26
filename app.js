const $ = (selector) => document.querySelector(selector);
const sentence = [];
const correctSentence = 'Ich komme aus Indien.';
let progress = Number(localStorage.getItem('klar-progress') || 0);
let streak = Number(localStorage.getItem('klar-streak') || 0);

function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove('show'), 2600); }
function scrollToLesson() { $('#learn').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
['#heroStart','#bottomStart'].forEach(id => $(id).addEventListener('click', scrollToLesson));
$('#previewButton').addEventListener('click', () => $('#method').scrollIntoView({ behavior: 'smooth' }));

const savedMode = localStorage.getItem('klar-mode');
if (savedMode === 'dark') document.body.classList.add('dark');
$('#modeToggle').addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('klar-mode', document.body.classList.contains('dark') ? 'dark' : 'light'); toast(document.body.classList.contains('dark') ? 'DARK MODE: ON' : 'LIGHT MODE: ON'); });

$('#playGreeting').addEventListener('click', () => {
  const button = $('#playGreeting'); button.classList.add('playing');
  if ('speechSynthesis' in window) { speechSynthesis.cancel(); const phrase = new SpeechSynthesisUtterance('Hallo, ich bin Yash.'); phrase.lang = 'de-DE'; phrase.rate = .78; speechSynthesis.speak(phrase); }
  else toast('SAY IT: HALLO, ICH BIN YASH.');
  setTimeout(() => button.classList.remove('playing'), 1300);
});
$('#revealBreakdown').addEventListener('click', () => { const block = $('#breakdown'); block.classList.toggle('show'); const isOpen = block.classList.contains('show'); $('#revealBreakdown').innerHTML = `${isOpen ? 'PHRASE DECODED' : 'DECODE PHRASE'} <span>${isOpen ? '−' : '+'}</span>`; });

function renderSentence() {
  const slot = $('#answerSlot'); slot.innerHTML = sentence.length ? '' : '<span>AWAITING INPUT</span>';
  sentence.forEach((word,index) => { const chip = document.createElement('button'); chip.className = 'answer-chip'; chip.textContent = word; chip.addEventListener('click', () => { sentence.splice(index,1); renderSentence(); }); slot.appendChild(chip); });
  document.querySelectorAll('#wordBank button').forEach(button => button.disabled = sentence.includes(button.dataset.word));
}
$('#wordBank').addEventListener('click', event => { const word = event.target.dataset.word; if (!word || sentence.includes(word)) return; sentence.push(word); renderSentence(); });
$('#resetSentence').addEventListener('click', () => { sentence.length = 0; $('#sentenceFeedback').textContent = ''; renderSentence(); });
$('#checkSentence').addEventListener('click', () => { const feedback = $('#sentenceFeedback'); if (sentence.join(' ') === correctSentence) { feedback.textContent = 'SEHR GUT. INPUT VERIFIED.'; progress = Math.max(progress,2); updateProgress(); toast('CORRECT — ICH KOMME AUS INDIEN.'); } else feedback.textContent = sentence.length ? 'CHECK ORDER: ICH + KOMME + AUS + INDIEN.' : 'NO INPUT DETECTED.'; });

function updateProgress() { progress = Math.min(3, progress); $('#progressText').textContent = `${String(progress).padStart(2,'0')} / 03`; document.querySelectorAll('#lessonDots i').forEach((dot,index) => dot.classList.toggle('filled', index < progress)); localStorage.setItem('klar-progress',progress); }
$('#saveProgress').addEventListener('click', () => { const wasZero = progress === 0; progress = Math.min(3,progress + 1); if (wasZero) streak += 1; localStorage.setItem('klar-streak',streak); $('#streak').textContent = streak; $('#saveMessage').textContent = progress === 3 ? 'TODAY: COMPLETE. SEHR GUT.' : 'ENTRY SAVED. CONTINUE WHEN READY.'; updateProgress(); toast('TODAY LOGGED.'); });
$('#streak').textContent = streak; updateProgress(); renderSentence();
