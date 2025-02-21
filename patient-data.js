// Mock Patient Profile
const patientProfile = {
    id: 'PAT123',
    name: 'John Doe',
    age: 35,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 234 567 8900',
    email: 'john.doe@example.com',
    address: '123 Health Street, Medical City, MC 12345',
    image: 'https://ui-avatars.com/api/?name=John+Doe',
    emergencyContact: {
        name: 'Jane Doe',
        relation: 'Spouse',
        phone: '+1 234 567 8901'
    }
};

// Mock Appointments
const appointments = [
    {
        id: 'APT001',
        doctorId: 'DOC123',
        doctorName: 'Dr. Sarah Smith',
        doctorSpecialty: 'Cardiologist',
        doctorImage: 'https://ui-avatars.com/api/?name=Sarah+Smith',
        date: '2024-02-25',
        time: '10:00',
        type: 'Regular Checkup',
        status: 'confirmed',
        notes: 'Regular heart checkup'
    },
    {
        id: 'APT002',
        doctorId: 'DOC124',
        doctorName: 'Dr. Michael Johnson',
        doctorSpecialty: 'Dermatologist',
        doctorImage: 'https://ui-avatars.com/api/?name=Michael+Johnson',
        date: '2024-03-05',
        time: '14:30',
        type: 'Follow-up',
        status: 'pending',
        notes: 'Skin condition follow-up'
    }
];

// Mock Medical Records
const medicalRecords = [
    {
        id: 'REC001',
        type: 'Blood Test',
        title: 'Complete Blood Count',
        date: '2024-02-10',
        doctor: 'Dr. Sarah Smith',
        hospital: 'City General Hospital',
        fileUrl: '#',
        status: 'normal'
    },
    {
        id: 'REC002',
        type: 'X-Ray',
        title: 'Chest X-Ray',
        date: '2024-02-15',
        doctor: 'Dr. Robert Wilson',
        hospital: 'City General Hospital',
        fileUrl: '#',
        status: 'normal'
    }
];

// Mock Prescriptions
const prescriptions = [
    {
        id: 'PRE001',
        medicineName: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '7 days',
        startDate: '2024-02-20',
        endDate: '2024-02-27',
        doctor: 'Dr. Sarah Smith',
        remainingRefills: 2,
        status: 'active'
    },
    {
        id: 'PRE002',
        medicineName: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        startDate: '2024-02-15',
        endDate: '2024-03-15',
        doctor: 'Dr. Sarah Smith',
        remainingRefills: 1,
        status: 'active'
    }
];

// Mock Recent Activities
const recentActivities = [
    {
        id: 'ACT001',
        type: 'appointment',
        title: 'Appointment Confirmed',
        description: 'Your appointment with Dr. Sarah Smith has been confirmed',
        time: '2024-02-23 14:30',
        status: 'confirmed'
    },
    {
        id: 'ACT002',
        type: 'prescription',
        title: 'New Prescription',
        description: 'Dr. Sarah Smith prescribed Amoxicillin',
        time: '2024-02-20 11:15',
        status: 'active'
    },
    {
        id: 'ACT003',
        type: 'record',
        title: 'Test Results Available',
        description: 'Your blood test results are now available',
        time: '2024-02-10 09:45',
        status: 'completed'
    }
];

// Mock Notifications
const notifications = [
    {
        id: 'NOT001',
        type: 'appointment',
        message: 'Upcoming appointment with Dr. Sarah Smith tomorrow at 10:00 AM',
        time: '1 day ago',
        read: false
    },
    {
        id: 'NOT002',
        type: 'prescription',
        message: 'Your prescription for Lisinopril needs refill',
        time: '2 hours ago',
        read: false
    }
];

// Mock Health Stats
const healthStats = {
    nextAppointment: {
        date: '2024-02-25',
        doctor: 'Dr. Sarah Smith',
        type: 'Regular Checkup'
    },
    activeMedications: 3,
    recentReports: 2,
    healthScore: {
        current: 85,
        trend: 5
    }
}; 