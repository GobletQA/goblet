import type { TTagOpts } from './getTagOptions'
import type { TTaskParams, TEnvObject } from '../../types'

import { loadEnvs } from '../envs/loadEnvs'
import { getTagOptions } from './getTagOptions'
import { getContext } from '../helpers/contexts'
import { resolveImgName } from './resolveImgName'
import { ensureArr, noOpObj, flatUnion, noPropArr } from '@keg-hub/jsutils'

const convertTags = (check:string, envs:TEnvObject) => {
  return check ? ((envs[`GB_${check.toUpperCase()}_BUILD_TAGS`] || ``) as string).split(`,`) : noPropArr
}

/**
 * Parses the tagMatch argument and checks if there is a branch match
 * If there is then is adds the tag types to the tags array
 */
const generateTagMatches = (
  params:TTaskParams = noOpObj as TTaskParams,
  docFileCtx:string = ``,
  envs:TEnvObject,
  tagOptions:TTagOpts
) => {
  const sContext = getContext(docFileCtx)?.short
  
  const contextTags = flatUnion(convertTags(docFileCtx, envs), convertTags(sContext, envs))
  const buildTags = contextTags.length ? contextTags : convertTags(`IMAGE`, envs)
  const tags = flatUnion(ensureArr(params.tag), buildTags).filter(Boolean)

  if (!params.tagMatch) return tags

  const { tagMatch } = params
  const [branch, tag] = tagMatch.split(`:`)

  return tagOptions.branch === branch ? tags.concat(tag.split(',')) : tags
}

/**
 * Generates the docker build image tags based on passed in params
 */
export const resolveImgTags = async (
  params:TTaskParams = noOpObj as TTaskParams,
  docFileCtx:string = ``,
  envs?:TEnvObject
) => {
  const { env } = params

  envs = envs || loadEnvs({ env })
  const tagOptions = await getTagOptions(params, docFileCtx, envs)
  const tagArr = generateTagMatches(params, docFileCtx, envs, tagOptions)

  if (!tagArr.length) tagArr.push(`package`)

  const imageName = resolveImgName((params = noOpObj as TTaskParams), docFileCtx, envs)

  return tagArr.reduce((imgTags, tag) => {
    const value = (tagOptions[tag] || tag).replace(/\s\n\t:\/\\/g, '.')

    value && imgTags.push(`--tag`, `${imageName}:${value}`)

    return imgTags
  }, [])
}
