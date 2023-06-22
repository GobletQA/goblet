import {TLatentFile, TLoadOpts} from '@GLT/types'
import {emptyObj} from '@keg-hub/jsutils'
import { env } from '@keg-hub/parse-config'

export class LatentFile {

  fill:boolean=true
  error:boolean=true
  pattern:RegExp=/{{([^}]*)}}/g
  data:Record<any, any>=emptyObj

  constructor(opts:TLatentFile=emptyObj){
    Object.assign(this, opts)
  }
  
  load = (location:string, opts:TLoadOpts=emptyObj) => {
    const loaded = env.loadEnvSync({
      fill: this.fill,
      error: this.error,
      pattern: this.pattern,
      ...opts,
      data: {...this.data, ...opts.data},
      format: `object`,
      location
    })

    return loaded
  }

}