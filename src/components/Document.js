import PageBackground from './PageBackground'
import PageBody from './PageBody'
import DocCursor from './DocCursor'
import DocInputBox from './DocInputBox'
import DocImageResizer from './DocImageResizer'

import { getPageNo } from '../measure'
import { createElement } from '../renderer'

import * as documentProcess from '../process/documentProcess'

class Document{
    constructor(body){
        this.pageWidth = body.doc.grid.pageWidth
        this.pageHeight = body.doc.grid.pageHeight
        this.pageSpacingHeight = body.doc.grid.pageSpacingHeight
        this.marginTop = body.doc.grid.marginTop
        this.marginRight = body.doc.grid.marginRight
        this.marginBottom = body.doc.grid.marginBottom
        this.marginLeft = body.doc.grid.marginLeft
        this.body = body
        
        documentProcess.setDocumentObj(this)
    }

    render(){
        // render paragraphs
        var lastPosBottom = this.marginTop;

        var pageBody = new PageBody(lastPosBottom, this.body)
        this.body.obj = pageBody
        lastPosBottom += this.body.bodyHeight
        var pageNo = getPageNo(lastPosBottom, this.pageHeight, this.pageSpacingHeight)
        
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

        // render image resizer
        var docImageResizer = new DocImageResizer()

        this.docEl = createElement('div', {
            class: 'doc',
            style: {
                position: 'absolute',
                marginTop: this.pageSpacingHeight+'px',
            },
        }, [ pageBgsWrap, pageBody.render(), docInputBox.render(), docImageResizer.render(), docCursor.render() ])

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
