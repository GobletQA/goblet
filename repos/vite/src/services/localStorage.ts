import type { TStorageSetting, TStorageSettings } from '@types'

import { noAuthService } from './noAuthService'
import { StorageKeys, LocalStorage } from '@gobletqa/components'
import { AuthActive, Environment } from '@constants/environment'

export type TWrapperFunc = (...args:any[]) => void

const missingGroup = (setting:string, data:TStorageSetting) => {
  console.error(`Can not save setting ${setting} without a group name.`, data)
  throw new Error(`Error saving setting`)
}

class Storage extends LocalStorage {

  devData = async () => {
    await noAuthService.init()
    Object.assign(this, noAuthService)
  }

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


  cleanupSession = async () => {
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
  removeThemeType = async () => await this.remove(StorageKeys.THEME_TYPE)

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
