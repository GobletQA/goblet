// @ts-nocheck
import { nanoid } from '@keg-hub/jsutils/nanoid'

export type TNanoidOpts = {
  joiner?:string
  parts?:number
  prefix?:string
}

export {
  nanoid
}