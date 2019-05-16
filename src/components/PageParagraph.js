import PageLine from './PageLine'

import { createElement } from '../utils/renderer'

class PageParagraph{
    constructor(posLeft, para){
        this.posLeft = posLeft
        this.para = para
    }
    
    render(){
        var pageLines = []
        for(var i = 0; i < this.para.lines.length; ++i){
            var ls = this.para.lines[i]

            if(ls.type == 'line'){
                // create a line
                var pageLine = new PageLine(ls)
                ls.obj = pageLine

                pageLines.push(pageLine.render())
            }
        }
        
        // create paragraph
        this.el =  createElement('div', {
            class: 'page-para',
            style: {
                marginLeft: this.posLeft+'px'
            }
        }, pageLines)

        return this.el
    }
}

export default PageParagraph