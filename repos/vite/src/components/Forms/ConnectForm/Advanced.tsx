import type { TOnAutoChange } from '@gobletqa/components'
import type { TBuiltRepos, TRepoValueCB, TRepoInputError, TBuiltRepo } from '@types'

import { colors, gutter } from '@gobletqa/components'
import { RepoAdvanced } from './RepoAdvanced'
import { BranchConnect } from './BranchConnect'
import { Container, Dropdown } from './Connect.styled'

export type TAdvanced = {
  branch?: string
  owner?:string
  parents?:string[]
  newBranch?:string
  repo?: TBuiltRepo
  repos?:TBuiltRepos
  disabled?:boolean
  createRepo?:boolean
  description?:string
  branchFrom?:boolean
  onChange: TOnAutoChange
  inputError:TRepoInputError
  onChangeOwner:TOnAutoChange
  onChangeDescription:TRepoValueCB
  onChangeNewBranch?:(branch:string) => void
  onChangeBranchFrom?:(change:boolean) => void
  onInputError?:(key:string, value?:string) => void
}

const styles = {
  container: {},
  bodySx:{
    marginTop: gutter.margin.px
  },
  header: {
    opacity: 0.7,
    borderBottom : `0px`,
    color: colors.purple10,
    [`:hover`]: {
      opacity: 1,
      transition: `opacity 300ms ease`,
    },
    [`& h5`]: {
      color: colors.purple10,
    }
  },
  expand: {
    color: colors.purple10
  }
}

export const Advanced = (props:TAdvanced) => {

  const { disabled, createRepo } = props

  return (
    <Container
      sx={styles.container}
      className='gb-advanced-connect-container'
    >
      <Dropdown
        disabled={disabled}
        transformIconOff={0}
        transformIconOn={180}
        bodySx={styles.bodySx}
        headerText={`Advanced`}
        headerSx={styles.header}
        expandIconSx={styles.expand}
        id='gb-connect-advanced-form'
        className='gb-advanced-connect-dropdown'
      >
        {createRepo ? (
          <RepoAdvanced {...props} />
        ) : (
          <BranchConnect {...props} />
        )}

      </Dropdown>
    </Container>
  )

}