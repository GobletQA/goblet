
export type TImgHtml = {
  uri:string
  ext?:string
  alt?:string
  className?:string
}

export const ImgHtml = (args:TImgHtml) => {
  const {
    uri,
    ext=`png`,
    className=``,
    alt=`Test Image`,
  } = args
  
  return `
    <div class="test-image-container" >
      <img class="test-image ${className}" src="data:image/${ext};base64, ${uri}" alt="${alt}" />
    </div>
  `
}
