
export type TScreenDims = {
  width: number,
  height: number,
}

export type TRecorderOpts = {
  locator: string
  [key:string]: any
}

export type TScreencastServer = {
  port: string
  host: string
}

export type TBrowserContext = {
  screen: TScreenDims,
  viewport: TScreenDims,
}

export type TVncConfig = {
  host: string
  port: string
  display: string
  width: string | number
  height: string | number
}

export type TNoVncProxy = {
  host: string
  port: string
}

export type TBrowserConfig = Record<any, any>

export type TGScreencastConfig = {
  vnc: TVncConfig
  active: boolean
  novnc: TNoVncProxy
  browser: TBrowserConfig
  context: TBrowserContext
  server: TScreencastServer
}
