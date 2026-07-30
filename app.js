const onboardingRoot = document.querySelector("#onboardingRoot");
const productRoot = document.querySelector("#productRoot");
const app = document.querySelector("#app");
const stored = JSON.parse(localStorage.getItem("klar-state") || "{}");

const CHAT_CONFIG = {
  // The key stays in api/chat.js on the server. This browser only talks to our own route.
  endpoint: window.KLAR_CHAT_ENDPOINT || "/api/chat",
};

const ALPHABET = [
  ["A a", "ah", "Apfel"],
  ["B b", "beh", "Brot"],
  ["C c", "tseh", "Café"],
  ["D d", "deh", "Danke"],
  ["E e", "eh", "Essen"],
  ["F f", "eff", "Frau"],
  ["G g", "geh", "gut"],
  ["H h", "hah", "Haus"],
  ["I i", "ee", "ich"],
  ["J j", "yot", "ja"],
  ["K k", "kah", "Kaffee"],
  ["L l", "ell", "Liebe"],
  ["M m", "emm", "Mann"],
  ["N n", "enn", "Name"],
  ["O o", "oh", "oder"],
  ["P p", "peh", "bitte"],
  ["Q q", "koo", "Quelle"],
  ["R r", "err", "rot"],
  ["S s", "ess", "Sonne"],
  ["T t", "teh", "Tag"],
  ["U u", "oo", "Uhr"],
  ["V v", "fow", "Vater"],
  ["W w", "veh", "Wasser"],
  ["X x", "iks", "Taxi"],
  ["Y y", "üpsilon", "Yoga"],
  ["Z z", "tsett", "Zeit"],
  ["Ä ä", "eh", "Äpfel"],
  ["Ö ö", "ur", "Öl"],
  ["Ü ü", "ue", "über"],
  ["ẞ ß", "ess-tsett", "Straße"],
];

const state = {
  profile: stored.profile || null,
  completed: stored.completed || [],
  opened: stored.opened || [],
  chat: stored.chat || [],
  deckIndex: 0,
};

function saveState() {
  localStorage.setItem(
    "klar-state",
    JSON.stringify({
      profile: state.profile,
      completed: state.completed,
      opened: state.opened,
      chat: state.chat,
    }),
  );
}

function activeCourse() {
  return state.profile?.level === "A2" ? A2_COURSE : COURSE;
}

function lessons() {
  return activeCourse().flatMap((unit) =>
    unit.lessons.map((lesson) => ({
      ...lesson,
      unit: unit.unit,
      unitTitle: unit.title,
    })),
  );
}

function isCompleted(id) {
  return state.completed.some(
    (completedId) => String(completedId) === String(id),
  );
}

function percent() {
  const total = lessons().length;
  return total
    ? Math.round(
        (state.completed.filter((id) =>
          lessons().some((lesson) => String(lesson.id) === String(id)),
        ).length /
          total) *
          100,
      )
    : 0;
}

function knownWords() {
  return lessons()
    .filter((lesson) => state.opened.includes(lesson.id))
    .flatMap((lesson) =>
      lesson.vocab.map(([german, english, gender]) => ({
        german,
        english,
        gender,
        note: lesson.title,
      })),
    );
}

