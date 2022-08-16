import path from 'path'
import { writeFileSync, rmSync } from 'fs'
import { tempDir } from'../../paths'
import { uuid } from'@keg-hub/jsutils'
import { Logger, error } from'@keg-hub/cli-utils'
import { kubectl } from '../../utils/kubectl/kubectl'
import { resolveLocalPath } from '../../utils/helpers/resolveLocalPath'

const resolveNames = (name:string, key:string, keyvalue:string) => {
  const splitK = keyvalue && keyvalue.trim().split(`:`).shift()
  
  if(!key) key = splitK || name
  if(!name) name = key || splitK

  if(!name || !key) error.throwError(`Either the 'name' or 'key' option must be passed to create a secret`)
  
  return {name, key}
}


const temptFile = () => {
  return path.join(tempDir, `${uuid()}.txt`)
}

const saveTempSecret = (value:string) => {
  const tempFileLoc = temptFile()
  writeFileSync(tempFileLoc, value)

  return tempFileLoc
}

const buildLocs = (params:Record<any, any>, name:string, defkey:string) => {
  const {
    file,
    log,
    value:val,
    files,
    secrets,
    keyvalue,
  } = params


  const secretFiles = files
    ? files.split(`,`)
    : file
      ? [`${defkey}:${file}`]
      : []
  
  const builtArr = secretFiles.reduce((acc, joined) => {
    const [key, loc] = joined.trim().split(`:`)
    if(!loc) return acc

    key && loc && acc.push(`--from-file=${key}=${resolveLocalPath(loc)}`)

    log && logCreate(name, key, loc)

    return acc
  }, [])

  const secretsFrom = secrets
    ? secrets.split(`,`)
    : keyvalue
      ? [keyvalue]
      : val
        ? [`${defkey}:${val}`]
        : []

  const tempFiles = []
  const secretArgs = secretsFrom.reduce((acc, joined) => {
    const [key, value] = joined.trim().split(`:`)
    if(!value) return acc

    const loc = saveTempSecret(value)
    tempFiles.push(loc)
    key && loc && acc.push(`--from-file=${key}=${saveTempSecret(value)}`)

    log && logCreate(name, key, loc)

    return acc
  }, builtArr)

  return { tempFiles,  secretArgs }
}

const logCreate = (name:string, key:string, loc:string) => {
  Logger.info([
    `\n`,
    `Creating Secret: ${Logger.colors.white(name)}\n`,
    ` - Key: ${Logger.colors.white(key)}\n`,
    ` - File: ${Logger.colors.white(loc)}`,
    `\n`
  ].join(' '))
}

/**
 * Log the output of a running kubernetes pod
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {Object} args.params - Passed in options, converted into an object
 *
 * @returns {void}
 */
const secretAct = async ({ params }) => {
  const { type=`generic`, value, file, files, secrets, keyvalue } = params

  !value
    && !keyvalue
    && !secrets
    && !file
    && !files
    && error.throwError(`One of 'value', 'keyvalue', 'secrets', 'file', or 'files' must be passed to create a secret`)
  
  const { name, key } = resolveNames(params.name, params.key, keyvalue)

  const { tempFiles,  secretArgs } = buildLocs(params, name, key)

  // @ts-ignore
  await kubectl([
    `create`,
    `secret`,
    type,
    name,
    ...secretArgs
  ], { ...params, exec: true })

  // Clean up temp files after creating the secrets
  tempFiles.map(loc => rmSync(loc))

}

export const secret = {
  name: 'secret',
  alias: ['scrt', 'sct'],
  action: secretAct,
  example: 'yarn task devspace secret <options>',
  description: 'Calls the kubectl create secret command',
  options: {
    type: {
      description: 'Name of the command to be run from the container/devspace.yml file',
    },
    name: {
      alias: [`nm`],
      example: `--name my-secret`,
      description: `Name of the secret, uses key when name is not set`,
    },
    keyvalue: {
      alias: [`kv`],
      example: `--keyvalue key1:value1`,
      description: `Joined key value pair. Overrides key and value option`
    },
    secrets: {
      alias: [`data`],
      example: `--data key1:value1,key2:value2`,
      description: `Key value pairs for setting multiple secrets separated by comma. Overrides keyvalue and key and value options`,
    },
    key: {
      alias: [`ky`],
      example: `--key secrets-key-name`,
      description: `Key name of the secret, uses name when key is not set`,
    },
    value: {
      alias: [`val`],
      example: `--value secrets-value`,
      description: `Value of the secret when the file option is not set`,
    },
    file: {
      alias: [`fl`],
      example: `--file /relative/path/to/secret/file`,
      description: `Path to a file that contains the secret relative to the apps root directory`,
    },
    files: {
      alias: [`fls`],
      example: `--files key1:/relative/path/to/secret/file1,key2:/relative/path/to/secret/file2`,
      description: `Key value pairs for setting multiple secrets from files separated by comma. Overrides all other options`,
    },
    log: {
      type: `boolean`,
      description: `Log the devspace command to be run`,
    },
  },
}
