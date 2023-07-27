import type { register } from 'esbuild-register/dist/node'


export type TESBuildCfg = Parameters<typeof register>[0]

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
   */
  extensions?:string[]

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
  esbuild?:TESBuildCfg
}