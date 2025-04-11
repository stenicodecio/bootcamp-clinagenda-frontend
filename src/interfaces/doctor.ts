import type { IStatus } from './status'
import type { ISpecialty } from './specialty'

export interface IDoctor {
  id: number
  name: string
  specialty: ISpecialty[]
  status: IStatus
}

export type GetDoctorListRequest = {
  itemsPerPage: number
  page: number
  name: IDoctor['name']
  specialtyId?: ISpecialty['id'] | null
  statusId?: IStatus['id'] | null
}

export type GetDoctorListResponse = {
  total: number
  items: IDoctor[]
}

export type DoctorForm = {
  name: IDoctor['name']
  specialty: Array<ISpecialty['id']>
  statusId: IStatus['id'] | null
}
