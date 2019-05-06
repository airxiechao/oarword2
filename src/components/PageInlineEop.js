import { createElement } from '../utils/renderer'
import { measureFontTextWH, measureElePageXY } from '../utils/measure.js'

import state from '../utils/state'

class PageInlineEop{
    constructor(ib){
        this.ib = ib
    }

    render(){
        var text = this.ib.text
        var textStyle = this.ib.lastInlineBlock.textStyle

        var t = window.goog.dom.createTextNode(text)

        this.el = createElement('div', {
            class: 'page-inline-eop',
            style: {
                display: 'inline-block',
                opacity: 0,
                cursor: 'text',
            }
        }, [
            t
        ])

        window.goog.events.listen(this.el, window.goog.events.EventType.CLICK, this.clickHandler.bind(this));

        return this.el
    }

    clickHandler(e){
        state.mutations.setCursorInlineBlock({
                inlineBlock: this.ib.lastInlineBlock,
                inlineStartIndex: this.ib.lastInlineBlock.text.length,
            }
        )
    }
}

export default PageInlineEop