function toast(message) {
  const element = document.querySelector("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => element.classList.remove("show"), 2600);
}

function renderOnboarding(step = 1) {
  productRoot.hidden = true;
  onboardingRoot.hidden = false;

  if (step === 1) {
    onboardingRoot.innerHTML = `
      <main class="welcome-screen">
        <section class="welcome-panel">
          <a class="welcome-brand" href="#">Klar<span></span></a>
          <div class="welcome-copy">
            <p class="eyebrow">A CALMER WAY TO LEARN GERMAN</p>
            <h1>Let’s make this<br /><em>your</em> space.</h1>
            <p>Three quick questions, then we will set up a course that fits where you are right now.</p>
          </div>
          <form id="profileForm" class="setup-form">
            <label>What should we call you?<input name="nickname" autocomplete="nickname" maxlength="24" placeholder="Your nickname" required /></label>
            <label>How old are you?<input name="age" inputmode="numeric" min="8" max="120" type="number" placeholder="Your age" required /></label>
            <fieldset><legend>Where are you starting?</legend><div class="level-choice"><label><input type="radio" name="level" value="A1" checked /><span><b>A1</b><small>I’m starting from scratch</small></span></label><label><input type="radio" name="level" value="A2" /><span><b>A2</b><small>I know the basics already</small></span></label></div></fieldset>
            <button class="primary-button" type="submit">Create my learning space <span>→</span></button>
          </form>
          <p class="welcome-note">Your answers stay in this browser. No account needed to begin.</p>
        </section>
        <aside class="welcome-aside"><div class="aside-orb"></div><p>KLAR / PERSONAL SETUP</p><blockquote>“A language grows through small, clear moments.”</blockquote></aside>
      </main>`;
    return;
  }

  onboardingRoot.innerHTML = `
    <main class="customising-screen"><div class="loading-mark"><i></i><i></i><i></i></div><p class="eyebrow">SETTING UP YOUR KLAR SPACE</p><h1>Customising your<br />learning path.</h1><p>Choosing your ${state.profile.level} course, preparing your first lesson, and building your review deck.</p><div class="loading-line"><i></i></div></main>`;

  setTimeout(() => {
    onboardingRoot.hidden = true;
    productRoot.hidden = false;
    createAmbientLetters();
    route("dashboard");
  }, 1200);
}

function updateChrome(title, label = "YOUR GERMAN SPACE") {
  document.querySelector("#topbarTitle").textContent = title;
  document.querySelector("#topbarLabel").textContent = label;
  document.querySelector("#levelBadge").textContent = state.profile.level;
  document.querySelector("#avatarButton").textContent = state.profile.nickname
    .charAt(0)
    .toUpperCase();
}

function route(name) {
  if (!state.profile) return renderOnboarding();
  const views = {
    dashboard: renderDashboard,
    course: renderCourse,
    review: renderReview,
    alphabet: renderAlphabet,
    practice: renderPractice,
    progress: renderProgress,
  };
  (views[name] || renderDashboard)();
  history.replaceState(null, "", `#${name}`);
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderDashboard() {
  updateChrome(`Hallo, ${state.profile.nickname}.`);
  const courseLessons = lessons();
  const next =
    courseLessons.find((lesson) => !isCompleted(lesson.id)) ||
    courseLessons[courseLessons.length - 1];
  app.innerHTML = `
    <section class="dashboard-hero">
      <div><p class="eyebrow">${state.profile.level} · YOUR LEARNING PATH</p><h2>One useful phrase<br />at a time.</h2><p class="dashboard-lede">Keep it simple today. A few focused minutes are enough to move forward.</p><button class="primary-button" data-open-lesson="${next.id}">${isCompleted(next.id) ? "Revisit a lesson" : "Continue lesson"} <span>→</span></button></div>
      <div class="daily-card"><div class="daily-card-top"><span>THIS COURSE</span><b>${percent()}%</b></div><div class="progress-track"><i style="width:${percent()}%"></i></div><p><strong>${state.completed.filter((id) => courseLessons.some((lesson) => String(lesson.id) === String(id))).length}</strong> of ${courseLessons.length} lessons complete</p><div class="daily-note"><span>Next up</span><b>${next.title}</b></div></div>
    </section>
    <section class="dashboard-grid"><article class="next-card"><div class="card-kicker">NEXT LESSON</div><p class="lesson-tag">${next.unit} · Lesson ${String(next.id).replace("a2-", "")}</p><h3>${next.title}</h3><p>${next.goal}</p><button class="inline-button" data-open-lesson="${next.id}">Open lesson →</button></article><article class="mini-card"><span class="mini-icon">◌</span><p>Pronunciation</p><h3>Say it out loud.</h3><p>Type any German word or phrase and hear it spoken naturally.</p><button class="inline-button" data-route="practice">Open tool →</button></article><article class="mini-card"><span class="mini-icon">◇</span><p>Review deck</p><h3>${knownWords().length} words ready.</h3><p>Short reviews help new vocabulary stay with you.</p><button class="inline-button" data-route="review">Review words →</button></article></section>
    <section class="unit-overview"><div class="section-heading"><div><p class="eyebrow">YOUR COURSE</p><h2>What comes next.</h2></div><button class="quiet-button" data-route="course">See all lessons</button></div><div class="unit-pills">${activeCourse()
      .map((unit) => `<span>${unit.unit} <b>${unit.title}</b></span>`)
      .join("")}</div></section>`;
}

function renderCourse() {
  updateChrome(`${state.profile.level} course`, "YOUR CURRICULUM");
  const courseLessons = lessons();
  app.innerHTML = `<section class="course-intro"><p class="eyebrow">${state.profile.level} COURSE · ${courseLessons.length} LESSONS</p><h2>A path you can<br />actually follow.</h2><p>Short lessons, useful language, and a clear next step every time.</p><div class="course-progress"><span>${state.completed.filter((id) => courseLessons.some((lesson) => String(lesson.id) === String(id))).length} of ${courseLessons.length} complete</span><div><i style="width:${percent()}%"></i></div><b>${percent()}%</b></div></section><div class="units">${activeCourse()
    .map((unit) => unitMarkup(unit))
    .join("")}</div>`;
}

function unitMarkup(unit) {
  const done = unit.lessons.filter((lesson) => isCompleted(lesson.id)).length;
  return `<section class="course-unit"><header><div><p>${unit.unit}</p><h3>${unit.title}</h3></div><span>${done}/${unit.lessons.length}</span></header><div class="lesson-list">${unit.lessons.map((lesson) => `<button class="lesson-row ${isCompleted(lesson.id) ? "is-complete" : ""}" data-open-lesson="${lesson.id}"><span>${isCompleted(lesson.id) ? "✓" : String(lesson.id).replace("a2-", "").padStart(2, "0")}</span><div><b>${lesson.title}</b><small>${lesson.goal}</small></div><i>→</i></button>`).join("")}</div></section>`;
}

function renderLesson(lessonId) {
  const lesson = lessons().find((item) => String(item.id) === String(lessonId));
  if (!lesson) return route("course");
  if (!state.opened.includes(lesson.id)) {
    state.opened.push(lesson.id);
    saveState();
  }
  updateChrome(
    lesson.title,
    `${lesson.unit} · LESSON ${String(lesson.id).replace("a2-", "").padStart(2, "0")}`,
  );
  const [question, answer, wrong] = lesson.quiz;
  app.innerHTML = `<button class="back-link" data-route="course">← Back to course</button><article class="lesson-view"><header><span>${lesson.unit}</span><h2>${lesson.title}</h2><p>${lesson.goal}</p></header><section class="focus-card"><div><p class="eyebrow">THE IDEA</p><p class="grammar-note">${lesson.grammar}</p></div><div class="phrase-box"><p class="eyebrow">SAY THIS</p><h3 id="lessonPhrase" lang="de">${lesson.phrase}</h3><p>${lesson.translation}</p><button class="listen-button" data-speak-target="lessonPhrase">Listen <span>◖))</span></button></div></section><section class="lesson-section"><div class="section-heading"><div><p class="eyebrow">WORDS TO KEEP</p><h2>Build your bank.</h2></div><span class="hint">Tap a word to hear it</span></div><div class="word-grid">${lesson.vocab.map(([german, english, gender]) => `<button class="word-card" data-speak="${german}"><i class="gender-dot ${gender || "neutral"}"></i><b>${german}</b><span>${english}</span><em>◖))</em></button>`).join("")}</div></section><section class="check-card"><p class="eyebrow">QUICK CHECK</p><h3>${question}</h3><div class="answer-grid">${shuffle(
    [answer, ...wrong],
  )
    .map(
      (option) =>
        `<button data-quiz="${escapeHtml(option)}" data-answer="${escapeHtml(answer)}">${option}</button>`,
    )
    .join(
      "",
    )}</div><p id="answerFeedback" aria-live="polite"></p></section><footer class="lesson-actions"><button class="quiet-button" data-speak="${lesson.phrase}">Hear the phrase again</button><button class="primary-button" data-complete="${lesson.id}">${isCompleted(lesson.id) ? "Lesson complete ✓" : "Complete lesson"}</button></footer></article>`;
}

