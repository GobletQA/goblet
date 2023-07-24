
import type { Exam } from "@GEX/Exam"
import type { GlobOptions } from 'glob'

import type {
  TAnyCB,
  TLoadOpts,
  TLoaderCfg,
  TExFileModel,
} from "@GEX/types"

import path from 'path'
import { readFileSync } from 'fs'
import { createRequire } from 'module'
import { LoaderCfg } from '@GEX/constants'
import { LoaderErr } from '@GEX/utils/error'
import { toFileModel } from "@GEX/utils/toFileModel"
import { register } from 'esbuild-register/dist/node'
import { globFileIgnore } from '@GEX/constants/defaults'
import { globFiles, createGlobMatcher } from "@GEX/utils/globMatch"

import { noOp, flatUnion, emptyObj } from "@keg-hub/jsutils"


type TLoadTests = TLoadOpts & {
  testDir?:string
  rootDir?:string
  testIgnore?:string|string[]
}

type TBuildRequire = {
  testDir?:string
  rootDir?:string
}

export class Loader {

  exam:Exam
  testDir:string
  require:NodeRequire
  unregister:TAnyCB=noOp
  testMatch:string|string[]
  rootDir:string=LoaderCfg.rootDir
  extensions:string[]=LoaderCfg.extensions
  esbuild:Parameters<typeof register>[0]|false
  testIgnore:((match:string) => boolean)=() => false
  loaderIgnore:((match:string) => boolean)=() => false

  #loadedCache:Record<string,any>={}
  #testFile:Record<string,boolean>={}
  #fileIgnored:Record<string,boolean>={}
  
  #globFileOpts:GlobOptions = {}

  constructor(exam:Exam, config:TLoaderCfg){
    this.exam = exam
    this.#setup(config)
  }

  #buildRequire = (opts:TBuildRequire) => {
    const {
      rootDir,
      testDir,
    } = opts
    
    if(!this.require || rootDir && (this.rootDir !== rootDir)){
      this.require = undefined
      this.require = createRequire(rootDir || this.rootDir)
    }

    this.rootDir = path.resolve(rootDir || this.rootDir)
    if(testDir) this.testDir = path.resolve(rootDir, testDir)
  }

  #setup = (config:TLoaderCfg) => {

    const {
      esbuild,
      rootDir,
      testDir,
      testMatch,
      extensions,
      testIgnore,
      loaderIgnore,
    } = config

    if(testMatch) this.testMatch = testMatch
    if(extensions) this.extensions = flatUnion(this.extensions, extensions)

    if(testIgnore) this.testIgnore = createGlobMatcher(testIgnore)
    if(loaderIgnore) this.loaderIgnore = createGlobMatcher(loaderIgnore)

    if(esbuild !== false && !this.unregister){
      this.esbuild = {...esbuild, hookMatcher: this.#hookMatcher.bind(this)}
      this.unregister =  register().unregister
    }

    // TODO: Investigate injecting aliases here
    this.#buildRequire({ rootDir, testDir })

    this.#globFileOpts = {
      ...this.#globFileOpts,
      cwd: rootDir || this.#globFileOpts.cwd,
      root: testDir || this.#globFileOpts.root,
      ignore:[...globFileIgnore, ...loaderIgnore,...testIgnore]
    }

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

  #getLoadMeta = (loc:string, opts:TLoadOpts=emptyObj) => {
    const options = {...opts }
    const location = this.#getLoc(loc, options)

    return [
      location,
      options,
    ] as [string, TLoadOpts]
  }

  load = (loc:string, opts:TLoadOpts=emptyObj, meta:boolean=true) => {
    const [location, options] = meta ? this.#getLoadMeta(loc, opts) : [loc, opts]

    if(!options.force && options.cache !== false && this.#loadedCache[location])
      return this.#loadedCache[location]

    let loaded:any
    let error:Error

    try {
      options.cache === false && this.#clearLocCache(location)
      this.#testFile[location] = Boolean(options.testFile)
      loaded = this.require(location)
    }
    catch(err){ error = err }

    return this.#onLoaded(
      location,
      loaded,
      options.error !== false && error
    )
  }

  loadMany = (locs:string[], opts:TLoadOpts=emptyObj) => {
    const [__, options] = this.#getLoadMeta(locs[0], opts)

    return locs.reduce((acc, loc:string) => {
      acc[loc] = this.load(this.#getLoc(loc, options), options, false)
      return acc
    }, {} as Record<string, any>)

  }

  loadContent = (loc:string, opts:TLoadOpts=emptyObj, meta:boolean=true) => {
    const [location, options] = meta ? this.#getLoadMeta(loc, opts) : [loc, opts]

    try {
      const content = readFileSync(location, 'utf8')
      return content.toString()
    }
    catch(err) {
      throw new LoaderErr(err)
    }
  }

  loadContentMany = async (locs?:string|string[], opts:TLoadOpts=emptyObj) => {
    const locations = await globFiles(locs, {
      ...this.#globFileOpts,
      ...opts,
      nodir: true,
      absolute: true,
    })

    return locations.reduce((acc, loc:string) => {
      if(!this.#hookMatcher(loc)) return acc

      const content = this.loadContent(loc, opts, false)
      acc[loc] = toFileModel({ content, location: loc })

      return acc
    }, {} as Record<string, TExFileModel>)
  }

  loadTests = async (
    testMatch:string|string[],
    opts:TLoadTests
  ) => {
    const {
      testDir,
      rootDir,
      testIgnore,
      ...rest
    } = opts
    
    if(testIgnore) this.testIgnore = createGlobMatcher(testIgnore)

    this.#buildRequire({ rootDir, testDir })
    
    return this.loadContentMany(testMatch || this.testMatch, {...rest, testFile: true})
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
    this.testMatch = undefined
    this.unregister = undefined
    this.testIgnore = undefined
    this.loaderIgnore = undefined
  }

}