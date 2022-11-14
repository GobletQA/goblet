import { useContext } from 'react'
import { PageSplitStateContext } from '../context/pageSplitContext'

export const usePageSplitState = () => {
  return useContext(PageSplitStateContext)
}