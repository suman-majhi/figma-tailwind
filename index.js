const getTailwindClass = () => {
  let raw = [...document.querySelectorAll('div[class*="css_code_panel--cssLine"]')].map((item) => item.innerText.slice(0, -1).split(': '))
  console.log(raw)

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
  tlSnippet.innerText = res.trim() || 'Click to get tailwind snippet'
}

const createSnippet = () => {
  const parent = document.querySelector('div[class*="css_code_panel--cssCodeContent"]')
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
  // Generate tailwind classes
  document.querySelector('canvas').addEventListener('click', (event) => {
    console.log('Canvas clicked')
    setTimeout(() => {
      getTailwindClass()
    }, 100)
  })

  // Tab click
  document.querySelector('div[class*="pages_panel--tab"][data-label="Inspect"]').addEventListener('click', (event) => {
    console.log('Inspect tab clicked')
    const tailwind_snippet = document.querySelector('.tailwind_snippet')
    if (!tailwind_snippet) {
      createSnippet()
    }
  })
  createSnippet()
}
window.onload = () => {
  setTimeout(() => {
    init()
    console.log('Figma plugin load')
  }, 3000)
}