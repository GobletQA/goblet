
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