import type {
  TTestRunUICfg,
  TOnBlurTestCfg,
  TOnChangeTestCfg,
} from '@types'
import { exists } from '@keg-hub/jsutils'
import {
  TagsInput,
  NumberInput,
  ToggleInput,
  InputContainer,
  InputHelperText,
  OptionsContainer,
  TestOptsHeaderTitle,
  TestOptsHeaderContainer,
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

  return (
    <>
      <TestOptsHeaderContainer className='gb-test-browser-options-header' >
        <TestOptsHeaderTitle className='gb-test-browser-options-header-title' >
          Browser Options
        </TestOptsHeaderTitle>
      </TestOptsHeaderContainer>

      <OptionsContainer>

        <InputContainer className='gb-test-slowmo-container' >
          <NumberInput
            type='number'
            defaultValue={100}
            label='Browser Speed'
            name='exam-browser-slowmo'
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
    </>
  )
}

