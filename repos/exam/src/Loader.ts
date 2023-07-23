
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
import { noOp, flatUnion, emptyObj, emptyArr } from "@keg-hub/jsutils"

export class Loader {
  exam:Exam
  testDir:string
  testMatch:string[]
  testIgnore:string[]
  require:NodeRequire
  loaderIgnore:string[]=emptyArr
  loadType?:ELoadType=LoaderCfg.loadType
  unregister:TAnyCB=noOp
  rootDir:string=LoaderCfg.rootDir
  extensions:string[]=LoaderCfg.extensions

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
      loaderIgnore,
    } = config

    if(loadType) this.loadType = loadType
    if(testMatch) this.testMatch = testMatch
    if(extensions) this.extensions = flatUnion(this.extensions, extensions)

    loaderIgnore

    this.rootDir = path.resolve(rootDir || this.rootDir)
    if(testDir) this.testDir = path.resolve(rootDir, testDir)

    if(esbuild !== false)
      this.unregister =  register(esbuild || emptyObj).unregister

      this.require = createRequire(this.rootDir)

  }

  #getLoc = (loc:string, opts:TLoadOpts=emptyObj) => {
    const { testFile } = opts
    const fromDir = (testFile && this.testDir) || this.rootDir

    return path.resolve(fromDir, loc)
  }

  loadSync = (loc:string, opts:TLoadOpts<ELoadType.require>=emptyObj) => {
    try {
      const location = this.#getLoc(loc, {...opts, type: ELoadType.require})

      if(opts.force) delete require.cache[location]

      return this.require(location)
    }
    catch(err){
      throw new LoaderErr(err)
    }
  }

  loadAsync = async (loc:string, opts:TLoadOpts<ELoadType.import>=emptyObj) => {

    /**
     * Playwright is doing this to import the file
     * Would like to investigate why at some point
     * @example
     * const esmImport = () => eval(`import(${JSON.stringify(converted)})`)
     * return await esmImport()
     */

    try {

      const location = url.pathToFileURL(this.#getLoc(loc, {
        ...opts,
        type: ELoadType.import
      }))

      // Add the date to the location url as a query param
      // This 
      if(opts.force) location.searchParams.append('t', `${Date.now()}`)

      return await import(JSON.stringify(location.href))
    }
    catch(err){
      throw new LoaderErr(err)
    }
  }
  
  load = (loc:string, opts:TLoadOpts=emptyObj) => {
    const loadType = opts?.type || this.loadType

    return loadType === ELoadType.import 
      ? this.loadAsync(loc, {...opts, type: ELoadType.import})
      : this.loadSync(loc, {...opts, type: ELoadType.require})
  }
  
  cleanup = () => {
    this?.unregister?.()
    this.unregister = undefined
    this.require = undefined
  }

}