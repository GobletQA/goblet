

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
            const parent = errorSection.closest('.root-failed.failed')

            if(parent && parent.style.maxHeight && parseInt(parent.style.maxHeight) <= parent.scrollHeight)
              parent.style.maxHeight = parent.scrollHeight + errorSection.scrollHeight + 'px'

          }
          else {
            errorSection.style.maxHeight = '0px'
            setTimeout(() => errorSection.style.visibility = 'hidden', 500)
          }
        }
      }

      const toggleSection = (id) => {
        const section = document.getElementById(id)
        if (section) {
          const visibility = window.getComputedStyle(section).visibility
          const parent = section.closest('section.test-section')
          if (visibility === 'hidden') {
            if(parent) parent.classList.add('open')

            section.style.visibility = 'visible'
            section.style.maxHeight =  section.scrollHeight + 'px'
          }
          else {
            if(parent) parent.classList.remove('open')

            section.style.maxHeight = '0px'
            setTimeout(() => section.style.visibility = 'hidden', 500)
          }
        }
      }

      document.addEventListener("DOMContentLoaded", function(event) {
        Array.from(document.querySelectorAll(".step-description.failed")).forEach(el => el.click())
        const sections = Array.from(document.querySelectorAll(".test-location-container"))
        sections.forEach(el => el.click())
        setTimeout(() => sections.forEach(el => {
          el.classList.contains('failed') && el.click()
        }), 500)
      })

    </script>
  `
}