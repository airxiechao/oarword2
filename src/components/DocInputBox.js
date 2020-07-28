import { createElement, updateElement } from '../renderer'
import { buildTextStyleCss } from '../convert'
import state from '../state'

import * as runProcess from '../process/runProcess'
import * as copyProcess from '../process/copyProcess'
import * as historyProcess from '../process/historyProcess'
import * as cursorProcess from '../process/cursorProcess'
import * as rangeProcess from '../process/rangeProcess'
import * as inputProcess from '../process/inputProcess'
import * as toolbarProcess from '../process/toolbarProcess'

class DocInputBox{
    constructor(){
        this.cursorPosX = 0
        this.cursorPoxY = 0
        this.imeStatus = false
        this.dummy = null

        inputProcess.setInputBoxObj(this)
    }

    render(){
        this.el = createElement('div', {
            class: 'doc-inputbox',
            attrs: {
                contentEditable: true,
            },
            style: {
                position: 'absolute',
                left: this.cursorPosX + 'px',
                top: this.cursorPoxY + 'px',
                opacity: 0,
                pointerEvents: 'none',
                outline: 'none',
                whiteSpace: 'nowrap',
            }
        })

        window.goog.events.listen(this.el, window.goog.events.EventType.INPUT, this.inputHandler.bind(this));
        window.goog.events.listen(new window.goog.events.ImeHandler(this.el),
            window.goog.object.getValues(window.goog.events.ImeHandler.EventType), this.imeHandler.bind(this));
        window.goog.events.listen(this.el, window.goog.events.EventType.KEYDOWN, this.keydownHandler.bind(this));

        return this.el
    }

    updatePos(cursorPosX, cursorPosY){
        this.cursorPosX = cursorPosX
        this.cursorPoxY = cursorPosY
        updateElement(this.el, {
            style: {
                left: this.cursorPosX + 'px',
                top: this.cursorPoxY + 'px',
            }
        })

        this.el.focus()
        this.el.textContent = ''
    }

    inputHandler(e){
        if(!this.imeStatus){
            let text = this.el.textContent 

            if(rangeProcess.hasRangeSelectOverlays()){
                rangeProcess.deleteRangeSelectInlineBlock()
            }
            
            if(text != ''){
                runProcess.addTextToParaRun({
                    text: text,
                    textStyle: toolbarProcess.cloneToolbarTextStyle(),
                })
                this.el.textContent = ''

                historyProcess.pushToHistory()
            }
        }else{
            var ib = state.document.cursor.inlineBlock
            var front = state.document.cursor.front
            if(ib.type == 'text'){
                var si = state.document.cursor.inlineStartIndex + (front ? 0 : 1)
            
                var text = ib.text
                var leftText = text.substr(0, si)
                var rightText = text.substr(si)
                var midText = this.el.textContent
                var leftTextStyle = ib.textStyle
                var midTextStyle = toolbarProcess.cloneToolbarTextStyle()
    
                var leftTextStyleCss = buildTextStyleCss(leftTextStyle)
                leftTextStyleCss['display'] = 'inline-block'
                leftTextStyleCss['height'] = ib.inlineHeight + 'px'
                var leftDummy = createElement('div', {
                    style: leftTextStyleCss
                }, [
                    window.goog.dom.createTextNode(leftText)
                ])
    
                var midTextStyleCss = buildTextStyleCss(midTextStyle)
                midTextStyleCss['textDecoration'] = 'underline'
                midTextStyleCss['display'] = 'inline-block'
                var midDummy = createElement('div', {
                    style: midTextStyleCss
                }, [
                    window.goog.dom.createTextNode(midText)
                ])
    
                let dummyComponents = []
                if(rightText){
                    var rightDummy = createElement('div',  {
                        style: leftTextStyleCss
                    }, [
                        window.goog.dom.createTextNode(rightText)
                    ])
    
                    dummyComponents =  [
                        leftDummy, midDummy, rightDummy
                    ]
                }else{
                    dummyComponents =  [
                        leftDummy, midDummy
                    ]
                }
                
                var dummy = createElement('div', {
                    style: {
                        class: 'input-dummy',
                        display: 'inline-block',
                        height: ib.inlineHeight + 'px',
                    }
                }, dummyComponents)
    
                if(this.dummy){
                    this.dummy.remove()
                }
                this.dummy = dummy
    
                ib.obj.el.style.display = 'none'
                window.goog.dom.insertSiblingAfter(this.dummy, ib.obj.el)
            }else if(ib.type == 'image'){
                var midText = this.el.textContent
                var midTextStyle = toolbarProcess.cloneToolbarTextStyle()
                
                var midTextStyleCss = buildTextStyleCss(midTextStyle)
                midTextStyleCss['textDecoration'] = 'underline'
                midTextStyleCss['display'] = 'inline-block'
                var midDummy = createElement('div', {
                    style: midTextStyleCss
                }, [
                    window.goog.dom.createTextNode(midText)
                ])
    
                let dummyComponents = [midDummy]
                
                var dummy = createElement('div', {
                    style: {
                        class: 'input-dummy',
                        display: 'inline-block',
                        //height: ib.inlineHeight + 'px',
                    }
                }, dummyComponents)
    
                if(this.dummy){
                    this.dummy.remove()
                }
                this.dummy = dummy
                
                if(front){
                    window.dom.insertSiblingBefore(this.dummy, ib.obj.el)
                }else{
                    window.goog.dom.insertSiblingAfter(this.dummy, ib.obj.el)
                }
                
            }
            
        }
    }

