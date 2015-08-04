(function(){
  if (!document.addEventListener) return;

  var options = INSTALL_OPTIONS;

  var add = function(){
    for (var i=0; i < options.blocks.length; i++) {
      var el = Eager.createElement(options.blocks[i].location);

      el.innerHTML = options.blocks[i].code || '';

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
  }

  if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', add);
  else
    add();
})()
