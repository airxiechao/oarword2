import { getCursorPos } from './measure'
import { getPagePara, getPageParas } from './convert'

var state = {
    document: {
        cursor: {
            paraIndex: -1,
            lineIndex: -1,
            inlineBlockIndex: -1,
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
            var cb = null
            if(state.document.cursor.paraIndex >= 0){
                cb = state.document.body[state.document.cursor.paraIndex].linesAndSpacings[state.document.cursor.lineIndex].inlineBlocks[state.document.cursor.inlineBlockIndex]
            }
            return cb
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
        setParaObj: function(paraIndex, obj){
            state.document.body[paraIndex].obj = obj
        },
        setLineSpacingObj: function(paraIndex, lineSpacingIndex, obj){
            state.document.body[paraIndex].linesAndSpacings[lineSpacingIndex].obj = obj
        },
        setInlineBlockObj: function(paraIndex, lineSpacingIndex, inineBlockIndex, obj){
            state.document.body[paraIndex].linesAndSpacings[lineSpacingIndex].inlineBlocks[inineBlockIndex].obj = obj
        },
        setDocument: function(doc){
            var documentBody = getPageParas(doc, state.document.marginTop, 
                state.document.pageWidth, state.document.pageHeight, state.document.pageSpacingHeight, 
                state.document.marginTop, state.document.marginRight, state.document.marginBottom, state.document.marginLeft)

            state.document.bodyDoc = doc
            state.document.body = documentBody
        },
        setCursorIndex: function(payload){
            state.document.cursor.paraIndex = payload.paraIndex
            state.document.cursor.lineIndex = payload.lineIndex
            state.document.cursor.inlineBlockIndex = payload.inlineBlockIndex
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

            var documentBody = getPageParas(state.document.bodyDoc, state.document.marginTop, 
                state.document.pageWidth, state.document.pageHeight, state.document.pageSpacingHeight, 
                state.document.marginTop, state.document.marginRight, state.document.marginBottom, state.document.marginLeft)

            state.document.body = documentBody
            
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
                                state.document.cursor.paraIndex = paraIndex
                                state.document.cursor.lineIndex = i
                                state.document.cursor.inlineBlockIndex = j
                                state.document.cursor.inlineStartIndex = nextStartIndex - lb.startIndex
                            } 
                        }
                }
            }

            state.ui.updateDocument()
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
        updateDocument: function(){
            var doc = state.document.obj
            doc.updateDoc(state.document.body)
        }
    }
}

window.state = state

export default state