function renderReview() {
  updateChrome("Review", "YOUR WORD BANK");
  const deck = knownWords();
  app.innerHTML = `<section class="tool-header"><p class="eyebrow">YOUR REVIEW DECK</p><h2>Keep the useful<br />words close.</h2><p>Say the answer out loud before you reveal it.</p></section><section class="review-screen"><button class="study-card" id="studyCard"><div class="study-card-inner"><div class="study-face study-front"><span id="cardGender" class="gender-dot neutral"></span><p>GERMAN</p><h3 id="cardGerman">${deck[0]?.german || "Open a lesson first"}</h3><button class="listen-button" id="cardListen">Listen <span>◖))</span></button><small>Tap to reveal</small></div><div class="study-face study-back"><p>ENGLISH</p><h3 id="cardEnglish">${deck[0]?.english || "Your words will appear here."}</h3><span id="cardNote">${deck[0]?.note || ""}</span><small>Tap to return</small></div></div></button><aside class="review-panel"><p class="eyebrow">IN THIS DECK</p><strong id="cardCount">${deck.length} word${deck.length === 1 ? "" : "s"}</strong><p id="reviewMessage">${deck.length ? "Take your time. Recall is the point." : "Learn a lesson to start your deck."}</p><div><button class="quiet-button" id="previousCard">←</button><button class="primary-button" id="nextCard">Next word →</button></div></aside></section>`;
  if (!deck.length) return;
  let index = state.deckIndex % deck.length;
  const update = () => {
    const word = deck[index];
    document.querySelector("#cardGerman").textContent = word.german;
    document.querySelector("#cardEnglish").textContent = word.english;
    document.querySelector("#cardNote").textContent = word.note;
    document.querySelector("#cardGender").className =
      `gender-dot ${word.gender || "neutral"}`;
    document.querySelector("#studyCard").classList.remove("flipped");
  };
  document.querySelector("#studyCard").onclick = () =>
    document.querySelector("#studyCard").classList.toggle("flipped");
  document.querySelector("#cardListen").onclick = (event) => {
    event.stopPropagation();
    speak(deck[index].german);
  };
  document.querySelector("#nextCard").onclick = () => {
    index = (index + 1) % deck.length;
    state.deckIndex = index;
    update();
  };
  document.querySelector("#previousCard").onclick = () => {
    index = (index - 1 + deck.length) % deck.length;
    state.deckIndex = index;
    update();
  };
}

