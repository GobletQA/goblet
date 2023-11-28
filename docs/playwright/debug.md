
# Playwright Debug

* Playwright supports the DEBUG env for extra debug logging
* Multiple types can be defined using a comma to separate them
* For example `DEBUG=pw:api*,pw:browser* ...some command`

## Debug Types

* `pw:api*`
* `pw:protocol*`
* `pw:install*`
* `pw:download*`
* `pw:browser*`
* `pw:proxy*`
* `pw:error*`
* `pw:webserver`
* `pw:channel*`
  * `pw:channel:command`
  * `pw:channel:response`
  * `pw:channel:event`


## PWDEBUG ENV
  * `PWDEBUG=console`
    * When running in Debug Mode with `PWDEBUG=console`, a `playwright` object is available in Developer tools console.
    * **Runs headed**: Browsers always launch in headed mode
    * **Disables timeout**: Sets default timeout to 0 (= no timeout)
    * **Console helper**: Configures a `playwright` object in the browser to generate and highlight
      [Playwright selectors](./selectors.md). This can be used to verify text or
      composite selectors.

## PW_CODEGEN_NO_INSPECTOR
* When set to `1`, prevents the Playwright inspector tool from running.

## Potential ENVs
  PWPAGE_IMPL
  PW_CODEGEN_NO_INSPECTOR=1
  PLAYWRIGHT_CHROMIUM_USE_HEADLESS_NEW=1
  PLAYWRIGHT_CHROMIUM_USE_HEADLESS_NEW
  TEST_WORKER_INDEX
  PWTEST_INTERMEDIATE_BLOB_REPORT
  DEVTOOLS
  INSIDE_DOCKER
  PWTEST_SELENIUM
  INSIDE_DOCKER
  TEST_INSPECTOR_LANGUAGE
  PWTEST_RECORDER_PORT
  PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1
  PW_TEST_REUSE_CONTEXT
  PWTEST_DEBUG
  PWDEBUGIMPL=1
  PWTEST_PROFILE_DIR
  PW_DEBUG_CONTROLLER_HEADLESS



