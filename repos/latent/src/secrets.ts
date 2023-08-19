import {
  TLTAdd,
  TLTGetSecrets,
  TLTSave,
  TLTLoad,
  TLTRekey,
  TLTCreate,
  EFileType,
  ELatentEnv,
} from "@GLT/types"
import {exists} from "@keg-hub/jsutils"

import {Latent} from "./latent"

export class Secrets {

  latent:Latent

  constructor(latent:Latent){
    this.latent = latent
  }

  /**
   * @description - Loads the content of a secret file as a decrypted Key/Value pair
   */
  load = (props:TLTLoad) => {
    return this.latent.load(props, EFileType.secrets)
  }

  get = (props:TLTGetSecrets) => {
    return this.latent.file.loadSingle({
      ...props,
      type: EFileType.secrets
    })
  }

  /**
   * @description - Saves and updates an existing secret file
   */
  save = (props:TLTSave) => {
    return this.latent.save(props, EFileType.secrets)
  }

  /**
   * @description - Create a new secret and or secret file
   */
  create = (props:TLTCreate) => {
    const { key, value, data={}, ...rest } = props
    const create = exists(key) && exists(value) ? { [key]: value } : data

    return this.latent.save({...rest, data:create }, EFileType.secrets)
  }

  /**
   * @description - Add a new secret for the environment
   */
  add = (props:TLTAdd) => {
    const { data, ...rest } = props
    // Load the current file as decrypted plain text
    const current = this.latent.file.loadSingle({
      ...rest,
      type: EFileType.secrets,
    })

    return this.latent.save({
      ...props,
      patch: true,
      data,
      current,
    }, EFileType.secrets)
  }

  /**
   * Steps to rekey
   * 1. Generate a latent.token from the old url and the new url
   * 2. Decrypt the secrets with the old url token
   * 3. Encrypt the secrets with the new url token
   * 4. Commit and push the updates secrets to the git ref
   * 5. Overwrite the existing git-tag with the new repo url
   *  - TODO: In the future we could have multiple tags that are searched and used
   *  - If multiple tags are found, they try each one until we find a match
   */
  rekey = (props:TLTRekey):string[] => {
    const {
      old,
      oldKey,
      update,
      updateKey,
      location,
    } = props

    // Create tokens to allow opening and saving the encrypted file
    const oldToken = this.latent.getToken(old, oldKey)
    const updatedToken = this.latent.getToken(update, updateKey)
    const environment = props.environment
      || this.latent.environment
      || ELatentEnv.develop

    return this.latent.file.locationFiles({
      location,
      environment,
      type: EFileType.secrets
    })
      .reduce((acc, loc) => {
        // Load the current file as decrypted plain text
        const current = this.latent.file.loadSingle({
          environment,
          fill: false,
          error: false,
          location: loc,
          token: oldToken,
          type: EFileType.secrets,
        })
        
        // Save the file using the new token to encrypt it
        const resp = this.latent.file.save({
          current,
          environment,
          rekey: true,
          location: loc,
          token: updatedToken,
          type: EFileType.secrets,
        })

        resp?.failed?.length
          && acc.push(...resp.failed)

        return acc
      }, [] as string[])
  }

}
