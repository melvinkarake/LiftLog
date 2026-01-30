// Progressive overload calculator
const currentWeightInput = document.getElementById("current-weight");
const repsCompletedInput = document.getElementById("reps-completed");
const targetRepsInput = document.getElementById("target-reps");
const calculateBtn = document.getElementById("calculate-btn");
const resultBox = document.getElementById("calc-result");
const resultWeight = document.querySelector(".calc-weight");
const resultAdvice = document.querySelector(".calc-advice");

function formatKg(value) {
  if (isNaN(value)) return "";
  return value.toFixed(1).replace(".0", "") + " kg";
}

calculateBtn.addEventListener("click", () => {
  const currentWeight = parseFloat(currentWeightInput.value);
  const repsCompleted = parseInt(repsCompletedInput.value, 10);
  const targetReps = parseInt(targetRepsInput.value, 10);

  if (!currentWeight || !repsCompleted || !targetReps) {
    resultBox.classList.remove("hidden");
    resultWeight.textContent = "Vul alle velden in.";
    resultAdvice.textContent =
      "Gebruik realistische cijfers – dit is een hulpmiddel, geen magische formule.";
    // AI blok leeg maken / resetten
    updateAiBlock(null, null, "Vul eerst je laatste sessie in.");
    return;
  }

  let nextWeight = currentWeight;
  let adviceText = "";
  let aiNote = "";

  if (repsCompleted >= targetReps) {
    nextWeight = currentWeight + 2.5;
    resultWeight.textContent = formatKg(nextWeight);
    adviceText =
      "Sterk werk. Volgende sessie kun je veilig iets zwaarder gaan.";
    aiNote =
      "De AI neemt aan dat je alle reps haalt en test een kleine verhoging (+2.5 kg). In de echte versie gebruikt ze meer data (vermoeidheid, slaap, volume).";
  } else if (repsCompleted >= Math.round(targetReps * 0.6)) {
    nextWeight = currentWeight;
    resultWeight.textContent = formatKg(nextWeight);
    adviceText =
      "Blijf nog één sessie op dit gewicht tot je alle reps haalt.";
    aiNote =
      "De AI ziet dat je nog niet alle reps haalt en kiest voor stabiliteit. Geen verhoging tot je consistent je target haalt.";
  } else {
    nextWeight = currentWeight * 0.9;
    resultWeight.textContent = formatKg(nextWeight);
    adviceText =
      "Vandaag was zwaar. Een lichte deload kan je op lange termijn sterker maken.";
    aiNote =
      "Omdat je ver onder je target zit, stelt de AI een deload voor (~10% lager) om overbelasting te vermijden.";
  }

  resultAdvice.textContent = adviceText;
  resultBox.classList.remove("hidden");

  // AI-blok updaten
  updateAiBlock(
    `3 × ${targetReps} @ ${formatKg(currentWeight)}`,
    `3 × ${targetReps} @ ${formatKg(nextWeight)}`,
    aiNote
  );
});


// Kleine UX: smooth scroll voor nav links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Waitlist form dummy handler
const waitlistForm = document.querySelector(".waitlist-form");
const waitlistInput = waitlistForm?.querySelector("input[type='email']");

waitlistForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = waitlistInput.value.trim();

  if (!email || !email.includes("@")) {
    alert("Voer een geldig e-mailadres in.");
    return;
  }

  alert(`Bedankt ${email}, je staat op de LiftLog wachtlijst!`);
  waitlistInput.value = "";
});

// ---- AI block updater ----
const aiLastSession = document.getElementById("ai-last-session");
const aiSuggestion = document.getElementById("ai-suggestion");
const aiNoteEl = document.getElementById("ai-note");

function updateAiBlock(lastSessionText, suggestionText, noteText) {
  if (!aiLastSession || !aiSuggestion || !aiNoteEl) return;

  if (!lastSessionText || !suggestionText) {
    aiLastSession.textContent = "—";
    aiSuggestion.textContent = "—";
    aiNoteEl.textContent = noteText || "";
    return;
  }

  aiLastSession.textContent = lastSessionText;
  aiSuggestion.textContent = suggestionText;
  aiNoteEl.textContent = noteText;
}
