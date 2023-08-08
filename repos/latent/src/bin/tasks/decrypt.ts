import type {
  TTask,
  TTaskParams,
  TTaskActionArgs
} from '@GLT/cli/types'

import {Latent} from "@GLT/latent"
  // token?:string
  // location?:string
  // encoded?:string
  // file?:TLatentFile
  
  
  // crypto?:TLatentCryptoOpts

const decryptAct = (args:TTaskActionArgs) => {
    const { remote, token, repo, ...rest } = args.params
    console.log(args)

  

    // const latent = new Latent()

    // const token = latent.getToken(remote)

    // const secrets = latent.secrets.load({
    //   ...rest,
    //   token
    // })

    // console.log(`------- secrets -------`)
    // console.log(secrets)

    // return secrets
  }


export const decrypt:TTask = {
  name: `decrypt`,
  alias: [`dec`],
  description: `Decrypt a file from path`,
  action: decryptAct,
  options: {
    token: {},
    remote: {},
    repo: {},
    location: {
      alias: [`file`, `secrets`],
      description: `Path location of the secrets file. Overrides the repo option`
    },
    file: {
      
    },
    encoded: {
      type: `bool`,
      default: true,
      alias: [`base64`, `b64`],
      description: `Is the token Base64 encoded. Ignored if token option is undefined`
    }
  }
}