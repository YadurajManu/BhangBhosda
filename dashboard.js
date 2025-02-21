// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    loadAppointments();
    loadPatients();
    initializeCalendar();
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
    initializeTabButtons();
}

// Initialize Tab Buttons
function initializeTabButtons() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadAppointmentsByTab(button.dataset.tab);
        });
    });
}

// Load Appointments by Tab
function loadAppointmentsByTab(tab) {
    const appointmentsGrid = document.getElementById('appointmentsGrid');
    let filteredAppointments;
    const today = new Date().toISOString().split('T')[0];

    switch(tab) {
        case 'today':
            filteredAppointments = appointments.filter(apt => apt.date === today);
            break;
        case 'upcoming':
            filteredAppointments = appointments.filter(apt => apt.date > today);
            break;
        case 'past':
            filteredAppointments = appointments.filter(apt => apt.date < today);
            break;
        default:
            filteredAppointments = appointments;
    }

    appointmentsGrid.innerHTML = '';
    
    if (filteredAppointments.length === 0) {
        appointmentsGrid.innerHTML = `
            <div class="no-appointments">
                <i class="fas fa-calendar-check"></i>
                <p>No ${tab} appointments found</p>
            </div>
        `;
        return;
    }

    filteredAppointments.forEach(appointment => {
        const appointmentCard = createAppointmentCard(appointment);
        appointmentsGrid.appendChild(appointmentCard);
    });
}

// Load Patients
function loadPatients() {
    const patientsGrid = document.getElementById('patientsGrid');
    patientsGrid.innerHTML = '';

    patients.forEach(patient => {
        const patientCard = createPatientCard(patient);
        patientsGrid.appendChild(patientCard);
    });
}

// Create Patient Card
function createPatientCard(patient) {
    const card = document.createElement('div');
    card.className = 'patient-card';
    card.innerHTML = `
        <div class="patient-header">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}" alt="${patient.name}" class="patient-image">
            <div>
                <h4>${patient.name}</h4>
                <p>${patient.age} years • ${patient.gender}</p>
            </div>
        </div>
        <div class="patient-info">
            <div class="info-item">
                <i class="fas fa-tint"></i>
                <span>${patient.bloodGroup}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-phone"></i>
                <span>${patient.phone}</span>
            </div>
        </div>
        <div class="patient-actions">
            <button class="action-btn view" onclick="viewPatient('${patient.id}')">
                <i class="fas fa-eye"></i> View Details
            </button>
            <button class="action-btn" onclick="showNewAppointmentModal('${patient.id}')">
                <i class="fas fa-calendar-plus"></i> New Appointment
            </button>
        </div>
    `;
    return card;
}

// Initialize Calendar
function initializeCalendar() {
    const calendarEl = document.getElementById('calendarWidget');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: appointments.map(apt => ({
            title: apt.patientName,
            start: `${apt.date}T${apt.time}`,
            className: `status-${apt.status}`
        })),
        eventClick: function(info) {
            const appointment = appointments.find(apt => 
                apt.date === info.event.start.toISOString().split('T')[0] &&
                apt.patientName === info.event.title
            );
            if (appointment) {
                viewAppointment(appointment.id);
            }
        }
    });
    calendar.render();
}

// Modal Functions
function showNewAppointmentModal(patientId = null) {
    const modal = document.getElementById('appointmentModal');
    const patientSelect = modal.querySelector('select[name="patientId"]');
    
    // Clear previous options
    patientSelect.innerHTML = '<option value="">Select Patient</option>';
    
    // Add patient options
    patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        if (patientId === patient.id) {
            option.selected = true;
        }
        patientSelect.appendChild(option);
    });

    modal.classList.add('active');
}

function showNewPatientModal() {
    const modal = document.getElementById('patientModal');
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Save Functions
function saveAppointment() {
    const form = document.getElementById('appointmentForm');
    const formData = new FormData(form);
    
    const appointment = {
        id: `APT${Date.now()}`,
        patientId: formData.get('patientId'),
        patientName: patients.find(p => p.id === formData.get('patientId'))?.name,
        date: formData.get('date'),
        time: formData.get('time'),
        type: formData.get('type'),
        status: 'pending',
        notes: formData.get('notes'),
        patientImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(patients.find(p => p.id === formData.get('patientId'))?.name)}`
    };

    saveAppointmentToStorage(appointment);
    closeModal('appointmentModal');
    loadAppointments();
    updateStatistics();
}

function savePatient() {
    const form = document.getElementById('patientForm');
    const formData = new FormData(form);
    
    const patient = {
        id: `PAT${Date.now()}`,
        name: formData.get('name'),
        age: formData.get('age'),
        gender: formData.get('gender'),
        bloodGroup: formData.get('bloodGroup'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        history: [],
        upcomingAppointments: [],
        pastAppointments: []
    };

    addPatient(patient);
    closeModal('patientModal');
    loadPatients();
    updateStatistics();
}

// Profile and Notification Functions
function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    menu.classList.toggle('active');
}

function toggleNotificationsPanel() {
    const panel = document.getElementById('notificationsPanel');
    panel.classList.toggle('active');
    loadNotifications();
}

function loadNotifications() {
    const notificationsList = document.querySelector('.notifications-list');
    notificationsList.innerHTML = '';

    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.read ? 'read' : ''}`;
        notificationItem.innerHTML = `
            <div class="notification-icon ${notification.type}">
                <i class="fas ${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <p>${notification.message}</p>
                <span>${notification.time}</span>
            </div>
            ${!notification.read ? `
                <button class="mark-read-btn" onclick="markNotificationAsRead('${notification.id}')">
                    <i class="fas fa-check"></i>
                </button>
            ` : ''}
        `;
        notificationsList.appendChild(notificationItem);
    });
}

function getNotificationIcon(type) {
    switch(type) {
        case 'appointment':
            return 'fa-calendar-check';
        case 'reminder':
            return 'fa-bell';
        case 'alert':
            return 'fa-exclamation-circle';
        default:
            return 'fa-info-circle';
    }
}

function clearAllNotifications() {
    notifications = [];
    localStorage.setItem('notifications', JSON.stringify(notifications));
    loadNotifications();
    updateNotifications();
}

// Profile Functions
function viewProfile() {
    // Implement view profile functionality
    console.log('View profile');
}

function editProfile() {
    // Implement edit profile functionality
    console.log('Edit profile');
}

function viewSettings() {
    // Implement view settings functionality
    console.log('View settings');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'login.html';
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
    const notificationsBtn = document.querySelector('.notifications');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', toggleNotificationsPanel);
    }
    
    // Patient search
    const patientSearch = document.getElementById('patientSearch');
    if (patientSearch) {
        patientSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const patientCards = document.querySelectorAll('.patient-card');
            
            patientCards.forEach(card => {
                const patientName = card.querySelector('h4').textContent.toLowerCase();
                if (patientName.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
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