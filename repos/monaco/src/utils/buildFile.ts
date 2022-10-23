import type { TFile, TBuildFile } from '../types'


export const buildFile = ({ part, key, value }:TBuildFile):TFile => {
  return {
    value,
    path: key,
    name: part,
    _isFile: true,
  }
}