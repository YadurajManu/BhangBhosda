// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    loadAppointments();
    setupEventListeners();
    updateNotifications();
});

// Initialize Dashboard Elements
function initializeDashboard() {
    // Update profile information
    updateProfileInfo();
    
    // Update statistics
    updateStatistics();
    
    // Initialize date filter
    initializeDateFilter();
}

// Update Profile Information
function updateProfileInfo() {
    const profileImage = document.querySelector('.profile-image');
    const profileName = document.querySelector('.profile-name');
    
    if (doctorProfile) {
        profileImage.src = doctorProfile.image;
        profileImage.alt = doctorProfile.name;
        profileName.textContent = doctorProfile.name;
    }
}

// Update Statistics
function updateStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statTrends = document.querySelectorAll('.stat-trend');
    
    // Today's appointments
    statNumbers[0].textContent = getTodayAppointments().length;
    statTrends[0].innerHTML = `<i class="fas fa-arrow-up"></i> ${statistics.appointmentsTrend}`;
    
    // Total patients
    statNumbers[1].textContent = statistics.totalPatients;
    statTrends[1].innerHTML = `<i class="fas fa-arrow-up"></i> ${statistics.patientsTrend}`;
    
    // Average rating
    statNumbers[2].textContent = statistics.averageRating;
    statTrends[2].innerHTML = `<i class="fas fa-arrow-up"></i> ${statistics.ratingTrend}`;
    
    // Total consultations
    statNumbers[3].textContent = statistics.totalAppointments;
    statTrends[3].innerHTML = `<i class="fas fa-arrow-up"></i> ${statistics.consultationsTrend}`;
}

// Get Today's Appointments
function getTodayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === today);
}

// Load Appointments
function loadAppointments() {
    const appointmentsList = document.querySelector('.appointments-list');
    const todayAppointments = getTodayAppointments();
    
    appointmentsList.innerHTML = '';
    
    if (todayAppointments.length === 0) {
        appointmentsList.innerHTML = `
            <div class="no-appointments">
                <i class="fas fa-calendar-check"></i>
                <p>No appointments scheduled for today</p>
            </div>
        `;
        return;
    }
    
    todayAppointments.forEach(appointment => {
        const appointmentCard = createAppointmentCard(appointment);
        appointmentsList.appendChild(appointmentCard);
    });
}

// Create Appointment Card
function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = 'appointment-card';
    card.innerHTML = `
        <div class="appointment-time">
            <i class="fas fa-clock"></i>
            <span>${appointment.time}</span>
        </div>
        <div class="appointment-info">
            <div class="patient-info">
                <img src="${appointment.patientImage}" alt="${appointment.patientName}" class="patient-image">
                <div>
                    <h4>${appointment.patientName}</h4>
                    <p>${appointment.type}</p>
                </div>
            </div>
            <div class="appointment-status ${appointment.status}">
                <span>${appointment.status}</span>
            </div>
        </div>
        <div class="appointment-actions">
            <button class="action-btn view" onclick="viewAppointment('${appointment.id}')">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="action-btn reschedule" onclick="rescheduleAppointment('${appointment.id}')">
                <i class="fas fa-calendar-alt"></i> Reschedule
            </button>
            <button class="action-btn cancel" onclick="cancelAppointment('${appointment.id}')">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;
    return card;
}

// Initialize Date Filter
function initializeDateFilter() {
    const dateFilter = document.querySelector('.date-filter');
    if (dateFilter) {
        dateFilter.addEventListener('click', () => {
            // Implement date filter functionality
            console.log('Date filter clicked');
        });
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Profile dropdown
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown) {
        profileDropdown.addEventListener('click', toggleProfileMenu);
    }
    
    // Notifications
    const notifications = document.querySelector('.notifications');
    if (notifications) {
        notifications.addEventListener('click', toggleNotificationsPanel);
    }
    
    // View all appointments button
    const viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            window.location.href = '#appointments';
        });
    }
}

// Toggle Profile Menu
function toggleProfileMenu() {
    // Implement profile menu toggle
    console.log('Toggle profile menu');
}

// Toggle Notifications Panel
function toggleNotificationsPanel() {
    // Implement notifications panel toggle
    console.log('Toggle notifications panel');
}

// Update Notifications
function updateNotifications() {
    const badge = document.querySelector('.notification-badge');
    const unreadCount = notifications.filter(n => !n.read).length;
    
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

// Appointment Actions
function viewAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        // Implement view appointment functionality
        console.log('View appointment:', appointment);
    }
}

function rescheduleAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        // Implement reschedule functionality
        console.log('Reschedule appointment:', appointment);
    }
}

function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        deleteAppointment(appointmentId);
        loadAppointments();
        updateStatistics();
    }
}

// Utility Functions
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
} 