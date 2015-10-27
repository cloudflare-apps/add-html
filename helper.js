(function(){
  if (!document.addEventListener) return;

  var options = INSTALL_OPTIONS;
  var elements = {};

  var prevElements = {};

  var add = function(){
    for (var i=0; i < options.blocks.length; i++) {
      var block = options.blocks[i];
      var locationHash = block.location.selector + "!" + block.location.method;

      if (elements[locationHash]){
        var el = elements[locationHash];
      } else {
        if (block.location.method === 'replace'){
          prevElements[locationHash] = document.querySelector(block.location.selector);
        }

        var el = Eager.createElement(block.location);
        elements[locationHash] = el;
      }

      el.foundInBlocks = true;
      el.innerHTML = block.code;

      var scripts = el.querySelectorAll('script');
      if (scripts){
        for (var j=0; j < scripts.length; j++){
          var newScript = document.createElement('script');
          for (var k=scripts[j].attributes.length; k--;){
              var attr = scripts[j].attributes[k];

              if (attr.specified)
                newScript.setAttribute(attr.name, attr.value);
          }

          newScript.innerHTML = scripts[j].innerHTML;

          el.replaceChild(newScript, scripts[j]);
        }
      }
    }

    for (var hash in elements){
      if (!elements[hash].foundInBlocks){
        if (prevElements[hash]){
          elements[hash].parentNode.replaceChild(prevElements[hash], elements[hash]);
          delete prevElements[hash];
        } else {
          elements[hash].parentNode.removeChild(elements[hash]);
        }

        delete elements[hash];
      } else {
        delete elements[hash].foundInBlocks;
      }
    }
  }

  var setOptions = function(opts){
    options = opts;

    add();
  };

  if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', add);
  else
    add();

  window.EagerAddHTML = {
    setOptions: setOptions
  }
})()
