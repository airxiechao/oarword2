import state from '../state'

import * as convert from '../convert'

export function setDocument(doc){
  var body = convert.getPageBody(doc, doc.grid.marginTop)
  
  state.document.body = body
}

export function setDocumentObj(obj){
  state.document.obj = obj
}