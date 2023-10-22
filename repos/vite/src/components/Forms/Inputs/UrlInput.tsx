import type { FocusEvent, ComponentProps, ChangeEvent } from 'react'

import { useState, useMemo } from 'react'
import { InputMenu } from '@components/Forms/InputMenu'
import { useInline, useEnsureRef } from '@gobletqa/components'

import {
  UrlInputComp,
  InputHelperText,
} from './UrlInput.styled'
import {isStr} from '@keg-hub/jsutils'

type TInProps = ComponentProps<typeof UrlInputComp>
export type TUrlInput = Omit<TInProps, `onBlur`|`onChange`> & {
  onBlur?: (evt:FocusEvent<HTMLInputElement>, url:string) => void
  onChange?: (evt:ChangeEvent<HTMLInputElement>, url?:string) => void
}

const urlInputProps = {
  label: `URL`,
  required: true,
  autoFocus: true,
  fullWidth: true,
  name: `input-url`,
  className: `gb-input-url`,
  placeholder: `Enter a valid URL`,
}


const useUrlFromBrowser = (props:TUrlInput) => {
  const {
    onBlur,
    value=``,
    onChange
  } = props
  
  const [error, setError] = useState<string>(``)
  const [url, setUrl] = useState<string>(value as string)
  const [inputProps, setInputProps] = useState<Partial<TInProps>>({})

  const inputRef = useEnsureRef(props.inputRef)

  const onUrlChange = useInline((evt:FocusEvent<HTMLInputElement>) => {
    error && setError(``)
    const value = evt.target.value as string
    setUrl(value)
    onBlur?.(evt, value)
  })

  const decorProps = useMemo(() => {
    return {
      setInputProps,
      Component: InputMenu,
      onChange: (evt:ChangeEvent<any>, data:Record<string, any>) => {
        error && setError(``)
        const url = data?.url as string
        url ? setUrl(url) : setError(data?.message as string || `Error getting url from browser`)
        
        onChange?.(evt, url)
      },
    }
  }, [])

  return {
    url,
    error,
    inputRef,
    inputProps,
    decorProps,
    onUrlChange,
    setInputProps
  }
  
}


export const UrlInput = (props:TUrlInput) => {

  const {
    helperText
  } = props

 const {
  url,
  error,
  inputRef,
  inputProps,
  decorProps,
  onUrlChange
 } = useUrlFromBrowser(props)


  return (
    <UrlInputComp
      {...props}
      {...urlInputProps}
      value={url}
      error={error}
      decor={decorProps}
      inputRef={inputRef}
      onBlur={onUrlChange}
      className='gb-joker-action-input'
      {...inputProps}
      helperText={
        isStr(helperText)
          ? (<InputHelperText>{helperText}</InputHelperText>)
          : helperText
      }
    />
  )
  
}
