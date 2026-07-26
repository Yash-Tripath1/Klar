const $ = (selector) => document.querySelector(selector);
const sentence = [];
const correctSentence = 'Ich komme aus Indien.';
let progress = Number(localStorage.getItem('hallo-progress') || 0);
let streak = Number(localStorage.getItem('hallo-streak') || 0);

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}
function scrollToLesson(){ $('#learn').scrollIntoView({behavior:'smooth', block:'start'}); }
$('#heroStart').addEventListener('click', scrollToLesson);
$('#navStart').addEventListener('click', scrollToLesson);
$('#bottomStart').addEventListener('click', scrollToLesson);
$('#previewButton').addEventListener('click', () => $('#method').scrollIntoView({behavior:'smooth'}));

$('#playGreeting').addEventListener('click', () => {
  const card = $('.greeting-card'); card.classList.add('playing');
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('Hallo, ich bin Yash.');
    utterance.lang = 'de-DE'; utterance.rate = .78;
    speechSynthesis.speak(utterance);
  } else toast('Say it aloud: Hallo, ich bin Yash.');
  setTimeout(() => card.classList.remove('playing'), 1400);
});

$('#revealBreakdown').addEventListener('click', () => {
  $('#breakdown').classList.toggle('show');
  const open = $('#breakdown').classList.contains('show');
  $('#revealBreakdown').innerHTML = `${open ? 'got it' : 'why does this work?'} <span>${open ? '−' : '+'}</span>`;
});

function renderSentence(){
  const slot = $('#answerSlot');
  slot.innerHTML = sentence.length ? '' : '<span>tap words below</span>';
  sentence.forEach((word, index) => {
    const chip = document.createElement('button'); chip.className = 'answer-chip'; chip.textContent = word;
    chip.title = 'Tap to remove'; chip.addEventListener('click', () => { sentence.splice(index, 1); renderSentence(); });
    slot.appendChild(chip);
  });
  document.querySelectorAll('#wordBank button').forEach(button => button.disabled = sentence.includes(button.dataset.word));
}
$('#wordBank').addEventListener('click', (event) => {
  const word = event.target.dataset.word;
  if (!word || sentence.includes(word)) return;
  sentence.push(word); renderSentence();
});
$('#resetSentence').addEventListener('click', () => { sentence.length = 0; $('#sentenceFeedback').textContent = ''; renderSentence(); });
$('#checkSentence').addEventListener('click', () => {
  const feedback = $('#sentenceFeedback');
  if (sentence.join(' ') === correctSentence) {
    feedback.textContent = 'Sehr gut. That is exactly right.';
    if (progress < 2) { progress = 2; updateProgress(); }
    toast('Correct — “Ich komme aus Indien.” ✦');
  } else feedback.textContent = sentence.length ? 'Nearly. Try: Ich + komme + aus + Indien.' : 'Build the sentence first.';
});

function updateProgress(){
  $('#progressFill').style.width = `${(progress / 3) * 100}%`;
  $('#progressText').textContent = `${progress} / 3 moments`;
  localStorage.setItem('hallo-progress', progress);
}
$('#saveProgress').addEventListener('click', () => {
  progress = Math.min(3, progress + 1);
  streak = Math.max(1, streak + (progress === 1 ? 1 : 0));
  localStorage.setItem('hallo-streak', streak);
  $('#streak').textContent = streak;
  $('#saveMessage').textContent = progress === 3 ? 'Today is complete. Sehr gut, Yash.' : 'Saved. Your future German self says danke.';
  updateProgress();
  toast('Progress saved locally.');
});
$('#streak').textContent = streak;
updateProgress();
renderSentence();
