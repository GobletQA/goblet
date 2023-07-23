import url from 'url'

export const fileIsModule = (file:string) => {
  if (file.endsWith('.mjs') || file.endsWith('.mts'))
    return true;
  
  return false
}

const installRequireTransform = () => {
  
  const revertRequireTransform = () => {
    
  }

  return revertRequireTransform
}

export const requireOrImport = async (file:string) => {
  const revertRequireTransform = installRequireTransform();
  const isModule = fileIsModule(file);
  try {
    const esmImport = () => eval(`import(${JSON.stringify(url.pathToFileURL(file))})`)
    if (isModule) return await esmImport()
    const result = require(file)
    return result
  }
  finally {
    revertRequireTransform()
  }
}
