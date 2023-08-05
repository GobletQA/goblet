import type { TBrowserConf } from '@GBR/types'

/**
 * Builds a browser config merging the passed in params and global config.browser settings
 */
export const joinBrowserConf = (...configs:Partial<TBrowserConf>[]) => {
  return configs.reduce((acc, config) => {
    return {...acc, ...config}
  }, {} as TBrowserConf)
}
