import type { TRouteMeta } from './routes.types'
import type  { EProvider } from './provider.types'

export type TTokenUser = {
  userId:string
  token: string
  subdomain:string
  username?:string
  provider:EProvider
  status: TRouteMeta
}