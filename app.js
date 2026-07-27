/* Klar application shell. State is browser-local by design, so the prototype works without accounts or a server. */
const app = document.querySelector("#app");
const templates = {
  home: document.querySelector("#homeTemplate"),
  learn: document.querySelector("#learnTemplate"),
  review: document.querySelector("#reviewTemplate"),
  practice: document.querySelector("#practiceTemplate"),
  progress: document.querySelector("#progressTemplate"),
};

const allLessons = COURSE.flatMap((unit) =>
  unit.lessons.map((lesson) => ({
    ...lesson,
    unit: unit.unit,
    unitTitle: unit.title,
  })),
);
const stored = JSON.parse(localStorage.getItem("klar-state") || "{}");
const state = {
  completed: stored.completed || [],
  opened: stored.opened || [],
  theme: stored.theme || "light",
  level: stored.level || "A1",
  deckIndex: 0,
};

function saveState() {
  localStorage.setItem(
    "klar-state",
    JSON.stringify({
      completed: state.completed,
      opened: state.opened,
      theme: state.theme,
      level: state.level,
    }),
  );
}

function coursePercent() {
  return Math.round((state.completed.length / allLessons.length) * 100);
}

function knownWords() {
  return allLessons
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

function mountTemplate(name) {
  app.replaceChildren(templates[name].content.cloneNode(true));
  app.focus({ preventScroll: true });
}

function renderHome() {
  mountTemplate("home");
  document.querySelector("#homeLessonsDone").textContent = String(
    state.completed.length,
  ).padStart(2, "0");
  document.querySelector("#homeWordsSeen").textContent = String(
    knownWords().length,
  ).padStart(3, "0");
  document.querySelectorAll("[data-select-level]").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.selectLevel === state.level,
    );
  });

  const next =
    allLessons.find((lesson) => !state.completed.includes(lesson.id)) ||
    allLessons[allLessons.length - 1];
  document.querySelector("#nextLessonCard").innerHTML = lessonCard(next, true);
}

function lessonCard(lesson, featured = false) {
  const isDone = state.completed.includes(lesson.id);
  return `
    <article class="lesson-card ${featured ? "featured-card" : ""}">
      <div class="lesson-card-top"><span>${lesson.unit} / ${String(lesson.id).padStart(2, "0")}</span><span class="status ${isDone ? "done" : ""}">${isDone ? "COMPLETE" : "READY"}</span></div>
      <div class="lesson-card-body"><p class="lesson-unit">${lesson.unitTitle}</p><h3>${lesson.title}</h3><p>${lesson.goal}</p></div>
      <button class="button ${featured ? "button-signal" : "button-outline"}" data-open-lesson="${lesson.id}">${isDone ? "Open again" : "Start lesson"} <span>→</span></button>
    </article>`;
}

function renderLearn() {
  if (state.level === "A2") {
    renderA2Roadmap();
    return;
  }

  mountTemplate("learn");
  document.querySelector("#courseProgressLabel").textContent =
    `${state.completed.length} of ${allLessons.length} complete`;
  document.querySelector("#courseProgressPercent").textContent =
    `${coursePercent()}%`;
  requestAnimationFrame(() => {
    document.querySelector("#courseProgressBar").style.width =
      `${coursePercent()}%`;
  });

  document.querySelector("#curriculum").innerHTML = COURSE.map(
    (unit) => `
    <section class="unit-block">
      <header class="unit-header"><div><span>${unit.unit}</span><h2>${unit.title}</h2></div><p>${unit.lessons.filter((lesson) => state.completed.includes(lesson.id)).length} / ${unit.lessons.length} complete</p></header>
      <div class="lesson-grid">${unit.lessons.map((lesson) => lessonCard(lesson)).join("")}</div>
    </section>`,
  ).join("");
}

function renderA2Roadmap() {
  app.innerHTML = `
    <section class="page-intro a2-intro">
      <p class="eyebrow">KLAR / A2 ROADMAP</p>
      <h1>Make German<br /><em>more yours.</em></h1>
      <p class="lede">A2 is where you stop assembling survival phrases and start handling everyday life with more independence. The complete A2 lesson library is the next content release.</p>
      <button class="button button-outline" data-select-level="A1">← Switch to A1 course</button>
    </section>
    <section class="a2-roadmap">
      ${A2_ROADMAP.map(
        (unit) => `
        <article class="a2-unit-card">
          <p>${unit.unit}</p>
          <h2>${unit.title}</h2>
          <ol>${unit.lessons.map((lesson) => `<li>${lesson}</li>`).join("")}</ol>
          <span>5 lessons planned</span>
        </article>`,
      ).join("")}
      <div class="a2-note"><strong>A2 is mapped.</strong><span>Next: lesson writing, native audio, and exercises.</span></div>
    </section>`;
}

