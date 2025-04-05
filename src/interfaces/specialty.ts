export interface ISpecialty {
  id: number
  name: number
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
