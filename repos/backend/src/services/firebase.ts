import type { App } from 'firebase-admin/app'
import type { Auth, UserRecord, DecodedIdToken } from 'firebase-admin/auth'

import { getAuth } from "firebase-admin/auth"
import { limbo } from '@keg-hub/jsutils/limbo'
import { initializeApp } from "firebase-admin/app"
import { resError } from '@gobletqa/shared/express/resError'


type TFBUser = {
  uid?:string
  email:string
  password:string
  photoUrl?:string
  disabled?:boolean
  phoneNumber:string
  displayName:string
}

export type TCustomClaims = {
  pat?:string
}

export type TValidateUser = TCustomClaims & {
  id:string
  token:string
  idToken:string
  provider:string
  username:string
}

export type TAddClaims = {
  id:string
  pat?:string
}

export type TRemoveClaims = {
  id:string
  claims:string[]
}

export class FBService {
  app:App
  auth:Auth
  
  constructor(){
    this.app = initializeApp()
    this.auth = getAuth(this.app)
  }

  getUser = async <T=UserRecord|TFBUser>(id:string, json?:boolean) => {
    const [err, user] = await limbo<UserRecord>(this.auth.getUser(id))
    if(err) throw err

    return (json ? user.toJSON() : user) as T
  }

  getUserByEmail = async <T=UserRecord|TFBUser>(email:string, json:boolean) => {
    const [err, user] = await limbo<UserRecord>(this.auth.getUserByEmail(email))
    if(err) throw err

    return (json ? user.toJSON() : user) as T
  }

  createUser = async <T=UserRecord|TFBUser>(data:TFBUser, json?:boolean) => {
    const [err, user] = await limbo<UserRecord>(this.auth.createUser(data))
    if(err) throw err

    return (json ? user.toJSON() : user) as T
  }

  updateUser = async (data:Omit<Partial<TFBUser>, `uid`> & { uid:string }, json?:boolean) => {
    const { uid, ...rest } = data
    const [err, user] = await limbo<UserRecord>(this.auth.updateUser(uid, rest))
    if(err) throw err

    return json ? user.toJSON() : user
  }

  deleteUser = async (uid:string) => {
    const [err] = await limbo(this.auth.deleteUser(uid))
    if(err) throw err

    return true
  }

  validate = async (data:TValidateUser) => {
    const {
      id,
      idToken,
      provider,
      username,
    } = data

    if(!id || !username || !idToken || !provider)
      resError(`Authorization failed`, 401)

    const [err, claims] = await limbo<DecodedIdToken>(this.auth.verifyIdToken(idToken))
    err && resError(`Authorization failed`, 401)

    /**
     * If a custom PAT exists, then use that as the token 
     * otherwise use the default
    */
    const token = claims[provider]

    return token ? {...data, token } : data
  }

  addClaims = async (data:TAddClaims, merge?:boolean) => {
    const {id, ...add} = data
    let claims = add

    if(merge){
      const user = await this.getUser<UserRecord>(id)
      claims = {...user.customClaims, ...add}
    }

    /**
     * Save the Personal access token as a custom claim
     * This allows accessing it at another time
     * So the user doesn't have to enter it in each time they login
     * Will overwrite the custom claims object that exists
     */
    await this.auth.setCustomUserClaims(id, claims)
  }

  removeClaims = async (data:TRemoveClaims) => {
    const { id, claims } = data
    const user = await this.getUser<UserRecord>(id)
    const customClaims = user.customClaims

    claims?.forEach(claim => {
      customClaims[claim] = undefined
      delete customClaims[claim]
    })

    /**
     * Save the updated custom claim object with the claims removed
     * Will overwrite the custom claims object that exists
     */
    await this.auth.setCustomUserClaims(id, customClaims)
  }

}

export const authService = new FBService()
