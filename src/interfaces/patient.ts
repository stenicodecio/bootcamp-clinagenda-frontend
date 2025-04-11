import type { IStatus } from './status'

export interface IPatient {
  id: number
  name: string
  documentNumber: string
  phoneNumber: string
  birthDate: string
  status: IStatus
}

export type GetPatientListRequest = {
  itemsPerPage: number
  page: number
  name: IPatient['name']
  documentNumber: IPatient['documentNumber']
  statusId: IStatus['id'] | null
}

export type GetPatientListResponse = {
  total: number
  items: IPatient[]
}

export type GetPatientResponse = {
  name: IPatient['name']
  documentNumber: IPatient['documentNumber']
  phoneNumber: IPatient['phoneNumber']
  birthDate: IPatient['birthDate']
  statusId: IStatus
}

export type PatientForm = {
  name: IPatient['name']
  documentNumber: IPatient['documentNumber']
  phoneNumber: IPatient['phoneNumber']
  birthDate: IPatient['birthDate']
  statusId: IStatus['id'] | null
}
