import path from 'path'
import { writeFileSync } from 'fs'
import { appRoot } from '../../paths'
import { toBool } from '@keg-hub/jsutils'
import semverLt from 'semver/functions/lt'
import semverInc from 'semver/functions/inc'
import semverValid from 'semver/functions/valid'
import { Logger, fileSys } from '@keg-hub/cli-utils'

const packagePath = path.join(appRoot, `package.json`)

type TPackageJson = Record<any, any>

/**
 * TODO: Replace this to use cli-utils constants once new version is pushed
 */
const SEMVER_TYPES = [
  `major`,
  `minor`,
  `patch`,
  `meta`,
  `premajor`,
  `preminor`,
  `prepatch`,
  `prerelease`,
]

/**
 * Validates if version is one of: minor,major,patch or specific semver version
 * @function
 */
 const isValidSemver = async (pack:TPackageJson, version:string) => {
  const valid = SEMVER_TYPES.indexOf(version) !== -1
    ? true
    : semverValid(version)

  if(!toBool(valid)) throw new Error(`Invalid Semver version ${version}`)

  const verNum = semverInc(pack.version, version)

  if(semverLt(verNum, pack.version))
    throw new Error(`New version ${verNum} must be greater then the previous version ${pack.version}!`)

  return verNum
}

/**
 * Rewrites the package.json for the passed in location
 * If a version is passed in, it update the version in the package before writing
 * @function
 */
const writePackageVersion = (pack:TPackageJson, version:string) => {
  version && (pack.version = version)
  return writeFileSync(packagePath, JSON.stringify(pack, null, 2) + '\n')
}

/**
 * Loads the package.json from the goblet-root directory
 * @function
 */
const loadPackage = () => {
  const content = fileSys.readFileSync(packagePath)
  return JSON.parse(content) as TPackageJson
}

const logCurrent = (pack:TPackageJson) => {
  Logger.yellow(`\n  ${pack.name}:`)
  Logger.pair(`    * Current:`, pack.version)
  Logger.empty()
}

/**
 * Updates the version in package.json with a valid semver value
 */
export const updateVersion = async (
  version:string,
  log:boolean
) => {

  const pack = loadPackage()

  log && logCurrent(pack)

  const updateTo = await isValidSemver(pack, version)

  writePackageVersion(pack, updateTo)
  log && Logger.success(`\n${pack.name} was successfully updated to version "${pack.version}"\n`)
  
  return updateTo
}
