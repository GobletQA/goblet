import type { TFile, TBuildFile } from '../types'


export const buildFile = ({ part, key, content, ext }:TBuildFile):TFile => {
  return {
    content,
    path: key,
    name: part,
    ext: ext || part.split('.').pop() || `unknown`,
  }
}