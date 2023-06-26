import type { TLTLoad, TLTRekey } from '@gobletqa/latent'

import { Latent } from '@gobletqa/latent'

export class LatentRepo {
  
  latent:Latent
  
  constructor(){
    this.latent = new Latent()
  }

  rekey = (props:TLTRekey):Error|undefined => {
    try {
      const failed = this.latent.secrets.rekey(props)

      return failed.length
        ? new Error(`The following keys failed to be rekeyed: \n${failed.join(`\n\t`)}`)
        : undefined
    }
    catch(err){
      return err
    }
  }

  decrypt = (props:TLTLoad & { remote:string }) => {
    const { remote, ...rest } = props

    const token = this.latent.getToken(props.remote)

    const secrets = this.latent.secrets.load({
      ...rest,
      token
    })

    return secrets
  }
}


export const latentRepo = new LatentRepo()

