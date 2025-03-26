import { handleSettingsFormSubmit, setupThemeToggle } from "./settings.js";
import { timer, pauseTimer, stopTimer } from "./timer.js";

const modes = document.querySelectorAll(".mode");
const getStartedMessage = document.querySelector(".get-started");
const settingsModalPopover = document.querySelector("#settings-modal");
const aboutModalPopover = document.querySelector("#about-modal");
const settingsModalApplyButton = document.querySelector(".settings-modal__btn");
const settingsButton = document.querySelector(".settings-btn__wrap button");

export function setupEventListeners() {
  modes.forEach((mode) => mode.addEventListener("click", switchModes));
  const pauseBtn = document.querySelector('#pauseBtn');
  const stopBtn = document.querySelector('#stopBtn');
  pauseBtn.addEventListener('click', pauseTimer);
  stopBtn.addEventListener('click', stopTimer);
  
  document.addEventListener("keyup", (event) => {
    if (event.target.localName === "input") return;
    if (event.key === "s") {
      settingsModalPopover.classList.toggle("is-visible");
    }
    else if (event.key === "a") {
      aboutModalPopover.classList.toggle("is-visible");
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".settings-modal__container") && 
        !event.target.closest(".settings-btn__wrap") && 
        settingsModalPopover.classList.contains("is-visible")) {
      settingsModalPopover.classList.remove("is-visible");
    }

    if (!event.target.closest(".about-modal__container") && 
        !event.target.closest(".about-btn") && 
        aboutModalPopover.classList.contains("is-visible")) {
      aboutModalPopover.classList.remove("is-visible");
    }
  });

  settingsButton.addEventListener("click", () => {
    settingsModalPopover.classList.toggle("is-visible");
  });
  settingsModalApplyButton.addEventListener("click", handleSettingsFormSubmit);
  setupThemeToggle();
}

function switchModes(event) {
  const secondsForMode = parseInt(event.target.dataset.time, 10);
  modes.forEach((mode) => mode.classList.remove("active"));
  event.target.classList.add("active");
  getStartedMessage.style.display = "none";
  timer(secondsForMode);
}
