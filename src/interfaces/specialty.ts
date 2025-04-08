export interface ISpecialty {
  id: number
  name: string
  scheduleDuration: string
}

export type GetSpecialtyListRequest = {
  itemsPerPage: number
  page: number
  name: ISpecialty['name']
}

export type GetSpecialtyListResponse = {
  total: number
  items: ISpecialty[]
}

export type SpecialtyForm = {
  name: ISpecialty['name']
  scheduleDuration: ISpecialty['scheduleDuration']
}
