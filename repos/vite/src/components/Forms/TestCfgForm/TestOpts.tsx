import type {
  TExamUIRun,
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


export type TTestOpts = {
  testRunCfg:TExamUIRun
  onBlurTestCfg:TOnBlurTestCfg
  onChangeTestCfg:TOnChangeTestCfg
}

export const TestOpts = (props:TTestOpts) => {

  const {
    testRunCfg,
    onBlurTestCfg,
    onChangeTestCfg,
  } = props

  return (
    <>

      <TestOptsHeaderContainer className='gb-test-test-options-header' >
        <TestOptsHeaderTitle className='gb-test-test-options-header-title' >
          Test Options
        </TestOptsHeaderTitle>
      </TestOptsHeaderContainer>

      <OptionsContainer>
        <InputContainer className='gb-test-tags-input-container' >
          <TagsInput
            freeSolo={true}
            multiple={true}
            className='gb-test-tags-input'
            onBlur={(evt) => onBlurTestCfg(evt, `tags`)}
            onChange={(...args:any[]) => onChangeTestCfg(args, `tags`)}
            label={`Tag Filter`}
            placeholder={`@whitelist   @passing   @user-auth  ...`}
            value={testRunCfg.tags || []}
            helperText={
              <InputHelperText>
                Set one or multiple tags to filter which tests will be executed.
              </InputHelperText>
            }
          />
        </InputContainer>
        <InputContainer className='gb-test-test-retry-input-container' >
          <NumberInput
            type='number'
            label='Step Retry'
            name='exam-test-retry-input'
            defaultValue={0}
            className='gb-test-test-retry'
            helperText={
              <InputHelperText>
                Amount of times to retry a step if it fails
              </InputHelperText>
            }
            placeholder='Enter the step retry amount... ( default: 0 )'
            onBlur={(evt) => onBlurTestCfg(evt, `testRetry`)}
          />
        </InputContainer>
        <InputContainer className='gb-test-suite-retry-input-container' >
          <NumberInput
            type='number'
            label='Feature Retry'
            name='exam-suite-retry-input'
            defaultValue={0}
            className='gb-test-suite-retry'
            helperText={
              <InputHelperText>
                Amount of times to retry a Feature if it fails.
              </InputHelperText>
            }
            placeholder='Enter the Feature retry amount... ( default: 0 )'
            onBlur={(evt) => onBlurTestCfg(evt, `suiteRetry`)}
          />
        </InputContainer>

        <InputContainer className='gb-test-bail-input-container' >
          <NumberInput
            type='number'
            label='Test Bail'
            name='exam-bail-input'
            defaultValue={5}
            className='gb-test-test-bail'
            helperText={
              <InputHelperText>
                Stop executing tests after a specified number of tests have failed.
              </InputHelperText>
            }
            placeholder='Enter a test bail amount... ( default: 5 )'
            onBlur={(evt) => onBlurTestCfg(evt, `testBail`)}
          />
        </InputContainer>

        <InputContainer className='gb-test-suite-retry-input-container' >
          <ToggleInput
            label='Exit on Fail'
            value={exists(testRunCfg.exitOnFailed) ? `${testRunCfg.exitOnFailed}` : `false`}
            onChange={(...args) => onChangeTestCfg(args, `exitOnFailed`)}
            options={[
              { value: `true`, text: `True` },
              { value: `false`, text: `False` },
            ]}
            helperText={
              <InputHelperText>
                Stop executing tests if a test fails. Same as setting <b>Test Bail</b> to <b>1</b>
              </InputHelperText>
            }
          />
        </InputContainer>

      </OptionsContainer>

    </>
  )
}

