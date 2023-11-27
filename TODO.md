## Feat
* Add play back functionality for Race
* Add gitlab authentication

## Bugs

### Race
* Browser play button not active when more then one feature open
* Issues with General section


### Parkin
* This type of select breaks parkin 
  * `div >> internal:has-text=/^Iowa Jamaican infomediaries$/`

### Screencast Goblet Config / FS API
* Validate the paths of a repo config
* Paths can only allow locations inside the mounted repo
* Any paths outside of it, are not allowed

* Secrets not reloading after change
  * When the secrets file is changed, it should reload them when tests are run
  * This currently does not happen

* Save currently opened file
  * Auto reopen it on reload

* Expression actions
  * Group Actions by type
  * Sort actions by most used
    * So don't have to use keyboard


* On world save, reload the entire world


* Add disable step
  * comment it out
  * Will require parsing commented out steps
  * Which means this needs updates to parkin


* Add ability to restart session container from UI

* Keeping the feature file open when switching editors


* Fix `feature` references when running feature tests to use a constant
  * Should come from the fileTypes, and not be a hard coded string


* Fix bug with race decorators
  * Rules seem to fail when running
    * Looks to be related to the decorators issues


## To Investigate
* Figure out how to handle camera and mic recording within the session container
  * Need to be able to record camera and audio
  * Most likely need sometime of emulator that runs on ubuntu
    * The browser would then talk to those instead

* Figure out why recording events is not propagating
* Figure out how to add an empty 
* File upload
  * opens a file explorer
  * Need a way to stop that from happening


* World not being passed to Test Runner after being auto-logged out

On every page load
* Walk the dom tree and add a dynamically generated selector
* Allow using that selector in tests
* Investigate adding a custom selector engine to playwright


* Monaco Editor
  * Loading Decorators not being cleared when a the test fails


* Add better descriptions to step meta-data
* Add step to set the sizes of the browser
  * Works in tandem with the move mouse to x-y position
* Add step to reset the browser context
* Be able to reuse blocks

* When grabbing a selector from the browser
  * Validate the selector before setting it in the step to ensure it's not a duplicate that will cause the test to fail
  * If it is a duplicate, try to regenerate the selector so that it properly passes


### Playwright
* Set a custom `userAgent` on the browser context
  * I.E.
  ```js
    const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' +
            ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36', }); 
  ```

### Mocks
  * For adding mocks to exam, look into https://www.npmjs.com/package/testdouble
  * Also look at the new `node:test` module that provides mocking functionality 
  * `import { mock, test } from 'node:test'`



### AI
* From user defined user story
  * AI outputs a feature file 
    * Should be editable, needs a little tlc
* Then run the feature
  * 



### Main issues
* Sometimes injected scripts are not injected
  * Steps
    * Open a test that fails
    * Run the test
    * Wait for it to fail or press cancel
    * Try to use the select from browser
      * Throws an error can't find injected script method
* Need to add world editor to Race Editor
  * Allow alias to be multi-leveled
* Need to add play from step / play step to monaco
  * Should be in a right click context menu
* Add element highlight on hover of selector from editor
  * Should also work with aliases
* Stop Browser page is reloaded on browser resize
* Need to restart browser when a page crashes
  * Listen to page.on(`crash`) event
* If a test is modified then run, sometimes the modification is not included in the run
  * Need to ensure runs the most up-to-date version of the test file
* Batch git commit/push changes
* Add long-pull to browser url when tests are not running


* Couldn't log in to the demo repo, even though I could get into others. Kept trying and eventually got it to get past the "failed to mount repo" message, but would get stuck at "This is taking longer than normal". After signing out and in a few times, it finally mounted.

* I started creating a demo test for Stylaquin and while making it the select from browser tool would stop working. Forcing the BiB restart did nothing. I had to log out of Goblet completely and log back in before I could get it to start working again.


Basically the select in browser issue caused an issue with your session container. When you logged out, it cause the session container to shutdown, but there's no update to the frontend about that. So when you  logged back in it would not allow you to mount until the container fully restarted.