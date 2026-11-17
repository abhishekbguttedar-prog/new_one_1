/*
  EDIT THE EVENT SETTINGS BELOW before publishing.
  Date format: YYYY-MM-DD
  Time format: 24-hour HH:MM (India time, Asia/Kolkata)
*/
const EVENT = {
  date: "2027-01-29", // CHANGE to confirmed engagement date
  time: "18:00",      // CHANGE to confirmed engagement time
  timeLabel: "6:00 PM", 
  venueName: "Kothari Bhavan", // CHANGE if engagement venue is different
  venueAddress: "New Jewargi Rd, Lal Bahadur Shastri Nagar, Kalaburagi, Karnataka 585102, India"
};

const $ = (id) => document.getElementById(id);
const screens = [...document.querySelectorAll(".screen")];
let currentPage = 1;
let countdownInterval;

function showPage(number) {
  if (number < 1 || number > 3) return;
  currentPage = number;
  screens.forEach((screen, index) => {
    screen.classList.toggle("active", index === number - 1);
    screen.setAttribute("aria-hidden", index === number - 1 ? "false" : "true");
  });
  document.querySelectorAll(".page-count").forEach((el, index) => {
    el.textContent = `${index + 1} of 3`;
  });
  if (number === 1) {
    document.querySelector(".invitation").classList.remove("curtains-open");
  } else {
    document.querySelector(".invitation").classList.add("curtains-open");
  }
  if (number === 3) startCountdown();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showPage(Number(button.dataset.go)));
});
$("replayButton").addEventListener("click", () => {
  showPage(1);
  // Re-run the opening animation on replay.
  const envelope = document.querySelector(".envelope");
  envelope.style.animation = "none";
  void envelope.offsetWidth;
  envelope.style.animation = "";
});

function setupEventDetails() {
  $("eventDate").textContent = EVENT.date === "2027-01-29"
    ? "29 January 2027 (edit if needed)"
    : new Date(`${EVENT.date}T00:00:00`).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" });
  $("eventTime").textContent = EVENT.timeLabel || EVENT.time;
  $("venueName").textContent = EVENT.venueName;
  $("venueAddress").textContent = EVENT.venueAddress;

  const query = encodeURIComponent(`${EVENT.venueName}, ${EVENT.venueAddress}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  $("mapLink").href = mapsUrl;
  $("directionsLink").href = directionsUrl;
}

function eventTimestamp() {
  // The event time is interpreted in India Standard Time (UTC+05:30).
  return new Date(`${EVENT.date}T${EVENT.time}:00+05:30`).getTime();
}

function updateUnit(id, value) {
  const el = $(id);
  const formatted = String(value).padStart(2, "0");
  if (el.textContent !== formatted) {
    el.textContent = formatted;
    el.parentElement.classList.remove("tick");
    void el.offsetWidth;
    el.parentElement.classList.add("tick");
  }
}

function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  const target = eventTimestamp();

  function tick() {
    const remaining = target - Date.now();
    if (remaining <= 0) {
      ["days","hours","minutes","seconds"].forEach(id => updateUnit(id, 0));
      $("startedMessage").hidden = false;
      clearInterval(countdownInterval);
      return;
    }
    $("startedMessage").hidden = true;
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    updateUnit("days", days);
    updateUnit("hours", hours);
    updateUnit("minutes", minutes);
    updateUnit("seconds", seconds);
  }
  tick();
  countdownInterval = setInterval(tick, 1000);
}

function createParticles() {
  const container = $("particles");
  for (let i = 0; i < 34; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = `${Math.random() * 100}%`;
    particle.style.setProperty("--dur", `${7 + Math.random() * 10}s`);
    particle.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(particle);
  }
}

setupEventDetails();
createParticles();
setTimeout(() => document.querySelector(".invitation").classList.add("curtains-open"), 350);
