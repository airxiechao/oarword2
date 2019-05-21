import PageParagraph from './PageParagraph'
import PageTable from './PageTable'

import { createElement } from '../utils/renderer'
import state from '../utils/state'

class PageBody{
    constructor(lastPosBottom, body){
        this.pageWidth = body.doc.grid.pageWidth
        this.pageHeight = body.doc.grid.pageHeight
        this.pageSpacingHeight = body.doc.grid.pageSpacingHeight
        this.marginTop = body.doc.grid.marginTop
        this.marginRight = body.doc.grid.marginRight
        this.marginBottom = body.doc.grid.marginBottom
        this.marginLeft = body.doc.grid.marginLeft
        this.body = body
        this.bodyHeight = 0
        this.lastPosBottom = lastPosBottom

        state.mutations.setDocumentObj(this)
    }

    render(){
        // render paragraphs
        var pageParas = []
        for(let i = 0; i < this.body.pts.length; ++i){
            let para = this.body.pts[i]

            if(para.type == 'para'){
                let pagePara = new PageParagraph(this.marginLeft, para)
                para.obj = pagePara
    
                pageParas.push(pagePara.render())
                this.bodyHeight += para.paraHeight;
            }else if(para.type == 'table'){
                let pageTable = new PageTable(this.marginLeft, para)
                para.obj = pageTable

                pageParas.push(pageTable.render())
                this.bodyHeight += para.tableHeight
            }
            
        }
        
        this.el = createElement('div', {
            class: 'page-body',
            style: {
                position: 'absolute',
                top: '0px',
                left: '0px',
                paddingTop: this.lastPosBottom+'px',
            }
        }, pageParas)
        
        return this.el
    }
}

export default PageBody
