import type { TAllDefGroup, TDefGroup } from '@types'
import type { TDefsList } from './DefaultDefsList'

import { useCallback, useRef, useState, useEffect } from 'react'

import { noOpObj } from '@keg-hub/jsutils'
import { SearchIcon } from '@gobletqa/components'
import { DefinitionList } from './DefinitionList'
import {
  DefTabPanel,
  DefSearchWrap,
  DefSearchIcon,
  DefSearchInput,
  DefSearchTitle,
  DefSearchHeader,
} from './DefinitionList.styled'

export type TAllDefsList = TDefsList

export type TSearchHeader = {
  group:TDefGroup
  onSearch: (input:string) => void
}

const SearchHeader = (props:TSearchHeader) => {
  const { group, onSearch } = props
  const inputRef = useRef<HTMLInputElement>(null)

  const onClick = useCallback(() => {
    const inputEl = inputRef?.current
    inputEl
      && (inputEl?.value?.length >= 3 || inputEl?.value?.length === 0)
      && onSearch?.(inputEl?.value)
  }, [onSearch])

  const onKeyDown = useCallback(({ key }:Record<'key', string>) => {
    const inputEl = inputRef?.current
    key === "Enter"
      && inputEl
      && (inputEl?.value?.length >= 3 || inputEl?.value?.length === 0)
      && onSearch?.(inputEl?.value)
  }, [onSearch])
  
  return (
    <DefSearchHeader className='gb-defs-search' >

      <DefSearchTitle>{group.group}</DefSearchTitle>

      <DefSearchWrap className='gb-defs-search-wrap' >
        <DefSearchIcon
          onClick={onClick}
          className='gb-defs-search-icon-button'
        >
          <SearchIcon className='gb-defs-search-icon' />
        </DefSearchIcon>
        <DefSearchInput
          ref={inputRef}
          onKeyDown={onKeyDown}
          placeholder='Search ...'
          className='gb-defs-search-input'
        />
      </DefSearchWrap>

    </DefSearchHeader>
  )
}

export const AllDefsList = (props:TAllDefsList) => {
  const { tab, index, definitions, ...other } = props
  const [searchDefs, setSearchDefs] = useState<TAllDefGroup>(definitions as TAllDefGroup)

  const searchRef = useRef<boolean>(false)
  const onSearch = useCallback((input:string) => {
    const allGrp = (definitions.all || noOpObj) as TDefGroup
    const copy = { all: { ...allGrp, items: [...allGrp?.items]}}

    const check = input.toLowerCase()
    copy.all.items = copy.all.items.filter(item => (
      check?.length ? item.title.toLowerCase().includes(check) : true
    ))

    searchRef.current = true
    setSearchDefs(copy)
  }, [searchDefs, definitions])

  useEffect(() => {
    !searchRef.current
      && definitions?.all?.items?.length
      && !searchDefs?.all?.items?.length
      && setSearchDefs(definitions as TAllDefGroup)
  }, [definitions])

  return (
    <DefTabPanel
      role="tabpanel"
      id={`gb-defs-tabpanel-${index}`}
      className='gb-defs-all-tab-panel'
      aria-labelledby={`gb-defs-tab-${index}`}
      {...other}
    >
      <DefinitionList
        all
        definitions={searchDefs}
        Header={(
          <SearchHeader
            onSearch={onSearch}
            group={definitions.all as TDefGroup}
          />
        )}
      />
    </DefTabPanel>
  );
}