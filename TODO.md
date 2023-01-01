## TODO

* Fix Monaco - File Rename
  * If file is not yet loaded, and is renamed
  * Update will happen correctly, but locally, the file content will not be loaded
  * Instead shows the file as empty


* Fix Repo Branch workflow
  * Both Create branch and new branch params should not exist or be better defined
  * Currently not handeled well
    * createBranch should be boolean
    * newBranch should be branch name
* Add frontend shared components
  * So monaco and race can share components
    * Right now duplicating components between them
