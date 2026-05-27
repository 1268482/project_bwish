// app.js – orchestrates the animation and final wish
import { startParticles } from './particles.js'; // already started by UI, but ensure fallback

// Helper to get element center relative to the page
function getCenter(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 + window.scrollX,
    y: rect.top + rect.height / 2 + window.scrollY,
  };
}

function animateHand(startPos, endPos, duration = 2000) {
  const hand = document.getElementById('handMarker');
  if (!hand) return;
  hand.classList.remove('hidden');
  hand.style.left = `${startPos.x - hand.offsetWidth / 2}px`;
  hand.style.top = `${startPos.y - hand.offsetHeight / 2}px`;

  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1); // 0..1
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad
    const curX = startPos.x + (endPos.x - startPos.x) * ease;
    const curY = startPos.y + (endPos.y - startPos.y) * ease;
    hand.style.left = `${curX - hand.offsetWidth / 2}px`;
    hand.style.top = `${curY - hand.offsetHeight / 2}px`;
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      // animation finished
      hand.classList.add('hidden');
      showWish();
    }
  }
  requestAnimationFrame(step);
}

function showWish() {
  const wishBox = document.getElementById('wishBox');
  if (!wishBox) return;
  const name = window.appState.userName || 'Friend';
  const today = new Date();
  const bday = window.appState.birthdayDate;
  // Use copies so setHours doesn't mutate the originals
  const todayCopy = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const bdayCopy = new Date(bday.getFullYear(), bday.getMonth(), bday.getDate());
  const diffTime = bdayCopy.getTime() - todayCopy.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  let message = '';
  if (diffDays === 0) {
    message = `Happy Birthday, ${name}! 🎉`;
  } else if (diffDays > 0) {
    message = `${name}, your birthday is in ${diffDays} day${diffDays === 1 ? '' : 's'}!`;
  } else {
    // birthday already passed this year – show next year's countdown
    const nextYear = new Date(todayCopy.getFullYear() + 1, bdayCopy.getMonth(), bdayCopy.getDate());
    const nextDiff = Math.round((nextYear - todayCopy) / (1000 * 60 * 60 * 24));
    message = `${name}, your birthday was ${-diffDays} day${-diffDays === 1 ? '' : 's'} ago. Next one in ${nextDiff} days!`;
  }
  wishBox.textContent = message;
  wishBox.classList.remove('hidden');
}

// Listen for UI to signal the calendar is ready
document.addEventListener('calendarReady', () => {
  const { todayCell, birthdayCell } = window.appState;
  if (!todayCell || !birthdayCell) {
    console.warn('Missing today or birthday cell – fallback to wish');
    showWish();
    return;
  }
  const start = getCenter(todayCell);
  const end = getCenter(birthdayCell);
  animateHand(start, end);
});

// Ensure particles run even if UI missed start (fallback)
if (!window.particlesStarted) {
  startParticles();
  window.particlesStarted = true;
}
