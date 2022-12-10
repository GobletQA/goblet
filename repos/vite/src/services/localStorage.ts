import type { TStorageSetting, TStorageSettings } from '@types'

import { limbo } from '@keg-hub/jsutils'
import { StorageKeys  } from '@constants'
import { noAuthService } from './noAuthService'
import { AuthActive, Environment } from '@constants/environment'

export type TWrapperFunc = (...args:any[]) => void

const missingGroup = (setting:string, data:TStorageSetting) => {
  console.error(`Can not save setting ${setting} without a group name.`, data)
  throw new Error(`Error saving setting`)
}

class Storage {

  devData = async () => {
    await noAuthService.init()
    Object.assign(this, noAuthService)
  }

  /**
   * Creates a promise around a passed in function
   * Wraps the promise with limbo to get a consistent response an catch errors
   * @function
   * @param {function} wrappedFn - Function to wrap in a promise
   *
   * @returns {Array} - limbo response array with a length of 2 => [ error, value ]
   */
  createPromise = (wrappedFn: TWrapperFunc) =>
    // Wrap in limbo to get a consistent response
    limbo(
      new Promise((res, rej) => {
        // Try an call the passed in wrapped function
        try {
          res(wrappedFn())
        }
        catch (err) {
          // Catch any errors and reject the promise
          rej(err)
        }
      })
    )

  /**
   * Logs a message to the console when not in production
   * If passed in type is Error, then throw the error when not in production
   * @function
   *
   * @returns {void}
   */
  logMessage = (type:string = 'log', ...message:any[]) => {
    // If we are in production, just return
    if (Environment !== 'local') return

    // If it's an error, then Throw
    if (type === 'error') throw new Error(...message)

    // Log all passed in messages message
    // @ts-ignore
    console[type](...message)
  }

  /**
   * Gets data from local storage by key using window.localStorage
   * @function
   *
   */
  getItem = async (key:string) => {
    const [ err, response ] = await this.createPromise(() =>
      window.localStorage.getItem(key)
    )

    return err ? this.logMessage('error', err.stack) : response
  }

  /**
   * Saves data to local storage by key using using window.localStorage
   * @function
   */
  setItem = async (key:string, value:any) => {
    const [err] = await this.createPromise(() =>
      window.localStorage.setItem(key, value)
    )

    return err ? this.logMessage('error', err.stack) : true
  }

  /**
   * Deletes data from local storage by key using window.localStorage
   * @function
   * @param {string} key - Name of the stored value
   *
   * @returns {Promise} - Will reject if the key / value couldn't be deleted.
   */
  removeItem = async (key:string) => {
    const [err] = await this.createPromise(() =>
      window.localStorage.removeItem(key)
    )

    return err ? this.logMessage('error', err.stack) : true
  }

  /**
  * Loads repo object from local storage
  * Then immediately removes it from local storage
  */
  get = async (key:string, parse:boolean=true) => {
    const name = StorageKeys[key] || key
    if(!name) return console.error(`A key is required to get a local storage item, instead got "${name}"`)

    try {
      const savedData = await this.getItem(name)
      return !savedData
        ? undefined
        : parse
          ? JSON.parse(savedData)
          : savedData
    }
    catch (err) {}
  }


  set = async (key:string, data:any, stringify:boolean=true) => {
    const name = StorageKeys[key] || key
    if(!name) return console.error(`A key is required to set a local storage item, instead got "${name}"`)

    try {
      const save = stringify && typeof data !== 'string'
        ? JSON.stringify(data)
        : data

      return await this.setItem(name, save)
    }
    catch (err:any) {
      console.error(`Error saving ${key} to local-storage.\n${err?.message}`)
    }
  }

  /**
   * Removes the store repo from local storage
   */
  remove = async (key:string) => {
    const name = StorageKeys[key] || key

    if(!name) return console.error(`A key is required to remove a local storage item, instead got "${name}"`)
    
    try {
      return await this.removeItem(name)
    }
    catch (err:any) {
      console.error(`Error removing ${key} from local-storage.\n${err?.message}`)
    }
  }

  cleanup = async () => {
    try {
      await this.removeJwt()
      await this.removeHeaders()
    }
    catch(err){
      console.error(`Error cleaning up local-storage`, err)
    }
  }

  getUser = async () => await this.get(StorageKeys.USER)
  setUser = async (data:any) => await this.set(StorageKeys.USER, data)
  removeUser = async () => await this.remove(StorageKeys.USER)

  getJwt = async () => await this.get(StorageKeys.JWT, false)
  setJwt = async (data:any) => await this.set(StorageKeys.JWT, data, false)
  removeJwt = async () => await this.remove(StorageKeys.JWT)

  getRepo = async () => await this.get(StorageKeys.REPO)
  setRepo = async (data:any) => await this.set(StorageKeys.REPO, data)
  removeRepo = async () => await this.remove(StorageKeys.REPO)

  getHeaders = async () => await this.get(StorageKeys.ROUTE_HEADERS)
  setHeaders = async (data:any) => await this.set(StorageKeys.ROUTE_HEADERS, data)
  removeHeaders = async () => await this.remove(StorageKeys.ROUTE_HEADERS)

  getThemeType = async () => await this.get(StorageKeys.THEME_TYPE, false)
  setThemeType = async (data:any) => await this.set(StorageKeys.THEME_TYPE, data, false)

  getSettings = async ():Promise<TStorageSettings> => await this.get(StorageKeys.SETTINGS) || {}
  setSettings = async (data:TStorageSettings) => await this.set(StorageKeys.SETTINGS, data)
  removeSettings = async () => await this.remove(StorageKeys.SETTINGS)

  setSetting = async (
    name:string,
    data:Partial<TStorageSetting>,
    settings?:TStorageSettings
  ) => {
    
    const loc = name.includes(`.`)
      ? name
      : data?.group
        ? `${data?.group}.${name}`
        : undefined

    if(!loc) return missingGroup(name, data as TStorageSetting)

    settings = settings || await this.getSettings()
    settings[loc] = {...settings[loc], ...data}

    return await this.set(StorageKeys.SETTINGS, settings)
  }

  removeSetting = async (
    loc:string,
    settings?:TStorageSettings
  ) => {
    settings = settings || await this.getSettings()

    if(!loc.includes(`.`))
      return console.warn(`Can not remove setting; missing group and "." separator`)

    delete settings[loc]

    return await this.set(StorageKeys.SETTINGS, settings)
  }

  removeSettingGroup = async (group:string, settings?:TStorageSettings) => {
    settings = settings || await this.getSettings()

    const removed = Object.entries(settings)
      .reduce((acc, [key, value]) => {
        !key.startsWith(`${group}.`) && (acc[key] = value)
        
        return acc
      }, {} as TStorageSettings)

    return await this.set(StorageKeys.SETTINGS, removed)
  }

}

export const localStorage = new Storage()

!AuthActive && (async () => await localStorage.devData())()
