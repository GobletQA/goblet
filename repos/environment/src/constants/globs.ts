
export const GlobMatchKeys = [`**`,`*`,`[`,`]`,`|`,`...`,`{`,`}`,`?`,`@`,`+`,`!`,`:`]

export const GlobJSExts = [
  `js`,
  `cjs`,
  `mjs`,
  `ts`,
  `cts`,
  `mts`
]

export const GlobJSFiles = `**/*.{${GlobJSExts.join(',')}}`
export const GlobIgnoreIdx = `**/index.{${GlobJSExts.join(',')}}`

export const GlobNMIgnore = [
  `/node_modules/`,
  `\\.pnp\\.[^\\\/]+$`
]

export const GlobAllIgnore = [
  GlobIgnoreIdx,
  ...GlobNMIgnore
]


export const GlobOnlyFiles = {
  nodir: true,
  absolute: true,
  ignore: GlobAllIgnore
}