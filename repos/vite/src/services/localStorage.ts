import type { TStorageSetting, TStorageSettings } from '@types'

import { emptyObj } from '@keg-hub/jsutils'
import { noAuthService } from './noAuthService'
import { StorageKeys, LocalStorage } from '@gobletqa/components'
import {
  AuthActive,
  Environment,
  LastOpenedFilesAmount
} from '@constants/environment'


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
      await this.removeAllLastOpened()
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

  getLastOpenedSync = () => (this.getSync(StorageKeys.LAST_OPENED_FILES) || []) as string[]
  getLastOpened = async () => (await this.get(StorageKeys.LAST_OPENED_FILES) || []) as string[]

  addLastOpened = async (loc:string) => {
    if(!loc) return

    let lastOpened = await this.getLastOpened() as string[]

    // If it's already in opened, then remove it, and add it to the start
    // Otherwise, just add to the start
    lastOpened.includes(loc)
      ? (lastOpened = [loc, ...lastOpened.filter(ext => ext !== loc)])
      : lastOpened.unshift(loc)

    // If over the allowed last opened limit, remove the oldest entry
    lastOpened.length > LastOpenedFilesAmount && lastOpened.pop()

    await this.set(StorageKeys.LAST_OPENED_FILES, lastOpened)
  }

  opLastOpened = async (opts:{ add?:string, remove?:string, isFolder?:boolean}=emptyObj) => {
    const {
      add,
      remove,
      isFolder,
    } = opts

    let lastOpened = await this.getLastOpened() as string[]
    if(remove && (isFolder || lastOpened.includes(remove)))
      lastOpened = lastOpened.filter(ext => isFolder ? !ext.startsWith(remove) : ext !== remove)
    
    if(add)
      lastOpened.includes(add)
        ? (lastOpened = [add, ...lastOpened.filter(ext => ext !== add)])
        : lastOpened.unshift(add)
    
    if(!add && !remove) return

    await this.set(StorageKeys.LAST_OPENED_FILES, lastOpened)
  }

  removeLastOpened = async (loc:string, isFolder?:boolean) => {
    if(!loc) return

    const lastOpened = await this.getLastOpened() as string[]
    if(!isFolder && !lastOpened.includes(loc)) return

    const updated = lastOpened.filter(ext => isFolder ? !ext.startsWith(loc) : ext !== loc)

    await this.set(StorageKeys.LAST_OPENED_FILES, updated)
  }

  removeAllLastOpened = async () => {
    await this.remove(StorageKeys.LAST_OPENED_FILES)
  }
}

export const localStorage = new Storage()

!AuthActive && (async () => await localStorage.devData())()
