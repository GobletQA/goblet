
import type { Exam } from "@GEX/Exam"
import type {
  TAnyCB,
  TLoadOpts,
  TLoaderCfg,
} from "@GEX/types"

import url from 'url'
import path from 'path'
import { ELoadType } from "@GEX/types"
import { createRequire } from 'module'
import { LoaderCfg } from '@GEX/constants'
import { LoaderErr } from '@GEX/utils/error'
import { register } from 'esbuild-register/dist/node'
import { createGlobMatcher } from "@GEX/utils/globMatch"
import { noOp, flatUnion, emptyObj, limbo } from "@keg-hub/jsutils"

export class Loader {
  exam:Exam
  testDir:string
  testMatch:string[]
  require:NodeRequire
  unregister:TAnyCB=noOp
  rootDir:string=LoaderCfg.rootDir
  testIgnore:(match:string) => boolean
  loaderIgnore:(match:string) => boolean
  loadType?:ELoadType=LoaderCfg.loadType
  extensions:string[]=LoaderCfg.extensions

  #loadedCache:Record<string,any>={}
  #testFile:Record<string,boolean>={}
  #fileIgnored:Record<string,boolean>={}

  constructor(exam:Exam, config:TLoaderCfg){
    this.exam = exam
    this.#setup(config)
  }

  #setup = (config:TLoaderCfg) => {

    const {
      esbuild,
      rootDir,
      testDir,
      loadType,
      testMatch,
      extensions,
      testIgnore,
      loaderIgnore,
    } = config

    if(loadType) this.loadType = loadType
    if(testMatch) this.testMatch = testMatch
    if(extensions) this.extensions = flatUnion(this.extensions, extensions)

    this.testIgnore = createGlobMatcher(testIgnore)
    this.loaderIgnore = createGlobMatcher(loaderIgnore)

    this.rootDir = path.resolve(rootDir || this.rootDir)
    if(testDir) this.testDir = path.resolve(rootDir, testDir)

    if(esbuild !== false)
      this.unregister =  register({
        ...esbuild,
        hookMatcher: this.#hookMatcher.bind(this)
      }).unregister

    this.require = createRequire(this.rootDir)

  }

  #clearLocCache = (loc:string) => {
    require.cache[loc] = undefined
    delete require.cache[loc]

    this.#loadedCache[loc] = undefined
    delete this.#loadedCache[loc]
  }

  #hookMatcher = (filename:string) => {
    if(this.loaderIgnore(filename)){
      this.#fileIgnored[filename] = true
      return false
    }
    if(this.#testFile[filename] && this.testIgnore(filename)){
      this.#fileIgnored[filename] = true
      return false
    }

    return true
  }

  #onLoaded = (location:string, loaded:any, err:Error) => {
    const wasIgnored = this.#fileIgnored[location]
    this.#testFile[location] = undefined
    this.#fileIgnored[location] = undefined

    if(!wasIgnored && err) throw new LoaderErr(err)

    this.#loadedCache[location] = loaded || emptyObj

    return this.#loadedCache[location]
  }

  #getLoc = (loc:string, opts:TLoadOpts=emptyObj) => {
    const { testFile } = opts
    const fromDir = (testFile && this.testDir) || this.rootDir

    return path.resolve(fromDir, loc)
  }

  loadSync = (location:string, opts:TLoadOpts<ELoadType.require>=emptyObj) => {
    let loaded:any
    let error:Error

    try {
      opts.cache === false
        && this.#clearLocCache(location)

      this.#testFile[location] = Boolean(opts.testFile)

      loaded = this.require(location)
    }
    catch(err){
      error = err
    }
    finally {
      return this.#onLoaded(
        location,
        loaded,
        opts.error !== false && error
      )
    }
  }

  loadAsync = async (location:string, opts:TLoadOpts<ELoadType.import>=emptyObj) => {
    /**
     * Playwright is doing this to import the file
     * Would like to investigate why at some point
     * @example
     * const esmImport = () => eval(`import(${JSON.stringify(converted)})`)
     * return await esmImport()
     */

    // Add the date to the locUrl url as a query param
    const locUrl = url.pathToFileURL(location)


    if(opts.cache === false){
      this.#clearLocCache(location)
      locUrl.searchParams.append('t', `${Date.now()}`)
    }

    this.#testFile[location] = Boolean(opts.testFile)
    const [loaded, error] = await limbo(import(JSON.stringify(locUrl.href)))

    return this.#onLoaded(
      location,
      loaded,
      opts.error !== false && error
    )
  }

  load = (loc:string, opts:TLoadOpts=emptyObj) => {
    const loadType = opts?.type || this.loadType

    const location = this.#getLoc(loc, {...opts, type: loadType })

    if(!opts.force && opts.cache !== false && this.#loadedCache[location])
      return this.#loadedCache[location]

    return loadType === ELoadType.import
      ? this.loadAsync(location, {...opts, type: ELoadType.import})
      : this.loadSync(location, {...opts, type: ELoadType.require})
  }

  /**
   * Call this when removing the Loader is being removed
   * After this call, it's no longer usable
   */
  cleanup = () => {
    this?.unregister?.()

    this.#testFile = {}
    this.extensions = []
    this.#fileIgnored = {}
    this.#loadedCache = {}
    this.exam = undefined
    this.testDir = undefined
    this.rootDir = undefined
    this.require = undefined
    this.loadType = undefined
    this.testMatch = undefined
    this.unregister = undefined
    this.testIgnore = undefined
    this.loaderIgnore = undefined

  }

}