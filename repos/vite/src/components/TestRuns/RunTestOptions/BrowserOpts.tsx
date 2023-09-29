import type {
  TTestRunUICfg,
  TOnBlurRunTestOpts,
  TOnChangeRunTestOpts,
} from '@types'

import { useState } from 'react'
import { TestOptsSectionHeader } from './TestOptsSectionHeader'
import {
  TagsInput,
  NumberInput,
  ToggleInput,
  InputContainer,
  InputHelperText,
  OptionsContainer,
  RunTestOptsSectionDrawer,
  RunTestOptsSectionContainer,
} from './RunTestOptions.styled'


export type TBrowserOpts = {
  testRunCfg:TTestRunUICfg
  onBlurRunTestOpts:TOnBlurRunTestOpts
  onChangeRunTestOpts:TOnChangeRunTestOpts
}

export const BrowserOpts = (props:TBrowserOpts) => {

  const {
    testRunCfg,
    onBlurRunTestOpts,
    onChangeRunTestOpts,
  } = props

  const [open, setOpen] = useState(true)

  return (
    <RunTestOptsSectionContainer>
      <TestOptsSectionHeader
        initial={open}
        onChange={setOpen}
        title='Browser Options'
        className='gb-test-browser-options-header'
        titleClass='gb-test-browser-options-header-title'
      />

      <RunTestOptsSectionDrawer
        in={open}
        unmountOnExit
        timeout="auto"
      >
        <OptionsContainer>

          <InputContainer className='gb-test-slowmo-container' >
            <NumberInput
              type='number'
              defaultValue={100}
              label='Browser Speed'
              name='tests-run-browser-slowmo'
              className='gb-test-slowmo-input'
              onBlur={(evt) => onBlurRunTestOpts(evt, `testBail`)}
              helperText={
                <InputHelperText>
                  Speed in which browser actions are executed, a.k.a &nbsp;<b>"slow-mo"</b>
                </InputHelperText>
              }
              placeholder='Enter the browser speed... ( default: 100 )'
            />
          </InputContainer>

        </OptionsContainer>
      </RunTestOptsSectionDrawer>
    </RunTestOptsSectionContainer>
  )
}

