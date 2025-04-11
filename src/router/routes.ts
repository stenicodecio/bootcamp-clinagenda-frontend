export const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/DashboardPage.vue')
  },
  // Status
  {
    path: '/status',
    name: 'status-list',
    component: () => import('@/pages/status/StatusListPage.vue')
  },
  {
    path: '/status/insert',
    name: 'status-insert',
    component: () => import('@/pages/status/StatusFormPage.vue')
  },
  {
    path: '/status/update/:id',
    name: 'status-update',
    component: () => import('@/pages/status/StatusFormPage.vue')
  },
  // Specialty
  {
    path: '/specialty',
    name: 'specialty-list',
    component: () => import('@/pages/specialty/SpecialtyListPage.vue')
  },
  {
    path: '/specialty/insert',
    name: 'specialty-insert',
    component: () => import('@/pages/specialty/SpecialtyFormPage.vue')
  },
  {
    path: '/specialty/update/:id',
    name: 'specialty-update',
    component: () => import('@/pages/specialty/SpecialtyFormPage.vue')
  },
  // Patient
  {
    path: '/patient/list',
    name: 'patient-list',
    component: () => import('@/pages/patient/PatientListPage.vue')
  },
  {
    path: '/patient/insert',
    name: 'patient-insert',
    component: () => import('@/pages/patient/PatientFormPage.vue')
  },
  {
    path: '/patient/update/:id',
    name: 'patient-update',
    component: () => import('@/pages/patient/PatientFormPage.vue')
  },
  // Doctor
  {
    path: '/doctor/list',
    name: 'doctor-list',
    component: () => import('@/pages/doctor/DoctorListPage.vue')
  },
  {
    path: '/doctor/insert',
    name: 'doctor-insert',
    component: () => import('@/pages/doctor/DoctorFormPage.vue')
  },
  {
    path: '/doctor/update/:id',
    name: 'doctor-update',
    component: () => import('@/pages/doctor/DoctorFormPage.vue')
  },
  // Appointment
  {
    path: '/appointment/list',
    name: 'appointment-list',
    component: () => import('@/pages/appointment/AppointmentListPage.vue')
  },
  {
    path: '/appointment/insert',
    name: 'appointment-insert',
    component: () => import('@/pages/appointment/AppointmentFormPage.vue')
  },
  {
    path: '/appointment/update/:id',
    name: 'appointment-update',
    component: () => import('@/pages/appointment/AppointmentFormPage.vue')
  }
]
