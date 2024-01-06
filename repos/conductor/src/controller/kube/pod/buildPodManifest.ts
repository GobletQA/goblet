import type { TPodManifest } from '@GCD/types'
import type { TPodManifestOpts } from '@gobletqa/shared/types'

import { buildMeta } from './buildMeta'
import { buildSpec } from './buildSpec'

export const buildPodManifest = (opts:TPodManifestOpts):TPodManifest => {
  return {
    kind: opts?.kind || `Pod`,
    apiVersion: opts?.apiVersion || `v1`,
    spec: buildSpec(opts),
    metadata: buildMeta(opts),
  }
}