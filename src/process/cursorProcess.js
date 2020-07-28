import state from '../state'

import * as measure from '../measure'
import * as convert from '../convert'

import * as toolbarProcess from '../process/toolbarProcess'

export function cursorInlineBlock(){
    return state.document.cursor.inlineBlock
}

export function cursorBodyIndex(){
    let cb = cursorInlineBlock()
    let bi = convert.getInlineBlockBodyIndex(cb)

    return {
        body: bi.body,
        paraIndex: bi.paraIndex,
        runIndex: bi.runIndex,
        startIndex: bi.startIndex + state.document.cursor.inlineStartIndex,
    }
}

export function cursorTable(){
    let ci = cursorInlineBlock()
    if(ci){
        let parent = ci.parent.parent.parent.parent
        if(parent){
            if(parent.type == 'table'){
                return parent
            }
        }
    }

    return null
}

export function cursorPos(){
    let ib = cursorInlineBlock()
    let pos = measure.getCursorPos(ib, state.document.cursor.inlineStartIndex, state.document.cursor.front)
    return pos
}

export function setCursorObj(obj){
  state.document.cursor.obj = obj
}

export function setCursorInlineBlock(payload){
  state.document.cursor.inlineBlock = payload.inlineBlock
  state.document.cursor.inlineStartIndex = payload.inlineStartIndex
  state.document.cursor.front = payload.front

  updateCursorAndInputBoxPos()
  toolbarProcess.updateCursorToolbarTextStyle()
  toolbarProcess.updateCursorToolbarParaStyle()
}

export function resetCursorInlineBlock(){
  state.document.cursor.inlineBlock = state.document.body.pts[0].lines[0].inlineBlocks[0]
  state.document.cursor.inlineStartIndex = 0
  state.document.cursor.front = true

  updateCursorAndInputBoxPos()
  toolbarProcess.updateCursorToolbarTextStyle()
  toolbarProcess.updateCursorToolbarParaStyle()
}

export function updateCursorAndInputBoxPos(){
  // update cursor ui
  var cursor = state.document.cursor.obj
  var pos = cursorPos()
  
  if(cursor){
      cursor.updatePos(pos.cursorPosX, pos.cursorPosY, pos.cursorHeight)
  }
  
  // update inputbox ui
  var inputBox = state.document.inputBox.obj
  if(inputBox){
      inputBox.updatePos(pos.cursorPosX, pos.cursorPosY)
  }
}

export function setCursor(body, paraIndex, runIndex, startIndex, front){
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

  updateCursorAndInputBoxPos()
  toolbarProcess.updateCursorToolbarTextStyle()
  toolbarProcess.updateCursorToolbarParaStyle()
}

export function leftMoveCursor(){
  let ci = cursorBodyIndex()
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
          let lastib = convert.getPreviousInlineOfBody(ib)
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

  updateCursorAndInputBoxPos()
  toolbarProcess.updateCursorToolbarTextStyle()
  toolbarProcess.updateCursorToolbarParaStyle()
}

export function rightMoveCursor(){
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
          let nextib = convert.getNextInlineOfBody(ib)
          if(nextib){
              let ci = convert.getInlineBlockBodyIndex(nextib)
              let runIndex = ci.runIndex

              state.document.cursor.inlineBlock = nextib
              state.document.cursor.inlineStartIndex = 0
              state.document.cursor.front = runIndex == 0 ? true : false
          }
      }
  }

  updateCursorAndInputBoxPos()
  toolbarProcess.updateCursorToolbarTextStyle()
  toolbarProcess.updateCursorToolbarParaStyle()
}

export function upMoveCursor(){
  let cx = state.document.cursor.obj.el.offsetLeft

  let lastline = convert.getPreviousLineOfBody(state.document.cursor.inlineBlock)
  if(lastline){
      let ib = null
      let si = -1
      let front = false
      for(let i = 0; i < lastline.inlineBlocks.length; ++i){
          ib = lastline.inlineBlocks[i]
          let lxy = measure.measureEleDocXY(ib.obj.el)
          let lx = lxy.x
          let lw = ib.obj.el.offsetWidth
          
          if(ib.type == 'text'){
              if(cx >= lx && cx <= lx + lw){
                  let lastw = 0
                  for(let j = 1; j <= ib.text.length; ++j){
                      let t = ib.text.substr(0, j)
                      let wh = measure.measureFontTextWH(t, ib.textStyle)
          
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

  updateCursorAndInputBoxPos()
  toolbarProcess.updateCursorToolbarTextStyle()
  toolbarProcess.updateCursorToolbarParaStyle()
}

export function downMoveCursor(){
  let cx = state.document.cursor.obj.el.offsetLeft

  var nextline = convert.getNextLineOfBody(state.document.cursor.inlineBlock)
  if(nextline){
      let ib = null
      let si = -1
      let front = false
      for(let i = 0; i < nextline.inlineBlocks.length; ++i){
          ib = nextline.inlineBlocks[i]
          let lxy = measure.measureEleDocXY(ib.obj.el)
          let lx = lxy.x
          let lw = ib.obj.el.offsetWidth

          if(ib.type == 'text'){
              if(cx >= lx && cx <= lx + lw){
                  let lastw = 0
                  for(let j = 1; j <= ib.text.length; ++j){
                      let t = ib.text.substr(0, j)
                      let wh = measure.measureFontTextWH(t, ib.textStyle)
          
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

  updateCursorAndInputBoxPos()
  toolbarProcess.updateCursorToolbarTextStyle()
  toolbarProcess.updateCursorToolbarParaStyle()
}