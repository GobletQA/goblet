import { Values } from 'HKConstants'
import { KeyStore } from 'KegNative/keyStore'
const { STORAGE } = Values

class Storage {

  /**
  * Loads repo object from local storage
  * Then immediately removes it from local storage
  */
  get = async (key, parse) => {
    const name = STORAGE[key] || key
    if(!name) return console.error(`A key is required to get a local storage item, instead got "${name}"`)

    try {
      const savedData = await KeyStore.getItem(name)
      return !savedData
        ? undefined
        : parse
          ? JSON.parse(savedData)
          : savedData
    }
    catch (err) {}
  }


  set = async (key, data, stringify) => {
    const name = STORAGE[key] || key
    if(!name) return console.error(`A key is required to set a local storage item, instead got "${name}"`)

    try {
      const save = stringify && typeof data !== 'string'
        ? JSON.stringify(data)
        : data
      return await KeyStore.setItem(name, save)
    }
    catch (err) {
      console.error(`Error saving ${key} to local-storage.\n${err.message}`)
    }
  }

  /**
   * Removes the store repo from local storage
   */
  remove = async (key) => {
    const name = STORAGE[key] || key
    if(!name) return console.error(`A key is required to remove a local storage item, instead got "${name}"`)
    
    try {
      return await KeyStore.removeItem(name)
    }
    catch (err) {
      console.error(`Error removing ${key} from local-storage.\n${err.message}`)
    }
  }

  cleanup = async () => {
    try {
      await this.removeJwt()
      await this.removeScPort()
      await this.removeHeaders()
    }
    catch(err){
      console.error(`Error cleaning up local-storage`, err)
    }
  }

  getUser = async () => this.get(STORAGE.USER, true)
  setUser = async (data) => this.set(STORAGE.USER, data, true)
  removeUser = async () => this.remove(STORAGE.USER)
 
  getJwt = async () => this.get(STORAGE.JWT)
  setJwt = async (data) => this.set(STORAGE.JWT, data)
  removeJwt = async () => this.remove(STORAGE.JWT)

  getRepo = async () => this.get(STORAGE.REPO, true)
  setRepo = async (data) => this.set(STORAGE.REPO, data)
  removeRepo = async () => this.remove(STORAGE.REPO)

  getScPort = async () => await this.get(STORAGE.SC_PORT)
  setScPort = async (data) => await this.set(STORAGE.SC_PORT, data)
  removeScPort = async () => this.remove(STORAGE.SC_PORT)

  getHeaders = async () => await this.get(STORAGE.ROUTE_HEADERS, true)
  setHeaders = async (data) => await this.set(STORAGE.ROUTE_HEADERS, data, true)
  removeHeaders = async () => this.remove(STORAGE.ROUTE_HEADERS)

}

export const localStorage = new Storage()
