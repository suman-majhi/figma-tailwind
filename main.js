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
  const tailwindClass = `${cssObj.key}-[${cssObj.value.replaceAll(' ', '_')}]`
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

const createSnippet = () => {
  const cssCodeContent = document.querySelector('div[class*="css_code_panel--cssCodeContent"]')

  const tailwindSnippet = document.createElement('div')
  tailwindSnippet.setAttribute('class', 'tailwind_snippet')
  tailwindSnippet.innerText = 'Click to get tailwind snippet'

  // Append snippet after cssCodeContent
  cssCodeContent.parentNode.insertBefore(tailwindSnippet, cssCodeContent.nextSibling)
}

const checkCssCodeContent = () => {
  const cssCodeContent = document.querySelector('div[class*="css_code_panel--cssCodeContent"]')
  if (cssCodeContent) {
    // Check if tailwind snippet already exists
    const preTailwindSnippet = document.querySelector('.tailwind_snippet')
    if (preTailwindSnippet) {
      return
    }

    // Creating tailwind snippet
    createSnippet()

    // Update snippet with tailwind classes
    convertCssProps()
  } else {
    console.log('Not available')
  }
}

const addCanvasClickEvent = () => {
  const canvas = document.querySelector('canvas')

  // If canvas not available, try again after 100ms
  if (!canvas) {
    setTimeout(addCanvasClickEvent, 100)
    return
  }

  // Click any design to update snippet props
  canvas.addEventListener('click', () => {
    console.log('Canvas clicked')
    setTimeout(convertCssProps, 100)
  })
}

window.onload = () => {
  console.log('Figma plugin onload')
  setInterval(() => {
    checkCssCodeContent()
  }, 1000)

  // update snippet on canvas click
  addCanvasClickEvent()
}