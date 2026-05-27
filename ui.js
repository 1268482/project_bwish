// ui.js – UI interactions and state management
import { renderCalendar } from './calendar.js';
import { startParticles } from './particles.js';

// Global state object that app.js will read
window.appState = {
  todayCell: null,
  birthdayCell: null,
  cellMap: null,
  userName: 'Mano',
};

/** Initialize the landing form */
function initForm() {
  const form = document.getElementById('birthForm');
  const nameInput = document.getElementById('nameInput');
  const dateInput = document.getElementById('dateInput');
  const userNameDisplay = document.getElementById('userNameDisplay');

  // keep name display in sync while typing
  nameInput.addEventListener('input', () => {
    const val = nameInput.value.trim() || 'Mano';
    userNameDisplay.textContent = val;
    window.appState.userName = val;
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = nameInput.value.trim() || 'Mano';
    const dateStr = dateInput.value; // ISO format yyyy-mm-dd
    if (!dateStr) {
      alert('Please pick a birthday date.');
      return;
    }
    // Parse date string as local date to avoid timezone shift
    const [year, month, day] = dateStr.split('-').map(Number);
    const birthday = new Date(year, month - 1, day);
    // store name
    window.appState.userName = name;
    userNameDisplay.textContent = name;

    // hide landing, show calendar screen
    document.getElementById('landingScreen').classList.add('hidden');
    document.getElementById('calendarScreen').classList.remove('hidden');

    // start particle background
    startParticles();

    // render calendar for current month (using today as reference)
    // Determine the month/year of the birthday
    const birthdayMonth = birthday.getMonth();
    const birthdayYear = birthday.getFullYear();
    // If the birthday is in the current month, also highlight today
    const today = new Date();
    const isSameMonth = today.getMonth() === birthdayMonth && today.getFullYear() === birthdayYear;
    const options = {
      containerId: 'calendarContainer',
      year: birthdayYear,
      month: birthdayMonth,
      today: isSameMonth ? today.getDate() : null,
      birthday: birthday.getDate(), // day of month for birthday
    };
    const map = renderCalendar(options);
    window.appState.cellMap = map;
    // locate cells by class
    const todayCell = document.querySelector('.day-cell.today');
    const birthdayCell = document.querySelector('.day-cell.birthday');
    window.appState.todayCell = todayCell;
    window.appState.birthdayCell = birthdayCell;
    // expose birthday date for final message
    window.appState.birthdayDate = birthday;
    // update header with month name
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const header = document.getElementById('todayHeader');
    header.textContent = `${monthNames[options.month]} ${options.year}`;
    console.log('Calendar rendered', options);
    // trigger animation after a short pause (app.js will handle missing cells)
    setTimeout(() => {
      const event = new Event('calendarReady');
      document.dispatchEvent(event);
    }, 300);
  });
}

// Execute when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForm);
} else {
  initForm();
}
