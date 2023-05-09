const config = {
  keys: {
    'display': '',
    'position': '',

    // Flex
    'flex-direction': 'flex',
    'flex-wrap': 'flex-warp',
    'flex-flow': 'flex',
    'justify-content': 'justify',
    'align-items': 'items',
    'align-content': 'content',
    'align-self': 'self',
    'order': 'order',
    'flex-grow': 'grow',
    'flex-shrink': 'shrink',
    'flex-basis': 'basis',

    'width': 'w',
    'height': 'h',

    'margin': 'm',
    'padding': 'p',

    'background': 'bg',
    'background-color': 'bg',

    'opacity': 'opacity',

    'border': 'border',
    'border-radius': 'rounded',

    'object-fit': 'object',
    'object-position': 'object',

    'box-shadow': 'shadow',

    // Text
    'font-family': 'font',
    'font-style': '',
    'font-weight': 'font',
    'font-size': 'text',
    'line-height': 'leading',
    'letter-spacing': 'tracking',
    'color': 'text'
  },
  values: {
    'flex-direction': {
      'row': 'row',
      'row-reverse': 'row-reverse',
      'column': 'col',
      'column-reverse': 'col-reverse'
    },
    'justify-content': {
      'flex-start': 'start',
      'flex-end': 'end',
      'center': 'center',
      'space-between': 'between',
      'space-around': 'around',
      'space-evenly': 'evenly'
    },
    'align-items': {
      'flex-start': 'start',
      'flex-end': 'end',
      'center': 'center',
      'baseline': 'baseline',
      'stretch': 'stretch'
    },
    'object-fit': {
      'fill': 'fill',
      'contain': 'contain',
      'cover': 'cover',
      'none': 'none',
      'scale-down': 'scale-down'
    },
    'object-position': {
      'center': 'center',
      'top': 'top',
      'bottom': 'bottom',
      'left': 'left',
      'right': 'right'
    },
    'font-weight': {
      100: "thin",
      200: "extralight",
      300: "light",
      400: "normal",
      500: "medium",
      600: "semibold",
      700: "bold",
      800: "extrabold",
      900: "black",
    },
    'font-style': {
      'italic': 'italic',
      'normal': 'non-italic'
    },
  }
}

// Get css list from html and convert to object list
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
  const tailwindKeys = config.keys
  const tailwindValues = config.values
  
  // Css key to tailwind prefix
  let tailwindClassPrefix = ''
  if (tailwindKeys[cssObj.key]) {
    tailwindClassPrefix = tailwindKeys[cssObj.key] + '-'
  } else if (tailwindKeys[cssObj.key] === '') {
    tailwindClassPrefix = ''
  } else {
    tailwindClassPrefix = cssObj.key + '-'
  }

  // Css value to tailwind value
  let tailwindClassValue = ''
  if (tailwindValues[cssObj.key]) {
    tailwindClassValue = tailwindValues[cssObj.key][cssObj.value]
  } else if (tailwindKeys[cssObj.key] === '') { // If no prefix, no need to add []
    tailwindClassValue = cssObj.value.replaceAll(' ', '_')
  } else {
    tailwindClassValue = `[${cssObj.value.replaceAll(' ', '_')}]`
  }

  // Combine prefix and value
  const tailwindClass = `${tailwindClassPrefix}${tailwindClassValue}`
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
    tailwindSnippetItem.innerText = cssList.map((cssObj) => cssObjToTailwind(cssObj)).join(' \n')
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

const updateSnippetOnClick = () => {

  // If canvas not available, try again after 100ms
  if (!document) {
    setTimeout(updateSnippetOnClick, 100)
    return
  }

  // Click any design to update snippet props
  document.addEventListener('click', (event) => {
    // click outside of tailwind snippet
    const snippet = document.querySelector('.tailwind_snippet')
    if (snippet && snippet.contains(event.target)) {
      return
    }

    console.log('document clicked')
    setTimeout(convertCssProps, 100)
  })
}

window.onload = () => {
  console.log('Figma plugin onload')
  setInterval(() => {
    checkCssCodeContent()
  }, 1000)

  // update snippet on click
  updateSnippetOnClick()
}