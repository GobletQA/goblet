import { useEditor, useDecorations } from '@GBR/contexts'


export const useFeatureDeco = () => {
  const { feature } = useEditor()
  const { decorations } = useDecorations()

  return decorations?.[feature?.parent?.location]
}
