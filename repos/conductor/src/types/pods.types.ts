import { V1Pod, V1ObjectMeta } from '@kubernetes/client-node'

export type TPodMeta = Omit<V1ObjectMeta, `name` | `namespace`> & {
  name: string
  namespace: string
}

export type TPodManifest = V1Pod & {
  metadata: TPodMeta
}