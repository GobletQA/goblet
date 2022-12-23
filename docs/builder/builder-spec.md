# Builder

* Define a list of steps that can be used a placeholders for actions in the browser
  * Most of these already exist in the test-utils repo
* Define how the web page will be loaded
  * Use the url defined in the world.json file by default
  * Allow setting a custom url to override the default
* Step input
  * Step by step selector
  * Include Given / When / Then ?
* 


### Cool Features
* Auto-Create alias to a selector
  * Allow user to type in alias name and map it to a page selector
* Click drag mouse to highlight an element
* Preview a specific step
  * Runs just a single step
    * Requires page be in a specific state, how to handle this??
* Observe action - Validates that an element exists on the page
* Multiple selectors
  * Attach multiple selectors to an alias
  * If one fails, then tries the next one
* Allow full Scenarios to be linked to within a feature file
  * Most likely a parkin feature