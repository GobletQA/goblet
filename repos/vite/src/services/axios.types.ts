import type { AxiosRequestConfig, ResponseType } from 'axios'

export type THeaders = Record<string, string>

export type TAXResponse = {
  data: any
  status: string
}

export type TRequestError = Error & {
  response: TAXResponse
}

export type TRequest = Omit<AxiosRequestConfig, 'method' | 'responseType' | 'headers' > & {
  url: string
  method?: string
  headers?: THeaders
  responseType?: ResponseType
}

export type TBuiltRequest = Omit<AxiosRequestConfig, 'method' | 'responseType' | 'headers' > & {
  url: string
  method: string
  headers: THeaders
  responseType: ResponseType
  data?: Record<string, any>
  params?: Record<string, any>
}

export type TResponse<T=Record<any, any>> = {
  data: T
  success: boolean
  statusCode?: number
  error?: string
  errorMessage?: string
}