function renderAlphabet() {
  updateChrome("Alphabet", "SOUNDS & LETTERS");
  app.innerHTML = `<section class="tool-header alphabet-header"><p class="eyebrow">GERMAN ALPHABET</p><h2>Hear every<br /><em>letter.</em></h2><p>German uses the same base alphabet as English, plus Ä, Ö, Ü, and ß. Tap a card to hear the letter and an example word.</p></section><section class="alphabet-guide"><article><span>Ä</span><div><b>Ä · ä</b><p>Often sounds like the “e” in <em>bed</em>.</p></div></article><article><span>Ö</span><div><b>Ö · ö</b><p>Round your lips as for “oh”, then say “eh”.</p></div></article><article><span>Ü</span><div><b>Ü · ü</b><p>Round your lips as for “oo”, then say “ee”.</p></div></article><article><span>ß</span><div><b>Eszett</b><p>Sounds like a sharp “ss”; it is never at the start of a word.</p></div></article></section><section class="alphabet-grid">${ALPHABET.map(([letter, sound, example]) => `<button data-speak="${letter.replace(" ", "")}. ${example}"><strong>${letter}</strong><span>${sound}</span><small>${example}</small></button>`).join("")}</section>`;
}

function renderPractice() {
  updateChrome("Pronounce", "SAY IT OUT LOUD");
  app.innerHTML = `<section class="tool-header"><p class="eyebrow">PRONUNCIATION SPACE</p><h2>Type it.<br /><em>Hear it.</em></h2><p>Use this for any German word or phrase you meet—not just the course content.</p></section><section class="pronounce-card"><label for="pronunciationInput">GERMAN WORD OR PHRASE</label><textarea id="pronunciationInput" lang="de" placeholder="Wie geht es dir?"></textarea><div><button class="primary-button" id="speakNormal">Play pronunciation <span>▶</span></button><button class="quiet-button" id="speakSlow">Play slowly</button></div><p>Listen once, repeat slowly, then try it at normal speed.</p></section><section class="phrase-suggestions"><p class="eyebrow">TRY A PHRASE</p>${["Guten Morgen!", "Ich lerne Deutsch.", "Können Sie das bitte wiederholen?", "Wo ist der Bahnhof?", "Das klingt interessant."].map((phrase) => `<button data-phrase="${phrase}">${phrase}<span>◖))</span></button>`).join("")}</section>`;
  const input = document.querySelector("#pronunciationInput");
  document.querySelector("#speakNormal").onclick = () =>
    speak(input.value, 0.84);
  document.querySelector("#speakSlow").onclick = () => speak(input.value, 0.58);
}

