import type { ReactNode, ChangeEventHandler, FocusEvent, CSSProperties } from "react"


import { PatSubmit } from './PatSubmit'
import Grid from '@mui/material/Unstable_Grid2'
import {useCallback, useRef, useState} from "react"
import { Input, RedText } from "@gobletqa/components"
import { addProviderPat } from "@actions/admin/provider/addProviderPat"


export type TPatForm = {
  onSave?:() => void
  onChange?:(value:string) => void
  parentError?:string
}

const styles:Record<string, CSSProperties> = {
  form: {},
  container: {
    height: `100%`,
    display: `grid`,
    flexDirection: `column`,
  },
  icon: { paddingTop: `2px` },
  grid: {
    alignItems: `center`,
  },
  pat: {
    fontSize: `10px`,
    fontStyle: `italic`,
  }
}

const inputProps = {
  required: false,
  name: `add-user-pat`,
  className: `add-user-pat`,
  label: <>Personal Access Token</>,
  placeholder: `PAT from your Git Cloud Provider...`,
}

const gridProps = {
  xs: 12,
  container: true,
  sx: styles.grid,
  columnSpacing: {xs: 0, md: 0.5},
  className: `gb-grid-user-pat-container`
}

const usePatInput = (props:TPatForm) => {

  const {
    onSave,
    onChange,
  } = props

  const inputRef = useRef<HTMLInputElement>()
  const [pat, setPat] = useState<string>(``)
  const [helper, setHelper] = useState<ReactNode>(``)
  const [loading, setLoading] = useState<boolean>(false)
  const [patError, setPatError] = useState<string|undefined>()

  const onKeyDown = useCallback(() => {
    patError && setPatError(``)
  }, [patError, pat])

  const onSavePat = useCallback(async () => {

    if(!pat?.trim?.()){
      setPatError(`A pat is required!`)
      inputRef?.current?.focus?.()
      return
    }

    setLoading(true)
    try {
      await addProviderPat(pat)
      onSave?.()
      setPat(``)
      setHelper(``)
      inputRef.current
        && (inputRef.current.value = ``)
    }
    catch(err:any){
      console.error(err)
      setPatError(err.message as string)
    }
    finally {
      setLoading(false)
    }

  }, [pat, patError, loading, onSave])
  
  const onChangePat = useCallback<ChangeEventHandler<HTMLInputElement>>((evt) => {
    const value = evt.target.value as string

    if(!value.length)
      return helper && setHelper(``)

    !helper
      && setHelper(<RedText>Click the <b>Key Button</b> on the right to save the PAT →</RedText>)

    pat?.trim?.() !== value?.trim?.()
      && setPat(value)

    onChange?.(value)
  }, [pat, helper, onChange])
  
  const onInputBlur = useCallback((evt:FocusEvent<HTMLInputElement>) => {
    const value = evt.target.value as string

    pat?.trim?.() !== value?.trim?.()
      && setPat(value)

    onChange?.(value)
  }, [pat, onChange])
  
  return {
    pat,
    setPat,
    helper,
    loading,
    inputRef,
    patError,
    onSavePat,
    onKeyDown,
    setLoading,
    onInputBlur,
    setPatError,
    onChangePat,
  }
  
}


export const PatForm = (props:TPatForm) => {

  const { parentError } = props

  const {
    pat,
    helper,
    loading,
    inputRef,
    patError,
    onKeyDown,
    onSavePat,
    onChangePat,
    onInputBlur,
  } = usePatInput(props)

  return (
    <Grid {...gridProps} >
      <Grid
        xs={9}
        md={11}
        className='gb-grid-user-pat-input'
      >
        <Input
          {...inputProps}
          defaultValue={pat}
          inputRef={inputRef}
          helperText={helper}
          onBlur={onInputBlur}
          onKeyDown={onKeyDown}
          onChange={onChangePat}
          error={parentError || patError}
        />
      </Grid>
      <Grid
        xs={3}
        md={1}
        sx={styles.icon}
        className='gb-grid-user-pat-save'
      >
        <PatSubmit
          loading={loading}
          onClick={onSavePat}
          disabled={Boolean(loading || patError || !pat.length)}
        />
      </Grid>
    </Grid>
  )
  
}