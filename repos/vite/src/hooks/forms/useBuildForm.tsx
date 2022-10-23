import type { ComponentType } from 'react'
import type { TInputDecor } from '@types'
import type { TextFieldProps, GridProps } from '@mui/material'
import type { THFormHelpers } from './useFormHelpers'


import { useMemo, useEffect } from 'react'
import { useFormHelpers } from './useFormHelpers'
import { FormComponents } from '@components/Form'
import {
  noOp,
  set,
  get,
  isStr,
  isObj,
  isArr,
  exists,
  toBool,
  deepMerge,
} from '@keg-hub/jsutils'

export const evtFnNoOp = noOp as (...args:any[]) => any

export type TFormRootProps = GridProps & {
  Component?: ComponentType<any>
}

export type TFormRef = {
  name: string
  values: Record<any, any>
}

export type TBuildFormOpts = Omit<TFormRef, 'name'> & THFormHelpers & {
  pathValues: Record<string, any>
}

export type TBuildFieldRules = {
  [key: string]: any
}

export type TBuildFormField = {
  name: string,
  label?: string,
  active?: boolean|string
  disabled?: boolean|string
  required?: boolean|string,
  placeholder?: string
  decor?: TInputDecor,
  rules?: TBuildFieldRules
  Grid?: ComponentType<any>
  gridOptions?: GridProps
  textFieldProps?: TextFieldProps
  Component?: ComponentType<any> | keyof typeof FormComponents
  [key:string]: any
}

export type TFormFields = Record<string, TBuildFormField>

export type TBuildFormObj = {
  form: TFormRef
  $root: TFormRootProps
  fields: TFormFields
}

export type TBuiltForm = Record<'form', Omit<TFormRef, 'name'>>
  & Record<'$root', TFormRootProps>
  & Record<string, TBuildFormField>


const __Form_Cache = {} as Record<string, TBuildFormObj>


type TOptFunc = (val:any) => any
const Options = {
  exists: (val:any) => exists(val),
  is: (val:any) => toBool(val) === true,
  not: (val:any) => toBool(val) === false,
}

const validateOption = (option:string, loc:string[]) => {
  const found = Options[option as keyof typeof Options]
  return found
    ? [found, loc]
    : [undefined, [option, ...loc]]
  
}

const replace$ = (
  parent:Record<string, any>,
  values:Record<string, any>,
  key:string,
  value:any
) => {

  if(isStr(value) && value.startsWith(`$`) && value.includes(`.`)){

    const [type, option, ...loc] = value.split(`.`)
    const [modifier, locArr] = validateOption(option, loc) as [TOptFunc|undefined, string[]]

    if(type === `$component`){
      const name = locArr.pop()
      const Component = FormComponents[name as keyof typeof FormComponents]
      if(Component){
        set(parent, key, Component)
        return true
      }
    }
    else {
      const found = get(values, locArr)
      set(parent, key, modifier ? modifier(found) : found)
      return true
    }
  }

  return false
}

const loopReplace = (
  original:Record<any, any>,
  parent:Record<any, any>,
  values:Record<string, any>
) => {

  let currOrg = original
  return Object.entries(parent)
    .reduce((replaced, [key, value]) => {
      if(key === `form` || key === `$root`) return replaced

      if(!replace$(parent, values, key, currOrg[key]) && (isObj(value) || isArr(value)))
        replaced[key] = loopReplace(currOrg[key], value, values)

      return replaced
    }, parent)
}

const useBuildFormValues = (
  formObj:TBuildFormObj,
  options:TBuildFormOpts
) => {
  const { values } = options

  return useMemo(() => {
    return Object.assign({}, formObj.fields, {
      form: {
        values: {
          ...formObj.form.values,
          ...values
        },
      },
      $root: formObj.$root || noOp
    })
  }, [formObj, values])
}

const usePathValues = (
  form:TBuiltForm,
  options:TBuildFormOpts
) => {

  const { values, pathValues } = options

  return useMemo(() => {
    return Object.entries(pathValues)
      .reduce((acc, [loc, value]) => {
        !replace$(acc, values, loc, value)
          && set(acc, loc, value)

        return acc
      }, form)
  }, [form, pathValues, values])
}

const getCacheForm = (formObj:TBuildFormObj) => {
  const formName = formObj?.form?.name as keyof typeof __Form_Cache
  if(!formName) throw new Error(`Can not build a form with out a name. Missing string at form.form.name`)

  if(!__Form_Cache[formName]) __Form_Cache[formName] = deepMerge(formObj)

  return __Form_Cache[formName]
}

const useClearFormCache = (form:TBuildFormObj) => {
  // Ensure the original from is added to cache
  // And add the mount handler to clean up the cache
  useEffect(() => {
    getCacheForm(form)
    
    return () => {
      delete __Form_Cache[form.form.name]
    }
  }, [])
}

export const useBuildForm = (
  formObj:TBuildFormObj,
  options:TBuildFormOpts
) => {

  const { values } = options
  const originalForm = getCacheForm(formObj)

  const valuesForm:TBuiltForm = useBuildFormValues(formObj, options)
  const pathForm:TBuiltForm = usePathValues(valuesForm, options)

  const form:TBuiltForm = useMemo(() => {
    return loopReplace(originalForm.fields, pathForm, values)
  }, [pathForm, values])

  const formHelpers = useFormHelpers(options)

  useClearFormCache(originalForm)

  return {
    form,
    ...formHelpers,
  }

}