function renderProgress() {
  updateChrome("Your progress", "YOUR LEARNING SPACE");
  const courseLessons = lessons();
  app.innerHTML = `<section class="tool-header"><p class="eyebrow">${state.profile.level} COURSE</p><h2>You are building<br /><em>something real.</em></h2></section><section class="metrics"><article><span>LESSONS COMPLETE</span><b>${state.completed.filter((id) => courseLessons.some((lesson) => String(lesson.id) === String(id))).length}</b><small>of ${courseLessons.length}</small></article><article><span>WORDS EXPLORED</span><b>${knownWords().length}</b><small>in your review deck</small></article><article><span>COURSE PROGRESS</span><b>${percent()}%</b><small>keep the rhythm</small></article></section><section class="map-section"><div class="section-heading"><div><p class="eyebrow">COURSE MAP</p><h2>Your steps.</h2></div></div><div class="lesson-map">${courseLessons.map((lesson) => `<button class="${isCompleted(lesson.id) ? "done" : state.opened.includes(lesson.id) ? "opened" : ""}" data-open-lesson="${lesson.id}" title="${lesson.title}">${String(lesson.id).replace("a2-", "").padStart(2, "0")}</button>`).join("")}</div></section>`;
}

function speak(text, rate = 0.82) {
  if (!text?.trim()) return toast("Type a German word or phrase first.");
  if (!("speechSynthesis" in window))
    return toast("Speech playback is unavailable in this browser.");
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = rate;
  speechSynthesis.speak(utterance);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

document.addEventListener("submit", (event) => {
  if (event.target.id !== "profileForm") return;
  event.preventDefault();
  const data = new FormData(event.target);
  state.profile = {
    nickname: data.get("nickname").trim(),
    age: Number(data.get("age")),
    level: data.get("level"),
  };
  state.completed = [];
  state.opened = [];
  state.chat = [];
  saveState();
  renderOnboarding(2);
});

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) return route(routeButton.dataset.route);
  const lessonButton = event.target.closest("[data-open-lesson]");
  if (lessonButton) return renderLesson(lessonButton.dataset.openLesson);
  const speakButton = event.target.closest("[data-speak], [data-speak-target]");
  if (speakButton)
    return speak(
      speakButton.dataset.speak ||
        document.querySelector(`#${speakButton.dataset.speakTarget}`)
          ?.textContent,
    );
  const phrase = event.target.closest("[data-phrase]");
  if (phrase) {
    document.querySelector("#pronunciationInput").value = phrase.dataset.phrase;
    return speak(phrase.dataset.phrase);
  }
  const answer = event.target.closest("[data-quiz]");
  if (answer) {
    const correct = answer.dataset.quiz === answer.dataset.answer;
    document.querySelectorAll("[data-quiz]").forEach((button) => {
      button.disabled = true;
      if (button.dataset.quiz === button.dataset.answer)
        button.classList.add("correct");
    });
    if (!correct) answer.classList.add("wrong");
    document.querySelector("#answerFeedback").textContent = correct
      ? "Correct. Nice work."
      : `Not quite — “${answer.dataset.answer}” is the answer.`;
    return;
  }
  const complete = event.target.closest("[data-complete]");
  if (complete) {
    const id = complete.dataset.complete;
    const courseLessons = lessons();
    const currentIndex = courseLessons.findIndex(
      (lesson) => String(lesson.id) === String(id),
    );
    const nextLesson = courseLessons[currentIndex + 1];

    if (!isCompleted(id)) {
      state.completed.push(id);
      saveState();
      toast("Lesson complete. Opening your next step…");
    }

    complete.disabled = true;
    complete.textContent = nextLesson
      ? "Opening next lesson…"
      : "Course complete ✓";

    window.setTimeout(() => {
      if (nextLesson) {
        renderLesson(nextLesson.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        route("progress");
      }
    }, 650);
    return;
  }
  if (event.target.closest("[data-action='restart']")) {
    if (
      confirm(
        "Start Klar setup again? Your local course progress will be cleared.",
      )
    ) {
      localStorage.removeItem("klar-state");
      state.profile = null;
      state.completed = [];
      state.opened = [];
      renderOnboarding();
    }
  }
});

