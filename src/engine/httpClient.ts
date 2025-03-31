import axios, { type Method } from 'axios'

const API_URL = import.meta.env.VITE_BASE_HOST

const axiosInstance = axios.create({
  baseURL: API_URL
})

interface RequestOptions<T> {
  method: Method
  endpoint: string
  body?: T
}

type CustomResponse<R> = {
  isError: boolean
  data: R
}

export default async function request<T, R>({
  method,
  endpoint,
  body
}: RequestOptions<T>): Promise<CustomResponse<R>> {
  const response = await axiosInstance.request<R>({
    method,
    url: endpoint,
    ...(method === 'GET' ? { params: body } : { data: body })
  })

  return {
    isError: response.statusText !== 'OK',
    data: response.data
  }
}
