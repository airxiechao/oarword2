import state from '../state'

import * as paraMutation from '../mutation/paraMutation'

import * as cursorProcess from '../process/cursorProcess'
import * as imageProcess from '../process/imageProcess'

export function cloneToolbarTextStyle(){
    return Object.assign({}, state.toolbar.textStyle)
}

export function cloneToolbarParaStyle(){
    return Object.assign({}, state.toolbar.paraStyle)
}

export function setToolbarObj(obj){
  state.toolbar.obj = obj
}

export function setToolbarTextStyle(key, value, updateUi){
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

  cursorProcess.updateCursorAndInputBoxPos()
}

export function setToolbarParaStyle(paraStyle, updateUi){
  let textAlign = paraStyle.textAlign
  state.toolbar.paraStyle['textAlign'] = textAlign
  if(updateUi){
      state.toolbar.obj.updateTextAlign(textAlign)
  }
}

export function setCursorParaStyleAsToolbar(){
  let ci = cursorProcess.cursorBodyIndex()
  let body = ci.body
  let paraIndex = ci.paraIndex

  paraMutation._updateParaStyle(body, paraIndex, cloneToolbarParaStyle())

  cursorProcess.updateCursorAndInputBoxPos()
  imageProcess.updateImageResizer()
}

export function updateCursorToolbarTextStyle(){
    let ib = state.document.cursor.inlineBlock
    
    if(ib.type == 'text'){
        let textStyle = ib.textStyle
        Object.keys(textStyle).forEach((key)=>{
            setToolbarTextStyle(key, textStyle[key], true)
        })
    }
}

export function updateCursorToolbarParaStyle(){
    let ib = state.document.cursor.inlineBlock
    let para = ib.parent.parent
    
    setToolbarParaStyle(para.paraStyle, true)
}