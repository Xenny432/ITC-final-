const selectedDateInfo = document.getElementById("selected-date-info");
let selectedDayButton = null;

document.querySelectorAll(".day-cell button").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
});

document.querySelector(".days")?.addEventListener("click", (event) => {
  const button = event.target.closest(".day-cell button");

  if (!button) {
    return;
  }

  if (button === selectedDayButton) {
    button.setAttribute("aria-pressed", "false");
    button.classList.remove("selected");
    selectedDayButton = null;
    selectedDateInfo.hidden = true;
    selectedDateInfo.textContent = "";
    return;
  }

  if (selectedDayButton) {
    selectedDayButton.setAttribute("aria-pressed", "false");
    selectedDayButton.classList.remove("selected");
  }

  selectedDayButton = button;
  button.setAttribute("aria-pressed", "true");
  button.classList.add("selected");
  selectedDateInfo.textContent = button.parentElement.querySelector(".tooltip").textContent;
  selectedDateInfo.hidden = false;
});
