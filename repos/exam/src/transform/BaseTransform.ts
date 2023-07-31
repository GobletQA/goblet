import type {
  TTransform,
  TESBuildCfg,
  IExTransform,
  TExTransformCfg,
} from '@GEX/types'



import path from 'path'
import * as esbuild from 'esbuild'
import { emptyObj } from '@keg-hub/jsutils'
import { Errors } from '@GEX/constants/errors'
import { createGlobMatcher } from '@GEX/utils/globMatch'

const IMPORT_META_URL_VARIABLE_NAME = '__esbuild_register_import_meta_url__'
const FILE_LOADERS: Record<string, string> = {
  '.js': 'js',
  '.jsx': 'jsx',
  '.ts': 'ts',
  '.tsx': 'tsx',
  '.mjs': 'js',
  '.mts': 'ts',
  '.cts': 'ts',
}

export const inferPackageFormat = (
  filename: string,
): 'esm' | 'cjs' => {

  if (filename.endsWith('.mjs')) return 'esm'
  if (filename.endsWith('.cjs')) return 'cjs'

  return /\.m?js$/.test(filename)
    ? 'esm'
    : 'cjs'
}

/**
 * ExamTransform - Base transform, used for all files by default
 * Can be overridden by defining custom transforms in a config
 */
export class BaseTransform<T=string> implements IExTransform<T> {

  esbuild?:TESBuildCfg=emptyObj
  options:TExTransformCfg=emptyObj
  
  transformIgnore:(match:string) => boolean

  constructor(cfg?:TExTransformCfg) {

    const { transformIgnore, esbuild, ...rest } = cfg

    if(esbuild) this.esbuild = esbuild
    this.transformIgnore = createGlobMatcher(transformIgnore)
    
    this.options = {...this.options, ...rest}
  }

  #onTransform = (transformed:esbuild.TransformResult) => {
    transformed.warnings?.length
      && transformed.warnings.map(warn => console.log(warn))

    return transformed.code
  }

  #esOpts = (cfg:TESBuildCfg=emptyObj) => {
    const { hookMatcher:_, ...rest } = cfg
    const { hookMatcher:__, ...local } = this.esbuild

    return {...local, ...rest}
  }

  transformAsync = async (content:string, cfg:TESBuildCfg):Promise<string> => {
    const esCfg = this.#esOpts(cfg)
    const transformed = await esbuild.transform(content, this.#esOpts(esCfg))
    return this.#onTransform(transformed)
  }
  
  transformSync = (content:string, cfg:TESBuildCfg):string => {
    const transformed = esbuild.transformSync(content, this.#esOpts(cfg))
    return this.#onTransform(transformed)
  }
  
  transform = (content:string, ctx:Pick<TTransform, `file`|`esbuild`>, sync?:boolean):Promise<T>|T => {
    const { file, esbuild } = ctx
    if(this.transformIgnore(file.location)) return content as T

    const ext = file.ext || path.extname(file.location)

    try {
      const { hookMatcher, ...opts} = (esbuild || {})
      
      const esOpts:TESBuildCfg = {
        sourcemap: `both`,
        sourcefile: file.location,
        loader: FILE_LOADERS[ext] as any,
        format: inferPackageFormat(file.location),
        define: {'import.meta.url': IMPORT_META_URL_VARIABLE_NAME },
        banner: `const ${IMPORT_META_URL_VARIABLE_NAME} = require('url').pathToFileURL(__filename).href;`,
        ...opts,
      }
      
      return sync
        ? this.transformSync(content, esOpts) as T
        : this.transformAsync(content, esOpts) as T
    }
    catch(err){
      Errors.Transform(file.location, `BaseTransform.transform`, err)

      return content as T
    }
  }
  
}
