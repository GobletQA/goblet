import type { THFormHelpers } from './useFormHelpers'

import { useState, useCallback } from 'react'
import { evtFnNoOp,  useBuildForm } from './useBuildForm'

const formFields = {
  form: {
    name: `connect-form`,
    values: {
      repo: ``,
      branch: ``,
    },
  },
  $root: {
    rowSpacing: 2,
    container: true,
    columnSpacing: 1,
    disableEqualOverflow: true
  },
  fields: {
    repo: {
      Component: `AutoInput`,
      required: true,
      name: `repo`,
      gridOptions: {
        xs: 12,
      },
      label: `Select Repo`,
      decor: {
        name: `syncRepos`,
        color: `secondary`,
        Icon: `$component.SyncIcon`,
        Component: `$component.IconButton`,
      },
      textFieldProps: {
        placeholder: `Select a repo to connect to...`,
      },
      rules: {
        required: `Please select a repository`
      }
    },
    branch: {
      Component: `AutoInput`,
      required: true,
      name: `branch`,
      label: `Select Branch`,
      gridOptions: {
        xs: 12,
      },
      textFieldProps: {
        inputProps: {},
        placeholder: `Select the branch to use...`,
      },
      rules: {
        required: `Please select a branch`
      }
    },
    createBranch: {
      name: `createBranch`,
      label: `Create Branch`,
    },
    branchName: {
      Component: `Input`,
      active: false,
      disabled: `$values.not.createBranch`,
      gridOptions: {
        xs: 12,
      },
      name: `branchName`,
      label: `Branch Name`,
      placeholder: `Enter a branch name...`,
      decor: {
        disabled: `$values.not.branch`,
        active: `$values.is.createBranch`,
        onClick: evtFnNoOp,
        labelPos: 'bottom',
        label: 'New Branch',
        name: 'createBranch',
        Component: `$component.IconToggle`,
        Icon: `$component.SubArrowRightIcon`,
        iconProps:{ fontSize: 'small' },
        labelSx: {
          [`> .MuiFormControlLabel-label`]: {
            fontSize: `10px`,
            marginTop: `-5px`,
          }
        }
      },
    }
  }
}


export type TConnectForm = THFormHelpers & {
  values?:Record<any, any>
}

export const useConnectForm = (props:TConnectForm) => {

  const [values, setValues] = useState<Record<any, any>>(props.values || {})

  const {
    form,
    onSuccess,
    isLoading:isConnecting,
    loadingError:connectError,
    setIsLoading:setIsConnecting,
    setLoadingError:setIsConnectError,
  } = useBuildForm(formFields, {
    ...props,
    values,
    pathValues: {
      [`branchName.decor.onClick`]: useCallback((evt:any) => {
        setValues({ ...values, createBranch: evt.target.checked })
      }, [values])
    }
  })

  return {
    form,
    values,
    onSuccess,
    connectError,
    isConnecting,
    setIsConnecting,
    setIsConnectError,
    setForm:setValues,
  }
  
}