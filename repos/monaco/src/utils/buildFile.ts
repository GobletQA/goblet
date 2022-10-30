import type { TFile, TBuildFile } from '../types'


export const buildFile = ({
  ext,
  key,
  part,
  content,
  rootPrefix
}:TBuildFile):TFile => {
  return {
    content,
    path: key,
    uuid: key,
    name: part,
    relative: key,
    ext: ext || part.split('.').pop() || ` `,
  }
}