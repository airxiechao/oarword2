import state from '../state'

export function setInputBoxObj(obj){
  state.document.inputBox.obj = obj
}

export function setImeStatus(imeStatus){
  var cursor = state.document.cursor.obj
  cursor.updateVisibility(!imeStatus)
}