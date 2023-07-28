
import type { Exam } from "@GEX/Exam"
import type { GlobOptions } from 'glob'

import type {
  TAnyCB,
  TLoadOpts,
  TLoaderCfg,
  TESBuildCfg,
  TExFileModel,
} from "@GEX/types"

import path from 'path'
import { promises } from 'fs'
import { createRequire } from 'module'
import moduleAlias from 'module-alias'
import { RunningCodeOptions } from "vm"
import { VMContext } from "@GEX/context/Context"
import { toFileModel } from "@GEX/utils/toFileModel"
import { register } from 'esbuild-register/dist/node'
import { globFileIgnore } from '@GEX/constants/defaults'
import { BaseTransform } from '@GEX/transform/BaseTransform'
import { LoaderCfg, Errors, ErrorCodes } from '@GEX/constants'
import { globMatchFiles, createGlobMatcher } from "@GEX/utils/globMatch"
import { exists, flatUnion, emptyObj, emptyArr, isStr } from "@keg-hub/jsutils"
const { readFile } = promises

type TLoopExtResp = {
  ext?:string
  data:string
}

type TLoadTests = TLoadOpts & {
  testDir?:string
  rootDir?:string
  testIgnore?:string|string[]
}

type TBuildRequire = {
  testDir?:string
  rootDir?:string
  aliases?:Record<string, string>
}

export class Loader {

  exam:Exam
  ctx:VMContext
  testDir:string
  unregister:TAnyCB
  cache:boolean=true
  require:NodeRequire
  esbuild:TESBuildCfg
  testMatch:string|string[]
  rootDir:string=LoaderCfg.rootDir
  extensions:string[]=LoaderCfg.extensions
  testIgnore:((match:string) => boolean)=() => false
  loaderIgnore:((match:string) => boolean)=() => false

  #transformer:BaseTransform
  #loadedCache:Record<string,any>={}
  #testFile:Record<string,boolean>={}
  #fileIgnored:Record<string,boolean>={}
  
  #globFileOpts:GlobOptions = {}

  constructor(exam:Exam, config:TLoaderCfg){
    this.exam = exam
    this.#setup(config)
  }

  #buildCtx = (opts:TBuildRequire) => {
    const {
      aliases,
      rootDir,
      testDir,
    } = opts
    
    if(aliases) moduleAlias.addAliases(aliases)

    const rootDirChange = (isStr(rootDir) && rootDir !== this.rootDir)

    this.rootDir = rootDirChange
      ? path.resolve(rootDir)
      : path.resolve(this.rootDir)

    if(!this.ctx || rootDirChange){
      this?.ctx?.cleanup?.()
      this.ctx = undefined

      this.ctx = new VMContext({
        exam: this.exam,
        require:createRequire(this.rootDir)
      })
    }

