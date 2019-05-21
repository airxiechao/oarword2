import { measureFontTextWH, getCursorPos, getPageLeftHeight } from './measure'
import { getPagePara, getPageBody, getDocParaOfRun, getPreviousInlineOfBody, 
    getNextInlineOfBody, getPreviousLineOfBody, getNextLineOfBody, getInlineBlockBodyIndex } from './convert'
import { getPageNo } from '../utils/measure'

import PageParagraph from '../components/PageParagraph'
import PageBackground from '../components/PageBackground'

var state = {
    document: {
        cursor: {
            inlineBlock: null,
            inlineStartIndex: -1,
            front: false,
        },
        inputBox: {},
        body: null,
    },
    getters: {
        cursorInlineBlock: function(){
            return state.document.cursor.inlineBlock
        },
        cursorBodyIndex: function(){
            let cb = state.getters.cursorInlineBlock()
            let bi = getInlineBlockBodyIndex(cb)

            return {
                body: bi.body,
                paraIndex: bi.paraIndex,
                runIndex: bi.runIndex,
                startIndex: bi.startIndex,
            }
        },
        cursorPos: function(){
            let cursorInlineBlock = state.getters.cursorInlineBlock()
            let pos = getCursorPos(cursorInlineBlock, state.document.cursor.inlineStartIndex, state.document.cursor.front)
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
            var body = getPageBody(doc, doc.grid.marginTop).pageBody
            
            state.document.body = body
        },
        setCursorInlineBlock: function(payload){
            state.document.cursor.inlineBlock = payload.inlineBlock
            state.document.cursor.inlineStartIndex = payload.inlineStartIndex
            state.document.cursor.front = payload.front

            state.mutations._updateCursorAndInputBoxPos()
        },
        leftMoveCursor: function(){
            let ci = state.getters.cursorBodyIndex()
            let runIndex = ci.runIndex

            if(!state.document.cursor.front && state.document.cursor.inlineBlock.text.length > 0){
                state.document.cursor.front = true
            }else{
                if(state.document.cursor.inlineStartIndex > 0){
                    state.document.cursor.inlineStartIndex -= 1
                }else{
                    // get left inline block of body
                    let lastib = getPreviousInlineOfBody(state.document.cursor.inlineBlock)
                    if(lastib){
                        state.document.cursor.inlineBlock = lastib
                        state.document.cursor.inlineStartIndex = lastib.text.length > 0 ? lastib.text.length - 1 : 0
                        state.document.cursor.front = runIndex == 0 ? false : true
                    }
                }
            }

            state.mutations._updateCursorAndInputBoxPos()
        },
        rightMoveCursor: function(){
            if(state.document.cursor.front && state.document.cursor.inlineBlock.text.length > 0){
                state.document.cursor.front = false
            }else{
                if(state.document.cursor.inlineStartIndex < state.document.cursor.inlineBlock.text.length - 1){
                    state.document.cursor.inlineStartIndex += 1
                }else{
                    // get right inline block of body
                    let nextib = getNextInlineOfBody(state.document.cursor.inlineBlock)
                    if(nextib){
                        let ci = getInlineBlockBodyIndex(nextib)
                        let runIndex = ci.runIndex

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

            let lastline = getPreviousLineOfBody(state.document.cursor.inlineBlock)
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
                    if(ib.text.length > 0){
                        si = ib.text.length - 1
                    }else{
                        si = 0
                        front = true
                    }
                }

                state.document.cursor.inlineBlock = ib
                state.document.cursor.inlineStartIndex = si
                state.document.cursor.front = front
            }

            state.mutations._updateCursorAndInputBoxPos()
        },
        downMoveCursor: function(){
            let cx = state.document.cursor.obj.el.offsetLeft

            var nextline = getNextLineOfBody(state.document.cursor.inlineBlock)
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
                    if(ib.text.length > 0){
                        si = ib.text.length - 1
                    }else{
                        si = 0
                        front = true
                    }
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
            let text = payload.text
            let textStyle = payload.textStyle

            let ci = state.getters.cursorBodyIndex()
            let body = ci.body
            let paraIndex = ci.paraIndex
            let runIndex = ci.runIndex
            let startIndex = ci.startIndex
            let front = state.document.cursor.front
            
            // update run text
            state.mutations._spliceRunText(body.doc, paraIndex, runIndex, front ? startIndex : startIndex + 1, text, textStyle)

            // update document paragraph
            let lastPosBottom = state.mutations._updatePara(body, paraIndex)
            
            // update page background
            state.mutations._updatePageBackground(body.doc, lastPosBottom)

            // update cursor
            let si = startIndex + text.length
            let len = body.doc.pts[paraIndex].runs[runIndex].text.length
            if(si >= len){
                state.mutations._updateCursor(body, paraIndex, runIndex, Math.max(len - 1, 0), false)
            }else{
                state.mutations._updateCursor(body, paraIndex, runIndex, si)
            }
        },
        deleteFromParaRun: function(){
            var ci = state.getters.cursorBodyIndex()
            var front = state.document.cursor.front
            var body = ci.body
            var paraIndex = ci.paraIndex
            var runIndex = ci.runIndex
            var startIndex = ci.startIndex
            var para = body.doc.pts[paraIndex]
            var run = para.runs[runIndex]

            if(!front){
                state.mutations._deleteRunText(body.doc, paraIndex, runIndex, startIndex)
                
                if(run.text == ''){
                    if(runIndex >= 1 || (runIndex == 0 && para.runs.length > 1)){
                        para.runs.splice(runIndex, 1)

                        if(runIndex == 0){
                            startIndex = 0
                            front = true
                        }else{
                            let lastib = getPreviousInlineOfBody(state.document.cursor.inlineBlock)
                            let p = getDocParaOfRun(body.doc, lastib.doc)
                            paraIndex = body.doc.pts.indexOf(p)
                            runIndex = body.doc.pts[paraIndex].runs.indexOf(lastib.doc)
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
                    state.mutations._deleteRunText(body.doc, paraIndex, runIndex, startIndex)
                }else{
                    if(runIndex == 0){
                        if(paraIndex > 0){
                            // merge to previous paragraph
                            let pi = paraIndex - 1
                            let ri = body.doc.pts[pi].runs.length - 1
                            let si = body.doc.pts[pi].runs[ri].text.length - 1

                            state.mutations._mergePreviousPara(body, paraIndex)
                            paraIndex = pi
                            runIndex = ri
                            startIndex = si
                            if(startIndex < 0){
                                startIndex = 0
                            }
                            front = false
                            if(si < 0){
                                front = true
                            }
                        }
                    }else{
                        runIndex -= 1
                        startIndex = body.doc.pts[paraIndex].runs[runIndex].text.length - 1

                        // delete previous inline block's text
                        state.mutations._deleteRunText(body.doc, paraIndex, runIndex, startIndex)

                        startIndex -= 1
                        front = false
                    }
                }
            }

            // update document paragraph
            var lastPosBottom = state.mutations._updatePara(body, paraIndex)
                
            // update page background
            state.mutations._updatePageBackground(body.doc, lastPosBottom)

            // update cursor
            state.mutations._updateCursor(body, paraIndex, runIndex, startIndex, front)
        },
        splitParaRun: function(){
            var ci = state.getters.cursorBodyIndex()
            var body = ci.body
            var paraIndex = ci.paraIndex
            var runLen = body.doc.pts[paraIndex].runs.length
            var runIndex = ci.runIndex
            var textLen = body.doc.pts[paraIndex].runs[runIndex].text.length
            var startIndex = ci.startIndex
            var front = state.document.cursor.front
            
            if(runIndex == 0 && startIndex == 0 && front){
                // add paragraph before
                let lastPosBottom = state.mutations._addEmptyParaBefore(body, paraIndex)

                // update page background
                state.mutations._updatePageBackground(body.doc, lastPosBottom)

                // update cursor
                state.mutations._updateCursor(body, paraIndex+1, 0, 0)
            }else if(runIndex == runLen - 1 && startIndex == textLen - 1 && !front){
                // add paragraph after
                let lastPosBottom = state.mutations._addEmptyParaAfter(body, paraIndex)

                // update page background
                state.mutations._updatePageBackground(body.doc, lastPosBottom)

                // update cursor
                state.mutations._updateCursor(body, paraIndex+1, 0, 0, true)
            }else{
                let lastPosBottom = state.mutations._splitParaInner(body, paraIndex, runIndex, front ? startIndex : startIndex + 1)
                
                // update page background
                state.mutations._updatePageBackground(body.doc, lastPosBottom)

                // update cursor
                state.mutations._updateCursor(body, paraIndex+1, 0, 0, true)
            }
        },
        _splitParaInner(body, paraIndex, runIndex, startIndex){
            // skip previous page paragraphs
            var lastPosBottom = body.doc.grid.marginTop
            for(let i = 0 ; i < paraIndex; ++i){
                lastPosBottom += body.pts[i].paraHeight
            }

            // split paragraph
            var para = body.doc.pts[paraIndex]
            var oldRun = para.runs[runIndex]
            var leftRun = {
                text: oldRun.text.substr(0, startIndex),
                textStyle : oldRun.textStyle,
            }
            var rightRun = {
                text: oldRun.text.substr(startIndex),
                textStyle : oldRun.textStyle,
            }

            var leftPara = {
                runs: [],
                type: 'para',
            }
            var rightPara = {
                runs: [],
                type: 'para',
            }
            for(let i = 0; i < para.runs.length; ++i){
                if(i < runIndex){
                    leftPara.runs.push(para.runs[i])
                }else if(i == runIndex){
                    if(leftRun.text != ''){
                        leftPara.runs.push(leftRun)
                    }
                    if(rightRun.text != ''){
                        rightPara.runs.push(rightRun)
                    }
                }else{
                    rightPara.runs.push(para.runs[i])
                }
            }
            
            if(leftPara.runs.length == 0){
                leftPara = rightPara
                rightPara.runs = []
            }

            // replace by left paragraph
            body.doc.pts.splice(paraIndex, 1, leftPara)

            var oldPara = body.pts[paraIndex]
            var newPara = getPagePara(body.doc.pts[paraIndex], lastPosBottom,
                body.doc.grid.pageWidth, body.doc.grid.pageHeight, body.doc.grid.pageSpacingHeight, 
                body.doc.grid.marginTop, body.doc.grid.marginRight, body.doc.grid.marginBottom, body.doc.grid.marginLeft)
            newPara.parent = body
            body.pts.splice(paraIndex, 1, newPara)

            var newPagePara = new PageParagraph(body.doc.grid.marginLeft, newPara)
            var oldPagePara = oldPara.obj.el
            newPara.obj = newPagePara
            window.goog.dom.replaceNode(newPagePara.render(), oldPagePara)

            lastPosBottom += newPara.paraHeight

            // add right paragraph
            if(rightPara.runs.length > 0){
                paraIndex += 1
                body.doc.pts.splice(paraIndex, 0, rightPara)
    
                var newParaRight = getPagePara(body.doc.pts[paraIndex], lastPosBottom,
                    body.doc.grid.pageWidth, body.doc.grid.pageHeight, body.doc.grid.pageSpacingHeight, 
                    body.doc.grid.marginTop, body.doc.grid.marginRight, body.doc.grid.marginBottom, body.doc.grid.marginLeft)
                newParaRight.parent = body
                body.pts.splice(paraIndex, 0, newParaRight)
    
                var newPageParaRight = new PageParagraph(body.doc.grid.marginLeft, newParaRight)
                var pageParaLeft = newPagePara.el
                newParaRight.obj = newPageParaRight
                window.goog.dom.insertSiblingAfter(newPageParaRight.render(), pageParaLeft)
    
                lastPosBottom += newParaRight.paraHeight
            }

            // adjust following page paragraph spacing
            lastPosBottom = state.mutations._adjustFollowingParaSpacing(body, lastPosBottom, paraIndex+1)

            return lastPosBottom
        },
        _addEmptyParaBefore(body, paraIndex){

            // skip previous page paragraphs
            var lastPosBottom = body.doc.grid.marginTop
            for(let i = 0 ; i < paraIndex; ++i){
                lastPosBottom += body.pts[i].paraHeight
            }

            // create new empty paragraph
            var emptyPara = {
                runs: [
                    {
                        type: 'run',
                        text: '',
                        textStyle: {},
                    }
                ],
                type: 'para',
            }

            body.doc.pts.splice(paraIndex, 0, emptyPara)

            var oldPara = body.pts[paraIndex]
            var newPara = getPagePara(body.doc.pts[paraIndex], lastPosBottom,
                body.doc.grid.pageWidth, body.doc.grid.pageHeight, body.doc.grid.pageSpacingHeight, 
                body.doc.grid.marginTop, body.doc.grid.marginRight, body.doc.grid.marginBottom, body.doc.grid.marginLeft)
            newPara.parent = body
            body.pts.splice(paraIndex, 0, newPara)

            var newPagePara = new PageParagraph(body.doc.grid.marginLeft, newPara)
            var oldPagePara = oldPara.obj.el
            newPara.obj = newPagePara
            window.goog.dom.insertSiblingBefore(newPagePara.render(), oldPagePara)

            // adjust following page paragraph spacing
            lastPosBottom += newPara.paraHeight
            lastPosBottom = state.mutations._adjustFollowingParaSpacing(body, lastPosBottom, paraIndex+1)

            return lastPosBottom
        },
        _addEmptyParaAfter(body, paraIndex){

            // skip previous page paragraphs
            var lastPosBottom = body.doc.grid.marginTop
            for(let i = 0 ; i < paraIndex+1; ++i){
                lastPosBottom += body.pts[i].paraHeight
            }

            // create new empty paragraph
            var emptyPara = {
                runs: [
                    {
                        type: 'run',
                        text: '',
                        textStyle: {},
                    }
                ],
                type: 'para',
            }

            body.doc.pts.splice(paraIndex+1, 0, emptyPara)

            var oldPara = body.pts[paraIndex]
            var newPara = getPagePara(body.doc.pts[paraIndex+1], lastPosBottom,
                body.doc.grid.pageWidth, body.doc.grid.pageHeight, body.doc.grid.pageSpacingHeight, 
                body.doc.grid.marginTop, body.doc.grid.marginRight, body.doc.grid.marginBottom, body.doc.grid.marginLeft)
            newPara.parent = body
            body.pts.splice(paraIndex+1, 0, newPara)

            var newPagePara = new PageParagraph(body.doc.grid.marginLeft, newPara)
            var oldPagePara = oldPara.obj.el
            newPara.obj = newPagePara
            window.goog.dom.insertSiblingAfter(newPagePara.render(), oldPagePara)

            // adjust following page paragraph spacing
            lastPosBottom += newPara.paraHeight
            lastPosBottom = state.mutations._adjustFollowingParaSpacing(body, lastPosBottom, paraIndex+1)

            return lastPosBottom
        },
        _mergePreviousPara(body, paraIndex){
            let bodyDoc = body.doc
            if(paraIndex > 0){
                var prePara = bodyDoc.pts[paraIndex-1]
                var para = bodyDoc.pts[paraIndex]

                for(let i = 0; i < para.runs.length; ++i){
                    let r = para.runs[i]
                    if(r.text != ''){
                        prePara.runs.push(para.runs[i])
                    }
                }

                if(prePara.runs[0].text == '' && prePara.runs.length > 1){
                    prePara.runs.splice(0,1)
                }

                bodyDoc.pts.splice(paraIndex, 1)
                body.pts[paraIndex].obj.el.remove()
                body.pts.splice(paraIndex, 1)
            }
            
        },
        _deleteRunText(bodyDoc, paraIndex, runIndex, startIndex){
            var para = bodyDoc.pts[paraIndex]
            var run = para.runs[runIndex]
            var leftText = run.text.substr(0, startIndex)
            var rightText = run.text.substr(startIndex+1)

            run.text = leftText + rightText
        },
        _spliceRunText(bodyDoc, paraIndex, runIndex, startIndex, text, textStyle){
            var run = bodyDoc.pts[paraIndex].runs[runIndex]
            var leftText = run.text.substr(0, startIndex)
            var rightText = run.text.substr(startIndex)

            run.text = leftText + text + rightText
        },
        _updatePara(body, paraIndex){
            
            // skip previous page paragraphs
            var lastPosBottom = body.doc.grid.marginTop
            for(let i = 0 ; i < paraIndex; ++i){
                lastPosBottom += body.doc.pts[i].paraHeight
            }

            // recreate current page paragraphs
            var oldPara = body.pts[paraIndex]
            var newPara = getPagePara(body.doc.pts[paraIndex], lastPosBottom,
                body.doc.grid.pageWidth, body.doc.grid.pageHeight, body.doc.grid.pageSpacingHeight, 
                body.doc.grid.marginTop, body.doc.grid.marginRight, body.doc.grid.marginBottom, body.doc.grid.marginLeft)
            newPara.parent = body
            body.pts.splice(paraIndex, 1, newPara)

            var newPagePara = new PageParagraph(body.doc.grid.marginLeft, newPara)
            var oldPagePara = oldPara.obj.el
            newPara.obj = newPagePara
            window.goog.dom.replaceNode(newPagePara.render(), oldPagePara)
            
            // adjust following page paragraph spacing
            lastPosBottom += newPara.paraHeight
            lastPosBottom = state.mutations._adjustFollowingParaSpacing(body, paraIndex+1, lastPosBottom)

            return lastPosBottom
        },
        _adjustFollowingParaSpacing(body, paraIndex, lastPosBottom){
            for(let i = paraIndex; i < body.pts.length; ++i){
                var pagePara = body.pts[i]
                var paraHeight = 0
                
                for(let j = 0; j < pagePara.lines.length; ++j){
                    var ls = pagePara.lines[j]
                    if(ls.type == 'line'){
                        // check paragraph height
                        var leftHeight = getPageLeftHeight(lastPosBottom, body.doc.grid.marginBottom, body.doc.grid.pageHeight, body.doc.grid.pageSpacingHeight)
                        if(ls.lineHeight > leftHeight){
                            // create new page spacing
                            var spacingHeight = leftHeight + body.doc.grid.marginBottom + body.doc.grid.pageSpacingHeight + body.doc.grid.marginTop
                            
                            lastPosBottom += spacingHeight
                            paraHeight += spacingHeight

                            ls.spacingHeight = spacingHeight
                            ls.obj.el.style.marginTop = spacingHeight+'px'
                        }else{
                            ls.spacingHeight = 0
                            ls.obj.el.style.marginTop = '0px'
                        }
                        
                        lastPosBottom += ls.lineHeight
                        paraHeight += ls.lineHeight
                    }
                }

                pagePara.paraHeight = paraHeight
            }

            return lastPosBottom
        },
        _updatePageBackground(bodyDoc, lastPosBottom){
            var pageNo = getPageNo(lastPosBottom, bodyDoc.grid.pageHeight, bodyDoc.grid.pageSpacingHeight)
            var bgWrap = document.getElementsByClassName('page-bgs-wrap')[0]
            var oldBgs = document.getElementsByClassName('page-bg')
            if(pageNo > oldBgs.length){
                for(let i = 0; i < pageNo - oldBgs.length; ++i){
                    var pageBg = new PageBackground(bodyDoc.grid.pageWidth, bodyDoc.grid.pageHeight, bodyDoc.grid.pageSpacingHeight, bodyDoc.grid.marginTop, 
                        bodyDoc.grid.marginRight, bodyDoc.grid.marginBottom, bodyDoc.grid.marginLeft, oldBgs.length+i)
                    window.goog.dom.appendChild(bgWrap, pageBg.render())
                }
            }else if(pageNo < oldBgs.length){
                for(let i = oldBgs.length; i > pageNo; --i){
                    oldBgs[i-1].remove()
                }
            }

            bgWrap.style.height = (bodyDoc.grid.pageHeight+bodyDoc.grid.pageSpacingHeight)*pageNo+'px'
        },
        _updateCursor(body, paraIndex, runIndex, startIndex, front){
            var nextStartIndex = startIndex
            var para = body.pts[paraIndex]
            for(let i = 0; i < para.lines.length; ++i){
                let ls = para.lines[i]

                for(let j = 0; j < ls.inlineBlocks.length; ++j){
                    let ib = ls.inlineBlocks[j]
                    let ibRunIndex = para.doc.runs.indexOf(ib.doc)
                    
                    if(ibRunIndex == runIndex){
                        if(nextStartIndex >= ib.startIndex && nextStartIndex <= ib.startIndex + ib.text.length ){
                            state.document.cursor.inlineBlock = body.pts[paraIndex].lines[i].inlineBlocks[j]
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