
/**
 * Helper to check if a canvas element has pixels rendered to it
 */
export const isCanvasBlank = (canvas:HTMLCanvasElement) => {
  const context = canvas.getContext('2d');
  if(!context) return true

  const pixelBuffer = new Uint32Array(context.getImageData(0, 0, canvas.width, canvas.height).data.buffer)

  return !pixelBuffer.some(color => color !== 0);
}