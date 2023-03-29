const getTailwindClass = () => {
  let raw = [...document.querySelectorAll('div[class*="css_code_panel--cssLine"]')].map((item) => item.innerText.slice(0, -1).split(': '))

  const textProps = {
    'font-family': 'font',
    'font-weight': 'font',
    'font-size': 'text',
    'line-height': 'leading',
    'letter-spacing': 'tracking',
    'color': 'text'
  }
  const fontWeight = {
    100: "thin",
    200: "extralight",
    300: "light",
    400: "normal",
    500: "medium",
    600: "semibold",
    700: "bold",
    800: "extrabold",
    900: "black",
  }


  const res = raw.reduce((acc, [key, val]) => {
    if (!textProps[key]) return acc
    if (key == 'font-weight' && val === '400') return acc

    const tlInitial = textProps[key]
    let tlCls = `${tlInitial}-[${val}]`

    if (key == 'font-weight') {
      tlCls = `${tlInitial}-${fontWeight[val]}`
    }
    if (key == 'font-family') {
      if (val.includes('Montreal')) {
        tlCls = `${tlInitial}-montreal`
      } else if (val.includes('Telegraf')) {
        tlCls = `${tlInitial}-telegraf`
      }
    }

    return `${acc} ${tlCls}`
  }, '')

  console.log('Tailwind result')
  console.log(res)
  const tlSnippet = document.querySelector('.tailwind_snippet')
  if (!tlSnippet) {
    setTimeout(() => {
      createSnippet()
      getTailwindClass()
    }, 500)
    return
  }
  tlSnippet.innerText = res.trim() || 'Click to get tailwind snippet'
}

const createSnippet = () => {
  const parent = document.querySelector('div[class*="css_code_panel--cssCodeContent"]')
  if (!parent) {
    setTimeout(() => {
      createSnippet()
    }, 500)
    return
  }
  const box = document.createElement('div')
  box.setAttribute('class', 'hljs-comment tailwind_snippet')
  box.innerText = 'Click to get tailwind snippet'

  const insertAfter = (newNode, existingNode) => {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
  }
  insertAfter(box, parent)
  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  box.addEventListener('click', (event) => {
    console.log('Text copyToClipboard')
    console.log(event.target.innerText)
    copyToClipboard(event.target.innerText)
  })
}
const init = () => {
  if (typeof document === 'undefined') {
    setTimeout(() => {
      init()
    }, 500)
    return
  }
  const canvasEl = document.querySelector('canvas')
  console.log('Canvas element')
  console.log(canvasEl)
  if (!canvasEl) {
    setTimeout(() => {
      init()
    }, 500)
    return
  }
  // Generate tailwind classes
  canvasEl.addEventListener('click', (event) => {
    console.log('Canvas clicked')
    setTimeout(() => {
      getTailwindClass()
    }, 100)
  })

  // Tab click
  const onInspectTabClick = () => {
    const inspectTab = document.querySelector('div[class*="pages_panel--tab"][data-label="Inspect"]')
    if (!inspectTab) {
      setTimeout(() => {
        onInspectTabClick()
      }, 500)
      return
    }
    inspectTab.addEventListener('click', (event) => {
      console.log('Inspect tab clicked')
      const tailwind_snippet = document.querySelector('.tailwind_snippet')
      if (!tailwind_snippet) {
        createSnippet()
      }
    })
  }
  onInspectTabClick()
  createSnippet()
}

console.warn('Figma plugin trigger')
window.onload = () => {
  console.warn('Figma plugin onload')
  setTimeout(() => {
    console.log('Figma plugin init')
    init()
    console.log('Figma plugin load')
  }, 3000)
}