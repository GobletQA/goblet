import type { AxiosRequestConfig, ResponseType } from 'axios'

export type THeaders = Record<string, string|number>

export type TAXResponse = {
  data: any
  status: string
}

export type TRequestError = Error & {
  response: TAXResponse
}

export type TRequest<T=Record<string, any>> = Omit<AxiosRequestConfig<T>, 'method' | 'responseType' | 'headers' > & {
  url: string
  method?: string
  headers?: THeaders
  responseType?: ResponseType
}

export type TBuiltRequest<T=Record<string, any>> = Omit<AxiosRequestConfig, 'method' | 'responseType' | 'headers' > & {
  data?: T
  params?: T
  url: string
  method: string
  headers: THeaders
  responseType: ResponseType
}

export type TResponse<T=Record<any, any>> = {
  data: T
  success: boolean
  statusCode?: number
  error?: string
  errorMessage?: string
}
