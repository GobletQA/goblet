import type { TAbortError, TSelectFromBrowserRespEvent } from '@types'
import type { TInputMenuItem, TInputMenuItemClick } from './InputMenu'

import { limbo } from '@keg-hub/jsutils'
import { ExpressionKinds } from '@constants'
import { CursorClickIcon } from '@gobletqa/components'
import { automateBrowser } from '@actions/socket/api/automateBrowser'


const getUrl:TInputMenuItemClick = async (evt, ctx) => {
  const {
    onChange,
    setInputProps
  } = ctx

  setInputProps?.({
    disabled: true,
    helperText: `Getting URL from browser...`
  })

  const [err, data] = await limbo<TSelectFromBrowserRespEvent, TAbortError>(automateBrowser({
    disabledEvents: true,
    selectorType: ExpressionKinds.url,
  }))

  setInputProps?.({})
  onChange?.(evt, err || data)
}

export const BrowserURLItem:TInputMenuItem = {
  closeMenu: true,
  onClick: getUrl,
  Icon: CursorClickIcon,
  text: `URL from Browser`,
  id: `input-menu-from-browser`,
}
