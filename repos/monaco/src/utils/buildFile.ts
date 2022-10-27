import type { TFile, TBuildFile } from '../types'


export const buildFile = ({ part, key, value, ext }:TBuildFile):TFile => {
  return {
    value,
    path: key,
    name: part,
    ext: ext || part.split('.').pop() || `unknown`,
  }
}