import axios, { type Method } from 'axios'
import { useToastStore } from '@/stores'

const API_URL = import.meta.env.VITE_BASE_HOST

const toastStore = useToastStore()

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
  try {
    const response = await axiosInstance.request<R>({
      method,
      url: endpoint,
      ...(method === 'GET' ? { params: body } : { data: body })
    })

    return {
      isError: false,
      data: response.data
    }
  } catch (error: any) {
    toastStore.setToast({
      type: 'error',
      text: error?.response?.data || error?.message || 'Erro desconhecido'
    })

    console.error(`Erro no request [${method}] ${endpoint}`, body)
    console.error(error)

    return {
      isError: true,
      data: null as R
    }
  }
}
