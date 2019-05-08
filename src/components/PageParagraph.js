import PageLine from './PageLine'

import { createElement } from '../utils/renderer'
import state from '../utils/state'

class PageParagraph{
    constructor(posLeft, para){
        this.posLeft = posLeft
        this.para = para
    }
    
    render(){
        var pageLinesAndSpacings = []
        for(var i = 0; i < this.para.linesAndSpacings.length; ++i){
            var ls = this.para.linesAndSpacings[i]

            if(ls.type == 'line'){
                // create a line
                var pageLine = new PageLine(ls)
                ls.obj = pageLine

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