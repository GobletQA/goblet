import { TRouteMeta } from './conductor.types'

export type TTokenUser = {
  userId:string
  token: string
  provider:string
  subdomain:string
  username?:string
  status: TRouteMeta
}