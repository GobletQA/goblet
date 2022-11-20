
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
* `pw:channel*`
  * `pw:channel:command`
  * `pw:channel:response`
  * `pw:channel:event`
