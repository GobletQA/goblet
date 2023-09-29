import type { TBrowserLaunchOpts } from './shared.types'
export type TBrowserTaskOpts = TBrowserLaunchOpts & { devices?: string[], type?: string }