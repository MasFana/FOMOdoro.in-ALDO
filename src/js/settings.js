import { isRunning } from "./timer.js";
const settingsModalPopover = document.querySelector("#settings-modal");
const pomodoroTimeInput = document.querySelector("#pomodoro");
const shortBreakTimeInput = document.querySelector("#short-break");
const longBreakTimeInput = document.querySelector("#long-break");
const themeToggle = document.querySelector("#theme-toggle");
const timerWarning = document.createElement("p");
timerWarning.classList.add("settings-warning");
timerWarning.textContent = "Stop the timer first to change the timer duration!";
timerWarning.style.color = "red";

export function handleSettingsFormSubmit() {
  const timeInputs = [
    pomodoroTimeInput,
    shortBreakTimeInput,
    longBreakTimeInput,
  ];
  const hasTimeChanges = timeInputs.some(
    (input) =>
      parseInt(input.value) * 60 !== parseInt(input.dataset.originalValue)
  );

  if (isRunning() && hasTimeChanges) {
    const formValues = {
      pomodoroTime: parseInt(pomodoroTimeInput.dataset.originalValue),
      shortBreakTime: parseInt(shortBreakTimeInput.dataset.originalValue),
      longBreakTime: parseInt(longBreakTimeInput.dataset.originalValue),
      isDarkMode: themeToggle.checked,
    };
    setAppSettings(formValues);
    return;
  }

  if (timeInputs.some((input) => !input.checkValidity())) {
    timeInputs.forEach((input) => input.reportValidity());
    return;
  }

  const formValues = {
    pomodoroTime: parseInt(pomodoroTimeInput.value) * 60,
    shortBreakTime: parseInt(shortBreakTimeInput.value) * 60,
    longBreakTime: parseInt(longBreakTimeInput.value) * 60,
    isDarkMode: themeToggle.checked,
  };

  if (formValues.isDarkMode) {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
  }

  timeInputs.forEach((input) => {
    input.dataset.originalValue = input.value * 60;
  });

  setAppSettings(formValues);
  localStorage.setItem("settings", JSON.stringify(formValues));
  settingsModalPopover.hidePopover();
}

export function loadSettings() {
  const settings = JSON.parse(localStorage.getItem("settings"));

  if (!settings) {
    document.body.classList.add("dark-mode");
    return;
  }
  setAppSettings(settings);
  populateSettingsForm(settings);
}

export function populateSettingsForm(settings) {
  pomodoroTimeInput.value = parseInt(settings.pomodoroTime) / 60;
  shortBreakTimeInput.value = parseInt(settings.shortBreakTime) / 60;
  longBreakTimeInput.value = parseInt(settings.longBreakTime) / 60;
  themeToggle.checked = settings.isDarkMode;
}

function setActiveButton(buttons, classPrefix, classEnding) {
  Array.from(buttons)
    .map((button) => (button.classList.remove("active"), button))
    .find((button) =>
      button.classList.contains(`${classPrefix}-${classEnding}`)
    )
    .classList.add("active");
}

function setAppSettings(settings) {
  const pomodoroModeTime = document.querySelector("[data-pomodoro]");
  const shortBreakModeTime = document.querySelector("[data-short-break]");
  const longBreakModeTime = document.querySelector("[data-long-break]");

  pomodoroModeTime.dataset.time = settings.pomodoroTime;
  shortBreakModeTime.dataset.time = settings.shortBreakTime;
  longBreakModeTime.dataset.time = settings.longBreakTime;

  if (settings.isDarkMode) {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    document.querySelector("#settings-modal").classList.add("dark");
    document.querySelector("#about-modal").classList.add("dark");
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    document.querySelector("#settings-modal").classList.remove("dark");
    document.querySelector("#about-modal").classList.remove("dark");
  }
}

export function setupThemeToggle() {
  const themeToggle = document.querySelector("#theme-toggle");
  document.body.classList.add("light-mode");
  themeToggle.checked = false;
}

export function updateTimerInputStates(isRunning) {
  const inputsContainer = document.querySelector(
    ".settings-modal__inputs-wrap"
  );
  const timeInputs = [
    pomodoroTimeInput,
    shortBreakTimeInput,
    longBreakTimeInput,
  ];

  timeInputs.forEach((input) => {
    input.disabled = isRunning;
  });

  if (isRunning) {
    inputsContainer.appendChild(timerWarning);
  } else {
    timerWarning.remove();
  }
}
