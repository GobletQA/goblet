

import { limbo } from '@keg-hub/jsutils'
import { STORAGE, ENVIRONMENT } from '@constants'

export type TWrapperFunc = (...args:any[]) => void


class Storage {

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
    if (ENVIRONMENT !== 'local') return

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
  get = async (key:string, parse?:boolean) => {
    const name = STORAGE[key] || key
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


  set = async (key:string, data:any, stringify?:boolean) => {
    const name = STORAGE[key] || key
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
    const name = STORAGE[key] || key

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
      // this.cache = {}
      await this.removeJwt()
      await this.removeHeaders()
    }
    catch(err){
      console.error(`Error cleaning up local-storage`, err)
    }
  }

  getUser = async () => this.get(STORAGE.USER, true)
  setUser = async (data:any) => this.set(STORAGE.USER, data, true)
  removeUser = async () => this.remove(STORAGE.USER)
 
  getJwt = async () => this.get(STORAGE.JWT)
  setJwt = async (data:any) => this.set(STORAGE.JWT, data)
  removeJwt = async () => this.remove(STORAGE.JWT)

  getRepo = async () => this.get(STORAGE.REPO, true)
  setRepo = async (data:any) => this.set(STORAGE.REPO, data)
  removeRepo = async () => this.remove(STORAGE.REPO)

  getHeaders = async () => await this.get(STORAGE.ROUTE_HEADERS, true)
  setHeaders = async (data:any) => await this.set(STORAGE.ROUTE_HEADERS, data, true)
  removeHeaders = async () => this.remove(STORAGE.ROUTE_HEADERS)

}

export const localStorage = new Storage()
