## Feat
* Add play back functionality for Race
* Add gitlab authentication

## Bugs

### Race
* Browser play button not active when more then one feature open
* Issues with General section


### Screencast Goblet Config / FS API
* Validate the paths of a repo config
* Paths can only allow locations inside the mounted repo
* Any paths outside of it, are not allowed


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
* Add scroll to position step

* Keeping the feature file open when switching editors


* Fix `feature` references when running feature tests to use a constant
  * Should come from the fileTypes, and not be a hard coded string


* Fix bug with race decorators
  * Rules seem to fail when running
    * Looks to be related to the decorators issues
  * Needs an update to Parkin to keep a consistent uuid for feature items
  * Needs to pass on feature test meta data
    * This is mostly done, but needs to be published