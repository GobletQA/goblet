
For step-definitions
* Parse the match text and find all expression tokens
  * Match the tokens to the meta data expressions
  * Add alias for general expression tokens
    * alias to the expression meta data,
    * For example:
      * Instead of string, show `Dom Element Selector`
      * Instead of word, show `World Path`
      * Instead of number, show `Element Count`
    * Then show the alias instead of the generic expression type in the match text
  * When hover over an expression in match text
    * Highlight the matching expression meta-data

* Connect actions to real functions
  * Need to add method to open a file in monaco from outside editor

* Add Up Toggle Arrow, to allow Definitions slider to be full height