function renderLesson(lessonId) {
  const lesson = allLessons.find((item) => item.id === Number(lessonId));
  if (!lesson) return renderHome();
  if (!state.opened.includes(lesson.id)) {
    state.opened.push(lesson.id);
    saveState();
  }

  const [question, answer, distractors] = lesson.quiz;
  app.innerHTML = `
    <section class="lesson-page">
      <button class="back-button" data-view="learn">← All lessons</button>
      <div class="lesson-header"><div><p class="eyebrow">${lesson.unit} · LESSON ${String(lesson.id).padStart(2, "0")}</p><h1>${lesson.title}</h1><p class="lede">${lesson.goal}</p></div><span class="lesson-number">${String(lesson.id).padStart(2, "0")}</span></div>
      <div class="lesson-content">
        <section class="lesson-explain technical-panel"><p class="eyebrow">CORE IDEA</p><p class="grammar-copy">${lesson.grammar}</p><div class="phrase-card"><p class="card-label">USEFUL PHRASE</p><h2 lang="de" id="lessonPhrase">${lesson.phrase}</h2><p>${lesson.translation}</p><button class="speaker" data-speak-target="lessonPhrase" aria-label="Listen to phrase">◖))</button></div></section>
        <section class="vocabulary-section"><div class="section-title"><div><p class="eyebrow">VOCABULARY</p><h2>Keep these.</h2></div><span class="micro-label">TAP TO HEAR</span></div><div class="vocab-list">${lesson.vocab
          .map(
            ([german, english, gender]) => `
          <button class="vocab-item" data-speak="${german}" lang="de"><span class="dot ${gender || "neutral"}"></span><b>${german}</b><span>${english}</span><i>◖))</i></button>`,
          )
          .join("")}</div></section>
        <section class="quiz-section"><p class="eyebrow">CHECK YOURSELF</p><h2>${question}</h2><div class="quiz-options">${shuffle(
          [answer, ...distractors],
        )
          .map(
            (option) =>
              `<button data-quiz-option="${escapeHtml(option)}" data-answer="${escapeHtml(answer)}">${option}</button>`,
          )
          .join(
            "",
          )}</div><p id="quizFeedback" class="quiz-feedback" aria-live="polite"></p></section>
      </div>
      <div class="lesson-footer"><button class="button button-outline" data-speak="${lesson.phrase}">Hear phrase again</button><button class="button button-signal" id="completeLesson">${state.completed.includes(lesson.id) ? "Lesson complete" : "Mark lesson complete"} <span>✓</span></button></div>
    </section>`;
}

function renderReview() {
  mountTemplate("review");
  const deck = knownWords();
  const card = document.querySelector("#flashcard");
  if (!deck.length) {
    document.querySelector("#flashGerman").textContent = "Open a lesson first";
    document.querySelector("#flashEnglish").textContent =
      "Your review words will appear here.";
    document.querySelector("#deckPosition").textContent = "00";
    document.querySelector("#deckTotal").textContent = "00";
    document.querySelector("#deckStatus").textContent =
      "Learn a lesson, then come back to practise.";
    return;
  }
  state.deckIndex %= deck.length;
  const updateCard = () => {
    const word = deck[state.deckIndex];
    document.querySelector("#flashGerman").textContent = word.german;
    document.querySelector("#flashEnglish").textContent = word.english;
    document.querySelector("#flashNote").textContent = word.note;
    document.querySelector("#flashGenderDot").className =
      `dot ${word.gender || "neutral"}`;
    document.querySelector("#deckPosition").textContent = String(
      state.deckIndex + 1,
    ).padStart(2, "0");
    document.querySelector("#deckTotal").textContent = String(
      deck.length,
    ).padStart(2, "0");
    card.classList.remove("flipped");
  };
  updateCard();
  card.addEventListener("click", () => card.classList.toggle("flipped"));
  document.querySelector("#nextCard").addEventListener("click", () => {
    state.deckIndex = (state.deckIndex + 1) % deck.length;
    updateCard();
  });
  document.querySelector("#previousCard").addEventListener("click", () => {
    state.deckIndex = (state.deckIndex - 1 + deck.length) % deck.length;
    updateCard();
  });
}

function renderPractice() {
  mountTemplate("practice");
  const input = document.querySelector("#pronunciationInput");
  const play = (rate) => speak(input.value, rate);
  document
    .querySelector("#pronounceButton")
    .addEventListener("click", () => play(0.85));
  document
    .querySelector("#slowPronounceButton")
    .addEventListener("click", () => play(0.58));
  document.querySelector("#quickPhrases").innerHTML = QUICK_PHRASES.map(
    (phrase) =>
      `<button data-quick-phrase="${phrase}">${phrase} <span>◖))</span></button>`,
  ).join("");
}

