/**
 * Will be needed when the package is bundled
 * Still needs to be figured out
 * So for now just return __dirname
 */
const resolveRoot = () => {
  return __dirname.endsWith(`/dist`) ? __dirname.replace(`/dist`, ``) : __dirname
}

module.exports = {
  GRPRoot: resolveRoot()
}