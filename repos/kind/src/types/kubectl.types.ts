
export type TKubeError = Error & {
  statusCode: number | string
}

export type TKubeConfig = {
  namespace?: string
}

export type TWatchRes = Record<'abort', () => void>

export type TSpecMetadata = {
  name: string
  namespace: string
}

export type TPodContainer = {
  name: string
  image: string
  
}

export type TPodSpec = {
  containers: TPodContainer[]
  [key: string]: any
}

export type TPodManifest = {
  metadata: TSpecMetadata
  spec: TPodSpec
  [key: string]: any
}