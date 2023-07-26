import type { Exam } from "@GEX/Exam";
import type { TExamEvt, TExBuiltReporters } from "@GEX/types"

export class ReportEventMapper {
  
  reporters:TExBuiltReporters

  constructor(){}

  event = (evt:TExamEvt) => {
    console.log(`------- event -------`)
    console.log(evt)
    
    // TODO: figure out the event type,
    // Then use that to call the correct method on the recorders array
    
    // Also need to add `default` and `silent` lookups to the buildReports helper method
    // Should load in the default and silent report classes, which I need to create
  }

}