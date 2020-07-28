import PageInlineBlock from './PageInlineBlock'

import { createElement } from '../renderer'
import { measureFontTextWH, measureElePageXY, measureEleDocXY, measureLineMouseStartIndex } from '../measure.js'

import * as cursorProcess from '../process/cursorProcess'
import * as rangeProcess from '../process/rangeProcess'

class PageLine{
    constructor(ls){
        this.ls = ls
    }

    render(){
        var inlineBlocks = []
        for(var i = 0; i < this.ls.inlineBlocks.length; ++i){
            var ib = this.ls.inlineBlocks[i]
            if(ib.type == 'text' || ib.type == 'image' ){
                var inlineBlock = new PageInlineBlock(ib)
                ib.obj = inlineBlock
    
                inlineBlocks.push(inlineBlock.render())
            }
        }

        this.el = createElement('div', {
            class: 'page-line',
            style: {
                whiteSpace: 'nowrap',
                width: this.ls.lineWidth+'px',
                marginTop: this.ls.spacingHeight+'px',
                height: this.ls.lineHeight+'px',
                cursor: 'text',
                fontSize: 0,
            }
        }, inlineBlocks)

        window.goog.events.listen(this.el, window.goog.events.EventType.CLICK, this.clickLineHandler.bind(this));
        window.goog.events.listen(this.el, window.goog.events.EventType.MOUSEDOWN, this.mouseDownLineHandler.bind(this));
        window.goog.events.listen(this.el, window.goog.events.EventType.MOUSEMOVE, this.mouseMoveLineHandler.bind(this));
        window.goog.events.listen(this.el, window.goog.events.EventType.MOUSEUP, this.mouseUpLineHandler.bind(this));

        return this.el
    }

    mouseDownLineHandler(e){
        let resizer = e.target
        let dragger = new goog.fx.Dragger(resizer)
        rangeProcess.updateRangeSelectDragged(false)
        
        dragger.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {
            if(!state.document.rangeSelect.dragged){
                rangeProcess.updateRangeSelectDragged(true)

                let { inlineBlock, startIndex } = measureLineMouseStartIndex(this, e)
                rangeProcess.startRangeSelect(dragger, this.ls, inlineBlock, startIndex)
            }
            
        }.bind(this))

        dragger.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
            dragger.dispose();
        }.bind(this))

        dragger.startDrag(e);
    }

    mouseMoveLineHandler(e){
        if(state.document.rangeSelect.dragged && state.document.rangeSelect.dragger){
            let { inlineBlock, startIndex } = measureLineMouseStartIndex(this, e)
            rangeProcess.dragRangeSelect(this.ls, inlineBlock, startIndex)
        }
    }

    mouseUpLineHandler(e){
        let { inlineBlock, startIndex } = measureLineMouseStartIndex(this, e)
        rangeProcess.endRangeSelect(this.ls, inlineBlock, startIndex)
    }

    clickLineHandler(e){
        let found = false
        for(let i = 0; i < this.ls.inlineBlocks.length; ++i){
            let ib = this.ls.inlineBlocks[i]
            
            if(ib.type == 'text'){
                found = this.clickTextHandler(e, ib)     
            }else if(ib.type == 'image'){
                found = this.clickImageHandler(e, ib)
            }

            if(found){
                break
            }
        }

        if(!found){
            let ib = this.ls.inlineBlocks[this.ls.inlineBlocks.length-1]
            
            if(ib.type == 'text'){
                let si = Math.max(0, ib.text.length-1)
                let front = ib.text.length == 0 ? true : false;
                cursorProcess.setCursorInlineBlock({
                        inlineBlock: ib,
                        inlineStartIndex: si,
                        front: front,
                    }
                )    
            }else if(ib.type == 'image'){
                cursorProcess.setCursorInlineBlock({
                        inlineBlock: ib,
                        inlineStartIndex: 0,
                        front: false,
                    }
                )
            }
        }
    }

    clickTextHandler(e, ib){
        let docXY = measureElePageXY(document.getElementsByClassName('doc')[0])
        let elXY = measureEleDocXY(ib.obj.el)
        let pointLeft = e.clientX - docXY.x - elXY.x
        if(pointLeft < 0){
            return false
        }
        
        let front = false
        let lastw = 0
        let found = false
        for(var i = 1; i <= ib.text.length; ++i){
            let t = ib.text.substr(0, i)
            let wh = measureFontTextWH(t, ib.textStyle)

            if(wh.w >= pointLeft){
                let cw = wh.w - lastw

                if(pointLeft < lastw + cw / 2){
                    front = true
                }

                found = true
                break
            }

            lastw = wh.w
        }
        
        if(found){
            // update cursor
            cursorProcess.setCursorInlineBlock({
                    inlineBlock: ib,
                    inlineStartIndex: i-1,
                    front: front,
                }
            )
        }

        return found
    }

    clickImageHandler(e, ib){
        let docXY = measureElePageXY(document.getElementsByClassName('doc')[0])
        let elXY = measureEleDocXY(ib.obj.el)
        let pointLeft = e.clientX - docXY.x - elXY.x
        
        if(pointLeft < 0 || pointLeft > ib.imageStyle.width){
            return false;
        }
        
        let front = true
        if(ib.imageStyle.width / 2 < pointLeft){
            front = false
        }
        
        cursorProcess.setCursorInlineBlock({
                inlineBlock: ib,
                inlineStartIndex: 0,
                front: front,
            }
        )

        return true
    }
}

export default PageLine