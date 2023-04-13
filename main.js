const getCssList = () => {
  const cssCodeContent = document.querySelector('div[class*="css_code_panel--cssCodeContent"]')
  if (cssCodeContent) {
    const cssList = [...cssCodeContent.querySelectorAll('div[class*="css_code_panel--cssCodeContent"] > div')]

    // From css html list to css object list
    const refinedListGroup = cssList.reduce((acc, item) => {
      const lastRefinedItem = acc[acc.length - 1]
      const isCssLine = item.className.includes('css_code_panel--cssLine')

      // If css line, create css object and push to last refined item
      if (isCssLine) {
        const cssObj = {
          key: item.innerText.slice(0, -1).split(': ')[0],
          value: item.innerText.slice(0, -1).split(': ')[1]
        }
        lastRefinedItem.push(cssObj)
      } else if (lastRefinedItem.length !== 0) {
        // If not css line, create new array item
        acc.push([])
      }
      return acc
    }, [[]])
    return refinedListGroup
  }
}

const cssObjToTailwind = (cssObj) => {
  const tailwindClass = `${cssObj.key}-[${cssObj.value}]`
  return tailwindClass
}

const createSnipperItem = () => {
  const tailwindSnippet = document.querySelector('.tailwind_snippet')
  const snippetItem = document.createElement('div')
  snippetItem.setAttribute('class', 'tailwind_snippet_item')

  tailwindSnippet.appendChild(snippetItem)
  return snippetItem
}

const convertCssProps = () => {
  const cssListGroup = getCssList()

  const tailwindSnippet = document.querySelector('.tailwind_snippet')
  tailwindSnippet.innerHTML = '' // Clear all snippet item

  cssListGroup.forEach((cssList) => {
    const tailwindSnippetItem = createSnipperItem()
    tailwindSnippetItem.innerText = cssList.map((cssObj) => cssObjToTailwind(cssObj)).join('\n')
  })
}
const cssCodeContent = () => {
  const cssCodeContent = document.querySelector('div[class*="css_code_panel--cssCodeContent"]')
  if (cssCodeContent) {
    // Check if tailwind snippet already exists
    const preTailwindSnippet = document.querySelector('.tailwind_snippet')
    if (preTailwindSnippet) {
      convertCssProps()
      return
    }

    // Creating tailwind snippet
    const tailwindSnippet = document.createElement('div')
    tailwindSnippet.setAttribute('class', 'tailwind_snippet')
    tailwindSnippet.innerText = 'Click to get tailwind snippet'

    // Append snippet before cssCodeContent
    cssCodeContent.parentNode.insertBefore(tailwindSnippet, cssCodeContent)
    convertCssProps()
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