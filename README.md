# Goblet Monorepo
* Provides **cross-platform** and **cross-browser** application testing.
* Runs within an isolated environment (docker) to ensure dependable and predicable testing conditions.
* Simplifies the testing process through functionality such:
  * Visualize tests as they are run on the host machines browser
  * Write and execute tests directly in the browser within a web applications context
    * **Requires** adding a single `script` tag to the web application
    * The same tests can later be executed within a `headless` browser environment ( CI )
  * Use Cucumber.js to write feature files and step definitions
    * Feature files can use pre-defined step definitions, enabling non-developers to write tests
    * Custom step definitions can also be loaded, to handel application edge cases
  * Use Jest and Expect to assert test validity
    * **0 modifications** are needed, if Jest is already being used
