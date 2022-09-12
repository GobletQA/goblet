import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { Modal } from '../modal'
import { Values } from 'GBConstants'
import { Git } from 'GBAssets/icons/git'
import { Link } from 'GBAssets/icons/link'
import { tapColors } from 'GBTheme/tapColors'
import { Text } from '@keg-hub/keg-components'
import { Branch } from 'GBAssets/icons/branch'
import { ModalMessage } from '../modalMessage'
import { FileCode } from 'GBAssets/icons/fileCode'
import { noPropArr, isUrl } from '@keg-hub/jsutils'
import { getRepos } from 'GBActions/repo/api/getRepos'
import { useStoreItems } from 'GBHooks/store/useStoreItems'
import { setScreenById } from 'GBActions/screens/setScreenById'
import { setActiveModal } from 'GBActions/modals/setActiveModal'
import { SignOutButton } from 'GBComponents/buttons/signOutButton'
import { ControlledAuto } from 'GBComponents/form/controlledAuto'
import { ControlledInput } from 'GBComponents/form/controlledInput'
import { SyncReposButton } from 'GBComponents/buttons/syncReposButton'
import { setModalVisibility } from 'GBActions/modals/setModalVisibility'
import { ControlledCheckbox } from 'GBComponents/form/controlledCheckbox'
import { ConnectRepoButton } from 'GBComponents/buttons/connectRepoButton'
import { ContainerSessionState } from 'GBComponents/container/containerSessionState'

// TODO: @lance-tipton - Add ability to create a new repo, use Values.CREATE_NEW_REPO as selector

const {
  SCREENS,
  STORAGE,
  CATEGORIES,
  MODAL_TYPES
} = Values

/**
 * Custom styles for checkbox options
 */
const checkboxOptStyle = { wrapper: { bgC: 'transparent', bC: 'transparent' }}

/**
 * Memoized callback method called when the connect repo button is pressed
 */
const useOnLoadRepo = (connectError, repoUrl, branch, setRepoUrl, setBranch, user) => {
  return useCallback(
    async resp => {
      if (!resp)
        return setConnectError(`Failed to mount repo. Please try again later.`)

      //Reset test name so that previously entered name does not remain in the name field
      setRepoUrl('')
      setBranch('')

      // Update the screen to be the editor
      setScreenById(SCREENS.EDITOR)

      // Close the modal
      setModalVisibility(false)

      // Open the selector modal to allow selecting a file from the mounted repo
      setActiveModal(MODAL_TYPES.TEST_SELECTOR)
    },
    [
      user,
      branch,
      repoUrl,
      setBranch,
      setRepoUrl,
      connectError,
    ]
  )
}

const useRepoBranches = (repoUrl, repos) => {
  return useMemo(() => {
    return repos &&
      repos.reduce((acc, repo) => {
        return repo.url === repoUrl ? repo.branches : acc
      }, noPropArr)
  }, [repoUrl, repos])
}

const useSelectItem = (item, setItem) => {
  return useCallback(update => {
    update.text !== item && setItem(update.text)
  }, [item, setItem])
}

const useCreateNewBranch = () => {
  const [createBranch, setCreateBranch] = useState(false)

  const onCreateBranch = useCallback((event) => {
    event?.target && setCreateBranch(event?.target?.checked)
  }, [createBranch])

  return {
    createBranch,
    onCreateBranch
  }
}

const branchNameStyle = {fontSize: 14, color: tapColors.primary, fontWeight: 'bold'}
const textStyle = {fontSize: 14}
const NewBranchText = ({ branch }) => {
  return (
    <Text style={textStyle} >
      {`Create new branch${branch ? ' from ' : ''}`}
      {branch && (<Text style={branchNameStyle}>"{branch}"</Text>)}
    </Text>
  )
}

/**
 * Modal component for creating new test files
 * @param {Object} props
 * @returns
 */
export const ConnectRepoModal = props => {
  const { title = 'Connect Repo', visible = false } = props
  const { user, providerRepos } = useStoreItems([
    STORAGE.USER,
    CATEGORIES.PROVIDER_REPOS,
  ])

  // On initial load of the component, load the users repos
  useEffect(() => ((!providerRepos || !providerRepos.length) && getRepos()), [])

  const [branchName, setBranchName] = useState('')
  const [branch, setBranch] = useState('')
  const [connectError, setConnectError] = useState(false)
  const [repoUrl, setRepoUrl] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const {createBranch, onCreateBranch} = useCreateNewBranch()

  const onRepoSelect = useSelectItem(repoUrl, setRepoUrl)
  const onBranchSelect = useSelectItem(branch, setBranch)

  const onConnecting = useCallback(connecting => {
    setIsConnecting(connecting)
    setConnectError(false)
  })

  const onError = useCallback(error => {
    setIsConnecting(false)
    error && setConnectError(error.message)
  })

  const repos = useMemo(() => {
    return providerRepos.map(repo => repo.url)
  }, [providerRepos])

  const branches = useRepoBranches(repoUrl, providerRepos)

  const onLoadRepo = useOnLoadRepo(
    connectError,
    repoUrl,
    branch,
    setRepoUrl,
    setBranch,
    user
  )

  const disabled = useMemo(() => {
    return !Boolean(branch && isUrl(repoUrl) && !isConnecting)
  }, [repoUrl, branch, isConnecting])

  return (
    <Modal
      Icon={Git}
      title={title}
      type='loadRepo'
      backdrop={false}
      visible={visible}
      classPrefix='modal-load-repo'
      headerRight={(<SyncReposButton />)}
      footerLeft={(<SignOutButton disabled={isConnecting} />)}
      footerRight={(
        <ConnectRepoButton
          branch={branch}
          repoUrl={repoUrl}
          onError={onError}
          disabled={disabled}
          newBranch={branchName}
          onConnect={onLoadRepo}
          createBranch={createBranch}
          onConnecting={onConnecting}
        />
      )}
    >
      <ModalMessage
        error={connectError}
        loading={isConnecting && 'Connecting Repo ...'}
      />
      <ControlledAuto
        zIndex={5}
        Aside={Link}
        text={repoUrl}
        values={repos}
        required={true}
        title={'Repo URL'}
        onChange={setRepoUrl}
        emptyShowList={true}
        disabled={isConnecting}
        onSelect={onRepoSelect}
        className={'modal-repo-url-field'}
        placeholder='https://github.com/organization/repo-name'
      />
      <ControlledAuto
        zIndex={4}
        Aside={Branch}
        text={branch}
        required={true}
        values={branches}
        title={`Branch`}
        placeholder='main'
        onChange={setBranch}
        emptyShowList={true}
        disabled={isConnecting}
        onSelect={onBranchSelect}
        className={'modal-repo-branch-field'}
      />
      {branch && (
        <ControlledCheckbox
          zIndex={3}
          postInline
          title={'Options'}
          checked={createBranch}
          onChange={onCreateBranch}
          styles={checkboxOptStyle}
          InlineComponent={<NewBranchText branch={branch} />}
        />
      ) || null}
      {branch && createBranch && (
        <ControlledInput
          zIndex={2}
          title={`Name`}
          required={true}
          Aside={FileCode}
          value={branchName}
          disabled={isConnecting}
          onValueChange={setBranchName}
          placeholder='my-awesome-branch'
          className={'modal-repo-branch-name-field'}
        />
      ) || null}
      <ContainerSessionState />
    </Modal>
  )
}
