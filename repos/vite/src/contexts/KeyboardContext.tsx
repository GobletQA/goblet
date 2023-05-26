import type {
  TKeyboard,
  TKeyboardCtx,
  TKeyboardProvider,
} from '@types'

import { KeyboardCfg } from './KeyboardCfg'
import { MemoChildren } from '@gobletqa/components'

import {
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react'
import {useKeyboardHooks} from '@hooks/components/useKeyboardHooks'

export const KeyboardContext = createContext<TKeyboardCtx>({} as TKeyboardCtx)
export const useKeyboard = () => useContext(KeyboardContext)

export const KeyboardProvider = (props:TKeyboardProvider) => {
  const {
    children,
  } = props


  const setKeyboard = () => {}

  useKeyboardHooks({
    setKeyboard,
    keyboard: KeyboardCfg,
  })

  const keyboardCtx:TKeyboardCtx = useMemo(() => ({
    setKeyboard,
    keyboard: KeyboardCfg,
  }), [
    setKeyboard,
    KeyboardCfg
  ])

  return (
    <KeyboardContext.Provider value={keyboardCtx}>
      <MemoChildren children={children} />
    </KeyboardContext.Provider>
  )

}
