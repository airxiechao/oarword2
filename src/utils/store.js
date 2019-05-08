import Vue from 'vue'
import Vuex from 'vuex'

import { getPagePara, getPageParas } from './convert'
import { getCursorPos } from '../utils/measure.js'
import st from '../utils/state'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        document: {
            bodyDoc: [],
            body: [],
            marginTop: 100,
            pageWidth: 800,
            pageHeight: 800 * Math.sqrt(2),
            pageSpacingHeight: 10,
            marginRight: 100,
            marginBottom: 100,
            marginLeft: 100,
        },
        cursorIndex: {
            paraIndex: -1,
            lineIndex: -1,
            inlineBlockIndex: -1,
            inlineStartIndex: -1,
        },
        imeStatus: false,
    },
    getters: {
        cursorInlineBlock: function(state){
            var cb = null
            if(state.cursorIndex.paraIndex >= 0){
                cb = state.document.body[state.cursorIndex.paraIndex].linesAndSpacings[state.cursorIndex.lineIndex].inlineBlocks[state.cursorIndex.inlineBlockIndex]
            
            }
            return cb
        },
        cursorPos: function(state, getters){
            var cursorInlineBlock = getters.cursorInlineBlock
            return getCursorPos(cursorInlineBlock, state.cursorIndex.inlineStartIndex)
        },
    },
    mutations: {
        setDocumentBody: function(state, bodyDoc){
            var documentBody = getPageParas(bodyDoc, state.document.marginTop, 
                state.document.pageWidth, state.document.pageHeight, state.document.pageSpacingHeight, 
                state.document.marginTop, state.document.marginRight, state.document.marginBottom, state.document.marginLeft)

            state.document.bodyDoc = bodyDoc
            state.document.body = documentBody

            st.mutations.setDocument(bodyDoc)
        },
        setCursorIndex: function(state, paypload){
            state.cursorIndex.paraIndex = paypload.paraIndex
            state.cursorIndex.lineIndex = paypload.lineIndex
            state.cursorIndex.inlineBlockIndex = paypload.inlineBlockIndex
            state.cursorIndex.inlineStartIndex = paypload.inlineStartIndex
        },
        setImeStatus: function(state, imeStatus){
            state.imeStatus = imeStatus
        },
        addOrUpdateParaRun: function(state, payload){
            var text = payload.text
            var textStyle = payload.textStyle

            var cb = state.document.body[state.cursorIndex.paraIndex].linesAndSpacings[state.cursorIndex.lineIndex].inlineBlocks[state.cursorIndex.inlineBlockIndex]
            var paraIndex = cb.paraIndex
            var runIndex = cb.runIndex
            var startIndex = cb.startIndex

            var run = state.document.bodyDoc[paraIndex][runIndex]
            var si = startIndex + state.cursorIndex.inlineStartIndex
            
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
                                state.cursorIndex.paraIndex = paraIndex
                                state.cursorIndex.lineIndex = i
                                state.cursorIndex.inlineBlockIndex = j
                                state.cursorIndex.inlineStartIndex = nextStartIndex - lb.startIndex
                            } 
                        }
                }
            }
        }
    }
})

export default store