import type { TDefinitionAst } from '@types'
import { capitalize } from '@keg-hub/jsutils'

const Clipboard = {
  setString: (data:string) => {
    console.log(`TODO: implement copy to clipboard`)
  }
}

/**
 * Copies a definitions matcher text to the users clipboard
 */
export const copyToDefinitionClipboard = (definition:TDefinitionAst) => {
  if (!definition || !definition.name)
    return console.warn(
      `Can not copy to clipboard, a definition is require!`,
      definition
    )

  const copyText = `${capitalize(definition.type)} ${definition.name}`.trim()
  Clipboard.setString(copyText)

  // TODO: Add toast notifications and remove this log
  // Add notifications that definition was copied to the users clipboard
  console.log(`Copied definition to clipboard:\n\n`, copyText)
}