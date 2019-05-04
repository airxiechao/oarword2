import { getCursorPos, getPageLeftHeight } from './measure'
import { getPagePara, getPageParas } from './convert'

import PageParagraph from '../components/PageParagraph'
import PageSpacing from '../components/PageSpacing'

var state = {
    document: {
        cursor: {
            inlineBlock: null,
            inlineStartIndex: -1,
        },
        inputBox: {

        },
        bodyDoc: [],
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
        cursorPos: function(){
            var cursorInlineBlock = state.getters.cursorInlineBlock()
            var pos = getCursorPos(cursorInlineBlock, state.document.cursor.inlineStartIndex)
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
        setParaObj: function(para, obj){
            para.obj = obj
        },
        setLineSpacingObj: function(ls, obj){
            ls.obj = obj
        },
        setInlineBlockObj: function(ib, obj){
            ib.obj = obj
        },
        setDocument: function(doc){
            var documentBody = getPageParas(doc, state.document.marginTop, 
                state.document.pageWidth, state.document.pageHeight, state.document.pageSpacingHeight, 
                state.document.marginTop, state.document.marginRight, state.document.marginBottom, state.document.marginLeft)

            state.document.bodyDoc = doc
            state.document.body = documentBody
        },
        setCursorInlineBlock: function(payload){
            state.document.cursor.inlineBlock = payload.inlineBlock
            state.document.cursor.inlineStartIndex = payload.inlineStartIndex

            state.ui.updateCursorAndInputBox()
        },
        addOrUpdateParaRun: function(payload){
            var text = payload.text
            var textStyle = payload.textStyle

            var cb = state.getters.cursorInlineBlock()
            var paraIndex = cb.paraIndex
            var runIndex = cb.runIndex
            var startIndex = cb.startIndex

            var run = state.document.bodyDoc[paraIndex][runIndex]
            var si = startIndex + state.document.cursor.inlineStartIndex
            
            var leftText = run.text.substr(0, si)
            var rightText = run.text.substr(si)

            run.text = leftText + text + rightText

            // update document paragraph
            var lastPosBottom = state.document.marginTop
            for(var i = 0 ; i < paraIndex; ++i){
                lastPosBottom += state.document.body[i].paraHeight
            }
            var oldPara = state.document.body[paraIndex]
            var newPara = getPagePara(state.document.bodyDoc[paraIndex], lastPosBottom, paraIndex,
                state.document.pageWidth, state.document.pageHeight, state.document.pageSpacingHeight, 
                state.document.marginTop, state.document.marginRight, state.document.marginBottom, state.document.marginLeft)
            state.document.body.splice(paraIndex, 1, newPara)

            var newPagePara = new PageParagraph(state.document.marginLeft, state.document.pageWidth - state.document.marginLeft - state.document.marginRight, newPara)
            var oldPagePara = oldPara.obj.el
            state.mutations.setParaObj(newPara, newPagePara)
            window.goog.dom.replaceNode(newPagePara.render(), oldPagePara)
            

            lastPosBottom += newPara.paraHeight
            for(var i = paraIndex + 1; i < state.document.body.length; ++i){
                var pagePara = state.document.body[i]
                var paraHeight = 0

                for(var j = 0; j < pagePara.linesAndSpacings.length; ++j){
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
                            state.mutations.setLineSpacingObj(spacing, pageSpacing)
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
            
            // update cursor
            var nextStartIndex = si + 1
            var para = state.document.body[paraIndex]
            for(var i = 0; i < para.linesAndSpacings.length; ++i){
                var ls = para.linesAndSpacings[i]
                if(ls.type == 'spacing'){
                    continue
                }

                for(var j = 0; j < ls.inlineBlocks.length; ++j){
                        var lb = ls.inlineBlocks[j]

                        if(lb.runIndex == runIndex){
                            if(nextStartIndex >= lb.startIndex && nextStartIndex < lb.startIndex + lb.text.length ){
                                state.document.cursor.inlineBlock = state.document.body[paraIndex].linesAndSpacings[i].inlineBlocks[j]
                                state.document.cursor.inlineStartIndex = nextStartIndex - lb.startIndex
                            } 
                        }
                }
            }

            state.ui.updateCursorAndInputBox()
        },
    },
    ui: {
        updateCursorAndInputBox: function(){
            // update cursor ui
            var cursor = state.document.cursor.obj
            var pos = state.getters.cursorPos()
            cursor.updatePos(pos.cursorPosX, pos.cursorPosY, pos.cursorHeight)

            // update inputbox ui
            var inputBox = state.document.inputBox.obj
            var pos = state.getters.cursorPos()
            inputBox.updatePos(pos.cursorPosX, pos.cursorPosY)
        },
    }
}

window.state = state

export default state