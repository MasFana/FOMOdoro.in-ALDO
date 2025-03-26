import { updateTimerInputStates } from "./settings.js";
const pomodoroTime = document.querySelector(".pomodoro__time");
const sound = document.querySelector("audio");
let countdown;
let isPaused = false;
let savedTime = 0;
let endTime;
let isTimerRunning = false;

export function timer(seconds) {
  clearInterval(countdown);

  isTimerRunning = true;
  isPaused = false;
  savedTime = 0;
  endTime = Date.now() + seconds * 1000;

  displayTimeLeft(seconds);
  updateTimerInputStates(true);
  document.querySelector("#pauseBtn").classList.remove("hidden");
  document.querySelector("#stopBtn").classList.remove("hidden");
  document.querySelector(".get-started").style.display = "none";

  countdown = setInterval(() => {
    if (!isPaused) {
      const secondsLeft = Math.round((endTime - Date.now()) / 1000);

      if (secondsLeft <= 0) {
        clearInterval(countdown);
        isTimerRunning = false;
        document.title = "Time Up!";
        sound.play();
        stopTimer();
        return;
      }
      displayTimeLeft(secondsLeft);
    }
  }, 1000);

  const pauseBtn = document.querySelector("#pauseBtn");
  pauseBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
  `;
}

export function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = seconds % 60;
  const displayTime = `${minutes}:${
    secondsRemaining < 10 ? "0" : ""
  }${secondsRemaining}`;
  document.title = displayTime;
  pomodoroTime.textContent = displayTime;
}

export function pauseTimer() {
  isPaused = !isPaused;
  const pauseBtn = document.querySelector("#pauseBtn");

  if (isPaused) {
    savedTime = Math.round((endTime - Date.now()) / 1000);
    pauseBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z" />
      </svg>
    `;
  } else {
    endTime = Date.now() + savedTime * 1000;
    pauseBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
      </svg>
    `;
  }
}

export function stopTimer() {
  isTimerRunning = false;
  updateTimerInputStates(false);
  clearInterval(countdown);
  isPaused = false;
  savedTime = 0;
  document.title = "FOMOdoro.in";

  const pauseBtn = document.querySelector("#pauseBtn");
  pauseBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
  `;

  pomodoroTime.textContent = "";

  document.querySelector("#pauseBtn").classList.add("hidden");
  document.querySelector("#stopBtn").classList.add("hidden");

  document.querySelector(".get-started").style.display = "block";

  document
    .querySelectorAll(".mode")
    .forEach((mode) => mode.classList.remove("active"));
}

export function isRunning() {
  return isTimerRunning;
}
