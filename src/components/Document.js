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

        this.docEl = createElement('div', {
            class: 'doc',
            style: {
                position: 'absolute',
                marginTop: this.pageSpacingHeight+'px',
            },
        }, [ pageBgsWrap, pageParasWrap, docInputBox.render(), docCursor.render() ])

        this.el = createElement('div', {
            class: 'doc-wrap',
            style: {
                position: 'relative',
                width: '100%',
                overflow: 'auto',
                background: '#ebebeb',
            }
        }, [this.docEl])

        // handle viewport resize
        this.vsm = new window.goog.dom.ViewportSizeMonitor();
        window.goog.events.listen(this.vsm, goog.events.EventType.RESIZE, this.resizeHandler.bind(this));

        return this.el
    }

    resizeHandler(){
        this.el.style.height = (this.el.offsetParent.offsetHeight - this.el.offsetTop) + 'px'
        this.docEl.style.left = Math.max((this.docEl.offsetParent.offsetWidth - this.pageWidth) / 2, 0) + 'px'
    }
}

export default Document
