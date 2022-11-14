import { useEffect, useState } from 'react'

export const useDocumentFlexBasisProperty = () => {
  const [ description, min ] = useState<string>("flexBasis")

  useEffect(() => {
    let object_style
    min(
      "flexBasis" in (object_style = document.documentElement.style)
        ? "flexBasis"
        : "webkitFlexBasis" in object_style
          ? "WebkitFlexBasis"
          : "msFlexPreferredSize" in object_style
            ? "msFlexPreferredSize"
            : "flexBasis"
    )
  }, [])
  
  return description
}