
// Simple calendar and booking logic
const calendarDiv = document.getElementById('calendar');
const bookingForm = document.getElementById('booking-form');
const selectedDateInput = document.getElementById('selected-date');

const unavailable = [];

let currentMonth, currentYear;

function getToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function renderMonthYearSelector() {
    const today = getToday();
    const minYear = today.getFullYear();
    const maxYear = minYear + 1;
    let html = '<div class="calendar-controls">';
    html += '<select id="calendar-month">';
    for (let m = 0; m < 12; m++) {
        html += `<option value="${m}" ${m === currentMonth ? 'selected' : ''}>${new Date(0, m).toLocaleString('es', {month: 'long'})}</option>`;
    }
    html += '</select>';
    html += '<select id="calendar-year">';
    for (let y = minYear; y <= maxYear; y++) {
        html += `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`;
    }
    html += '</select>';
    html += '</div>';
    return html;
}

function renderCalendar() {
    const today = getToday();
    if (currentMonth === undefined || currentYear === undefined) {
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
    }
    let html = renderMonthYearSelector();
    html += `<table class='calendar-table'><thead><tr>`;
    const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    for (let d of days) html += `<th>${d}</th>`;
    html += '</tr></thead><tbody><tr>';
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) html += '<td></td>';
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isUnavailable = unavailable.includes(dateStr);
        const cellDate = new Date(currentYear, currentMonth, d);
        // Compare only year, month, day for today and cellDate
        const isToday = cellDate.getFullYear() === today.getFullYear() && cellDate.getMonth() === today.getMonth() && cellDate.getDate() === today.getDate();
        const isPast = cellDate < today;
        const isPastOrToday = isPast || isToday;
        let classes = 'calendar-cell';
        if (isUnavailable || isPastOrToday) classes += ' unavailable';
        else classes += ' available';
        html += `<td class='${classes}' data-date='${dateStr}'>${d}</td>`;
        if ((firstDay + d) % 7 === 0) html += '</tr><tr>';
    }
    html += '</tr></tbody></table>';
    calendarDiv.innerHTML = html;
    document.getElementById('calendar-month').addEventListener('change', e => {
        currentMonth = parseInt(e.target.value);
        renderCalendar();
    });
    document.getElementById('calendar-year').addEventListener('change', e => {
        currentYear = parseInt(e.target.value);
        renderCalendar();
    });
    document.querySelectorAll('.available').forEach(cell => {
        cell.addEventListener('click', () => selectDate(cell.dataset.date));
    });
}

function selectDate(date) {
    // Always hide the booking form first
    bookingForm.style.display = 'none';
    const today = getToday();
    const selected = new Date(date + 'T00:00:00');
    // Block same-day reservations (just do nothing)
    if (
        selected.getFullYear() === today.getFullYear() &&
        selected.getMonth() === today.getMonth() &&
        selected.getDate() === today.getDate()
    ) {
        return;
    }
    // Only show booking form for future dates
    if (selected > today) {
        bookingForm.style.display = 'block';
        selectedDateInput.value = date;
        bookingForm.scrollIntoView({behavior: 'smooth'});
        // Show external reservar button
        const externalBtn = document.getElementById('external-reservar-btn');
        if (externalBtn) {
            externalBtn.style.display = 'block';
        }
    }
}

// Simple form handler (no backend)
document.addEventListener('DOMContentLoaded', () => {
    // Hide booking form and popup on page load
    bookingForm.style.display = 'none';
    const popup = document.getElementById('reserva-popup');
    if (popup) popup.style.display = 'none';
    renderCalendar();
    // Custom AJAX Formspree submission to show rose gold popup instead of redirect
    const form = bookingForm.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show rose gold confirmation popup
                const confirmationPopup = document.getElementById('confirmation-popup');
                if (confirmationPopup) confirmationPopup.style.display = 'flex';
                bookingForm.style.display = 'none';
                const externalBtn = document.getElementById('external-reservar-btn');
                if (externalBtn) externalBtn.style.display = 'none';
                form.reset();
            } else {
                response.json().then(data => {
                    alert(data.error || 'Hubo un error al enviar el formulario.');
                });
            }
        })
        .catch(() => {
            alert('Hubo un error al enviar el formulario.');
        });
    });
    // Confirmation popup close button (X)
    const closeConfirmationBtn = document.getElementById('close-confirmation-btn');
    if (closeConfirmationBtn) {
        closeConfirmationBtn.addEventListener('click', () => {
            const confirmationPopup = document.getElementById('confirmation-popup');
            if (confirmationPopup) confirmationPopup.style.display = 'none';
        });
    }
    // External Reservar button functionality
    const externalBtn = document.getElementById('external-reservar-btn');
    if (externalBtn) {
        externalBtn.addEventListener('click', () => {
            // Validate form before submitting
            const form = bookingForm.querySelector('form');
            if (form.checkValidity()) {
                form.requestSubmit();
            } else {
                form.reportValidity();
            }
        });
    }
    // Close popup button
    const closePopupBtn = document.getElementById('close-popup-btn');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            const popup = document.getElementById('reserva-popup');
            if (popup) popup.style.display = 'none';
        });
    }
});