function createAmbientLetters() {
  const container = document.querySelector("#ambientLetters");
  const letters = ["ä", "ö", "ü", "ß", "a", "e", "i", "g", "k", "z"];
  container.replaceChildren();
  for (let index = 0; index < 18; index += 1) {
    const letter = document.createElement("span");
    letter.textContent = letters[Math.floor(Math.random() * letters.length)];
    letter.style.left = `${Math.random() * 100}%`;
    letter.style.top = `${Math.random() * 100}%`;
    letter.style.animationDelay = `${-Math.random() * 18}s`;
    letter.style.animationDuration = `${14 + Math.random() * 12}s`;
    letter.style.fontSize = `${16 + Math.random() * 32}px`;
    container.append(letter);
  }
}

function renderChat() {
  const messages = document.querySelector("#chatMessages");
  const scenarios = document.querySelector("#scenarioChips");
  const history = state.chat.length
    ? state.chat
    : [
        {
          role: "assistant",
          content: `Hallo ${state.profile.nickname}! I’m your Klar Coach. Choose a situation, then answer in German—short is perfect.`,
        },
      ];
  messages.innerHTML = history
    .map(
      (message) =>
        `<div class="chat-message ${message.role}">${escapeHtml(message.content)}</div>`,
    )
    .join("");
  scenarios.innerHTML = ["Meet someone", "Order coffee", "Ask directions"]
    .map(
      (scenario) => `<button data-scenario="${scenario}">${scenario}</button>`,
    )
    .join("");
  messages.scrollTop = messages.scrollHeight;
}

function openChat() {
  const drawer = document.querySelector("#chatDrawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  renderChat();
}

function closeChat() {
  const drawer = document.querySelector("#chatDrawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

function coachSystemPrompt() {
  const words = knownWords()
    .slice(0, 60)
    .map((word) => word.german)
    .join(", ");
  return `You are Klar Coach, a warm German conversation tutor. The learner is ${state.profile.nickname}, age ${state.profile.age}, studying ${state.profile.level}. Have a short, friendly conversation in simple German appropriate to ${state.profile.level}. Use mostly learned words when possible: ${words || "basic greetings"}. Keep every reply under 55 words. Correct errors gently: first reply naturally, then add one tiny 'Tipp:' correction only when useful. Do not over-explain grammar. Never claim to be a native speaker.`;
}

async function sendChatMessage(content) {
  state.chat.push({ role: "user", content });
  saveState();
  renderChat();
  const messages = document.querySelector("#chatMessages");
  const pending = document.createElement("div");
  pending.className = "chat-message assistant pending";
  pending.textContent = "Klar Coach is thinking…";
  messages.append(pending);
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await fetch(CHAT_CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: coachSystemPrompt() },
          ...state.chat,
        ],
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Chat request failed");
    const reply = result.message?.content?.trim();
    if (!reply) throw new Error("No response received");
    state.chat.push({ role: "assistant", content: reply });
    saveState();
    renderChat();
  } catch (error) {
    pending.textContent = `Coach is not connected: ${error.message}`;
    pending.classList.remove("pending");
  }
}

document.querySelector("#chatToggle").addEventListener("click", openChat);
document.querySelector("#chatClose").addEventListener("click", closeChat);
document.querySelector("#chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#chatInput");
  const message = input.value.trim();
  if (!message) return;
  input.value = "";
  sendChatMessage(message);
});
document.querySelector("#scenarioChips").addEventListener("click", (event) => {
  const scenario = event.target.closest("[data-scenario]")?.dataset.scenario;
  if (!scenario) return;
  sendChatMessage(
    `Let's practise this scenario: ${scenario}. Please start the conversation in German.`,
  );
});
if (state.profile) {
  onboardingRoot.hidden = true;
  productRoot.hidden = false;
  createAmbientLetters();
  route(location.hash.slice(1) || "dashboard");
} else {
  renderOnboarding();
}
