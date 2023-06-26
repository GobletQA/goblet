import {
  TLTAdd,
  TLTLoad,
  TLTSave,
  TLTCreate,
  EFileType,
} from "@GLT/types"
import {exists} from "@keg-hub/jsutils"

import {Latent} from "./latent"


export class Values {
  latent:Latent

  constructor(latent:Latent){
    this.latent = latent
  }

  /**
   * @description - Loads the content of a values file as a Key/Value pair
   */
  load = (props:TLTLoad) => {
    return this.latent.load(props, EFileType.values)
  }

  /**
   * @description - Saves and updates an existing values file
   */
  save = (props:TLTSave) => {
    return this.latent.save(props, EFileType.values)
  }

  /**
   * @description - Create a new value and or values file
   */
  create = (props:TLTCreate) => {
    const { key, value, data={}, ...rest } = props
    const create = exists(key) && exists(value) ? { [key]: value } : data

    return this.latent.save({...rest, data:create }, EFileType.values)
  }


  /**
   * @description - Add a new value for the environment
   */
  add = (props:TLTAdd) => {
    const { data, ...rest } = props
    // Load the current file as decrypted plain text
    const current = this.latent.file.loadSingle({
      ...rest,
      type: EFileType.values,
    })

    return this.latent.save({
      ...props,
      patch: true,
      data,
      current,
    }, EFileType.values)
  }

}
