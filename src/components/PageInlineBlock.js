import { createElement } from '../utils/renderer'
import { measureFontTextWH, measureElePageXY } from '../utils/measure.js'

import state from '../utils/state'

class PageInlineBlock{
    constructor(ib){
        this.ib = ib
    }

    render(){
        var text = this.ib.text
        var textStyle = this.ib.textStyle

        var t = window.goog.dom.createTextNode(text)
        this.el = createElement('div', {
            class: 'page-inline-block',
            style: {
                display: 'inline-block',
                height: this.ib.inlineHeight + 'px',
            }
        }, [
            t
        ])

        window.goog.events.listen(this.el, window.goog.events.EventType.CLICK, this.clickHandler.bind(this));

        return this.el
    }

    clickHandler(e){
        var docXY = measureElePageXY(document.getElementsByClassName('doc')[0])
        var docX = docXY.x
        var pointLeft = e.clientX - docX - this.el.offsetLeft
        
        var front = false
        var lastw = 0
        for(var i = 1; i <= this.ib.text.length; ++i){
            var t = this.ib.text.substr(0, i)
            var wh = measureFontTextWH(t, '', '', '')

            if(wh.w > pointLeft){
                var cw = wh.w - lastw

                if(pointLeft < lastw + cw / 2){
                    front = true
                }

                break
            }

            lastw = wh.w
        }
        
        state.mutations.setCursorInlineBlock({
                inlineBlock: this.ib,
                inlineStartIndex: i-1,
                front: front,
            }
        )
    }
}

export default PageInlineBlock