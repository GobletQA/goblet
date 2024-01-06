import { getBaseApiUrl } from '@utils/api/getBaseApiUrl'

type TBaseURlMeta = {
  url:URL
  https:boolean
  protocol:string
}

const BaseURLMeta = {} as TBaseURlMeta

export const getBaseUrl = () => {
  if(BaseURLMeta.url) return BaseURLMeta

  const base = getBaseApiUrl()
  BaseURLMeta.url = new URL(base)

  const { protocol } = new URL(window.location.origin)
  BaseURLMeta.protocol = protocol
  BaseURLMeta.https = Boolean(protocol.includes(`https`))

  return BaseURLMeta
}