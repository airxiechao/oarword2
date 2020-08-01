import state from '../state'

import * as convert from '../convert'

import Document from '../components/Document'
import * as cursorProcess from '../process/cursorProcess'

export function setDocument(doc){
  var body = convert.getPageBody(doc, doc.grid.marginTop)
  
  state.document.body = body
}

export function updateDocument(){
  // update doc
  let oldDoc =  state.document.obj.el
  let doc = new Document(state.document.body);   
  window.goog.dom.replaceNode(doc.render(), oldDoc)
  doc.resizeHandler()

  // reset cursor
  cursorProcess.resetCursorInlineBlock()
}

export function setDocumentObj(obj){
  state.document.obj = obj
}