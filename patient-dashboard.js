// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    loadAppointments();
    loadMedicalRecords();
    loadPrescriptions();
    loadRecentActivities();
    setupEventListeners();
    updateNotifications();
});

// Initialize Dashboard Elements
function initializeDashboard() {
    // Update profile information
    updateProfileInfo();
    
    // Update health statistics
    updateHealthStats();
    
    // Initialize tab buttons
    initializeTabButtons();
}

// Update Profile Information
function updateProfileInfo() {
    const profileImage = document.querySelector('.profile-image');
    const profileName = document.querySelector('.profile-name');
    const profileInfo = document.querySelector('.profile-info');
    
    if (patientProfile) {
        profileImage.src = patientProfile.image;
        profileImage.alt = patientProfile.name;
        profileName.textContent = patientProfile.name;
        profileInfo.textContent = `${patientProfile.age} years • ${patientProfile.bloodGroup}`;
    }
}

// Update Health Statistics
function updateHealthStats() {
    // Update next appointment
    document.querySelector('.health-card:nth-child(1) .health-value').textContent = 
        new Date(healthStats.nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    document.querySelector('.health-card:nth-child(1) .health-info').textContent = 
        healthStats.nextAppointment.doctor;

    // Update active medications
    document.querySelector('.health-card:nth-child(2) .health-value').textContent = 
        healthStats.activeMedications;

    // Update recent reports
    document.querySelector('.health-card:nth-child(3) .health-value').textContent = 
        healthStats.recentReports;

    // Update health score
    document.querySelector('.health-card:nth-child(4) .health-value').textContent = 
        `${healthStats.healthScore.current}%`;
    document.querySelector('.health-card:nth-child(4) .health-info').textContent = 
        `↑ ${healthStats.healthScore.trend}% this month`;
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
        case 'upcoming':
            filteredAppointments = appointments.filter(apt => apt.date >= today && apt.status !== 'cancelled');
            break;
        case 'past':
            filteredAppointments = appointments.filter(apt => apt.date < today && apt.status !== 'cancelled');
            break;
        case 'cancelled':
            filteredAppointments = appointments.filter(apt => apt.status === 'cancelled');
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
            <div class="doctor-info">
                <img src="${appointment.doctorImage}" alt="${appointment.doctorName}" class="doctor-image">
                <div>
                    <h4>${appointment.doctorName}</h4>
                    <p>${appointment.doctorSpecialty}</p>
                </div>
            </div>
            <div class="appointment-status ${appointment.status}">
                ${appointment.status}
            </div>
        </div>
        <div class="appointment-type">
            <i class="fas fa-stethoscope"></i>
            <span>${appointment.type}</span>
        </div>
        <div class="appointment-actions">
            <button class="action-btn view" onclick="viewAppointment('${appointment.id}')">
                <i class="fas fa-eye"></i> View Details
            </button>
            ${appointment.status !== 'cancelled' ? `
                <button class="action-btn cancel" onclick="cancelAppointment('${appointment.id}')">
                    <i class="fas fa-times"></i> Cancel
                </button>
            ` : ''}
        </div>
    `;
    return card;
}

// Load Medical Records
function loadMedicalRecords() {
    const recordsGrid = document.getElementById('recordsGrid');
    recordsGrid.innerHTML = '';

    medicalRecords.forEach(record => {
        const recordCard = createRecordCard(record);
        recordsGrid.appendChild(recordCard);
    });
}

// Create Record Card
function createRecordCard(record) {
    const card = document.createElement('div');
    card.className = 'record-card';
    card.innerHTML = `
        <div class="record-type">
            <i class="fas ${getRecordIcon(record.type)}"></i>
            <span>${record.type}</span>
        </div>
        <h4 class="record-title">${record.title}</h4>
        <div class="record-meta">
            <span>${record.date}</span>
            <span>${record.doctor}</span>
        </div>
        <div class="record-actions">
            <button class="action-btn view" onclick="viewRecord('${record.id}')">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="action-btn download" onclick="downloadRecord('${record.id}')">
                <i class="fas fa-download"></i> Download
            </button>
        </div>
    `;
    return card;
}

// Get Record Icon
function getRecordIcon(type) {
    switch(type.toLowerCase()) {
        case 'blood test':
            return 'fa-vial';
        case 'x-ray':
            return 'fa-x-ray';
        case 'prescription':
            return 'fa-prescription';
        default:
            return 'fa-file-medical';
    }
}

// Load Prescriptions
function loadPrescriptions() {
    const prescriptionsGrid = document.getElementById('prescriptionsGrid');
    prescriptionsGrid.innerHTML = '';

    prescriptions.forEach(prescription => {
        const prescriptionCard = createPrescriptionCard(prescription);
        prescriptionsGrid.appendChild(prescriptionCard);
    });
}

// Create Prescription Card
function createPrescriptionCard(prescription) {
    const card = document.createElement('div');
    card.className = 'prescription-card';
    card.innerHTML = `
        <h4 class="medicine-name">${prescription.medicineName}</h4>
        <p class="dosage">${prescription.dosage} - ${prescription.frequency}</p>
        <div class="prescription-details">
            <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>${prescription.duration}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-user-md"></i>
                <span>${prescription.doctor}</span>
            </div>
        </div>
        <div class="prescription-meta">
            <span class="refill-status ${prescription.remainingRefills <= 1 ? 'low' : ''}">
                ${prescription.remainingRefills} refills remaining
            </span>
            <button class="action-btn" onclick="requestRefill('${prescription.id}')">
                <i class="fas fa-prescription-bottle-alt"></i> Request Refill
            </button>
        </div>
    `;
    return card;
}

// Load Recent Activities
function loadRecentActivities() {
    const activityTimeline = document.getElementById('activityTimeline');
    activityTimeline.innerHTML = '';

    recentActivities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityTimeline.appendChild(activityItem);
    });
}

// Create Activity Item
function createActivityItem(activity) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
        <div class="activity-content">
            <h4 class="activity-title">${activity.title}</h4>
            <p class="activity-description">${activity.description}</p>
            <span class="activity-time">${formatActivityTime(activity.time)}</span>
        </div>
    `;
    return item;
}

// Format Activity Time
function formatActivityTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric' 
    });
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

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

