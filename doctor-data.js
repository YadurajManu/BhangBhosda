// Doctor Profile Data
const doctorProfile = {
    id: "DR001",
    name: "Dr. Sarah Smith",
    specialization: "Cardiologist",
    experience: "15 years",
    qualifications: ["MBBS", "MD", "DM"],
    hospital: "City General Hospital",
    rating: 4.8,
    totalRatings: 524,
    image: "https://ui-avatars.com/api/?name=Dr.+Smith&background=0D8ABC&color=fff",
    contact: {
        email: "dr.smith@hospital.com",
        phone: "+1-234-567-8900",
        address: "123 Medical Center Drive"
    },
    availability: {
        monday: ["09:00-13:00", "15:00-18:00"],
        tuesday: ["09:00-13:00", "15:00-18:00"],
        wednesday: ["09:00-13:00", "15:00-18:00"],
        thursday: ["09:00-13:00", "15:00-18:00"],
        friday: ["09:00-13:00", "15:00-18:00"],
        saturday: ["09:00-13:00"],
        sunday: []
    }
};

// Appointments Data
let appointments = [
    {
        id: "APT001",
        patientName: "John Doe",
        patientId: "PAT001",
        date: "2024-02-21",
        time: "09:30",
        type: "Regular Checkup",
        status: "confirmed",
        symptoms: "Chest pain, shortness of breath",
        notes: "Follow-up appointment after medication change",
        patientImage: "https://ui-avatars.com/api/?name=John+Doe"
    },
    {
        id: "APT002",
        patientName: "Jane Smith",
        patientId: "PAT002",
        date: "2024-02-21",
        time: "10:30",
        type: "New Patient",
        status: "confirmed",
        symptoms: "Irregular heartbeat",
        notes: "First consultation",
        patientImage: "https://ui-avatars.com/api/?name=Jane+Smith"
    },
    {
        id: "APT003",
        patientName: "Robert Johnson",
        patientId: "PAT003",
        date: "2024-02-21",
        time: "11:30",
        type: "Follow-up",
        status: "pending",
        symptoms: "Post-surgery checkup",
        notes: "Two weeks after bypass surgery",
        patientImage: "https://ui-avatars.com/api/?name=Robert+Johnson"
    }
];

// Patient Records
let patients = [
    {
        id: "PAT001",
        name: "John Doe",
        age: 45,
        gender: "Male",
        bloodGroup: "O+",
        phone: "+1-234-567-8901",
        email: "john.doe@email.com",
        address: "456 Patient Street",
        history: [
            {
                date: "2024-01-15",
                diagnosis: "Hypertension",
                prescription: "Amlodipine 5mg",
                notes: "Blood pressure: 140/90"
            }
        ],
        upcomingAppointments: ["APT001"],
        pastAppointments: ["APT789", "APT456"]
    },
    {
        id: "PAT002",
        name: "Jane Smith",
        age: 35,
        gender: "Female",
        bloodGroup: "A+",
        phone: "+1-234-567-8902",
        email: "jane.smith@email.com",
        address: "789 Patient Avenue",
        history: [
            {
                date: "2024-02-01",
                diagnosis: "Arrhythmia",
                prescription: "Beta blockers",
                notes: "ECG shows irregular rhythm"
            }
        ],
        upcomingAppointments: ["APT002"],
        pastAppointments: ["APT321"]
    }
];

// Statistics
let statistics = {
    totalPatients: 248,
    totalAppointments: 156,
    averageRating: 4.8,
    ratingTrend: "+3%",
    appointmentsTrend: "+12%",
    patientsTrend: "+8%",
    consultationsTrend: "+15%"
};

// Notifications
let notifications = [
    {
        id: "NOT001",
        type: "appointment",
        message: "New appointment request from Sarah Johnson",
        time: "5 minutes ago",
        read: false
    },
    {
        id: "NOT002",
        type: "reminder",
        message: "Follow-up with Patient #PAT003 due today",
        time: "1 hour ago",
        read: false
    },
    {
        id: "NOT003",
        type: "alert",
        message: "Emergency consultation requested",
        time: "2 hours ago",
        read: true
    }
];

// Local Storage Functions
function saveAppointment(appointment) {
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

function updateAppointment(appointmentId, updates) {
    const index = appointments.findIndex(apt => apt.id === appointmentId);
    if (index !== -1) {
        appointments[index] = { ...appointments[index], ...updates };
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }
}

function deleteAppointment(appointmentId) {
    appointments = appointments.filter(apt => apt.id !== appointmentId);
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

function addPatient(patient) {
    patients.push(patient);
    localStorage.setItem('patients', JSON.stringify(patients));
}

function updatePatient(patientId, updates) {
    const index = patients.findIndex(p => p.id === patientId);
    if (index !== -1) {
        patients[index] = { ...patients[index], ...updates };
        localStorage.setItem('patients', JSON.stringify(patients));
    }
}

function markNotificationAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
}

// Initialize data in localStorage
function initializeData() {
    if (!localStorage.getItem('doctorProfile')) {
        localStorage.setItem('doctorProfile', JSON.stringify(doctorProfile));
    }
    if (!localStorage.getItem('appointments')) {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }
    if (!localStorage.getItem('patients')) {
        localStorage.setItem('patients', JSON.stringify(patients));
    }
    if (!localStorage.getItem('statistics')) {
        localStorage.setItem('statistics', JSON.stringify(statistics));
    }
    if (!localStorage.getItem('notifications')) {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
}

// Load data from localStorage
function loadData() {
    const storedDoctorProfile = localStorage.getItem('doctorProfile');
    const storedAppointments = localStorage.getItem('appointments');
    const storedPatients = localStorage.getItem('patients');
    const storedStatistics = localStorage.getItem('statistics');
    const storedNotifications = localStorage.getItem('notifications');

    if (storedDoctorProfile) doctorProfile = JSON.parse(storedDoctorProfile);
    if (storedAppointments) appointments = JSON.parse(storedAppointments);
    if (storedPatients) patients = JSON.parse(storedPatients);
    if (storedStatistics) statistics = JSON.parse(storedStatistics);
    if (storedNotifications) notifications = JSON.parse(storedNotifications);
}

// Initialize data when the script loads
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    loadData();
}); 