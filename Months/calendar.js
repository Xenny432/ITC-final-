const modal = document.getElementById("activity-modal");
const modalBody = document.getElementById("activity-modal-body");
const closeModalBtn = document.getElementById("close-activity-modal");
let selectedDayButton = null;

document.querySelectorAll(".day-cell button").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
});

function closeActivityModal() {
  if (!modal) return;
  modal.hidden = true;
  if (modalBody) {
    modalBody.innerHTML = "";
  }
  if (selectedDayButton) {
    selectedDayButton.setAttribute("aria-pressed", "false");
    selectedDayButton.classList.remove("selected");
    selectedDayButton = null;
  }
}

document.querySelector(".days")?.addEventListener("click", (event) => {
  const button = event.target.closest(".day-cell button");
  if (!button || !modal || !modalBody) return;

  if (button === selectedDayButton && !modal.hidden) {
    closeActivityModal();
    return;
  }

  if (selectedDayButton) {
    selectedDayButton.setAttribute("aria-pressed", "false");
    selectedDayButton.classList.remove("selected");
  }

  selectedDayButton = button;
  button.setAttribute("aria-pressed", "true");
  button.classList.add("selected");

  const tooltip = button.parentElement.querySelector(".tooltip");
  modalBody.innerHTML = tooltip
    ? tooltip.innerHTML
    : "<p>No scheduled activity for this day.</p>";

  modal.hidden = false;
});

closeModalBtn?.addEventListener("click", closeActivityModal);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeActivityModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.hidden) {
    closeActivityModal();
  }
});