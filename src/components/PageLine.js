import PageInlineBlock from './PageInlineBlock'
import PageInlineEop from './PageInlineEop'

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
            }else if(ib.type == 'inline-eop'){
                var inlineEop = new PageInlineEop(ib)
                ib.obj = inlineEop
    
                inlineBlocks.push(inlineEop.render())
            }
            
        }

        this.el = createElement('div', {
            class: 'page-line',
            style: {
                whiteSpace: 'nowrap',
                width: this.lineWidth+'px',
            }
        }, inlineBlocks)

        return this.el
    }
}

export default PageLine