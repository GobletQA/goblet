import { getEditor } from '@GBR/utils/editor/getEditor'
import { missing, logNotFound } from '@GBR/utils/logging'

const prefix = `[Collapse Error]`
export const collapseAllExcept = async (...ids:string[]) => {
  if(!ids?.length) return missing(`uuid of section. Can not collapse sections without a valid uuid`, prefix)
  
  const { editor } = await getEditor()
  if(!editor) return logNotFound(`Editor Context`, prefix)
  
  editor?.collapseAllExcept?.(ids)
}