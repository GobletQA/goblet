
export type TKubeError = Error & {
  statusCode: number | string
}

export type TKubeConfig = {
  namespace?: string
}

export type TWatchRes = Record<'abort', () => void>
