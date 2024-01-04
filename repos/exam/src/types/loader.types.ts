import type { GlobOptions } from 'glob'
import type { IExTransform } from './transform.types'
import type { RegisterOptions } from 'esbuild-register'


export type TESBuildCfg = RegisterOptions

export type TLoaderCfg = {
  /**
   * Must be a absolute URL
   */
  rootDir?:string

  /**
   * Use module caching based on file path
   */
  cache?:boolean

  /**
   * Relative to the rootDir
   */
  testDir?:string

  /**
   * Glob path of tests to run
   */
  testMatch?:string|string[]

  /**
   * Glob path of tests to ignore
   */
  testIgnore?:string[]

  /**
   * Glob path of files to be ignored by the transformer
   */
  transformIgnore?:string[]

  /**
   * Array of file extensions that can be loaded
   * Overrides the defaults
   */
  extensions?:string[]

  /**
   * Boolean to turn on/off matching file extensions
   * Defaults to `false`
   */
  matchExtensions?:boolean

  /**
   * Glob paths of files the loader will ignore
   */
  loaderIgnore?:string[]

  /**
   * Uses module-alias to inject aliases
   * See here for more info https://github.com/ilearnio/module-alias
   */
  aliases?:Record<string, string>

  /**
   * Esbuild configuration passed to esbuild
   * See here for more info https://github.com/egoist/esbuild-register
   */
  esbuild?:TESBuildCfg|false
}


export type TLoadOpts = {
  cache?:boolean
  force?:boolean
  error?:boolean
  single?:boolean
  asModel?:boolean
  testFile?:boolean
  glob?:GlobOptions
  esbuild?:TESBuildCfg
  transform?:IExTransform
}