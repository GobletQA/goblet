import { getEditor } from '@GBR/utils/editor/getEditor'


export const createFolder = async (location:string) => {
  const { editor } = await getEditor()
  editor?.onFolderCreate?.(location)
}