    imeHandler(e){
        if(e.type == 'startIme' ) {
            if(rangeProcess.hasRangeSelectOverlays()){
                rangeProcess.deleteRangeSelectInlineBlock()
            }
            
            this.imeStatus = true
            inputProcess.setImeStatus(this.imeStatus)

        } else if(e.type == 'endIme' ) {
            runProcess.addTextToParaRun({
                text: this.el.textContent,
                textStyle: toolbarProcess.cloneToolbarTextStyle(),
            })
            this.el.textContent = ''

            this.imeStatus = false
            inputProcess.setImeStatus(this.imeStatus)

            var ib = state.document.cursor.inlineBlock
            ib.obj.el.style.display = 'inline-block'
            if(this.dummy){
                this.dummy.remove()
            }

            historyProcess.pushToHistory()

        } else if(e.type == 'updateIme') {
            
        }
    }

    keydownHandler(e){
        if(e.ctrlKey ) {
            e.stopPropagation();
            e.preventDefault();
        }

        switch(e.keyCode) {
            // hot kes: ctrl+f
            case 70: {
                if(e.ctrlKey ) {

                }
                break;
            }
            // hot keys: ctrl+z
            case 90: {
                if( e.ctrlKey ) {
                    historyProcess.goBackwardHistory()
                }
    
                break;
            }
            // hot keys: ctrl+y
            case 89: {
                if( e.ctrlKey ) {
                    historyProcess.goForwardHistory()
                }
    
                break;
            }
            // hot keys: ctrl+c
            case 67: {
                if( e.ctrlKey ) {
                    if(rangeProcess.hasRangeSelectOverlays()){
                        let docPts = rangeProcess.getRangeSelectDocPts()
                        copyProcess.setCopy(docPts)
                    }
                }
    
                break;
            }
            // hot keys: ctrl+v
            case 86: {
                if( e.ctrlKey ) {
                    if(rangeProcess.hasRangeSelectOverlays()){
                        rangeProcess.deleteRangeSelectInlineBlock()
                    }

                    copyProcess.pasteCopy()

                    historyProcess.pushToHistory()
                }
    
                break;
            }
            // hot keys: ctrl+x
            case 88: {
                if( e.ctrlKey ) {
                    if(rangeProcess.hasRangeSelectOverlays()){
                        let docPts = rangeProcess.getRangeSelectDocPts()
                        copyProcess.setCopy(docPts)

                        rangeProcess.deleteRangeSelectInlineBlock()

                        historyProcess.pushToHistory()
                    }
                }
    
                break;
            }
            // key delete
            case 8:
            {
                if(rangeProcess.hasRangeSelectOverlays()){
                    rangeProcess.deleteRangeSelectInlineBlock()
                }else{
                    runProcess.deleteFromParaRun()
                }

                historyProcess.pushToHistory()

                break;
            }
            // key enter
            case 13:
            {
                if(rangeProcess.hasRangeSelectOverlays()){
                    rangeProcess.deleteRangeSelectInlineBlock()
                }
                runProcess.splitParaRun()

                historyProcess.pushToHistory()

                break;
            }
            // left
            case 37:
            {
                cursorProcess.leftMoveCursor()
                break;
            }
            // up
            case 38:
            {
                cursorProcess.upMoveCursor()
                break;
            }
            // right
            case 39:
            {
                cursorProcess.rightMoveCursor()
                break;
            }
            // down
            case 40:
            {
                cursorProcess.downMoveCursor()
                break;
            }
        }
    }
}

export default DocInputBox