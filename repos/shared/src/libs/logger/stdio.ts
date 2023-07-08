// TODO: This still needs some tweaks to only hide secrets and not the whole line

import { replaceUnsafe } from '@GSH/utils/safeReplacer'
const orgStdOut = process.stdout.write.bind(process.stdout)
const orgStdErr = process.stderr.write.bind(process.stderr)

process.stdout.write = function (data:Uint8Array|string, ...args:any[]){
  const str = data.toString()
  const replaced = replaceUnsafe(str)

  return orgStdOut.apply(process.stdout, [replaced, ...args])
}
process.stdout.write.bind(process.stdout)


process.stderr.write = function (data:Uint8Array|string, ...args:any[]){
  const str = data.toString()
  const replaced = replaceUnsafe(str)

  return orgStdErr.apply(process.stderr, [replaced, ...args])
}
process.stderr.write.bind(process.stderr)

