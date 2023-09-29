import type {
  TTestRunUICfg,
  TOnBlurRunTestOpts,
  TOnChangeRunTestOpts,
} from '@types'
import { useState } from 'react'
import { exists } from '@keg-hub/jsutils'
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



export type TTestOpts = {
  testRunCfg:TTestRunUICfg
  onBlurRunTestOpts:TOnBlurRunTestOpts
  onChangeRunTestOpts:TOnChangeRunTestOpts
}

export const TestOpts = (props:TTestOpts) => {

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
        title='Test Options'
        className='gb-test-test-options-header'
        titleClass='gb-test-test-options-header-title'
      />

      <RunTestOptsSectionDrawer
        in={open}
        unmountOnExit
        timeout="auto"
      >
        <OptionsContainer>

          <InputContainer className='gb-test-match-input-container' >
            <TagsInput
              freeSolo={true}
              label={`Test Match`}
              className='gb-test-match-input'
              onBlur={(evt) => onBlurRunTestOpts(evt, `testMatch`)}
              onChange={(...args:any[]) => onChangeRunTestOpts(args, `testMatch`)}
              placeholder={`*.feature      /user-tests/*      *.*`}
              value={testRunCfg.testMatch || ``}
              helperText={
                <InputHelperText>
                  Glob pattern used to filter which test files to execute
                </InputHelperText>
              }
            />
          </InputContainer>

          <InputContainer className='gb-test-tags-input-container' >
            <TagsInput
              freeSolo={true}
              multiple={true}
              className='gb-test-tags-input'
              onBlur={(evt) => onBlurRunTestOpts(evt, `tags`)}
              onChange={(...args:any[]) => onChangeRunTestOpts(args, `tags`)}
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
              name='tests-run-retry-input'
              defaultValue={0}
              className='gb-test-test-retry'
              helperText={
                <InputHelperText>
                  Amount of times to retry a step if it fails
                </InputHelperText>
              }
              placeholder='Enter the step retry amount... ( default: 0 )'
              onBlur={(evt) => onBlurRunTestOpts(evt, `testRetry`)}
            />
          </InputContainer>
          <InputContainer className='gb-test-suite-retry-input-container' >
            <NumberInput
              type='number'
              label='Feature Retry'
              name='tests-run-suite-retry-input'
              defaultValue={0}
              className='gb-test-suite-retry'
              helperText={
                <InputHelperText>
                  Amount of times to retry a Feature if it fails.
                </InputHelperText>
              }
              placeholder='Enter the Feature retry amount... ( default: 0 )'
              onBlur={(evt) => onBlurRunTestOpts(evt, `suiteRetry`)}
            />
          </InputContainer>

          <InputContainer className='gb-test-bail-input-container' >
            <NumberInput
              type='number'
              label='Test Bail'
              name='tests-run-bail-input'
              defaultValue={5}
              className='gb-test-test-bail'
              helperText={
                <InputHelperText>
                  Stop executing tests after a specified number of tests have failed.
                </InputHelperText>
              }
              placeholder='Enter a test bail amount... ( default: 5 )'
              onBlur={(evt) => onBlurRunTestOpts(evt, `testBail`)}
            />
          </InputContainer>

          <InputContainer className='gb-test-suite-retry-input-container' >
            <ToggleInput
              label='Exit on Fail'
              value={exists(testRunCfg.exitOnFailed) ? `${testRunCfg.exitOnFailed}` : `false`}
              onChange={(...args) => onChangeRunTestOpts(args, `exitOnFailed`)}
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
      </RunTestOptsSectionDrawer>
    </RunTestOptsSectionContainer>
  )
}

