import { createElement } from '../renderer'
import { buildTextStyleCss } from '../convert'

export default class PageInlineBlockText{
    constructor(ib){
        this.ib = ib
    }

    render(){
        let text = this.ib.text
        let textStyle = this.ib.textStyle

        let t = window.goog.dom.createTextNode(text)
        let textStyleCss = buildTextStyleCss(textStyle)
        textStyleCss['display'] = 'inline-block'
        textStyleCss['height'] = this.ib.inlineHeight + 'px'
        this.el = createElement('div', {
            class: 'page-inline-block-text',
            style: textStyleCss
        }, [
            t
        ])

        return this.el
    }
}