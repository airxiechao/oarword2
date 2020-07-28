import state from '../state'

export function setImageResizerObj(obj){
  state.document.imageResizer.obj = obj
}

export function showImageResizer(targetObj){
  state.document.imageResizer.obj.updateTarget(targetObj)
  state.document.imageResizer.obj.show()
}

export function hideImageResizer(){
  state.document.imageResizer.obj.hide()
}

export function updateImageResizer(){
  state.document.imageResizer.obj.updateTarget()
}