import { replaceUnsafe } from './utils/safeReplacer'
import { stripColors } from './utils/stripColors'

const orgStdOut = process.stdout.write.bind(process.stdout)
const orgStdErr = process.stderr.write.bind(process.stderr)

process.stdout.write = function (data:Uint8Array|string, ...args:any[]){
  const str = stripColors(data.toString())
  const replaced = replaceUnsafe(str)

  return orgStdOut.apply(process.stdout, [replaced, ...args])
}
process.stdout.write.bind(process.stdout)


process.stderr.write = function (data:Uint8Array|string, ...args:any[]){
  const str = stripColors(data.toString())
  const replaced = replaceUnsafe(str)

  return orgStdErr.apply(process.stderr, [replaced, ...args])
}
process.stderr.write.bind(process.stderr)

export {}