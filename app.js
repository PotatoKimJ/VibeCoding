const QUESTIONS_PER_QUIZ = 5;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const questionNumEl = document.getElementById("question-num");
const questionWordEl = document.getElementById("question-word");
const questionReadingEl = document.getElementById("question-reading");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const progressFill = document.getElementById("progress-fill");
const scoreTextEl = document.getElementById("score-text");
const scorePercentEl = document.getElementById("score-percent");
const restartBtn = document.getElementById("restart-btn");
const contactModal = document.getElementById("contact-modal");
const contactOpenBtn = document.getElementById("contact-open-btn");
const contactBackdrop = document.getElementById("contact-backdrop");
const contactCloseBtn = document.getElementById("contact-close-btn");
const contactFormEl = document.getElementById("contact-form");
const contactFormMsg = document.getElementById("contact-form-msg");
const contactSubmitBtn = document.getElementById("contact-submit-btn");

let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let answered = false;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickRandomWords(count) {
  const shuffled = shuffle(VOCABULARY);
  return shuffled.slice(0, count);
}

function getWrongChoices(correctMeaning, count) {
  const others = VOCABULARY
    .filter((v) => v.meaning !== correctMeaning)
    .map((v) => v.meaning);
  const unique = [...new Set(others)];
  const shuffled = shuffle(unique);
  return shuffled.slice(0, count);
}

function buildQuestion(vocab) {
  const wrongs = getWrongChoices(vocab.meaning, 3);
  const options = shuffle([vocab.meaning, ...wrongs]);
  return {
    word: vocab.word,
    reading: vocab.reading,
    meaning: vocab.meaning,
    options,
  };
}

function startQuiz() {
  const picked = pickRandomWords(QUESTIONS_PER_QUIZ);
  currentQuiz = picked.map(buildQuestion);
  currentIndex = 0;
  score = 0;
  answered = false;
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");
  resultScreen.classList.remove("active");
  showQuestion();
}

function showQuestion() {
  const q = currentQuiz[currentIndex];
  if (!q) {
    showResult();
    return;
  }

  answered = false;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.style.display = "none";

  const progress = ((currentIndex + 1) / currentQuiz.length) * 100;
  progressFill.style.width = `${progress}%`;

  questionNumEl.textContent = `${currentIndex + 1} / ${currentQuiz.length}`;
  questionWordEl.textContent = q.word;
  questionReadingEl.textContent = q.reading;

  const choiceBtns = choicesEl.querySelectorAll(".choice-btn");
  choiceBtns.forEach((btn, i) => {
    btn.textContent = q.options[i];
    btn.disabled = false;
    btn.classList.remove("correct", "wrong");
  });
}

function showResult() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");
  scoreTextEl.textContent = `${QUESTIONS_PER_QUIZ}문제 중 ${score}문제 맞춤`;
  scorePercentEl.textContent = `${Math.round((score / QUESTIONS_PER_QUIZ) * 100)}%`;
}

function onChoiceClick(e) {
  if (answered) return;
  const btn = e.target.closest(".choice-btn");
  if (!btn || btn.disabled) return;

  const selected = btn.textContent;
  const q = currentQuiz[currentIndex];
  const isCorrect = selected === q.meaning;

  answered = true;
  if (isCorrect) score++;

  const choiceBtns = choicesEl.querySelectorAll(".choice-btn");
  choiceBtns.forEach((b) => {
    b.disabled = true;
    if (b.textContent === q.meaning) b.classList.add("correct");
    else if (b === btn && !isCorrect) b.classList.add("wrong");
  });

  feedbackEl.textContent = isCorrect ? "정답입니다! 正解！" : `틀렸어요. 정답: ${q.meaning}`;
  feedbackEl.className = "feedback " + (isCorrect ? "correct-msg" : "wrong-msg");
  nextBtn.style.display = "block";
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= currentQuiz.length) {
    showResult();
  } else {
    showQuestion();
  }
}

function restart() {
  resultScreen.classList.remove("active");
  startScreen.classList.add("active");
}

// 연락하기 모달
function openContactModal() {
  contactModal.classList.add("is-open");
  contactModal.setAttribute("aria-hidden", "false");
  contactFormMsg.textContent = "";
  contactFormMsg.className = "form-msg";
  contactFormEl.reset();
}

function closeContactModal() {
  contactModal.classList.remove("is-open");
  contactModal.setAttribute("aria-hidden", "true");
}

contactOpenBtn.addEventListener("click", openContactModal);
contactBackdrop.addEventListener("click", closeContactModal);
contactCloseBtn.addEventListener("click", closeContactModal);

contactFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(contactFormEl);
  const name = formData.get("name").trim();
  const phone = formData.get("phone").trim();
  const email = formData.get("email").trim();

  if (!name || !phone || !email) {
    contactFormMsg.textContent = "모든 항목을 입력해 주세요.";
    contactFormMsg.className = "form-msg error";
    return;
  }

  contactSubmitBtn.disabled = true;
  contactFormMsg.textContent = "전송 중...";
  contactFormMsg.className = "form-msg";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      contactFormMsg.textContent = "제출되었습니다. 연락드리겠습니다!";
      contactFormMsg.className = "form-msg success";
      contactFormEl.reset();
      setTimeout(closeContactModal, 1500);
    } else {
      contactFormMsg.textContent = data.message || "전송에 실패했습니다. 나중에 다시 시도해 주세요.";
      contactFormMsg.className = "form-msg error";
    }
  } catch (err) {
    contactFormMsg.textContent = "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해 주세요.";
    contactFormMsg.className = "form-msg error";
  } finally {
    contactSubmitBtn.disabled = false;
  }
});

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restart);
choicesEl.addEventListener("click", onChoiceClick);
