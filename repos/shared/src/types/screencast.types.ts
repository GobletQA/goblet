
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
  path?: string
  active?: boolean
  protocol?: string
}

export type TBrowserContext = {
  screen: TScreenDims,
  viewport: TScreenDims,
}

export type TBrowserPage = {
  [key:string]: any
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

export type TBrowserConfig = {
  [key:string]: any
}

export type TScreencastConfig = {
  active?: boolean
  vnc?: TVncConfig
  novnc?: TNoVncProxy
  page?: TBrowserPage
  browser?: TBrowserConfig
  context?: TBrowserContext
}

export type TGScreencastConfig = {
  server: TScreencastServer
  screencast: TScreencastConfig
}
