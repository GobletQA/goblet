import type { MakeDirectoryOptions, RmOptions } from 'fs'
import { promises } from 'fs'

type TExistsErr = Error & { code: any }
type TFSReadResp = Promise<[undefined|Error, string]>
type TFSResp = Promise<[undefined|TExistsErr, true]>

export const pathExists = async (loc:string):TFSResp => {
  try {
    await promises.access(loc, promises.constants.F_OK)
    return [undefined, true]
  }
  catch(err) {
    return [err, undefined]
  }
}

export const readFile = async (loc:string):TFSReadResp => {
  try {
    const content = await promises.readFile(loc, `utf8`)
    return [undefined, content]
  }
  catch(err){
    return [err, undefined]
  }
}

export const writeFile = async (loc:string, content:string):TFSResp => {
  try {
    await promises.writeFile(loc, content)
    return [undefined, true]
  }
  catch(err){
    return [err, undefined]
  }
}
export const removeFile = async (loc:string, opts:RmOptions={ force: true, recursive: true }):TFSResp => {
  try {
    await promises.rm(loc, opts)
    return [undefined, true]
  }
  catch(err){
    return [err, undefined]
  }
}

export const unlink = async (loc:string):TFSResp => {
  try {
    await promises.unlink(loc)
    return [undefined, true]
  }
  catch(err){
    return [err, undefined]
  }
}

type TFSMkdirOpts = MakeDirectoryOptions & { recursive?:boolean }

export const mkDir = async (loc:string, opts:TFSMkdirOpts={ recursive: true }) => {
  try {
    await promises.mkdir(loc, opts)
    return [undefined, true]
  }
  catch(err){
    return [err, undefined]
  }
}

export const getRelativeLoc = (location:string, rootDir?:string) => {
  return location?.replace(rootDir, ``).replace(/^\//, `./`)
}