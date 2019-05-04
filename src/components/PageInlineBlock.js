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
                display: 'inline-block'
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
        
        for(var i = 1; i <= this.ib.text.length; ++i){
            var t = this.ib.text.substr(0, i)
            var wh = measureFontTextWH(t, '', '', '')

            if(wh.w > pointLeft){
                break
            }
        }
        
        state.mutations.setCursorInlineBlock({
                inlineBlock: this.ib,
                inlineStartIndex: i-1,
            }
        )
    }
}

export default PageInlineBlock