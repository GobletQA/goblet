import { useContext } from 'react'
import { PageSplitDispatchContext } from '../context/pageSplitContext'

export const usePageSplitDispatch = () => {
  return useContext(PageSplitDispatchContext)
}