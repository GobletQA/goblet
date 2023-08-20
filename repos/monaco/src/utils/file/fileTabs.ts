import type { ComponentType } from 'react'
import type { TFileMeta } from '@GBM/types'
import type { TTabItem, TTab } from '@gobletqa/components'

import { FileIcon } from '@gobletqa/components'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { omitKeys } from '@keg-hub/jsutils/omitKeys'
import { TabStyles, TabRefs } from '@GBM/constants/tabs'


/**
 * Converts a file object into a tab object for the tabs component
 */
export const fileToTab = (
  file:TFileMeta,
  { Icon=FileIcon, ...tab }:Partial<TTab> & { Icon?:ComponentType<any> }=emptyObj
):TTabItem => ({
  Icon,
  styles: TabStyles,
  tab: {
    ...file,
    ...tab,
    uuid: file.path,
    title: file.path
  }
})

/**
 * Converts a tab object into a file object
 */
export const fileFromTab = (tab:TTab) => {
  const omitFile = omitKeys<TFileMeta>(tab, [`active`, `editing`, `title`, `uuid`])
  return omitFile
}