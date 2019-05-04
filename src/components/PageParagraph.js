import PageSpacing from './PageSpacing'
import PageLine from './PageLine'

import { createElement } from '../utils/renderer'
import state from '../utils/state'

class PageParagraph{
    constructor(posLeft, posTop, paraWidth, linesAndSpacings, paraIndex){
        this.posLeft = posLeft
        this.posTop = posTop
        this.paraWidth = paraWidth
        this.linesAndSpacings = linesAndSpacings
        this.paraIndex = paraIndex

        state.mutations.setParaObj(this.paraIndex, this)
    }
    
    render(){
        var pageLinesAndSpacings = []
        for(var i = 0; i < this.linesAndSpacings.length; ++i){
            var ls = this.linesAndSpacings[i]

            if(ls.type == 'spacing'){
                // create a page spacing
                var pageSpacing = new PageSpacing(0, ls.spacingHeight, this.paraIndex, i)
                pageLinesAndSpacings.push(pageSpacing.render())
                
            }else if(ls.type == 'line'){
                // create a line
                var pageLine = new PageLine(this.paraWidth, ls.inlineBlocks, this.paraIndex, i)
                pageLinesAndSpacings.push(pageLine.render())
            }
        }
        
        // create paragraph
        this.el =  createElement('div', {
            class: 'page-para',
            style: {
                marginLeft: this.posLeft+'px'
            }
        }, pageLinesAndSpacings)

        return this.el
    }
}

export default PageParagraph