// Modal Functions
function bookNewAppointment() {
    const modal = document.getElementById('appointmentModal');
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Action Functions
function viewAppointment(appointmentId) {
    console.log('View appointment:', appointmentId);
    // Implement view appointment functionality
}

function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        console.log('Cancel appointment:', appointmentId);
        // Implement cancel appointment functionality
    }
}

function viewRecord(recordId) {
    console.log('View record:', recordId);
    // Implement view record functionality
}

function downloadRecord(recordId) {
    console.log('Download record:', recordId);
    // Implement download record functionality
}

function requestRefill(prescriptionId) {
    console.log('Request refill:', prescriptionId);
    // Implement request refill functionality
}

function uploadRecord() {
    console.log('Upload record');
    // Implement upload record functionality
}

// Profile Functions
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

    // Update notification badge
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.querySelector('.notification-badge');
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'block' : 'none';
}

function getNotificationIcon(type) {
    switch(type) {
        case 'appointment':
            return 'fa-calendar-check';
        case 'prescription':
            return 'fa-prescription';
        case 'record':
            return 'fa-file-medical';
        default:
            return 'fa-bell';
    }
}

function markNotificationAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        loadNotifications();
    }
}

function clearAllNotifications() {
    notifications.forEach(notification => notification.read = true);
    loadNotifications();
}

// Profile Actions
function viewProfile() {
    console.log('View profile');
    // Implement view profile functionality
}

function editProfile() {
    console.log('Edit profile');
    // Implement edit profile functionality
}

function viewSettings() {
    console.log('View settings');
    // Implement view settings functionality
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'login.html';
    }
} 