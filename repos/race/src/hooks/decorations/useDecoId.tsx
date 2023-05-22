import { useFeatureDeco } from '@GBR/hooks/decorations/useFeatureDeco'

export type THDecoId = {
  id?:string
}

export const useDecoId = (props:THDecoId) => {
  const { id } = props
  const deco = useFeatureDeco()
  return id ? deco?.[id] : undefined
}
