

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
            errorSection.style.maxHeight = '0px'
            setTimeout(() => errorSection.style.visibility = 'hidden', 1000)
          }
        }
      }

      const toggleSection = (id) => {
        const section = document.getElementById(id)
        if (section) {
          const visibility = window.getComputedStyle(section).visibility
          if (visibility === 'hidden') {
            section.style.visibility = 'visible'
            section.style.maxHeight =  section.scrollHeight + 'px'
          }
          else {
            section.style.maxHeight = '0px'
            setTimeout(() => section.style.visibility = 'hidden', 1000)
          }
        }
      }

      document.addEventListener("DOMContentLoaded", function(event) {
        Array.from(document.querySelectorAll(".step-description.failed")).forEach(el => el.click())
        const sections = Array.from(document.querySelectorAll(".test-location-container"))
        sections.forEach(el => el.click())
        setTimeout(() => sections.forEach(el => el.click()), 100)
      })


    </script>
  `
}