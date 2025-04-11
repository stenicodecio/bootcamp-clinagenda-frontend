import type { ISpecialty } from './specialty'
import type { IDoctor } from './doctor'
import type { IPatient } from './patient'

export interface IAppointment {
  id: number
  patient: IPatient
  doctor: IDoctor
  specialty: ISpecialty
  appointmentDate: string
  observation: string
}

export type GetAppointmentListRequest = {
  itemsPerPage: number
  page: number
  doctorName: IDoctor['name']
  patientName: IPatient['name']
  specialtyId: ISpecialty['id'] | null
}

export type GetAppointmentListResponse = {
  total: number
  items: IAppointment[]
}

export type AppointmentForm = {
  patientId: IPatient['id'] | null
  doctorId: IDoctor['id'] | null
  specialtyId: ISpecialty['id'] | null
  appointmentDate: IAppointment['appointmentDate']
  observation: IAppointment['observation']
}
