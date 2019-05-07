import { measureFontTextWH, getCursorPos, getPageLeftHeight } from './measure'
import { getPagePara, getPageParas, getDocParaOfRun, 
    getPreviousInlineOfBody, getNextInlineOfBody, getPreviousLineOfBody, getNextLineOfBody } from './convert'
import { getPageNo } from '../utils/measure'

import PageParagraph from '../components/PageParagraph'
import PageSpacing from '../components/PageSpacing'
import PageBackground from '../components/PageBackground'

var state = {
    document: {
        cursor: {
            inlineBlock: null,
            inlineStartIndex: -1,
            front: false,
        },
        inputBox: {

        },
        doc: [],
        body: [],
        marginTop: 100,
        pageWidth: 500,
        pageHeight: 300,
        pageSpacingHeight: 10,
        marginRight: 100,
        marginBottom: 100,
        marginLeft: 100,
    },
    getters: {
        cursorInlineBlock: function(){
            return state.document.cursor.inlineBlock
        },
        cursorDocIndex: function(){
            var cb = state.getters.cursorInlineBlock()
            var cbPara = getDocParaOfRun(state.document.doc, cb.doc)
            var paraIndex = state.document.doc.indexOf(cbPara)
            var runIndex = state.document.doc[paraIndex].indexOf(cb.doc)
            var startIndex = cb.startIndex + state.document.cursor.inlineStartIndex

            return {
                paraIndex: paraIndex,
                runIndex: runIndex,
                startIndex: startIndex,
            }
        },
        cursorPos: function(){
            var cursorInlineBlock = state.getters.cursorInlineBlock()
            var pos = getCursorPos(cursorInlineBlock, state.document.cursor.inlineStartIndex, state.document.cursor.front)
            return pos
        },
    },
    mutations: {
        setDocumentObj: function(obj){
            state.document.obj = obj
        },
        setCursorObj: function(obj){
            state.document.cursor.obj = obj
        },
        setInputBoxObj: function(obj){
            state.document.inputBox.obj = obj
        },
        setDocument: function(doc){
            var documentBody = getPageParas(doc, state.document.marginTop, 
                state.document.pageWidth, state.document.pageHeight, state.document.pageSpacingHeight, 
                state.document.marginTop, state.document.marginRight, state.document.marginBottom, state.document.marginLeft)

            state.document.doc = doc
            state.document.body = documentBody
        },
        setCursorInlineBlock: function(payload){
            state.document.cursor.inlineBlock = payload.inlineBlock
            state.document.cursor.inlineStartIndex = payload.inlineStartIndex
            state.document.cursor.front = payload.front

            state.mutations._updateCursorAndInputBoxPos()
        },
        leftMoveCursor: function(){
            var ci = state.getters.cursorDocIndex()
            var runIndex = ci.runIndex

            if(!state.document.cursor.front){
                state.document.cursor.front = true
            }else{
                if(state.document.cursor.inlineStartIndex > 0){
                    state.document.cursor.inlineStartIndex -= 1
                }else{
                    // get left inline block of body
                    let lastib = getPreviousInlineOfBody(state.document.body, state.document.cursor.inlineBlock)
                    if(lastib){
                        state.document.cursor.inlineBlock = lastib
                        state.document.cursor.inlineStartIndex = lastib.text.length - 1
                        state.document.cursor.front = runIndex == 0 ? false : true
                    }
                }
            }

            state.mutations._updateCursorAndInputBoxPos()
        },
        rightMoveCursor: function(){
            if(state.document.cursor.front){
                state.document.cursor.front = false
            }else{
                if(state.document.cursor.inlineStartIndex < state.document.cursor.inlineBlock.text.length - 1){
                    state.document.cursor.inlineStartIndex += 1
                }else if(state.document.cursor.inlineStartIndex == state.document.cursor.inlineBlock.text.length - 1){
                    // get right inline block of body
                    let nextib = getNextInlineOfBody(state.document.body, state.document.cursor.inlineBlock)
                    if(nextib){
                        let para = getDocParaOfRun(state.document.doc, nextib.doc)
                        let paraIndex = state.document.doc.indexOf(para)
                        let runIndex = state.document.doc[paraIndex].indexOf(nextib.doc)

                        state.document.cursor.inlineBlock = nextib
                        state.document.cursor.inlineStartIndex = 0
                        state.document.cursor.front = runIndex == 0 ? true : false
                    }
                }
            }

            state.mutations._updateCursorAndInputBoxPos()
        },
        upMoveCursor: function(){
            let cx = state.document.cursor.obj.el.offsetLeft

            let lastline = getPreviousLineOfBody(state.document.body, state.document.cursor.inlineBlock)
            if(lastline){
                let ib = null
                let si = -1
                let front = false
                for(let i = 0; i < lastline.inlineBlocks.length; ++i){
                    ib = lastline.inlineBlocks[i]
                    let lx = ib.obj.el.offsetLeft
                    let lw = ib.obj.el.offsetWidth

                    if(cx >= lx && cx <= lx + lw){
                        let lastw = 0
                        for(let j = 1; j <= ib.text.length; ++j){
                            let t = ib.text.substr(0, j)
                            let wh = measureFontTextWH(t, '', '', '')
                
                            if(wh.w + lx > cx ){
                                si = j - 1

                                if( lx + lastw + (wh.w - lastw) / 2 > cx ){
                                    front = true
                                }else{
                                    front = false
                                }

                                break
                            }

                            lastw = wh.w
                        }

                        if(si >= 0){
                            break
                        }
                    }
                }

                if(si < 0){
                    si = ib.text.length - 1
                }

                state.document.cursor.inlineBlock = ib
                state.document.cursor.inlineStartIndex = si
                state.document.cursor.front = front
            }

            state.mutations._updateCursorAndInputBoxPos()
        },
        downMoveCursor: function(){
            let cx = state.document.cursor.obj.el.offsetLeft

            var nextline = getNextLineOfBody(state.document.body, state.document.cursor.inlineBlock)
            if(nextline){
                let ib = null
                let si = -1
                let front = false
                for(let i = 0; i < nextline.inlineBlocks.length; ++i){
                    ib = nextline.inlineBlocks[i]
                    let lx = ib.obj.el.offsetLeft
                    let lw = ib.obj.el.offsetWidth

                    if(cx >= lx && cx <= lx + lw){
                        let lastw = 0
                        for(let j = 1; j <= ib.text.length; ++j){
                            let t = ib.text.substr(0, j)
                            let wh = measureFontTextWH(t, '', '', '')
                
                            if(wh.w + lx > cx ){
                                si = j - 1

                                if( lx + lastw + (wh.w - lastw) / 2 > cx ){
                                    front = true
                                }else{
                                    front = false
                                }

                                break
                            }

                            lastw = wh.w
                        }

                        if(si >= 0){
                            break
                        }
                    }
                }

                if(si < 0){
                    si = ib.text.length - 1
                }

                state.document.cursor.inlineBlock = ib
                state.document.cursor.inlineStartIndex = si
                state.document.cursor.front = front
            }

            state.mutations._updateCursorAndInputBoxPos()
        },
        setImeStatus: function(imeStatus){
            var cursor = state.document.cursor.obj
            cursor.updateVisibility(!imeStatus)
        },
        addToParaRun: function(payload){
            var text = payload.text
            var textStyle = payload.textStyle

            var ci = state.getters.cursorDocIndex()
            var paraIndex = ci.paraIndex
            var runIndex = ci.runIndex
            var startIndex = ci.startIndex
            var front = state.document.cursor.front
            
            // update run text
            state.mutations._spliceRunText(paraIndex, runIndex, front ? startIndex : startIndex + 1, text, textStyle)

            // update document paragraph
            var lastPosBottom = state.mutations._updatePara(paraIndex)
            
            // update page background
            state.mutations._updatePageBackground(lastPosBottom)

            // update cursor
            state.mutations._updateCursor(paraIndex, runIndex, startIndex + text.length)
        },
        deleteFromParaRun: function(){
            var ci = state.getters.cursorDocIndex()
            var front = state.document.cursor.front
            var paraIndex = ci.paraIndex
            var runIndex = ci.runIndex
            var startIndex = ci.startIndex
            var para = state.document.doc[paraIndex]
            var run = para[runIndex]

            if(!front){
                state.mutations._deleteRunText(paraIndex, runIndex, startIndex)
                
                if(run.text == ''){
                    if(runIndex >= 1 || (runIndex == 0 && para.length > 1)){
                        para.splice(runIndex, 1)

                        if(runIndex == 0){
                            startIndex = 0
                            front = true
                        }else{
                            let lastib = getPreviousInlineOfBody(state.document.body, state.document.cursor.inlineBlock)
                            let p = getDocParaOfRun(state.document.doc, lastib.doc)
                            paraIndex = state.document.doc.indexOf(p)
                            runIndex = state.document.doc[paraIndex].indexOf(lastib.doc)
                            startIndex = lastib.text.length - 1
                            front = false
                        }
                    }else{
                        front = true
                    }
                }else{
                    if(startIndex > 0){
                        startIndex -= 1
                    }else{
                        front = true
                    }
                }
            }else{
                if(startIndex > 0){
                    startIndex -= 1
                    state.mutations._deleteRunText(paraIndex, runIndex, startIndex)
                }else{
                    if(runIndex == 0){
                        if(paraIndex > 0){
                            // merge to previous paragraph
                            state.mutations._mergePreviousPara(paraIndex)

                            let lastib = getPreviousInlineOfBody(state.document.body, state.document.cursor.inlineBlock)
                            if(lastib){
                                let p = getDocParaOfRun(state.document.doc, lastib.doc)
                                paraIndex = state.document.doc.indexOf(p)
                                runIndex = state.document.doc[paraIndex].indexOf(lastib.doc)
                                startIndex = lastib.text.length - 1

                                
                            }
                            front = false
                        }
                    }else{
                        let lastib = getPreviousInlineOfBody(state.document.body, state.document.cursor.inlineBlock)
                        if(lastib){
                            let p = getDocParaOfRun(state.document.doc, lastib.doc)
                            paraIndex = state.document.doc.indexOf(p)
                            runIndex = state.document.doc[paraIndex].indexOf(lastib.doc)
                            startIndex = lastib.text.length - 1

                            // delete previous inline block's text
                            state.mutations._deleteRunText(paraIndex, runIndex, startIndex)

                            startIndex -= 1
                            front = false
                        }

                        
                    }

                    
                    
                }
            }

            // update document paragraph
            var lastPosBottom = state.mutations._updatePara(paraIndex)
                
            // update page background
            state.mutations._updatePageBackground(lastPosBottom)

            // update cursor
            state.mutations._updateCursor(paraIndex, runIndex, startIndex, front)
        },
        _mergePreviousPara(paraIndex){
            if(paraIndex > 0){
                var prePara = state.document.doc[paraIndex-1]
                var para = state.document.doc[paraIndex]

                for(let i = 0; i < para.length; ++i){
                    let r = para[i]
                    if(r.text != ''){
                        prePara.push(para[i])
                    }
                }

                state.document.doc.splice(paraIndex, 1)
                state.document.body[paraIndex].obj.el.remove()
                state.document.body.splice(paraIndex, 1)
            }
            
        },
        _deleteRunText(paraIndex, runIndex, startIndex){
            var para = state.document.doc[paraIndex]
            var run = para[runIndex]
            var leftText = run.text.substr(0, startIndex)
            var rightText = run.text.substr(startIndex+1)

            run.text = leftText + rightText
        },
        _spliceRunText(paraIndex, runIndex, startIndex, text, textStyle){
            var run = state.document.doc[paraIndex][runIndex]
            var leftText = run.text.substr(0, startIndex)
            var rightText = run.text.substr(startIndex)

            run.text = leftText + text + rightText
        },
        _updatePara(paraIndex){
            
            // skip previous page paragraphs
            var lastPosBottom = state.document.marginTop
            for(let i = 0 ; i < paraIndex; ++i){
                lastPosBottom += state.document.body[i].paraHeight
            }

            // recreate current page paragraphs
            var oldPara = state.document.body[paraIndex]
            var newPara = getPagePara(state.document.doc[paraIndex], lastPosBottom,
                state.document.pageWidth, state.document.pageHeight, state.document.pageSpacingHeight, 
                state.document.marginTop, state.document.marginRight, state.document.marginBottom, state.document.marginLeft)
            state.document.body.splice(paraIndex, 1, newPara)

            var newPagePara = new PageParagraph(state.document.marginLeft, state.document.pageWidth - state.document.marginLeft - state.document.marginRight, newPara)
            var oldPagePara = oldPara.obj.el
            newPara.obj = newPagePara
            window.goog.dom.replaceNode(newPagePara.render(), oldPagePara)
            
            // adjust following page paragraph spacing
            lastPosBottom += newPara.paraHeight
            for(let i = paraIndex + 1; i < state.document.body.length; ++i){
                var pagePara = state.document.body[i]
                var paraHeight = 0

                for(let j = 0; j < pagePara.linesAndSpacings.length; ++j){
                    var ls = pagePara.linesAndSpacings[j]
                    if(ls.type == 'line'){
                        // check paragraph height
                        var leftHeight = getPageLeftHeight(lastPosBottom, state.document.marginBottom, state.document.pageHeight, state.document.pageSpacingHeight)
                        if(ls.lineHeight > leftHeight){
                            // create new page spacing
                            var spacingHeight = leftHeight + state.document.marginBottom + state.document.pageSpacingHeight + state.document.marginTop
                            var spacing = {
                                spacingHeight: spacingHeight,
                                type: 'spacing',
                            }
                            
                            lastPosBottom += spacingHeight
                            paraHeight += spacingHeight

                            pagePara.linesAndSpacings.splice(j-1, 0, spacing)
                            
                            var pageSpacing = new PageSpacing(0, { spacingHeight: spacingHeight})
                            spacing.obj = pageSpacing
                            window.goog.dom.insertSiblingBefore(pageSpacing.render(), ls.obj.el)

                            j += 1
                        }
                        
                        lastPosBottom += ls.lineHeight
                        paraHeight += ls.lineHeight
                    }else if(ls.type == 'spacing'){
                        // remove old page spacing
                        pagePara.linesAndSpacings.splice(j, 1)
                        j -= 1

                        ls.obj.el.remove()
                    }
                }

                pagePara.paraHeight = paraHeight
            }

            return lastPosBottom
        },
        _updatePageBackground(lastPosBottom){
            var pageNo = getPageNo(lastPosBottom, state.document.pageHeight, state.document.pageSpacingHeight)
            var bgWrap = document.getElementsByClassName('page-bgs-wrap')[0]
            var oldBgs = document.getElementsByClassName('page-bg')
            if(pageNo > oldBgs.length){
                for(let i = 0; i < pageNo - oldBgs.length; ++i){
                    var pageBg = new PageBackground(state.document.pageWidth, state.document.pageHeight, state.document.pageSpacingHeight, state.document.marginTop, 
                        state.document.marginRight, state.document.marginBottom, state.document.marginLeft, oldBgs.length+i)
                    window.goog.dom.appendChild(bgWrap, pageBg.render())
                }
            }else if(pageNo < oldBgs.length){
                for(let i = oldBgs.length; i > pageNo; --i){
                    oldBgs[i-1].remove()
                }
            }

            bgWrap.style.height = (state.document.pageHeight+state.document.pageSpacingHeight)*pageNo+'px'
        },
        _updateCursor(paraIndex, runIndex, startIndex, front){
            var nextStartIndex = startIndex
            var para = state.document.body[paraIndex]
            for(let i = 0; i < para.linesAndSpacings.length; ++i){
                let ls = para.linesAndSpacings[i]
                if(ls.type == 'spacing'){
                    continue
                }

                for(let j = 0; j < ls.inlineBlocks.length; ++j){
                    let ib = ls.inlineBlocks[j]
                    let ibRunIndex = para.doc.indexOf(ib.doc)
                    
                    if(ibRunIndex == runIndex){
                        if(nextStartIndex >= ib.startIndex && nextStartIndex <= ib.startIndex + ib.text.length ){
                            state.document.cursor.inlineBlock = state.document.body[paraIndex].linesAndSpacings[i].inlineBlocks[j]
                            state.document.cursor.inlineStartIndex = nextStartIndex - ib.startIndex
                            if(front !== undefined){
                                state.document.cursor.front = front
                            }
                            
                        } 
                    }
                }
            }

            state.mutations._updateCursorAndInputBoxPos()
        },
        _updateCursorAndInputBoxPos: function(){
            // update cursor ui
            var cursor = state.document.cursor.obj
            var pos = state.getters.cursorPos()
            cursor.updatePos(pos.cursorPosX, pos.cursorPosY, pos.cursorHeight)

            // update inputbox ui
            var inputBox = state.document.inputBox.obj
            inputBox.updatePos(pos.cursorPosX, pos.cursorPosY)
        },
    },
}

window.state = state

export default state