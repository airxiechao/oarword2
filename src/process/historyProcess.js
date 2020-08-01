import { cloneDeep } from 'lodash'

import state from '../state'

import Document from '../components/Document'

import * as cursorProcess from '../process/cursorProcess'
import * as documentProcess from '../process/documentProcess'

export function pushToHistory(){

  let bodyDoc = cloneDeep(state.document.body.doc)

  // pop above top
  for(let i = state.document.history.stack.length-1; i > state.document.history.top; --i){
      state.document.history.stack.pop()
  }

  state.document.history.stack.push(bodyDoc)
  state.document.history.top += 1
  if(state.document.history.top < 0){
      state.document.history.top = 0
  }
}

export function  goBackwardHistory(){
  state.document.history.top -= 1
  let bodyDoc = state.document.history.stack[state.document.history.top]
  if(bodyDoc){
      documentProcess.setDocument(cloneDeep(bodyDoc))
      documentProcess.updateDocument()
  }
}

export function goForwardHistory(){
  if(state.document.history.top >= state.document.history.stack.length -1){
      return
  }
  
  state.document.history.top += 1
  let bodyDoc = state.document.history.stack[state.document.history.top]
  if(bodyDoc){
      documentProcess.setDocument(cloneDeep(bodyDoc))
      documentProcess.updateDocument()
  }
}