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
  testMatch?:string[]

  /**
   * Glob path of tests to ignore
   */
  testIgnore?:string[]

  /**
   * Use `require()` or `await import()` for loading modules
   * Defaults to using `require()`
   */
  loadType?:ELoadType

  /**
   * Array of file extensions that can be loaded
   */
  extensions?:string[]

  /**
   * Glob paths of files the loader will ignore
   */
  loaderIgnore?:string[]

  esbuild?:Parameters<typeof register>[0]|false
}

export enum ELoadType {
  import=`import`,
  require=`require`
}

export type TLoadOpts<T=ELoadType> = {
  type?:T
  force?:boolean
  testFile?:boolean
}