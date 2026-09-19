/* ============================================
   A A Smoke Shop — site behavior
   Hours are defined once here. Edit HOURS below
   if the shop's schedule ever changes — every
   page pulls from this same source.
   ============================================ */

// 0 = Sunday ... 6 = Saturday. Times are 24hr, in Houston (America/Chicago) time.
const HOURS = {
  0: { open: 11, close: 22 },   // Sunday 11am–10pm
  1: { open: 10, close: 22 },   // Monday 10am–10pm
  2: { open: 10, close: 22 },   // Tuesday 10am–10pm
  3: { open: 10, close: 22 },   // Wednesday 10am–10pm
  4: { open: 10, close: 22 },   // Thursday 10am–10pm
  5: { open: 10, close: 23 },   // Friday 10am–11pm
  6: { open: 10, close: 23 },   // Saturday 10am–11pm
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatHour(h) {
  const period = h >= 12 ? "PM" : "AM";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12} ${period}`;
}

function getHoustonNow() {
  // Get the current date/time as it is in America/Chicago, regardless of visitor's own timezone.
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  const map = {};
  parts.forEach((p) => (map[p.type] = p.value));

  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(map.weekday);
  const hour = parseInt(map.hour, 10);
  const minute = parseInt(map.minute, 10);

  return { weekdayIndex, hour, minute };
}

function computeStatus() {
  const { weekdayIndex, hour, minute } = getHoustonNow();
  const today = HOURS[weekdayIndex];
  const nowDecimal = hour + minute / 60;

  const isOpen = nowDecimal >= today.open && nowDecimal < today.close;

  return {
    isOpen,
    weekdayIndex,
    closesAt: today.close,
    opensAt: today.open,
  };
}

function renderStatusBadges() {
  const badges = document.querySelectorAll("[data-status-badge]");
  if (!badges.length) return;

  const status = computeStatus();

  badges.forEach((badge) => {
    badge.classList.remove("is-open", "is-closed");
    const label = badge.querySelector("[data-status-label]");

    if (status.isOpen) {
      badge.classList.add("is-open");
      if (label) label.textContent = `Open now · closes ${formatHour(status.closesAt)}`;
    } else {
      badge.classList.add("is-closed");
      if (label) label.textContent = `Closed now · opens ${formatHour(status.opensAt)}`;
    }
  });
}

function highlightToday() {
  const rows = document.querySelectorAll("[data-hours-row]");
  if (!rows.length) return;

  const { weekdayIndex } = getHoustonNow();
  const todayName = DAY_NAMES[weekdayIndex];

  rows.forEach((row) => {
    if (row.getAttribute("data-hours-row") === todayName) {
      row.classList.add("is-today");
    }
  });
}

function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderStatusBadges();
  highlightToday();
  setupNavToggle();
});