    if(testDir) this.testDir = path.resolve(rootDir, testDir)
  }

  #setup = (config:TLoaderCfg) => {
    const {
      esbuild,
      rootDir,
      testDir,
      testMatch,
      extensions,
      cache=true,
      testIgnore=emptyArr,
      loaderIgnore=emptyArr,
      transformIgnore=emptyArr
    } = config

    if(exists(cache)) this.cache = cache

    if(testMatch) this.testMatch = testMatch
    if(extensions) this.extensions = flatUnion(this.extensions, extensions)

    if(this.extensions?.length)
      this.extensions = this.extensions.map(ext => ext.replace(/^./, ``))

    if(testIgnore) this.testIgnore = createGlobMatcher(testIgnore)
    if(loaderIgnore) this.loaderIgnore = createGlobMatcher(loaderIgnore)


    if(esbuild !== false && !this.unregister){
      this.esbuild = {
        ...(LoaderCfg.esbuild as TESBuildCfg),
        ...esbuild,
        hookMatcher: this.#hookMatcher.bind(this)
      }
      this.unregister =  register().unregister
    }

    this.#transformer = new BaseTransform({
      transformIgnore,
      esbuild: this.esbuild,
    })

    this.#buildCtx({ rootDir, testDir })

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

    if(this.cache === false) return

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

  #onError = (location:string, err:any) => {
    err.code === ErrorCodes.NotFound
      ? Errors.NotFound(path.relative(this.rootDir, location), err)
      : Errors.LoadErr(err)
    
    return undefined
  }

  #onLoaded = <T extends any=any>(location:string, loaded:any, err:Error):T => {
    const wasIgnored = this.#fileIgnored[location]
    this.#testFile[location] = undefined
    this.#fileIgnored[location] = undefined

    if(!wasIgnored && err) return this.#onError(location, err)

    const resp = loaded || emptyObj

    if(this.cache === false) return resp

    this.#loadedCache[location] = resp

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

  #loopExts = async (file:string, cb:(file:string) => Promise<any>) => {
    let error:Error
    /**
     * Add empty as the last item, to the last Error will match the original location
     */
    const extensions = [...this.extensions, ``]
  
    return await extensions.reduce( async (acc, ext) => {
      const res = await acc
      if(res.ext) return res

      try {
        const loc = ext ? `${file}.${ext}` : file
        const data = await cb(loc)
        return { data, ext }
      }
      catch(err){
        error = err
        /** Validate if the loop is at the last extension */
        if(ext !== `` && err.code === ErrorCodes.NotFound) return res

        throw err
      }

    }, Promise.resolve({ data: `` } as TLoopExtResp))
  }

  #require = async <T extends any=any>(
    loc:string,
    opts:TLoadOpts=emptyObj
  ):Promise<T> => {
    const model = await this.loadContent<TExFileModel>(loc, {...opts, asModel: true}, false)
    return this.ctx.require(model)
  }

  load = async <T extends any=any>(
    loc:string,
    opts:TLoadOpts=emptyObj,
    meta:boolean=true
  ):Promise<T> => {
    const [location, options] = meta ? this.#getLoadMeta(loc, opts) : [loc, opts]

    const fromCache = !options.force
      && this.cache !== false
      && options.cache !== false
      && this.#loadedCache[location]
    
    if(fromCache) return this.#loadedCache[location]

    let loaded:any
    let error:Error
    // TODO: figure out how to add the found extension
    let extension:string

    try {
      options.cache === false && this.#clearLocCache(location)
      this.#testFile[location] = Boolean(options.testFile)
      
      if(path.extname(location).length)
        loaded = await this.#require(location, opts)
      else {
        const { data, ext } = await this.#loopExts(location, (lc) => this.#require(location, opts))
        loaded = data
        extension = ext
      }

    }
    catch(err){ error = err }

    return this.#onLoaded<T>(
      location,
      loaded,
      options.error !== false && error
    )
  }

  loadMany = async (locs:string[], opts:TLoadOpts=emptyObj) => {
    const [__, options] = this.#getLoadMeta(locs[0], opts)

    return await locs.reduce(async (acc, loc:string) => {
      const res = await acc
      res[loc] = await this.load(this.#getLoc(loc, options), options, false)
      return res
    }, Promise.resolve({} as Record<string, any>))

  }

  loadContent = async <T=string|TExFileModel>(
    loc:string,
    opts:TLoadOpts=emptyObj,
    meta:boolean=true
  ):Promise<T> => {
    const [location, options] = meta ? this.#getLoadMeta(loc, opts) : [loc, opts]
    let ext:string|undefined

    try {

      let loaded:string
      if(path.extname(location).length)
        loaded = await readFile(location, `utf8`)
      else {
        const resp = await this.#loopExts(location, (lc) => readFile(lc, `utf8`))
        loaded = resp?.data
        ext = resp?.ext
      }

      const content = await this.#transformer.transform(loaded, {
        exam: this.exam,
        esbuild: opts?.esbuild,
        file: { content: loaded, location }
      })

      return !options.asModel
        ? content as T
        : toFileModel({ location, content, ext }) as TExFileModel<any>
    }
    catch(err) {
      return this.#onError(location, err)
    }

  }

  loadContentMany = async (locs?:string|string[], opts:TLoadOpts=emptyObj) => {
    const {glob=emptyObj, ...options} = opts

    const locations = await globMatchFiles(locs, {
      ...this.#globFileOpts,
      ...glob,
      nodir: true,
      absolute: true,
    })

    if(!locations?.length) return undefined

    return await locations.reduce(async (acc, loc:string) => {
      const res = await acc
      if(!this.#hookMatcher(loc)) return res

      res[loc] = await this.loadContent<TExFileModel>(
        loc,
        {...options, asModel: true},
        false
      )

      return res
    }, Promise.resolve({} as Record<string, TExFileModel>))
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

    this.#buildCtx({ rootDir, testDir })

    return await this.loadContentMany(testMatch || this.testMatch, {...rest, testFile: true})
  }
  
  runTest = async (
    model:TExFileModel,
    opts:RunningCodeOptions=emptyObj
  ) => {
    return this.ctx.require(model, opts)
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
    this.esbuild = undefined
    this.testDir = undefined
    this.rootDir = undefined
    this.require = undefined
    this.testMatch = undefined
    this.unregister = undefined
    this.testIgnore = undefined
    this.loaderIgnore = undefined
  }

}