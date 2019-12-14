import { measureFontTextWH, getCursorPos, getPageLeftHeight } from './measure'
import { getPagePara, getPageTable, getPageBody, getPreviousInlineOfBody, 
    getNextInlineOfBody, getPreviousLineOfBody, getNextLineOfBody, getInlineBlockBodyIndex,
    isTextStyleEqual, buildEmptyTableCell, getRowColGridOfTableCell, getInlineBlockByRun } from './convert'
import { getPageNo, measureEleDocXY } from '../utils/measure'

import PageParagraph from '../components/PageParagraph'
import PageTable from '../components/PageTable'
import PageBackground from '../components/PageBackground'
import DocRangeSelect from '../components/DocRangeSelect'

var state = {
    document: {
        cursor: {
            inlineBlock: null,
            inlineStartIndex: -1,
            front: false,
        },
        imageResizer: {},
        rangeSelect: {
            dragged: false,
            overlays: [],
            dragger: null,
            start: {
                line: null,
                inlineBlock: null,
                startIndex: null,
            },
            end: {
                line: null,
                inlineBlock: null,
                startIndex: null,
            },
        },
        inputBox: {},
        body: null,
    },
    toolbar:{
        textStyle: {
            fontFamily: 'unset',
            fontSize: 'unset',
            color: 'unset',
            backgroundColor: 'unset',
            fontWeight: 'unset',
            fontStyle: 'unset',
            textDecoration: 'unset',
            verticalAlign: 'unset',
        },
        paraStyle: {
            textAlign: 'left',
        },
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
                startIndex: bi.startIndex + state.document.cursor.inlineStartIndex,
            }
        },
        cursorTable: function(){
            let ci = state.getters.cursorInlineBlock()
            if(ci){
                let parent = ci.parent.parent.parent.parent
                if(parent){
                    if(parent.type == 'table'){
                        return parent
                    }
                }
            }

            return null
        },
        cursorPos: function(){
            let cursorInlineBlock = state.getters.cursorInlineBlock()
            let pos = getCursorPos(cursorInlineBlock, state.document.cursor.inlineStartIndex, state.document.cursor.front)
            return pos
        },
        cloneToolbarTextStyle: function(){
            return Object.assign({}, state.toolbar.textStyle)
        },
        cloneToolbarParaStyle: function(){
            return Object.assign({}, state.toolbar.paraStyle)
        },
        getRangeSelectInlineBlocks: function(){
            let startLine = state.document.rangeSelect.start.line
            let startIb = state.document.rangeSelect.start.inlineBlock
            let startSi = state.document.rangeSelect.start.startIndex
            let startPara = startIb.parent.parent
            let startBody = startPara.parent

            let endLine = state.document.rangeSelect.end.line
            let endIb = state.document.rangeSelect.end.inlineBlock
            let endSi = state.document.rangeSelect.end.startIndex
            let endPara = endIb.parent.parent
            let endBody = endPara.parent
            
            if(!startLine || !endLine){
                return []
            }

            let pi = startBody.pts.indexOf(startPara)
            let li = startPara.lines.indexOf(startLine)
            let bi = startLine.inlineBlocks.indexOf(startIb)

            let range = []
            ptLoop: for(let i = pi; i < startBody.pts.length; ++i){
                let para = startBody.pts[i]
                if(para.type == 'table'){
                    break ptLoop
                }

                for(let j = 0; j < para.lines.length; ++j){
                    if(i == pi && j == 0){
                        j = li
                    }

                    let line = para.lines[j]
                    for(let k = 0; k < line.inlineBlocks.length; ++k){
                        if(i == pi && j == li && k == 0){
                            k = bi
                        }

                        let ib = line.inlineBlocks[k]

                        let selectInlineBlock = ib
                        let selectStartIndex = ib === startIb ? startSi : 0
                        let selectEndIndex = ib === endIb ? endSi : (ib.type == 'text' ? ib.text.length-1 : 0)

                        range.push({
                            inlineBlock: selectInlineBlock,
                            startIndex: selectStartIndex,
                            endIndex: selectEndIndex,
                        })
                        
                        if(ib === endIb){
                            break ptLoop
                        }
                    }
                }
            }
            
            return range
        },
        hasRangeSelectOverlays: function(){
            return state.document.rangeSelect.overlays.length > 0
        },
        _matchTableCell: function(oldTable, newTable, oldBody, deleteRowIndex, deleteColumnIndex){

            let iterBody = function(body, newBody, oldBody){
                for(let i = 0; i < body.pts.length; ++i){
                    let pt = body.pts[i]
                    if(pt.type == 'table'){
                        let newTable = undefined
                        if(newBody){
                            newTable = newBody.pts[i]
                        }
                        let newBody2 = iterTable(pt, newTable, oldBody)
                        if(newBody2 !== false){
                            return newBody2
                        }
                    }
                }

                return false
            }

            let iterTable = function(oldTable, newTable, oldBody, deleteRowIndex, deleteColumnIndex){
                for(let r = 0; r < oldTable.cells.length; ++r){
                    let row = oldTable.cells[r]
                    for(let c = 0; c < row.length; ++c ){
                        let col = row[c]

                        let r2 = r
                        let c2 = c

                        if(deleteRowIndex !== undefined){
                            if(r == deleteRowIndex){
                                r2 = -1
                            }else if(r > deleteRowIndex){
                                r2 = r - 1
                            }
                        }
                        
                        if(deleteColumnIndex !== undefined){
                            if(c == deleteColumnIndex){
                                c2 = -1
                            }else if(c > deleteColumnIndex){
                                c2 = c - 1
                            }
                        }
    
                        if(col == oldBody){
                            if(newTable && newTable.cells[r2] && newTable.cells[r2][c2]){
                                let newBody = newTable.cells[r2][c2]
                                return newBody
                            }else{
                                return null
                            }
                        }else{
                            let newCol = undefined
                            if(newTable && newTable.cells[r2] && newTable.cells[r2][c2]){
                                newCol = newTable.cells[r2][c2]
                            }

                            let newBody = iterBody(col, newCol, oldBody)
                            if(newBody !== false){
                                return newBody
                            }
                        }
                    }
                }

                return false
            }

            return iterTable(oldTable, newTable, oldBody, deleteRowIndex, deleteColumnIndex)
        },
    },
    mutations: {
        
        /***********************************************************************************************************************************
         *                                                          public muations
         ***********************************************************************************************************************************/

        setDocument: function(doc){
            var body = getPageBody(doc, doc.grid.marginTop)
            
            state.document.body = body
        },
        setDocumentObj: function(obj){
            state.document.obj = obj
        },
        setCursorObj: function(obj){
            state.document.cursor.obj = obj
        },
        setInputBoxObj: function(obj){
            state.document.inputBox.obj = obj
        },
        setImageResizerObj: function(obj){
            state.document.imageResizer.obj = obj
        },
        showImageResizer: function(targetObj){
            state.document.imageResizer.obj.updateTarget(targetObj)
            state.document.imageResizer.obj.show()
        },
        hideImageResizer: function(){
            state.document.imageResizer.obj.hide()
        },
        updateImageResizer: function(){
            state.document.imageResizer.obj.updateTarget()
        },
        setImeStatus: function(imeStatus){
            var cursor = state.document.cursor.obj
            cursor.updateVisibility(!imeStatus)
        },

        // ---------------------------------------------------------- range select mutations --------------------------------------------------------------
        updateRangeSelectDragged(dragged){
            state.document.rangeSelect.dragged = dragged
        },
        startRangeSelect: function(dragger, line, inlineBlock, startIndex){
            state.mutations.clearRangeSelectOverlays()

            state.document.rangeSelect.dragger = dragger
            state.document.rangeSelect.start = {
                line: line,
                inlineBlock: inlineBlock,
                startIndex: startIndex,
            }
        },
        dragRangeSelect: function(line, inlineBlock, startIndex){
            state.mutations.clearRangeSelectOverlays()

            state.document.rangeSelect.end = {
                line: line,
                inlineBlock: inlineBlock,
                startIndex: startIndex,
            }

            state.mutations.showRangeSelectOverlays()
        },
        endRangeSelect: function(line, inlineBlock, startIndex){
            state.mutations.clearRangeSelectOverlays()

            let dragger = state.document.rangeSelect.dragger
            if(dragger){
                state.document.rangeSelect.dragger = null
                state.document.rangeSelect.end = {
                    line: line,
                    inlineBlock: inlineBlock,
                    startIndex: startIndex,
                }

                state.mutations.showRangeSelectOverlays()
            }
        },
        showRangeSelectOverlays: function(){
            let range = state.getters.getRangeSelectInlineBlocks()
            let select = new DocRangeSelect(range)
            select.render()

            state.document.rangeSelect.overlays.push(select)
        },
        clearRangeSelectOverlays: function(){
            for(let i = 0; i < state.document.rangeSelect.overlays.length; ++i){
                let overlay = state.document.rangeSelect.overlays[i]
                overlay.remove()
            }

            state.document.rangeSelect.overlays = []
        },
        updateRangeSelectStart(body, paraIndex, lineIndex, inlineBlockIndex, startIndex){

            if(!body){
                state.document.rangeSelect.start = {
                    line: null,
                    inlineBlock: null,
                    startIndex: null,
                }
                return
            }

            let para = body.pts[paraIndex]
            let line = para.lines[lineIndex]
            let inlineBlock = line.inlineBlocks[inlineBlockIndex]
            state.document.rangeSelect.start = {
                line: line,
                inlineBlock: inlineBlock,
                startIndex: startIndex,
            }
        },
        updateRangeSelectEnd(body, paraIndex, lineIndex, inlineBlockIndex, startIndex){

            if(!body){
                state.document.rangeSelect.end = {
                    line: null,
                    inlineBlock: null,
                    startIndex: null,
                }
                return
            }

            let para = body.pts[paraIndex]
            let line = para.lines[lineIndex]
            let inlineBlock = line.inlineBlocks[inlineBlockIndex]

            if(startIndex == -1){
                if(inlineBlock.type == 'text'){
                    let text = inlineBlock.text
                    startIndex = text.length - 1
                }else{
                    startIndex = 0
                }
            }

            state.document.rangeSelect.end = {
                line: line,
                inlineBlock: inlineBlock,
                startIndex: startIndex,
            }
        },
        adjustRangeSelectInlineBlock: function(textStyle){
            let range = state.getters.getRangeSelectInlineBlocks()
            let lastBody = null
            let lastParaIndex = null

            let rangeSelectStartBody = null
            let rangeSelectStartParaIndex = null
            let rangeSelectStartLineIndex = null
            let rangeSelectStartInlineBlockIndex = null
            let rangeSelectStartStartIndex = null
            let rangeSelectStartSplit = false

            let rangeSelectEndBody = null
            let rangeSelectEndParaIndex = null
            let rangeSelectEndLineIndex = null
            let rangeSelectEndInlineBlockIndex = null
            let rangeSelectEndStartIndex = null

            for(let i = 0; i < range.length; ++i){
                let { inlineBlock, startIndex, endIndex } = range[i]
                let body = inlineBlock.parent.parent.parent
                let bodyDoc = body.doc
                let paraDoc = inlineBlock.parent.parent.doc
                let paraIndex = bodyDoc.pts.indexOf(paraDoc)
                let runIndex = paraDoc.runs.indexOf(inlineBlock.doc)

                if(i == 0){
                    // range select start
                    let { line, inlineBlock, startIndex } = state.document.rangeSelect.start
                    let para = line.parent
                    let lineIndex = para.lines.indexOf(line)
                    let inlineBlockIndex = line.inlineBlocks.indexOf(inlineBlock)
                    
                    rangeSelectStartBody = body
                    rangeSelectStartParaIndex = paraIndex
                    rangeSelectStartLineIndex = lineIndex
                    if(inlineBlock.type == 'text'){
                        if(startIndex == 0){
                            rangeSelectStartInlineBlockIndex = inlineBlockIndex
                            rangeSelectStartStartIndex = startIndex
                        }else{
                            rangeSelectStartInlineBlockIndex = inlineBlockIndex + 1
                            rangeSelectStartStartIndex = 0
                            rangeSelectStartSplit = true
                        }
                    }else{
                        rangeSelectStartInlineBlockIndex = inlineBlockIndex
                        rangeSelectStartStartIndex = startIndex
                    }
                }
                
                if(i == range.length - 1){
                    // range select end
                    let { line, inlineBlock, startIndex } = state.document.rangeSelect.end
                    let para = line.parent
                    let lineIndex = para.lines.indexOf(line)
                    let inlineBlockIndex = line.inlineBlocks.indexOf(inlineBlock)
                    
                    rangeSelectEndBody = body
                    rangeSelectEndParaIndex = paraIndex
                    rangeSelectEndLineIndex = lineIndex

                    if(state.document.rangeSelect.start.inlineBlock === state.document.rangeSelect.end.inlineBlock && rangeSelectStartSplit){
                        inlineBlockIndex += 1
                    }

                    if(inlineBlock.type == 'text'){
                        rangeSelectEndInlineBlockIndex = inlineBlockIndex
                        rangeSelectEndStartIndex = -1
                    }else{
                        rangeSelectEndInlineBlockIndex = inlineBlockIndex
                        rangeSelectEndStartIndex = startIndex
                    }
                }

                if(inlineBlock.type == 'text'){
                    let text = inlineBlock.text
                    if(startIndex > 0 || endIndex < text.length - 1){
                        startIndex += inlineBlock.startIndex
                        endIndex += inlineBlock.startIndex

                        state.mutations._splitRunText(bodyDoc, paraIndex, runIndex, startIndex, endIndex)
                        if(i == 0){
                            runIndex += 1
                        }
                    }

                    // change text style
                    if(textStyle){
                        bodyDoc.pts[paraIndex].runs[runIndex].textStyle = textStyle
                    }

                    // paragraph changed
                    if(lastBody !== null && lastParaIndex !== null && lastParaIndex != paraIndex){
                        // update para
                        let lastPosBottom = state.mutations._getParaLastPosBottom(lastBody, lastParaIndex)
                        lastPosBottom = state.mutations._updatePara(lastBody, lastParaIndex, lastPosBottom)
                        
                        // adjust following page paragraph spacing
                        lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(lastBody, lastParaIndex+1, lastPosBottom)
                        
                        // adjust parent following spacing
                        lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(lastBody, lastPosBottom)
                    }

                    lastBody = body
                    lastParaIndex = paraIndex
                }
            }

            // paragraph changed
            if(lastBody !== null && lastParaIndex !== null){
                let lastPosBottom = state.mutations._getParaLastPosBottom(lastBody, lastParaIndex)
                lastPosBottom = state.mutations._updatePara(lastBody, lastParaIndex, lastPosBottom)

                // adjust following page paragraph spacing
                lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(lastBody, lastParaIndex+1, lastPosBottom)
                        
                // adjust parent following spacing
                lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(lastBody, lastPosBottom)
            }

            // update range select
            state.mutations.updateRangeSelectStart(
                rangeSelectStartBody, 
                rangeSelectStartParaIndex,
                rangeSelectStartLineIndex,
                rangeSelectStartInlineBlockIndex,
                rangeSelectStartStartIndex)

            state.mutations.updateRangeSelectEnd(
                rangeSelectEndBody,
                rangeSelectEndParaIndex,
                rangeSelectEndLineIndex,
                rangeSelectEndInlineBlockIndex,
                rangeSelectEndStartIndex
            )

            // update range select overlay
            state.mutations.clearRangeSelectOverlays()
            state.mutations.showRangeSelectOverlays()

            // update cursor
            let endIb = state.document.rangeSelect.end.inlineBlock
            state.document.cursor.inlineBlock = endIb
            state.document.cursor.inlineStartIndex = endIb.type == 'text' ? endIb.text.length - 1 : 0
            state.document.cursor.front = false
            state.mutations._updateCursorAndInputBoxPos()
            state.mutations.updateImageResizer()
        },
        deleteRangeSelectInlineBlock: function(){
            state.mutations.adjustRangeSelectInlineBlock()

            let range = state.getters.getRangeSelectInlineBlocks()
            let lastBody = null
            let lastParaIndex = null

            let rangeSelectStartBody = null
            let rangeSelectStartParaIndex = null
            let rangeSelectStartLineIndex = null
            let rangeSelectStartInlineBlockIndex = null
            let rangeSelectStartRunIndex = null
            let rangeSelectStartStartIndex = null
            let rangeSelectStartSplit = false

            let rangeSelectEndBody = null
            let rangeSelectEndParaIndex = null
            let rangeSelectEndLineIndex = null
            let rangeSelectEndInlineBlockIndex = null
            let rangeSelectEndStartIndex = null

            for(let i = 0; i < range.length; ++i){
                let { inlineBlock, startIndex, endIndex } = range[i]
                let body = inlineBlock.parent.parent.parent
                let bodyDoc = body.doc
                let paraDoc = inlineBlock.parent.parent.doc
                let paraIndex = bodyDoc.pts.indexOf(paraDoc)
                let runIndex = paraDoc.runs.indexOf(inlineBlock.doc)

                if(i == 0){
                    // range select start
                    rangeSelectStartBody = body
                    rangeSelectStartParaIndex = paraIndex
                    rangeSelectStartRunIndex = runIndex
                }

                if(i == range.length - 1){
                    // range select end
                    rangeSelectEndBody = body
                    rangeSelectEndParaIndex = paraIndex
                }

                // delete inline block
                state.mutations._deleteRun(bodyDoc, paraIndex, runIndex)

                // paragraph changed
                if(lastBody !== null && lastParaIndex !== null && lastParaIndex != paraIndex){
                    if(lastBody.doc.pts[lastParaIndex].runs.length == 0){
                        state.mutations._deletePt(lastBody, lastParaIndex)
    
                        body = null
                        paraIndex = null
                    }else{
                        let lastPosBottom = state.mutations._getParaLastPosBottom(lastBody, lastParaIndex)
                        lastPosBottom = state.mutations._updatePara(lastBody, lastParaIndex, lastPosBottom)
                        
                        // adjust following page paragraph spacing
                        lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(lastBody, lastParaIndex+1, lastPosBottom)
                        
                        // adjust parent following spacing
                        lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(lastBody, lastPosBottom)
                    }
                }

                lastBody = body
                lastParaIndex = paraIndex
            }

            // paragraph changed
            if(lastBody !== null && lastParaIndex !== null){
                if(lastBody.doc.pts[lastParaIndex].runs.length == 0){
                    state.mutations._deletePt(lastBody, lastParaIndex)
                }else{
                    if(rangeSelectEndParaIndex != rangeSelectStartParaIndex){
                        state.mutations._mergePreviousPara(lastBody, lastParaIndex)
                        lastParaIndex -= 1
                    }

                    let lastPosBottom = state.mutations._getParaLastPosBottom(lastBody, lastParaIndex)
                    lastPosBottom = state.mutations._updatePara(lastBody, lastParaIndex, lastPosBottom)

                    // adjust following page paragraph spacing
                    lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(lastBody, lastParaIndex+1, lastPosBottom)
                        
                    // adjust parent following spacing
                    lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(lastBody, lastPosBottom)
                }
            }

            // update range select
            state.mutations.updateRangeSelectStart(null)

            state.mutations.updateRangeSelectEnd(null)

            // update range select overlay
            state.mutations.clearRangeSelectOverlays()

            // update cursor
            let cib = null
            let csi = 0
            let cft = true
            if(rangeSelectStartBody.doc.pts[rangeSelectStartParaIndex].runs.length - 1 < rangeSelectStartRunIndex){
                rangeSelectStartRunIndex = rangeSelectStartBody.doc.pts[rangeSelectStartParaIndex].runs.length - 1
                cib = getInlineBlockByRun(rangeSelectStartBody, rangeSelectStartParaIndex, rangeSelectStartRunIndex, 0)
                if(cib.type == 'text'){
                    csi = cib.text.length - 1
                    cft = false
                }
            }else{
                cib = getInlineBlockByRun(rangeSelectStartBody, rangeSelectStartParaIndex, rangeSelectStartRunIndex, 0)
            }

            state.document.cursor.inlineBlock = cib
            state.document.cursor.inlineStartIndex = csi
            state.document.cursor.front = cft
            
            state.mutations._updateCursorAndInputBoxPos()
            state.mutations.updateImageResizer()
        },
        
        // ----------------------------------------------------------------- cursor mutation -------------------------------------------------------
        setCursorInlineBlock: function(payload){
            state.document.cursor.inlineBlock = payload.inlineBlock
            state.document.cursor.inlineStartIndex = payload.inlineStartIndex
            state.document.cursor.front = payload.front

            state.mutations._updateCursorAndInputBoxPos()
            state.mutations._updateCursorToolbarTextStyle()
            state.mutations._updateCursorToolbarParaStyle()
        },
        resetCursorInlineBlock: function(){
            state.document.cursor.inlineBlock = state.document.body.pts[0].lines[0].inlineBlocks[0]
            state.document.cursor.inlineStartIndex = 0
            state.document.cursor.front = true

            state.mutations._updateCursorAndInputBoxPos()
            state.mutations._updateCursorToolbarTextStyle()
            state.mutations._updateCursorToolbarParaStyle()
        },

        // ------------------------------------------------------------------ toolbar mutation --------------------------------------------------------
        setToolbarObj: function(obj){
            state.toolbar.obj = obj
        },
        setToolbarTextStyle: function(key, value, updateUi){
            switch(key){
                case 'fontFamily':
                    state.toolbar.textStyle[key] = value
                    if(updateUi){
                        state.toolbar.obj.updateFontFamily(value)
                    }
                    break;
                case 'fontSize':
                        state.toolbar.textStyle[key] = value
                        if(updateUi){
                            state.toolbar.obj.updateFontSize(value)
                        }
                        break;
                case 'color':
                        state.toolbar.textStyle[key] = value
                        if(updateUi){
                            state.toolbar.obj.updateColor(value)
                        }
                        break;
                case 'backgroundColor':
                        state.toolbar.textStyle[key] = value
                        if(updateUi){
                            state.toolbar.obj.updateBackgroundColor(value)
                        }
                        break;
                case 'fontWeight':
                        state.toolbar.textStyle[key] = value
                        if(updateUi){
                            state.toolbar.obj.updateFontWeight(value)
                        }
                        break;
                case 'fontStyle':
                        state.toolbar.textStyle[key] = value
                        if(updateUi){
                            state.toolbar.obj.updateFontStyle(value)
                        }
                        break;
                case 'textDecoration':
                        state.toolbar.textStyle[key] = value
                        if(updateUi){
                            state.toolbar.obj.updateTextDecoration(value)
                        }
                        break;
                case 'verticalAlign':
                        state.toolbar.textStyle[key] = value
                        if(updateUi){
                            state.toolbar.obj.updateVerticalAlign(value)
                        }
                        break;
                default:
                    break;
            }

            state.mutations._updateCursorAndInputBoxPos()
        },
        setToolbarParaStyle: function(paraStyle, updateUi){
            let textAlign = paraStyle.textAlign
            state.toolbar.paraStyle['textAlign'] = textAlign
            if(updateUi){
                state.toolbar.obj.updateTextAlign(textAlign)
            }
        },
        setCursorParaStyleAsToolbar: function(){
            let ci = state.getters.cursorBodyIndex()
            let body = ci.body
            let paraIndex = ci.paraIndex

            state.mutations._updateParaStyle(body, paraIndex, state.getters.cloneToolbarParaStyle())

            state.mutations._updateCursorAndInputBoxPos()
            state.mutations.updateImageResizer()
        },
        setRangeSelectInlineBlocksTextStyleAsToolbar: function(){
            if(!state.getters.hasRangeSelectOverlays()){
                return
            }

            let textStyle = state.getters.cloneToolbarTextStyle()
            state.mutations.adjustRangeSelectInlineBlock(textStyle)
        },

        // ----------------------------------------------------------- move cursor mutation -----------------------------------------------------------
        leftMoveCursor: function(){
            let ci = state.getters.cursorBodyIndex()
            let runIndex = ci.runIndex
            let ib = state.document.cursor.inlineBlock

            if(!state.document.cursor.front && (
                (ib.type == 'text' && ib.text.length > 0) ||
                ib.type == 'image'
            )){
                state.document.cursor.front = true
            }else{
                if(state.document.cursor.inlineStartIndex > 0){
                    state.document.cursor.inlineStartIndex -= 1
                }else{
                    // get left inline block of body
                    let lastib = getPreviousInlineOfBody(ib)
                    if(lastib){
                        state.document.cursor.inlineBlock = lastib
                        if(lastib.type == 'text'){
                            state.document.cursor.inlineStartIndex = lastib.text.length > 0 ? lastib.text.length - 1 : 0
                        }else if(lastib.type == 'image'){
                            state.document.cursor.inlineStartIndex = 0
                        }
                        state.document.cursor.front = runIndex == 0 ? false : true
                    }
                }
            }

            state.mutations._updateCursorAndInputBoxPos()
            state.mutations._updateCursorToolbarTextStyle()
            state.mutations._updateCursorToolbarParaStyle()
        },
        rightMoveCursor: function(){
            let ib = state.document.cursor.inlineBlock
            if(state.document.cursor.front && (
                (ib.type == 'text' && ib.text.length > 0) ||
                ib.type == 'image'
            )){
                state.document.cursor.front = false
            }else{
                if((ib.type == 'text' && state.document.cursor.inlineStartIndex < ib.text.length - 1)){
                    state.document.cursor.inlineStartIndex += 1
                }else{
                    // get right inline block of body
                    let nextib = getNextInlineOfBody(ib)
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
            state.mutations._updateCursorToolbarTextStyle()
            state.mutations._updateCursorToolbarParaStyle()
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
                    let lxy = measureEleDocXY(ib.obj.el)
                    let lx = lxy.x
                    let lw = ib.obj.el.offsetWidth
                    
                    if(ib.type == 'text'){
                        if(cx >= lx && cx <= lx + lw){
                            let lastw = 0
                            for(let j = 1; j <= ib.text.length; ++j){
                                let t = ib.text.substr(0, j)
                                let wh = measureFontTextWH(t, ib.textStyle)
                    
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
                    }else if(ib.type == 'image'){
                        if(cx >= lx && cx <= lx + lw){
                            if(cx <= lx + ib.imageStyle.width / 2){
                                front = true
                            }else{
                                front = false
                            }
                            
                            si = 0
                            break
                        }
                    }
                }

                if(si < 0){
                    if(ib.type == 'text'){
                        if(ib.text.length > 0){
                            si = ib.text.length - 1
                        }else{
                            si = 0
                            front = true
                        }
                    }else if(ib.type == 'image'){
                        si = 0
                        front = true
                    }
                }

                state.document.cursor.inlineBlock = ib
                state.document.cursor.inlineStartIndex = si
                state.document.cursor.front = front
            }

            state.mutations._updateCursorAndInputBoxPos()
            state.mutations._updateCursorToolbarTextStyle()
            state.mutations._updateCursorToolbarParaStyle()
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
                    let lxy = measureEleDocXY(ib.obj.el)
                    let lx = lxy.x
                    let lw = ib.obj.el.offsetWidth

                    if(ib.type == 'text'){
                        if(cx >= lx && cx <= lx + lw){
                            let lastw = 0
                            for(let j = 1; j <= ib.text.length; ++j){
                                let t = ib.text.substr(0, j)
                                let wh = measureFontTextWH(t, ib.textStyle)
                    
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
                    }else if(ib.type == 'image'){
                        if(cx >= lx && cx <= lx + lw){
                            if(cx <= lx + ib.imageStyle.width / 2){
                                front = true
                            }else{
                                front = false
                            }
                            
                            si = 0
                            break
                        }
                    }
                    
                }

                if(si < 0){
                    if(ib.type == 'text'){
                        if(ib.text.length > 0){
                            si = ib.text.length - 1
                        }else{
                            si = 0
                            front = true
                        }
                    }else if(ib.type == 'image'){
                        si = 0
                        front = true
                    }
                    
                }

                state.document.cursor.inlineBlock = ib
                state.document.cursor.inlineStartIndex = si
                state.document.cursor.front = front
            }

            state.mutations._updateCursorAndInputBoxPos()
            state.mutations._updateCursorToolbarTextStyle()
            state.mutations._updateCursorToolbarParaStyle()
        },

        // ------------------------------------------------------- run mutation ----------------------------------------------------------- 
        addTextToParaRun: function(payload){
            if(!state.getters.cursorInlineBlock()){
                return
            }

            let ib = state.document.cursor.inlineBlock
            let ci = state.getters.cursorBodyIndex()
            let body = ci.body
            let paraIndex = ci.paraIndex
            let runIndex = ci.runIndex
            let startIndex = ci.startIndex
            let front = state.document.cursor.front
            
            let text = payload.text
            let textStyle = payload.textStyle

            // update run
            let textRunInserted = false
            if(ib.type == 'text'){
                textRunInserted = state.mutations._spliceRunText(body.doc, paraIndex, runIndex, front ? startIndex : startIndex + 1, text, textStyle)
            }else if(ib.type == 'image'){
                state.mutations._addRunTextAfter(body.doc, paraIndex, front ? runIndex : runIndex + 1, text, textStyle)
            }

            // get last position bottom
            let lastPosBottom = state.mutations._getParaLastPosBottom(body, paraIndex)
            
            // update document paragraph
            lastPosBottom = state.mutations._updatePara(body, paraIndex, lastPosBottom)
            
            // adjust following spacing
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)
            
            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)
            
            // update page background
            state.mutations._updatePageBackground(lastPosBottom)

            // update cursor
            if(ib.type == 'text'){
                if(textRunInserted){
                    let len = body.doc.pts[paraIndex].runs[runIndex+1].text.length
                    state.mutations._updateCursor(body, paraIndex, runIndex+1, Math.max(len - 1, 0), false)
                }else{
                    let si = startIndex + text.length
                    let len = body.doc.pts[paraIndex].runs[runIndex].text.length
                    if(si >= len){
                        state.mutations._updateCursor(body, paraIndex, runIndex, Math.max(len - 1, 0), false)
                    }else{
                        state.mutations._updateCursor(body, paraIndex, runIndex, si)
                    }
                }
            }else if(ib.type == 'image'){
                state.mutations._updateCursor(body, paraIndex, front ? runIndex : runIndex+1, Math.max(text.length - 1, 0), false)
            }

            // update image resizer
            state.mutations.updateImageResizer()
            
        },
        addImageToParaRun: function(payload){
            if(!state.getters.cursorInlineBlock()){
                return
            }

            let ib = state.document.cursor.inlineBlock
            let ci = state.getters.cursorBodyIndex()
            let body = ci.body
            let paraIndex = ci.paraIndex
            let runIndex = ci.runIndex
            let startIndex = ci.startIndex
            let front = state.document.cursor.front
            
            let image = payload.image
            let imageStyle = payload.imageStyle

            // adjust image widht and height
            let maxWidth = body.doc.grid.pageWidth - body.doc.grid.marginLeft - body.doc.grid.marginRight
            let maxHeight = body.doc.grid.pageHeight - body.doc.grid.marginTop- body.doc.grid.marginBottom

            if(imageStyle.width > maxWidth * .9){
                let oldWidth = imageStyle.width
                imageStyle.width = maxWidth * .9;
                imageStyle.height = ( imageStyle.width  / oldWidth) * imageStyle.height
            }

            if(imageStyle.height > maxHeight * .9){
                let oldHeight = imageStyle.height
                imageStyle.height = maxHeight * .9;
                imageStyle.width = ( imageStyle.height  / oldHeight) * imageStyle.width
            }

            // update run
            if(ib.type == 'text'){
                state.mutations._spliceRunImage(body.doc, paraIndex, runIndex, front ? startIndex : startIndex + 1, image, imageStyle)
            }else if(ib.type == 'image'){
                state.mutations._addRunImageAfter(body.doc, paraIndex, front ? runIndex : runIndex + 1, image, imageStyle)
            }

            // get last position bottom
            let lastPosBottom = state.mutations._getParaLastPosBottom(body, paraIndex)
           
            // update document paragraph
            lastPosBottom = state.mutations._updatePara(body, paraIndex, lastPosBottom)
           
            // adjust following spacing
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)
            
            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)
            
            // update page background
            state.mutations._updatePageBackground(lastPosBottom)

            // update cursor
            state.mutations._updateCursor(body, paraIndex, runIndex+1, 0, false)

            // update image resizer
            state.mutations.updateImageResizer()
        },
        updateImageStyle: function(payload){
            
            let ib = payload.ib
            let imageStyle = payload.imageStyle

            let bi = getInlineBlockBodyIndex(ib)
            let body = bi.body
            let paraIndex = bi.paraIndex
            let runIndex = bi.runIndex

            // update run
            state.mutations._updateRunImageStyle(body.doc, paraIndex, runIndex, imageStyle)

            // get last position bottom
            let lastPosBottom = state.mutations._getParaLastPosBottom(body, paraIndex)
           
            // update document paragraph
            lastPosBottom = state.mutations._updatePara(body, paraIndex, lastPosBottom)
           
            // adjust following spacing
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)
            
            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)
            
            // update page background
            state.mutations._updatePageBackground(lastPosBottom)

            // update cursor
            state.mutations._updateCursor(body, paraIndex, runIndex, 0, false)

            // update image resizer
            let cib = state.document.cursor.inlineBlock
            state.mutations.showImageResizer(cib.obj)
        },
        deleteFromParaRun: function(){
            let ci = state.getters.cursorBodyIndex()
            let ib = state.document.cursor.inlineBlock
            let front = state.document.cursor.front
            let body = ci.body
            let paraIndex = ci.paraIndex
            let runIndex = ci.runIndex
            let startIndex = ci.startIndex
            let para = body.doc.pts[paraIndex]
            let run = para.runs[runIndex]

            if(!front){
                if(ib.type == 'text'){
                    state.mutations._deleteRunText(body.doc, paraIndex, runIndex, startIndex)
                
                    if(run.text == ''){
                        if(runIndex >= 1 || (runIndex == 0 && para.runs.length > 1)){
                            para.runs.splice(runIndex, 1)
    
                            if(runIndex == 0){
                                startIndex = 0
                                front = true
                            }else{
                                let lastib = getPreviousInlineOfBody(ib)
                                let bi = getInlineBlockBodyIndex(lastib)
                                paraIndex = bi.paraIndex
                                runIndex = bi.runIndex
                                if(lastib.type == 'text'){
                                    startIndex = lastib.text.length - 1
                                    front = false
                                }else if(lastib.type == 'image'){
                                    startIndex = 0
                                    front = false
                                }
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
                }else if(ib.type == 'image'){
                    state.mutations._deleteRunImage(body.doc, paraIndex, runIndex)
                    let runsLen = para.runs.length

                    if(runsLen > 0){
                        if(runIndex > runsLen - 1){
                            runIndex = runsLen - 1
                            startIndex = para.runs[runIndex].text ? para.runs[runIndex].text.length - 1 : 0
                            front = false
                        }else{
                            front = true
                        }
                    }else{
                        // add empty text run to para
                        let emptyRun = {
                            type: 'text',
                            text: '',
                            textStyle: state.getters.cloneToolbarTextStyle(),
                        }

                        para.runs.splice(0, 0, emptyRun)
                        runIndex = 0
                        startIndex = 0
                        front = true
                    }
                    
                }
                
            }else{
                if(startIndex > 0){
                    if(ib.type == 'text'){
                        startIndex -= 1
                        state.mutations._deleteRunText(body.doc, paraIndex, runIndex, startIndex)
                    }
                }else{
                    if(runIndex == 0){
                        if(paraIndex > 0){
                            // merge to previous paragraph
                            let pi = paraIndex - 1
                            let pt = body.doc.pts[pi]
                            if(pt.type == 'para'){
                                let ri = pt.runs.length - 1
                                let preParaRun = pt.runs[ri]
    
                                state.mutations._mergePreviousPara(body, paraIndex)
                                paraIndex = pi
                                runIndex = ri
                                
                                if(preParaRun.type == 'text'){
                                    let si = preParaRun.text.length - 1
                                    startIndex = si
                                    if(startIndex < 0){
                                        startIndex = 0
                                    }
                                    front = false
                                    if(si < 0){
                                        front = true
                                    }
                                }else if(preParaRun.type == 'image'){
                                    startIndex = 0
                                    front = false
                                }
                            }
                        }
                    }else{
                        let preRun = body.doc.pts[paraIndex].runs[runIndex-1]
                        if(preRun.type == 'text'){
                            startIndex = preRun.text.length - 1

                            // delete previous inline block's text
                            state.mutations._deleteRunText(body.doc, paraIndex, runIndex-1, startIndex)

                            runIndex -= 1
                            startIndex -= 1
                            front = false
                        }else if(preRun.type == 'image'){
                            // delete previous inline block's image
                            state.mutations._deleteRunImage(body.doc, paraIndex, runIndex-1)

                            runIndex -= 1
                            startIndex = 0
                            front = true
                        }
                        
                    }
                }
            }

            // get last position bottom
            let lastPosBottom = state.mutations._getParaLastPosBottom(body, paraIndex)

            // update document paragraph
            lastPosBottom = state.mutations._updatePara(body, paraIndex, lastPosBottom)

            // adjust following spacing
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)

            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)
                
            // update page background
            state.mutations._updatePageBackground(lastPosBottom)

            // update cursor
            state.mutations._updateCursor(body, paraIndex, runIndex, startIndex, front)

            // update image resizer
            state.mutations.updateImageResizer()
        },
        splitParaRun: function(){
            let ci = state.getters.cursorBodyIndex()
            let body = ci.body
            let paraIndex = ci.paraIndex
            let runLen = body.doc.pts[paraIndex].runs.length
            let runIndex = ci.runIndex
            let runDoc = body.doc.pts[paraIndex].runs[runIndex]
            let contentLen = runDoc.type == 'text' ? runDoc.text.length : 1
            let startIndex = ci.startIndex
            let front = state.document.cursor.front
            
            if(runIndex == 0 && startIndex == 0 && front){
                // add paragraph before
                let lastPosBottom = state.mutations._addEmptyParaBefore(body, paraIndex)

                // update page background
                state.mutations._updatePageBackground(lastPosBottom)

                // update cursor
                state.mutations._updateCursor(body, paraIndex+1, 0, 0)

                // update image resizer
                state.mutations.updateImageResizer()
            }else if(runIndex == runLen - 1 && startIndex == contentLen - 1 && !front){
                // add paragraph after
                let lastPosBottom = state.mutations._addEmptyParaAfter(body, paraIndex)
                
                // update page background
                state.mutations._updatePageBackground(lastPosBottom)

                // update cursor
                state.mutations._updateCursor(body, paraIndex+1, 0, 0, true)

                // update image resizer
                state.mutations.updateImageResizer()
            }else{
                let lastPosBottom = state.mutations._splitParaInner(body, paraIndex, runIndex, front ? startIndex : startIndex + 1)
                
                // update page background
                state.mutations._updatePageBackground(lastPosBottom)

                // update cursor
                state.mutations._updateCursor(body, paraIndex+1, 0, 0, true)

                // update image resizer
                state.mutations.updateImageResizer()
            }
        },

        // ----------------------------------------------------------- table mutation --------------------------------------------------------
        addTableToBody: function(payload){
            if(!state.getters.cursorInlineBlock()){
                return
            }
            
            let rows = payload.height
            let cols = payload.width

            state.mutations.splitParaRun()

            let ci = state.getters.cursorBodyIndex()
            let body = ci.body
            let paraIndex = ci.paraIndex
            let lastPosBottom = state.mutations._addTableAfter(body, paraIndex-1, rows, cols)

            // update page background
            state.mutations._updatePageBackground(lastPosBottom)

            // update cursor
            body = body.pts[paraIndex].cells[0][0]
            state.mutations._updateCursor(body, 0, 0, 0, true)

            // update image resizer
            state.mutations.updateImageResizer()
        },
        mergeTableCell: function(payload){
            let cells = payload
            let table = cells[0].parent

            // get cells grid border
            let r0 = -1
            let c0 = -1
            let r1 = -1
            let c1 = -1
            let area = {}
            let cellsRowCol = {}
            let cell0 = null
            for(let ci = 0; ci < cells.length; ++ci){
                let cell = cells[ci]
                let {rowGrid0, colGrid0, rowGrid1, colGrid1} = getRowColGridOfTableCell(cell)
                let cr = cellsRowCol[rowGrid0]
                if(cr){
                    cr[colGrid0] = cell
                }else{
                    cr = {}
                    cr[colGrid0] = cell
                    cellsRowCol[rowGrid0] = cr
                }
                
                for(let i = rowGrid0; i <= rowGrid1; ++i){
                    for(let j = colGrid0; j <= colGrid1; ++j){
                        area[i+"_"+j] = 1
                    }
                }

                r0 = r0 < 0 ? rowGrid0 : Math.min(r0, rowGrid0)
                c0 = c0 < 0 ? colGrid0 : Math.min(c0, colGrid0)
                r1 = Math.max(r1, rowGrid1)
                c1 = Math.max(c1, colGrid1)

                if(rowGrid0 == r0 && colGrid0 == c0){
                    cell0 = cell
                }
            }

            let rowIndex = -1
            let colIndex = -1
            for(let i = 0; i < table.cells.length; ++i){
                let row = table.cells[i]
                for(let j = 0; j < row.length; ++j){
                    let col = row[j]
                    if(col == cell0){
                        rowIndex = i
                        colIndex = j

                        i = table.cells.length
                        break
                    }
                }
            }

            // check if cells grid is fully covered
            for(let i = r0; i <= r1; ++i){
                for(let j = c0; j <= c1; ++j){
                    if(area[i+"_"+j] === undefined){
                        return
                    }
                }
            }

            // collect cell pts
            let allPts = cell0.doc.pts
            for(let i = r0; i <= r1; ++i){
                let cr = cellsRowCol[i]
                if(!cr){
                    continue
                }

                for(let j = c0; j <= c1; ++j){
                    let cc = cr[j]
                    if(!cc || cc === cell0){
                        continue
                    }
                    
                    allPts = allPts.concat(cc.doc.pts)
                }
            }
            cell0.doc.pts = allPts

            // remove other cell
            let otherCells = cells.filter(c=>c!==cell0)
            for(let i = 0; i < table.cells.length; ++i){
                let row = table.cells[i]
                let rowDoc = table.doc.cells[i]
                
                let newRowDoc = []
                row.forEach((c,ri)=>{
                    let ci = otherCells.indexOf(c)
                    if(ci < 0){
                        newRowDoc.push(rowDoc[ri])
                    }
                })
                table.doc.cells[i] = newRowDoc
            }

            // change cell0 rowspan and colspan
            cell0.doc.rowspan = r1 - r0 + 1
            cell0.doc.colspan = c1 - c0 + 1

            // update table
            let body = table.parent
            let ptIndex = body.pts.indexOf(table)

            // get last position bottom
            let lastPosBottom = state.mutations._getParaLastPosBottom(body, ptIndex-1)
                        
            // update document paragraph
            lastPosBottom = state.mutations._updateTable(body, ptIndex, lastPosBottom)

            // adjust following spacing
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, ptIndex+1, lastPosBottom)

            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)

            // update page background
            state.mutations._updatePageBackground(lastPosBottom)

            // update cursor
            let cbody = body.pts[ptIndex].cells[rowIndex][colIndex]
            state.mutations._updateCursor(cbody, 0, 0, 0, true)

            // update image resizer
            state.mutations.updateImageResizer()
        },
        splitTableCell: function(payload){
            let cell = payload
            let table = cell.parent

            let rowIndex = -1
            let colIndex = -1
            for(let i = 0; i < table.cells.length; ++i){
                let row = table.cells[i]
                for(let j = 0; j < row.length; ++j){
                    let col = row[j]
                    if(col == cell){
                        rowIndex = i
                        colIndex = j

                        i = table.cells.length
                        break
                    }
                }
            }
            
            let {rowGrid0, colGrid0, rowGrid1, colGrid1} = getRowColGridOfTableCell(cell)

            // add cells
            let rowspan = cell.doc.rowspan
            let colspan = cell.doc.colspan
            for(let rs = 0; rs < rowspan; ++rs){
                let row = table.cells[rowIndex + rs]
                let rowDoc = table.doc.cells[rowIndex + rs]
                
                // find start grid col
                let ci = -1
                for(let j = 0; j < row.length; ++j){
                    let col = row[j]
                    let c0 = getRowColGridOfTableCell(col).colGrid0
                    if(c0 == colGrid0){
                        ci = j
                        break
                    }
                }

                for(let cs = 1; cs <= colspan - (rs==0?1:0); ++cs){
                    rowDoc.splice(ci + cs, 0, buildEmptyTableCell())
                }
            }

            // change cell rowspan and colspan
            cell.doc.rowspan = 1
            cell.doc.colspan = 1

            // update table
            let body = table.parent
            let ptIndex = body.pts.indexOf(table)

            // get last position bottom
            let lastPosBottom = state.mutations._getParaLastPosBottom(body, ptIndex-1)
                        
            // update document paragraph
            lastPosBottom = state.mutations._updateTable(body, ptIndex, lastPosBottom)

            // adjust following spacing
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, ptIndex+1, lastPosBottom)

            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)

            // update page background
            state.mutations._updatePageBackground(lastPosBottom)

            // update cursor
            let cbody = body.pts[ptIndex].cells[rowIndex][colIndex]
            state.mutations._updateCursor(cbody, 0, 0, 0, true)

            // update image resizer
            state.mutations.updateImageResizer()
        },
        updateTableGrid: function(payload){
            let table = payload.table
            let columnIndex = payload.columnIndex
            let columnWidth = payload.columnWidth

            table.doc.grid[columnIndex] = columnWidth

            let body = table.parent
            let ptIndex = body.pts.indexOf(table)

            // get last position bottom
            let lastPosBottom = state.mutations._getParaLastPosBottom(body, ptIndex-1)
                        
            // update document paragraph
            lastPosBottom = state.mutations._updateTable(body, ptIndex, lastPosBottom)

            // adjust following spacing
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, ptIndex+1, lastPosBottom)

            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)

            // update page background
            state.mutations._updatePageBackground(lastPosBottom)

            // update cursor
            let ci = state.getters.cursorBodyIndex()
            let front = state.document.cursor.front
            let cbody = ci.body
            let newBody = state.getters._matchTableCell(table, body.pts[ptIndex], cbody)
            if(newBody){
                cbody = newBody
            }
            let paraIndex = ci.paraIndex
            let runIndex = ci.runIndex
            let startIndex = ci.startIndex
            state.mutations._updateCursor(cbody, paraIndex, runIndex, startIndex, front)

            // update image resizer
            state.mutations.updateImageResizer()
        },
        deleteTableFromBody: function(table){
            let body = table.parent
            let ptIndex = body.pts.indexOf(table)
            let lastPosBottom = state.mutations._deletePt(body, ptIndex)

            // update page background
            state.mutations._updatePageBackground(lastPosBottom)

            // update cursor
            state.mutations._updateCursor(body, ptIndex, 0, 0, true)

            // update image resizer
            state.mutations.updateImageResizer()
        },
        deleteTableRowCol: function(payload){
            let table = payload.table

            let rowIndex = payload.rowIndex
            let columnIndex = payload.columnIndex

            if(rowIndex !== undefined){
                if(table.doc.cells.length == 1){
                    state.mutations.deleteTableFromBody(table)
                    return
                }else{
                    table.doc.cells.splice(rowIndex, 1)
                }
                
            }

            if(columnIndex !== undefined){
                if(table.doc.grid.length == 1){
                    state.mutations.deleteTableFromBody(table)
                    return
                }else{
                    table.doc.cells.forEach(r=>r.splice(columnIndex, 1))
                    table.doc.grid.splice(columnIndex, 1)
                }
                
            }

            let body = table.parent
            let ptIndex = body.pts.indexOf(table)

            // get last position bottom
            let lastPosBottom = state.mutations._getParaLastPosBottom(body, ptIndex-1)
                        
            // update document paragraph
            lastPosBottom = state.mutations._updateTable(body, ptIndex, lastPosBottom)

            // adjust following spacing
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, ptIndex+1, lastPosBottom)

            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)

            // update page background
            state.mutations._updatePageBackground(lastPosBottom)

            // update cursor
            let ci = state.getters.cursorBodyIndex()
            let front = state.document.cursor.front
            let cbody = ci.body
            let paraIndex = ci.paraIndex
            let runIndex = ci.runIndex
            let startIndex = ci.startIndex
            let newBody = state.getters._matchTableCell(table, body.pts[ptIndex], cbody, rowIndex, columnIndex)
            if(newBody === false){

            }else if(newBody === null){
                cbody = body
                paraIndex = ptIndex + 1
                runIndex = 0
                startIndex = 0
                front = true
            }else{
                cbody = newBody
            }

            state.mutations._updateCursor(cbody, paraIndex, runIndex, startIndex, front)

            // update image resizer
            state.mutations.updateImageResizer()
        },
        
        /***********************************************************************************************************************************
         *                                                        private muations
         ***********************************************************************************************************************************/

        // ------------------------------------------------------- private run mutation ------------------------------------------------------------
        _deleteRun(bodyDoc, paraIndex, runIndex){
            var para = bodyDoc.pts[paraIndex]
            para.runs.splice(runIndex, 1)
        },
        _deleteRunImage(bodyDoc, paraIndex, runIndex){
            var para = bodyDoc.pts[paraIndex]
            para.runs.splice(runIndex, 1)
        },
        _deleteRunText(bodyDoc, paraIndex, runIndex, startIndex){
            var para = bodyDoc.pts[paraIndex]
            var run = para.runs[runIndex]
            var leftText = run.text.substr(0, startIndex)
            var rightText = run.text.substr(startIndex+1)

            run.text = leftText + rightText
        },
        _addRunTextAfter(bodyDoc, paraIndex, runIndex, text, textStyle){
            let r = {
                type: 'text',
                text: text,
                textStyle: textStyle,
            }

            bodyDoc.pts[paraIndex].runs.splice(runIndex, 0, r)
        },
        _addRunImageAfter(bodyDoc, paraIndex, runIndex, image, imageStyle){
            let r = {
                type: 'image',
                image: image,
                imageStyle: imageStyle,
            }

            bodyDoc.pts[paraIndex].runs.splice(runIndex, 0, r)
        },
        _spliceRunText(bodyDoc, paraIndex, runIndex, startIndex, text, textStyle){
            let run = bodyDoc.pts[paraIndex].runs[runIndex]
            let leftText = run.text.substr(0, startIndex)
            let rightText = run.text.substr(startIndex)
            let oldTextStyle = run.textStyle
            let textStyleEqual = textStyle ? isTextStyleEqual(oldTextStyle, textStyle) : false
            
            if(textStyle){
                if(textStyleEqual){
                    run.text = leftText + text + rightText

                    return false
                }else{
                    run.text = leftText
    
                    let newRun = {
                        type: 'text',
                        text: text,
                        textStyle: textStyle,
                    }
                    bodyDoc.pts[paraIndex].runs.splice(runIndex+1, 0, newRun)
        
                    if(rightText){
                        let rightRun = {
                            type: 'text',
                            text: rightText,
                            textStyle: oldTextStyle,
                        }
                        bodyDoc.pts[paraIndex].runs.splice(runIndex+2, 0, rightRun)
                    }

                    return true
                }
            }else{
                run.text = leftText + text + rightText

                return false
            }
        },
        _splitRunText(bodyDoc, paraIndex, runIndex, startIndex, endIndex){
            let run = bodyDoc.pts[paraIndex].runs[runIndex]
            if(startIndex == 0){
                startIndex = endIndex+1
                endIndex = run.text.length - 1
            }
            let leftText = run.text.substring(0, startIndex)
            let midText = run.text.substring(startIndex, endIndex+1)
            let rightText = run.text.substr(endIndex+1)
            let oldTextStyle = run.textStyle
            
            run.text = leftText
    
            if(midText){
                let newMidRun = {
                    type: 'text',
                    text: midText,
                    textStyle: oldTextStyle,
                    startIndex: 0,
                }
                bodyDoc.pts[paraIndex].runs.splice(runIndex+1, 0, newMidRun)
            }

            if(rightText){
                let rightRun = {
                    type: 'text',
                    text: rightText,
                    textStyle: oldTextStyle,
                    startIndex: 0,
                }
                bodyDoc.pts[paraIndex].runs.splice(runIndex+2, 0, rightRun)
            }

        },
        _spliceRunImage(bodyDoc, paraIndex, runIndex, startIndex, image, imageStyle){
            let run = bodyDoc.pts[paraIndex].runs[runIndex]
            let leftText = run.text.substr(0, startIndex)
            let rightText = run.text.substr(startIndex)
            let oldTextStyle = run.textStyle
            
            run.text = leftText
    
            let newRun = {
                type: 'image',
                image: image,
                imageStyle: imageStyle,
            }
            bodyDoc.pts[paraIndex].runs.splice(runIndex+1, 0, newRun)

            if(rightText){
                let rightRun = {
                    type: 'text',
                    text: rightText,
                    textStyle: oldTextStyle,
                }
                bodyDoc.pts[paraIndex].runs.splice(runIndex+2, 0, rightRun)
            }
        },
        _updateRunImageStyle(bodyDoc, paraIndex, runIndex, imageStyle){
            let run = bodyDoc.pts[paraIndex].runs[runIndex]
            run.imageStyle = imageStyle
        },

        // -------------------------------------------------------- private para/table mutation -----------------------------------------------------
        _getParaLastPosBottom(body, paraIndex){
            let lastPosBottom = 0
            
            while(body){
                
                for(let i = 0 ; i < paraIndex; ++i){
                    let pt = body.pts[i]
                    if(pt.type == 'para'){
                        lastPosBottom += pt.paraHeight
                    }else if(pt.type == 'table'){
                        lastPosBottom += pt.tableHeight
                    }
                }

                let bodyParent = body.parent
                if(!bodyParent){
                    lastPosBottom += body.doc.grid.marginTop
                    break
                }else{
                    if(bodyParent.type == 'table'){
                        for(let i = 0; i < bodyParent.cells.length; ++i){
                            let row = bodyParent.cells[i]
                            let colHeights = []
                            let found = false
                            let colCount = 0
                            for(let j = 0; j < row.length; ++j){
                                let col = row[j]

                                if(col == body){
                                    found = true
                                    break
                                }
                                
                                if(col.doc.rowspan == 1){
                                    colHeights.push(col.doc.grid.height)
                                }

                                colCount += 1
                            }
                            if(colCount == row.length){
                                lastPosBottom += Math.max(...colHeights)
                            }
                            if(found){
                                break
                            }
                        }
    
                        body = bodyParent.parent
                        paraIndex = body.pts.indexOf(bodyParent)
                    }else{
                        break
                    }
                }
                
            }

            return lastPosBottom
        },
        _deletePt(body, ptIndex){
            let lastPosBottom = state.mutations._getParaLastPosBottom(body, ptIndex)

            body.pts[ptIndex].obj.el.remove()
            body.doc.pts.splice(ptIndex, 1)
            body.pts.splice(ptIndex, 1)

            // adjust following page paragraph spacing
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, ptIndex, lastPosBottom)
                                        
            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)

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
        _splitParaInner(body, paraIndex, runIndex, startIndex){
            // skip previous page paragraphs
            var lastPosBottom = body.doc.grid.marginTop
            for(let i = 0 ; i < paraIndex; ++i){
                let pt = body.pts[i]
                if(pt.type == 'para'){
                    lastPosBottom += body.pts[i].paraHeight
                }else if(pt.type == 'table'){
                    lastPosBottom += body.pts[i].tableHeight
                }
                
            }

            var para = body.doc.pts[paraIndex]
            // split paragraph
            var leftPara = {
                runs: [],
                type: 'para',
                paraStyle: para.paraStyle,
            }
            var rightPara = {
                runs: [],
                type: 'para',
                paraStyle: para.paraStyle,
            }

            var oldRun = para.runs[runIndex]
            var leftRun = null
            var rightRun = null
            if(oldRun.type == 'text'){
                leftRun = {
                    type: 'text',
                    text: oldRun.text.substr(0, startIndex),
                    textStyle : oldRun.textStyle,
                }
                rightRun = {
                    type: 'text',
                    text: oldRun.text.substr(startIndex),
                    textStyle : oldRun.textStyle,
                }
            }else if(oldRun.type == 'image'){
                if(startIndex == 0){
                    leftRun = {
                        type: 'text',
                        text: '',
                        textStyle : {},
                    }
                    rightRun = {
                        type: 'image',
                        image: oldRun.image,
                        imageStyle : oldRun.imageStyle,
                    }
                }else{
                    leftRun = {
                        type: 'image',
                        image: oldRun.image,
                        imageStyle : oldRun.imageStyle,
                    }
                    rightRun = {
                        type: 'text',
                        text: '',
                        textStyle : {},
                    }
                }
            }

            for(let i = 0; i < para.runs.length; ++i){
                if(i < runIndex){
                    leftPara.runs.push(para.runs[i])
                }else if(i == runIndex){
                    if(leftRun.type == 'text'){
                        if(leftRun.text != ''){
                            leftPara.runs.push(leftRun)
                        }
                    }else if(leftRun.type == 'image'){
                        leftPara.runs.push(leftRun)
                    }
                    if(rightRun.type == 'text'){
                        if(rightRun.text != ''){
                            rightPara.runs.push(rightRun)
                        }
                    }else if(rightRun.type == 'image'){
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
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)

            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)

            return lastPosBottom
        },
        _addEmptyParaBefore(body, paraIndex){

            // skip previous page paragraphs
            var lastPosBottom = body.doc.grid.marginTop
            for(let i = 0 ; i < paraIndex; ++i){
                let pt = body.pts[i]
                if(pt.type == 'para'){
                    lastPosBottom += body.pts[i].paraHeight
                }else if(pt.type == 'table'){
                    lastPosBottom += body.pts[i].tableHeight
                }
                
            }
            
            
            // create new empty paragraph
            var emptyPara = {
                runs: [
                    {
                        type: 'text',
                        text: '',
                        textStyle: state.getters.cloneToolbarTextStyle(),
                    },
                ],
                type: 'para',
                paraStyle: state.getters.cloneToolbarParaStyle(),
            }

            var oldPara = body.pts[paraIndex]
            body.doc.pts.splice(paraIndex, 0, emptyPara)
            
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
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)

            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)

            return lastPosBottom
        },
        _addEmptyParaAfter(body, paraIndex){

            // skip previous page paragraphs
            var lastPosBottom = body.doc.grid.marginTop
            for(let i = 0 ; i < paraIndex+1; ++i){
                let pt = body.pts[i]
                if(pt.type == 'para'){
                    lastPosBottom += body.pts[i].paraHeight
                }else if(pt.type == 'table'){
                    lastPosBottom += body.pts[i].tableHeight
                }
            }
            
            // create new empty paragraph
            var emptyPara = {
                runs: [
                    {
                        type: 'text',
                        text: '',
                        textStyle: state.getters.cloneToolbarTextStyle(),
                    }
                ],
                type: 'para',
                paraStyle: state.getters.cloneToolbarParaStyle(),
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
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)
            
            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)
            
            return lastPosBottom
        },
        _updatePara(body, paraIndex, lastPosBottom){

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
            
            lastPosBottom += newPara.paraHeight
            
            return lastPosBottom
        },
        _updateParaStyle: function(body, paraIndex, paraStyle){
            var para = body.pts[paraIndex]
            para.paraStyle = paraStyle
            para.doc.paraStyle = paraStyle
            para.obj.el.style['textAlign'] = paraStyle.textAlign
        },
        _adjustParaLineFollowingSpacing(body, paraIndex, lineIndex, lastPosBottom){
            var pagePara = body.pts[paraIndex]
            var paraHeight = 0

            for(let i = 0; i < lineIndex; ++i){
                var ls = pagePara.lines[i]
                if(ls.type == 'line'){
                    paraHeight += ls.spacingHeight + ls.lineHeight
                }
            }
            
            for(let i = lineIndex; i < pagePara.lines.length; ++i){
                let ls = pagePara.lines[i]
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

            return lastPosBottom
        },
        _adjustTableRowFollowingSpacing(body, tableIndex, rowIndex, lastPosBottom){
            var pageTable = body.pts[tableIndex]
            var tableHeight = 0
            let tableMultiRowCol = []
            let rowHeights = []

            // adjust row before
            for(let i = 0; i < rowIndex; ++i){
                let row = pageTable.cells[i]
                let colHeights = []
                let tableRow = []
                for(let j = 0; j < row.length; ++j){
                    let col = row[j]
                    tableRow.push(col)
                    let rowspan = col.doc.rowspan
                    let mc = {
                        r0: i,
                        r1: i + rowspan - 1
                    }
                    if(rowspan > 1){
                        tableMultiRowCol.push(mc)
                    }
                    mc.body = col

                    if(rowspan == 1){
                        colHeights.push(col.bodyHeight)
                    }
                }
                let rowHeight = Math.max(...colHeights)
                rowHeights.push(rowHeight)
                
                // update the last row height of multiple-row cell
                for(let mi = 0; mi < tableMultiRowCol.length; ++mi){
                    let mrc = tableMultiRowCol[mi]
                    if(i == mrc.r1){
                        let mh = 0
                        
                        for(let ri = mrc.r0; ri <= mrc.r1; ++ri){
                            mh += rowHeights[ri]
                        }
                        
                        if(mh < mrc.body.bodyHeight){
                            let rh = mrc.body.bodyHeight - (mh - rowHeights[mrc.r1])
                            rowHeight = Math.max(rowHeight, rh)
                        }else{
                            mrc.body.doc.grid.height = mh
                            let td = goog.dom.getParentElement(mrc.body.obj.el)
                            td.style.height = rowHeight+'px'
                        }
                    }
                }
                
                tableRow.forEach(r=>{
                    if(r.doc.rowspan == 1){
                        r.doc.grid.height = rowHeight
                    }
                })

                for(let j = 0; j < row.length; ++j){
                    let col = row[j]
                    if(col.doc.rowspan == 1){
                        let td = goog.dom.getParentElement(col.obj.el)
                        td.style.height = rowHeight+'px'
                    }
                }

                tableHeight += rowHeight
            }

            // adjust row and after
            for(let i = rowIndex; i < pageTable.cells.length; ++i){
                let row = pageTable.cells[i]
                let colHeights = []
                let tableRow = []
                for(let j = 0; j < row.length; ++j){
                    let col = row[j]
                    tableRow.push(col)
                    let rowspan = col.doc.rowspan
                    let mc = {
                        r0: i,
                        r1: i + rowspan - 1
                    }
                    if(rowspan > 1){
                        tableMultiRowCol.push(mc)
                    }

                    let lpb = state.mutations._adjustBodyPtFollowingSpacing(col, 0, lastPosBottom)
                    let colHeight = lpb - lastPosBottom
                    
                    mc.body = col

                    if(rowspan == 1){
                        colHeights.push(colHeight)
                    }
                }
                let rowHeight = Math.max(...colHeights)
                rowHeights.push(rowHeight)

                // update the last row height of multiple-row cell
                for(let mi = 0; mi < tableMultiRowCol.length; ++mi){
                    let mrc = tableMultiRowCol[mi]
                    
                    if(i == mrc.r1){
                        let mh = 0
                        for(let ri = mrc.r0; ri <= mrc.r1; ++ri){
                            mh += rowHeights[ri]
                        }
                        
                        if(mh < mrc.body.bodyHeight){
                            let rh = mrc.body.bodyHeight - (mh - rowHeights[mrc.r1])
                            rowHeight = Math.max(rowHeight, rh)
                        }else{
                            mrc.body.doc.grid.height = mh
                            let td = goog.dom.getParentElement(mrc.body.obj.el)
                            td.style.height = rowHeight+'px'
                        }
                    }
                }
                
                tableRow.forEach(r=>{
                    if(r.doc.rowspan == 1){
                        r.doc.grid.height = rowHeight
                    }
                })

                for(let j = 0; j < row.length; ++j){
                    let col = row[j]
                    if(col.doc.rowspan == 1){
                        let td = goog.dom.getParentElement(col.obj.el)
                        td.style.height = rowHeight+'px'
                    }
                }

                tableHeight += rowHeight
                lastPosBottom += rowHeight
            }

            pageTable.tableHeight = tableHeight

            pageTable.obj.updateResizers()
            
            return lastPosBottom
        },
        _adjustBodyPtFollowingSpacing(body, ptIndex, lastPosBottom){
            let bodyHeight = 0
            for(let i = 0; i < ptIndex; ++i){
                let pagePt = body.pts[i]
                if(pagePt.type == 'para'){
                    bodyHeight += pagePt.paraHeight
                }else if(pagePt.type == 'table'){
                    bodyHeight += pagePt.tableHeight
                }
            }

            for(let i = ptIndex; i < body.pts.length; ++i){
                let pagePt = body.pts[i]
                if(pagePt.type == 'para'){
                    lastPosBottom = state.mutations._adjustParaLineFollowingSpacing(body, i, 0, lastPosBottom)
                    bodyHeight += pagePt.paraHeight
                }else if(pagePt.type == 'table'){
                    lastPosBottom = state.mutations._adjustTableRowFollowingSpacing(body, i, 0, lastPosBottom)
                    bodyHeight += pagePt.tableHeight
                }
            }

            body.bodyHeight = bodyHeight

            return lastPosBottom
        },
        _adjustBodyParentFollowingSpacing(body, lastPosBottom){
            let bodyParent = body.parent
            let tableIndex = -1
            while(bodyParent){
                if(bodyParent.type == 'table'){
                    let rowIndex = -1
                    for(let i = 0; i < bodyParent.cells.length; ++i){
                        let row = bodyParent.cells[i]
                        for(let j = 0; j< row.length; ++j){
                            let col = row[j]
                            if(col == body){
                                rowIndex = i
                                break
                            }
                        }
                    }
                    
                    if(rowIndex >= 0){
                        let tableParent = bodyParent.parent
                        tableIndex = tableParent.pts.indexOf(bodyParent)

                        lastPosBottom = state.mutations._getParaLastPosBottom(body, 0)
                        lastPosBottom = state.mutations._adjustTableRowFollowingSpacing(tableParent, tableIndex, rowIndex, lastPosBottom)
                    }
                }else if(bodyParent.type == 'body'){
                    if(tableIndex >= 0){
                        lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(bodyParent, tableIndex+1, lastPosBottom)
                    }

                    body = bodyParent
                }

                bodyParent = bodyParent.parent
            }

            return lastPosBottom
        },
        _updatePageBackground(lastPosBottom){
            let bodyDoc = state.document.body.doc
            let pageNo = getPageNo(lastPosBottom, bodyDoc.grid.pageHeight, bodyDoc.grid.pageSpacingHeight)
            let bgWrap = document.getElementsByClassName('page-bgs-wrap')[0]
            let oldBgs = document.getElementsByClassName('page-bg')
            let OldBgLen = oldBgs.length

            if(pageNo > OldBgLen){
                for(let i = 0; i < pageNo - OldBgLen; ++i){
                    var pageBg = new PageBackground(bodyDoc.grid.pageWidth, bodyDoc.grid.pageHeight, bodyDoc.grid.pageSpacingHeight, bodyDoc.grid.marginTop, 
                        bodyDoc.grid.marginRight, bodyDoc.grid.marginBottom, bodyDoc.grid.marginLeft, OldBgLen+i)
                    window.goog.dom.appendChild(bgWrap, pageBg.render())
                }
            }else if(pageNo < OldBgLen){
                for(let i = OldBgLen; i > pageNo; --i){
                    oldBgs[i-1].remove()
                }
            }

            bgWrap.style.height = (bodyDoc.grid.pageHeight+bodyDoc.grid.pageSpacingHeight)*pageNo+'px'
        },
        _addTableAfter(body, paraIndex, rows, cols){

            // skip previous page paragraphs
            var lastPosBottom = body.doc.grid.marginTop
            for(let i = 0 ; i < paraIndex+1; ++i){
                let pt = body.pts[i]
                if(pt.type == 'para'){
                    lastPosBottom += body.pts[i].paraHeight
                }else if(pt.type == 'table'){
                    lastPosBottom += body.pts[i].tableHeight
                }
            }
            
            // create new table
            var table = {
                type: 'table',
                grid: [],
                cells: [],
            }
            var cw = (body.doc.grid.pageWidth-body.doc.grid.marginLeft-body.doc.grid.marginRight)/cols
            for(let i = 0; i < cols; ++i){
                table.grid.push(cw)
            }
            for(let i = 0; i < rows; ++i){
                let row = []
                table.cells.push(row)
                for(let j = 0; j < cols; ++j){
                    let col = buildEmptyTableCell()
                    row.push(col)
                }
            }
            
            body.doc.pts.splice(paraIndex+1, 0, table)

            var oldPara = body.pts[paraIndex]
            var newTable = getPageTable(body.doc, body.doc.pts[paraIndex+1], lastPosBottom)
            newTable.parent = body
            body.pts.splice(paraIndex+1, 0, newTable)

            var newPageTable = new PageTable(body.doc.grid.marginLeft, newTable)
            var oldPagePara = oldPara.obj.el
            newTable.obj = newPageTable
            window.goog.dom.insertSiblingAfter(newPageTable.render(), oldPagePara)

            // adjust following page paragraph spacing
            lastPosBottom = state.mutations._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)
            
            // adjust parent following spacing
            lastPosBottom = state.mutations._adjustBodyParentFollowingSpacing(body, lastPosBottom)
            
            return lastPosBottom
        },
        _updateTable(body, ptIndex, lastPosBottom){

            // recreate current page table
            var oldTable = body.pts[ptIndex]
            var newTable = getPageTable(body.doc, body.doc.pts[ptIndex], lastPosBottom)
            newTable.parent = body
            body.pts.splice(ptIndex, 1, newTable)

            var newPageTable = new PageTable(body.doc.grid.marginLeft, newTable)
            var oldPageTable = oldTable.obj.el
            newTable.obj = newPageTable
            window.goog.dom.replaceNode(newPageTable.render(), oldPageTable)
            
            lastPosBottom += newTable.tableHeight
            
            return lastPosBottom
        },

        // ---------------------------------------------------------------- private cursor mutation -------------------------------------------------------
        _updateCursor(body, paraIndex, runIndex, startIndex, front){
            var nextStartIndex = startIndex
            var para = body.pts[paraIndex]
            for(let i = 0; i < para.lines.length; ++i){
                let ls = para.lines[i]

                for(let j = 0; j < ls.inlineBlocks.length; ++j){
                    let ib = ls.inlineBlocks[j]
                    let ibRunIndex = para.doc.runs.indexOf(ib.doc)
                    
                    if(ibRunIndex == runIndex){
                        if(ib.type == 'text'){
                            if(nextStartIndex >= ib.startIndex && nextStartIndex <= ib.startIndex + ib.text.length ){
                                state.document.cursor.inlineBlock = body.pts[paraIndex].lines[i].inlineBlocks[j]
                                state.document.cursor.inlineStartIndex = nextStartIndex - ib.startIndex
                                if(front !== undefined){
                                    state.document.cursor.front = front
                                }
                                
                            } 
                        }else if(ib.type == 'image'){
                            state.document.cursor.inlineBlock = body.pts[paraIndex].lines[i].inlineBlocks[j]
                                state.document.cursor.inlineStartIndex =0
                                if(front !== undefined){
                                    state.document.cursor.front = front
                                }
                        }
                        
                    }
                }
            }

            state.mutations._updateCursorAndInputBoxPos()
            state.mutations._updateCursorToolbarTextStyle()
            state.mutations._updateCursorToolbarParaStyle()
        },
        _updateCursorAndInputBoxPos: function(){
            // update cursor ui
            var cursor = state.document.cursor.obj
            var pos = state.getters.cursorPos()
            
            if(cursor){
                cursor.updatePos(pos.cursorPosX, pos.cursorPosY, pos.cursorHeight)
            }
            
            // update inputbox ui
            var inputBox = state.document.inputBox.obj
            if(inputBox){
                inputBox.updatePos(pos.cursorPosX, pos.cursorPosY)
            }
        },
        _updateCursorToolbarTextStyle: function(){
            let ib = state.document.cursor.inlineBlock
            
            if(ib.type == 'text'){
                let textStyle = ib.textStyle
                Object.keys(textStyle).forEach((key)=>{
                    state.mutations.setToolbarTextStyle(key, textStyle[key], true)
                })
            }
        },
        _updateCursorToolbarParaStyle: function(){
            let ib = state.document.cursor.inlineBlock
            let para = ib.parent.parent
            
            state.mutations.setToolbarParaStyle(para.paraStyle, true)
        },
    },
}

window.state = state

export default state