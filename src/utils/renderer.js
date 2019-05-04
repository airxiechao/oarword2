function createElement(tag, settings, children){
    var el = window.goog.dom.createElement(tag)

    if(settings){
        Object.keys(settings).forEach(function(s) {
            if(s == 'style'){
                Object.keys(settings['style']).forEach(function(k) {
                    el.style[k] =  settings[s][k]
                })
            }else if(s == 'attrs'){
                Object.keys(settings['attrs']).forEach(function(k) {
                    el.setAttribute(k, settings[s][k])
                })
            }else if(s == 'class'){
                el.className = settings['class']
            }
            
        });
    }
    
    if(children){
        children.forEach(function(c){
            window.goog.dom.appendChild(el, c)
        })
    }

    return el
}

function updateElement(el, settings){
    if(settings){
        Object.keys(settings).forEach(function(s) {
            if(s == 'style'){
                Object.keys(settings['style']).forEach(function(k) {
                    el.style[k] =  settings[s][k]
                })
            }else if(s == 'attrs'){
                Object.keys(settings['attrs']).forEach(function(k) {
                    el.setAttribute[k] =  settings[s][k]
                })
            }else if(s == 'class'){
                el.className = settings['class']
            }
            
        });
    }

    return el
}

export { createElement, updateElement }