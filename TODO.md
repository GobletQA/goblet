## TODO

* Fix Repo Branch workflow
  * Both Create branch and new branch params should not exist or be better defined
  * Currently not handeled well
    * createBranch should be boolean
    * newBranch should be branch name
* When unmounting a repo, the UI repo files don't seem to change
  * Repos def not unmounting properly
  * Seems like it's not being removed form local storage on frontend
* Add frontend shared components
  * So monaco and race can share components
    * Right now duplicating components between them
* Save active editor in local storage
  * Should reuse the last editor on refresh