# Joker AI


## Preset Actions


### Generate Step

**How it works**
1. From UI, get user input
  * Set the url of the web page where the step will run
  * Add a prompt describing the step or steps to be generated
  * Send input to backend
2. Backend pre-processes user input
  * Loads the user defined web page, and pulls it's html content
  * Loads step text of all available steps
  * Combines steps web page html, and user prompt into a single prompt
  * Sends prompt to JokerAI
3. JokerAI sends prompt to LLM, and returns response to backend
  * Formats the response as needed
  * Includes system message
  * At some point add similarity search to filter steps based on user prompt
  * Validates response from LLM and ensures it includes the correct step format
  * Sends back to backend
4. Backend gets response from Joker AI, processes and returns to UI
  * At some point add save analytics data / LLM training data
  * Sends response back to UI
5. UI displays generated step to user
  * User has two options
    * Accept the generated step
      * Is automatically added as the last step to the active feature
    * User asks the LLM to try again

### Feature From User Story


### Auto-Fix Feature