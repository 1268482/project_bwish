// calendar.js – renders the monthly calendar grid
import { daysInMonth } from './utils.js';

/**
 * Render a calendar for the given year/month inside a container element.
 * Returns a Map where the key is the day number (1‑31) and the value is the
 * corresponding DOM element for that day. The calling code can use the map to
 * locate the cell position for animation.
 *
 * @param {Object} opts
 * @param {string} opts.containerId - id of the div that will hold the grid.
 * @param {number} opts.year        - full year (e.g. 2026).
 * @param {number} opts.month       - 0‑based month (0 = January).
 * @param {number} opts.today       - day of month that is today.
 * @param {number} opts.birthday   - day of month that is the birthday.
 */
export function renderCalendar({containerId, year, month, today, birthday}) {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container #${containerId} not found`);
  container.innerHTML = '';

  const totalDays = daysInMonth(year, month);
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Fill initial empty slots so the first day lands on the correct weekday
  for (let i = 0; i < firstWeekday; i++) {
    const empty = document.createElement('div');
    empty.className = 'day-cell empty';
    container.appendChild(empty);
  }

  const map = new Map();
  for (let d = 1; d <= totalDays; d++) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';
    cell.textContent = d;
    if (d === today) cell.classList.add('today');
    if (d === birthday) cell.classList.add('birthday');
    container.appendChild(cell);
    map.set(d, cell);
  }

  return map;
}
