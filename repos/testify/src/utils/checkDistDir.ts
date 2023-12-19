import path from 'path'

/**
 * Helper to check if the location is in the built `dist` directory or not
 * Used when running in production, but in dev/local we use the `src` directory
 */
export const checkDistDir = (location:string, distDir:string) => {
  const dist = path.basename(location).startsWith(`dist`)

  return {
    dist,
    ext: dist ? `js` : `ts`,
    from: dist ? `dist` : `src`,
    dirname: dist ? path.join(location, distDir) : location
  }
}
