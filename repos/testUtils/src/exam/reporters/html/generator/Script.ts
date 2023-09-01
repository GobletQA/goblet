

export const Script = () => {
  return `
    <script>
      const toggleError = (index) => {
        const errorSection = document.getElementById('error-' + index)
        if (errorSection) {
          const visibility = window.getComputedStyle(errorSection).visibility
          if (visibility === 'hidden') {
            errorSection.style.visibility = 'visible'
            errorSection.style.maxHeight =  errorSection.scrollHeight + 'px'
          }
          else {
            errorSection.style.maxHeight = '0'
            setTimeout(() => errorSection.style.visibility = 'hidden', 1000)
          }
        }
      }
      document.addEventListener("DOMContentLoaded", function(event) {
        Array.from(document.querySelectorAll(".step-description.failed")).forEach(el => el.click())
      })
    </script>
  `
}