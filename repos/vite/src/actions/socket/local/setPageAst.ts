
import type { TBrowserNavEvt } from '@types'
import { getStore, pageDispatch } from '@store'

export const setPageAst = (data:TBrowserNavEvt) => {
  const page = getStore().getState().page

  ;(page.url !== data.url || (data?.ast?.length && !page?.ast?.length))
    && pageDispatch.setPage(data)
}