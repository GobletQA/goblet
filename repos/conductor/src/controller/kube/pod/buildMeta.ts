import type { TPodMeta, TPodMetaOpts } from '../../../types'
import { addIfExists } from './helpers'

export const buildMeta = (opts:Record<'meta', TPodMetaOpts>):TPodMeta => {
  const { name, namespace, labels, annotations } = opts.meta

  const built = { name, namespace }
  addIfExists(built, `labels`, labels)
  addIfExists(built, `annotations`, annotations)
  
  return built
}