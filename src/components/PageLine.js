import PageInlineBlock from './PageInlineBlock'

import { createElement } from '../utils/renderer'
import state from '../utils/state'

class PageLine{
    constructor(lineWidth, inlineBlocks, paraIndex, lineSpacingIndex){
        this.lineWidth = lineWidth
        this.inlineBlocks = inlineBlocks
        this.paraIndex = paraIndex
        this.lineSpacingIndex = lineSpacingIndex

        state.mutations.setLineSpacingObj(this.paraIndex, this. lineSpacingIndex, this)
    }

    render(){
        var inlineBlocks = []
        for(var i = 0; i<this.inlineBlocks.length; ++i){
            var ib = this.inlineBlocks[i]
            var inlineBlock = new PageInlineBlock(ib.text, ib.textStyle, this.paraIndex, this.lineSpacingIndex, i)
            inlineBlocks.push(inlineBlock.render())
        }

        this.el = createElement('div', {
            class: 'page-line',
            style: {
                width: this.lineWidth+'px',
            }
        }, inlineBlocks)

        return this.el
    }
}

export default PageLine