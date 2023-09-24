import type {
  TTestRunUICfg,
  TOnBlurTestCfg,
  TOnChangeTestCfg,
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
  TestCfgSectionDrawer,
  TestCfgSectionContainer,
} from './TestCfgForm.styled'


export type TBrowserOpts = {
  testRunCfg:TTestRunUICfg
  onBlurTestCfg:TOnBlurTestCfg
  onChangeTestCfg:TOnChangeTestCfg
}

export const BrowserOpts = (props:TBrowserOpts) => {

  const {
    testRunCfg,
    onBlurTestCfg,
    onChangeTestCfg,
  } = props

  const [open, setOpen] = useState(true)

  return (
    <TestCfgSectionContainer>
      <TestOptsSectionHeader
        initial={open}
        onChange={setOpen}
        title='Browser Options'
        className='gb-test-browser-options-header'
        titleClass='gb-test-browser-options-header-title'
      />

      <TestCfgSectionDrawer
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
              onBlur={(evt) => onBlurTestCfg(evt, `testBail`)}
              helperText={
                <InputHelperText>
                  Speed in which browser actions are executed, a.k.a &nbsp;<b>"slow-mo"</b>
                </InputHelperText>
              }
              placeholder='Enter the browser speed... ( default: 100 )'
            />
          </InputContainer>

        </OptionsContainer>
      </TestCfgSectionDrawer>
    </TestCfgSectionContainer>
  )
}

