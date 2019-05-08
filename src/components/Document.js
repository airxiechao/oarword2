import PageBackground from './PageBackground'
import PageParagraph from './PageParagraph'
import DocCursor from './DocCursor'
import DocInputBox from './DocInputBox'

import { getPageNo } from '../utils/measure'
import { createElement } from '../utils/renderer'
import state from '../utils/state'

class Document{
    constructor(pageWidth, pageHeight, pageSpacingHeight, marginTop, marginRight, marginBottom, marginLeft, documentBody){
        this.pageWidth = pageWidth
        this.pageHeight = pageHeight
        this.pageSpacingHeight = pageSpacingHeight
        this.marginTop = marginTop
        this.marginRight = marginRight
        this.marginBottom = marginBottom
        this.marginLeft = marginLeft
        this.documentBody = documentBody

        state.mutations.setDocumentObj(this)
    }

    render(){
        // render paragraphs
        var lastPosBottom = this.marginTop;
        
        var pageParas = []
        for(let i = 0; i < this.documentBody.length; ++i){
            var para = this.documentBody[i]
            var pagePara = new PageParagraph(this.marginLeft, para)
            para.obj = pagePara

            pageParas.push(pagePara.render())
            lastPosBottom += para.paraHeight;
        }
        
        var pageNo = getPageNo(lastPosBottom, this.pageHeight, this.pageSpacingHeight)
        var pageParasWrap = createElement('div', {
            class: 'page-paras-wrap',
            style: {
                position: 'absolute',
                top: '0px',
                left: '0px',
                paddingTop: this.marginTop+'px',
            }
        }, pageParas)
        
        
        // render page backgrounds
        var pageBgs = []
        for(let i = 0; i < pageNo; ++i){
            var pageBg = new PageBackground(this.pageWidth, this.pageHeight, this.pageSpacingHeight, this.marginTop, 
                this.marginRight, this.marginBottom, this.marginLeft, i)
    
            pageBgs.push(pageBg.render())
        }
        
        var pageBgsWrap = createElement('div', {
            class: 'page-bgs-wrap',
            style: {
                position: 'absolute',
                top: '0px',
                left: '0px',
                height: (this.pageHeight+this.pageSpacingHeight)*pageNo+'px'
            }
        }, pageBgs)

        // render cursor
        var docCursor = new DocCursor()

        // render inputbox
        var docInputBox = new DocInputBox()

        this.el = createElement('div', {
            class: 'doc',
        }, [ pageBgsWrap, pageParasWrap, docInputBox.render(), docCursor.render() ])

        return this.el
    }
}

export default Document
