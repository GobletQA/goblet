import type { register } from 'esbuild-register/dist/node'

export type TLoaderCfg = {
  /**
   * Must be a absolute URL
   */
  rootDir?:string

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
   * Array of file extensions that can be loaded
   */
  extensions?:string[]

  /**
   * Glob paths of files the loader will ignore
   */
  loaderIgnore?:string[]

  /**
   * Esbuild configuration passed to esbuild
   * See here for more info https://github.com/egoist/esbuild-register
   */
  esbuild?:Parameters<typeof register>[0]|false
}


export type TLoadOpts = {
  cache?:boolean
  force?:boolean
  error?:boolean
  testFile?:boolean
  asModel?:boolean
}