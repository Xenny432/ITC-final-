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

function setSemesterProgress(startDateStr, endDateStr) {
  const box = document.querySelector(".semester-progress-box");
  if (!box) return;

  const start = new Date(startDateStr).getTime();
  const end = new Date(endDateStr).getTime();
  const now = Date.now();

  const pct = Math.max(0, Math.min(100, Math.round(((now - start) / (end - start)) * 100)));

  const fill = box.querySelector(".semester-progress-fill");
  const valueEl = box.querySelector(".semester-progress-value");
  const track = box.querySelector(".semester-progress-track");
  const subtext = box.querySelector(".semester-progress-subtext");

  if (fill) fill.style.width = `${pct}%`;
  if (valueEl) valueEl.textContent = `${pct}%`;
  if (track) track.setAttribute("aria-valuenow", String(pct));
  if (subtext) subtext.textContent = `${100 - pct}% remaining until the 1st semester ends`;
}

function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function updateSemesterProgress() {
  const box = document.querySelector(".semester-progress-box");
  if (!box) return;

  const startStr = box.dataset.start || "2026-07-20";
  const endStr = box.dataset.end || "2026-11-27";

  const startDate = parseLocalDate(startStr);
  const endDate = parseLocalDate(endStr);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.max(1, Math.round((endDate - startDate) / msPerDay));
  const elapsedDays = Math.round((today - startDate) / msPerDay);

  const rawPct = (elapsedDays / totalDays) * 100;
  const pct = Math.max(0, Math.min(100, Math.round(rawPct)));
  const daysRemaining = Math.max(0, Math.round((endDate - today) / msPerDay));

  const fill = box.querySelector(".semester-progress-fill");
  const valueEl = box.querySelector(".semester-progress-value");
  const track = box.querySelector(".semester-progress-track");
  const subtext = box.querySelector(".semester-progress-subtext");

  if (fill) fill.style.width = `${pct}%`;
  if (valueEl) valueEl.textContent = `${pct}%`;
  if (track) track.setAttribute("aria-valuenow", String(pct));
  if (subtext) {
    if (today < startDate) {
      subtext.textContent = `Starts Jul 20, 2026 · Ends Nov 27, 2026`;
    } else if (today >= endDate) {
      subtext.textContent = `1st semester completed (Jul 20 – Nov 27, 2026)`;
    } else {
      subtext.textContent = `${100 - pct}% left (${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} until Nov 27, 2026)`;
    }
  }
}

updateSemesterProgress();