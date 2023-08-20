import { buildFile } from './buildFile'
import type { TFolderItem } from '@GBM/types'

import { buildFolder } from './buildFolder'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'

export type TAddSrcFile = {
  path: string,
  content?: string,
  rootPrefix?: string,
  filetree: TFolderItem,
}

export const addSourceFile = ({
  path,
  filetree,
  content,
  rootPrefix,
}:TAddSrcFile):TFolderItem => {
  const copy = deepMerge(filetree)
  const paths = (path || '/').slice(1).split('/')
  const name = paths[paths.length - 1]

  let temp = copy.children

  paths.forEach((loc, index) => {

    if (index === paths.length - 1)
      temp[name] = buildFile({
        part: name,
        key: path,
        rootPrefix,
        content: content || '',
        ext: name.split('.').pop() || ` `,
      })

    else if (temp[loc]) temp = temp[loc].children

    else {
      temp[loc] = buildFolder({
        index,
        paths,
        part: loc,
        path: '/' + paths.slice(0, index + 1).join('/')
      })

      temp = temp[loc].children
    }

  })
  return copy
}
