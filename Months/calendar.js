const modal = document.getElementById("activity-modal");
const modalBody = document.getElementById("activity-modal-body");
const closeModalBtn = document.getElementById("close-activity-modal");
let selectedDayButton = null;

document.querySelectorAll(".day-cell button").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
});

function syncActivityHighlights() {
  document.querySelectorAll(".day-cell").forEach((cell) => {
    const button = cell.querySelector("button");
    const tooltip = cell.querySelector(".tooltip");
    if (!button || !tooltip) return;

    // A day has a scheduled activity if its tooltip contains <br> or extra text after the date
    const hasBr = Boolean(tooltip.querySelector("br"));
    const lines = tooltip.innerText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const hasActivity = hasBr || lines.length > 1 || button.classList.contains("has-activity");

    button.classList.toggle("has-activity", hasActivity);
  });
}

syncActivityHighlights();

function ensureBackToContentButton() {
  if (!document.querySelector(".days") && !document.querySelector(".month")) return;

  const titleBar = document.querySelector(".title");
  if (!titleBar || titleBar.querySelector(".back-content-btn")) return;

  const backLink = document.createElement("a");
  backLink.href = "../content.html";
  backLink.className = "back-content-btn";
  backLink.setAttribute("aria-label", "Back to home page");
  backLink.innerHTML = "&#8592; Home Page";

  titleBar.prepend(backLink);
}

ensureBackToContentButton();

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