function renderProgress() {
  mountTemplate("progress");
  document.querySelector("#metricLessons").textContent = String(
    state.completed.length,
  ).padStart(2, "0");
  document.querySelector("#metricWords").textContent = String(
    knownWords().length,
  ).padStart(3, "0");
  document.querySelector("#metricPercent").textContent =
    `${String(coursePercent()).padStart(2, "0")}%`;
  document.querySelector("#progressDots").innerHTML = allLessons
    .map(
      (lesson) =>
        `<button class="map-dot ${state.completed.includes(lesson.id) ? "complete" : state.opened.includes(lesson.id) ? "opened" : ""}" data-open-lesson="${lesson.id}" title="${lesson.id}. ${lesson.title}">${String(lesson.id).padStart(2, "0")}</button>`,
    )
    .join("");
}

function speak(text, rate = 0.8) {
  if (!text?.trim()) return toast("Type a German word or phrase first.");
  if (!("speechSynthesis" in window))
    return toast("Speech playback is not available in this browser.");
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = rate;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function completeLesson() {
  const lessonId = Number(
    document
      .querySelector("#completeLesson")
      ?.closest(".lesson-page")
      ?.querySelector(".lesson-number")?.textContent,
  );
  if (!lessonId || state.completed.includes(lessonId)) return;
  state.completed.push(lessonId);
  state.completed.sort((a, b) => a - b);
  saveState();
  document.querySelector("#completeLesson").innerHTML =
    "Lesson complete <span>✓</span>";
  toast("Lesson saved to your course progress.");
  updateHeaderProgress();
}

function updateHeaderProgress() {
  document.querySelector(".profile-button").textContent = `${coursePercent()}%`;
}

function toast(message) {
  let element = document.querySelector(".toast");
  if (!element) {
    element = document.createElement("div");
    element.className = "toast";
    document.body.append(element);
  }
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => element.classList.remove("show"), 2400);
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}
function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function route(view) {
  (
    ({
      home: renderHome,
      learn: renderLearn,
      review: renderReview,
      practice: renderPractice,
      progress: renderProgress,
    })[view] || renderHome
  )();
  history.replaceState(null, "", `#${view}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (event) => {
  const levelButton = event.target.closest("[data-select-level]");
  if (levelButton) {
    state.level = levelButton.dataset.selectLevel;
    saveState();
    if (levelButton.closest(".level-picker")) {
      document.querySelectorAll("[data-select-level]").forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.selectLevel === state.level,
        );
      });
    } else {
      renderLearn();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  }
  const actionButton = event.target.closest("[data-action='continue']");
  if (actionButton) {
    if (state.level === "A2") {
      renderLearn();
    } else {
      const nextLesson =
        allLessons.find((lesson) => !state.completed.includes(lesson.id)) ||
        allLessons[0];
      renderLesson(nextLesson.id);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    route(viewButton.dataset.view);
    return;
  }
  const openButton = event.target.closest("[data-open-lesson]");
  if (openButton) {
    renderLesson(openButton.dataset.openLesson);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const speakButton = event.target.closest("[data-speak], [data-speak-target]");
  if (speakButton) {
    const text =
      speakButton.dataset.speak ||
      document.querySelector(`#${speakButton.dataset.speakTarget}`)
        ?.textContent;
    speak(text);
    return;
  }
  const quick = event.target.closest("[data-quick-phrase]");
  if (quick) {
    document.querySelector("#pronunciationInput").value =
      quick.dataset.quickPhrase;
    speak(quick.dataset.quickPhrase);
    return;
  }
  const quiz = event.target.closest("[data-quiz-option]");
  if (quiz) {
    const correct =
      quiz.dataset.quizOption.toLowerCase() ===
      quiz.dataset.answer.toLowerCase();
    document.querySelectorAll("[data-quiz-option]").forEach((button) => {
      button.disabled = true;
      if (
        button.dataset.quizOption.toLowerCase() ===
        button.dataset.answer.toLowerCase()
      )
        button.classList.add("correct");
    });
    if (!correct) quiz.classList.add("incorrect");
    document.querySelector("#quizFeedback").textContent = correct
      ? "Correct. Keep going."
      : `Not quite — the answer is “${quiz.dataset.answer}”.`;
    return;
  }
  if (event.target.closest("#completeLesson")) {
    completeLesson();
    return;
  }
  if (event.target.closest("#resetProgress")) {
    if (confirm("Clear all Klar progress stored in this browser?")) {
      state.completed = [];
      state.opened = [];
      saveState();
      route("progress");
      updateHeaderProgress();
    }
  }
});

document.querySelector("#themeButton").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.body.classList.toggle("dark", state.theme === "dark");
  saveState();
});
document.body.classList.toggle("dark", state.theme === "dark");
updateHeaderProgress();
route(location.hash.slice(1) || "home");
