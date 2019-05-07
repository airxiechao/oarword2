import PageInlineBlock from './PageInlineBlock'

import { createElement } from '../utils/renderer'

class PageLine{
    constructor(lineWidth, ls){
        this.lineWidth = lineWidth
        this.ls = ls
    }

    render(){
        var inlineBlocks = []
        for(var i = 0; i < this.ls.inlineBlocks.length; ++i){
            var ib = this.ls.inlineBlocks[i]
            if(ib.type == 'inline-block'){
                var inlineBlock = new PageInlineBlock(ib)
                ib.obj = inlineBlock
    
                inlineBlocks.push(inlineBlock.render())
            }
        }

        this.el = createElement('div', {
            class: 'page-line',
            style: {
                whiteSpace: 'nowrap',
                width: this.lineWidth+'px',
                //height: this.ls.lineHeight+'px',
            }
        }, inlineBlocks)

        return this.el
    }
}

export default PageLine