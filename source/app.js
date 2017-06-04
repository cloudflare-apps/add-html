(function () {
  'use strict'

  if (!document.addEventListener) return

  var options = INSTALL_OPTIONS
  var elements = {}
  var prevElements = {}

  function updateElements () {
    options.blocks.forEach(function (block, index) {
      var locationHash = [block.location.selector, block.location.method, index].join('!')
      var element

      if (elements[locationHash]) {
        element = elements[locationHash]
      } else {
        if (block.location.method === 'replace') {
          prevElements[locationHash] = document.querySelector(block.location.selector)
        }

        element = INSTALL.createElement(block.location)
        elements[locationHash] = element
      }

      element.foundInBlocks = true
      element.innerHTML = block.code

      var scripts = element.querySelectorAll('script')

      if (scripts) {
        scripts.forEach(function (script) {
          var newScript = document.createElement('script')

          for (var key = script.attributes.length; key--;) {
            var attr = script.attributes[key]

            if (attr.specified) {
              newScript.setAttribute(attr.name, attr.value)
            }
          }

          newScript.innerHTML = script.innerHTML

          element.replaceChild(newScript, script)
        })
      }
    })

    for (var hash in elements) {
      if (!elements[hash].foundInBlocks) {
        if (prevElements[hash]) {
          elements[hash].parentNode.replaceChild(prevElements[hash], elements[hash])
          delete prevElements[hash]
        } else {
          elements[hash].parentNode.removeChild(elements[hash])
        }

        delete elements[hash]
      } else {
        delete elements[hash].foundInBlocks
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElements)
  } else {
    updateElements()
  }

  window.INSTALL_SCOPE = {
    setOptions: function (nextOptions) {
      options = nextOptions

      updateElements()
    }
  }
}())
