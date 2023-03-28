import type { TRaceBackground } from '@GBR/types'

export type TCopyBackground = {
  background:TRaceBackground,
  parentId:string
}

export const copyBackground = async (props:TCopyBackground) => {
  const {
    background,
    parentId
  } = props

}