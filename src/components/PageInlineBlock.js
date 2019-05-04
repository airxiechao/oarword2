import { createElement } from '../utils/renderer'
import { measureFontTextWH, measureElePageXY } from '../utils/measure.js'

import state from '../utils/state'

class PageInlineBlock{
    constructor(text, textStyle, paraIndex, lineSpacingIndex, inlineBlockIndex){
        this.text = text
        this.textStyle = textStyle
        this.paraIndex = paraIndex
        this.lineSpacingIndex = lineSpacingIndex
        this.inlineBlockIndex = inlineBlockIndex

        state.mutations.setInlineBlockObj(this.paraIndex, this. lineSpacingIndex, this.inlineBlockIndex, this)
    }

    render(){
        var text = window.goog.dom.createTextNode(this.text)
        this.el = createElement('div', {
            class: 'page-inline-block',
            style: {
                display: 'inline-block'
            }
        }, [
            text
        ])

        window.goog.events.listen(this.el, window.goog.events.EventType.CLICK, this.clickHandler.bind(this));

        return this.el
    }

    clickHandler(e){
        var docXY = measureElePageXY(document.getElementsByClassName('doc')[0])
        var docX = docXY.x
        var pointLeft = e.clientX - docX - this.el.offsetLeft
        
        for(var i = 1; i <= this.text.length; ++i){
            var t = this.text.substr(0, i)
            var wh = measureFontTextWH(t, '', '', '')

            if(wh.w > pointLeft){
                break
            }
        }

        state.mutations.setCursorIndex({
                paraIndex: this.paraIndex,
                lineIndex: this.lineSpacingIndex,
                inlineBlockIndex: this.inlineBlockIndex,
                inlineStartIndex: i-1,
            }
        )
    }
}

export default PageInlineBlock