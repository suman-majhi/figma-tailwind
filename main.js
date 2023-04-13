
const cssCodeContent = () => {
  const cssCodeContent = document.querySelector('div[class*="css_code_panel--cssCodeContent"]')
  if (cssCodeContent) {
    // Check if tailwind snippet already exists
    const preTailwindSnippet = document.querySelector('.tailwind_snippet')
    if (preTailwindSnippet) return

    // Creating tailwind snippet
    const tailwindSnippet = document.createElement('div')
    tailwindSnippet.setAttribute('class', 'tailwind_snippet')
    tailwindSnippet.innerText = 'Click to get tailwind snippet'

    // Append snippet before cssCodeContent
    cssCodeContent.parentNode.insertBefore(tailwindSnippet, cssCodeContent)
  } else {
    console.log('Not available')
  }
}

window.onload = () => {
  console.warn('Figma plugin onload')
  setInterval(() => {
    cssCodeContent()
  }, 1000)
}