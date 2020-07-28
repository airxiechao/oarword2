import state from '../state'
import * as measure from '../measure'
import * as convert from '../convert'

import * as runMutation from '../mutation/runMutation'
import * as paraMutation from '../mutation/paraMutation'
import * as spacingMutation from '../mutation/spacingMutation'

import * as cursorProcess from '../process/cursorProcess'
import * as imageProcess from '../process/imageProcess'
import * as toolbarProcess from '../process/toolbarProcess'

export function addTextToParaRun(payload){
  if(!cursorProcess.cursorInlineBlock()){
      return
  }

  let ib = state.document.cursor.inlineBlock
  let ci = cursorProcess.cursorBodyIndex()
  let body = ci.body
  let paraIndex = ci.paraIndex
  let runIndex = ci.runIndex
  let startIndex = ci.startIndex
  let front = state.document.cursor.front
  
  let text = payload.text
  let textStyle = payload.textStyle

  // update run
  let textRunInserted = false
  if(ib.type == 'text'){
      textRunInserted = runMutation._spliceRunText(body.doc, paraIndex, runIndex, front ? startIndex : startIndex + 1, text, textStyle)
  }else if(ib.type == 'image'){
      runMutation._addRunTextAfter(body.doc, paraIndex, front ? runIndex : runIndex + 1, text, textStyle)
  }

  // get last position bottom
  let lastPosBottom = measure.getParaLastPosBottom(body, paraIndex)
  
  // update document paragraph
  lastPosBottom = paraMutation._updatePara(body, paraIndex, lastPosBottom)
  
  // adjust following spacing
  lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)
  
  // adjust parent following spacing
  lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(body, lastPosBottom)
  
  // update page background
  spacingMutation._updatePageBackground(state.document.body.doc, lastPosBottom)

  // update cursor
  if(ib.type == 'text'){
      if(textRunInserted){
          let len = body.doc.pts[paraIndex].runs[runIndex+1].text.length
          cursorProcess.setCursor(body, paraIndex, runIndex+1, Math.max(len - 1, 0), false)
      }else{
          let si = startIndex + text.length
          let len = body.doc.pts[paraIndex].runs[runIndex].text.length
          if(si >= len){
              cursorProcess.setCursor(body, paraIndex, runIndex, Math.max(len - 1, 0), false)
          }else{
              cursorProcess.setCursor(body, paraIndex, runIndex, si)
          }
      }
  }else if(ib.type == 'image'){
      cursorProcess.setCursor(body, paraIndex, front ? runIndex : runIndex+1, Math.max(text.length - 1, 0), false)
  }

  // update image resizer
  imageProcess.updateImageResizer()
  
}

export function addImageToParaRun(payload){
  if(!cursorProcess.cursorInlineBlock()){
      return
  }

  let ib = state.document.cursor.inlineBlock
  let ci = cursorProcess.cursorBodyIndex()
  let body = ci.body
  let paraIndex = ci.paraIndex
  let runIndex = ci.runIndex
  let startIndex = ci.startIndex
  let front = state.document.cursor.front
  
  let image = payload.image
  let imageStyle = payload.imageStyle

  // adjust image widht and height
  let maxWidth = body.doc.grid.pageWidth - body.doc.grid.marginLeft - body.doc.grid.marginRight
  let maxHeight = body.doc.grid.pageHeight - body.doc.grid.marginTop- body.doc.grid.marginBottom

  if(imageStyle.width > maxWidth * .9){
      let oldWidth = imageStyle.width
      imageStyle.width = maxWidth * .9;
      imageStyle.height = ( imageStyle.width  / oldWidth) * imageStyle.height
  }

  if(imageStyle.height > maxHeight * .9){
      let oldHeight = imageStyle.height
      imageStyle.height = maxHeight * .9;
      imageStyle.width = ( imageStyle.height  / oldHeight) * imageStyle.width
  }

  // update run
  if(ib.type == 'text'){
      runMutation._spliceRunImage(body.doc, paraIndex, runIndex, front ? startIndex : startIndex + 1, image, imageStyle)
  }else if(ib.type == 'image'){
      runMutation._addRunImageAfter(body.doc, paraIndex, front ? runIndex : runIndex + 1, image, imageStyle)
  }

  // get last position bottom
  let lastPosBottom = measure.getParaLastPosBottom(body, paraIndex)
 
  // update document paragraph
  lastPosBottom = paraMutation._updatePara(body, paraIndex, lastPosBottom)
 
  // adjust following spacing
  lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)
  
  // adjust parent following spacing
  lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(body, lastPosBottom)
  
  // update page background
  spacingMutation._updatePageBackground(state.document.body.doc, lastPosBottom)

  // update cursor
  cursorProcess.setCursor(body, paraIndex, runIndex+1, 0, false)

  // update image resizer
  imageProcess.updateImageResizer()
}

export function updateImageStyle(payload){
            
  let ib = payload.ib
  let imageStyle = payload.imageStyle

  let bi = convert.getInlineBlockBodyIndex(ib)
  let body = bi.body
  let paraIndex = bi.paraIndex
  let runIndex = bi.runIndex

  // update run
  runMutation._updateRunImageStyle(body.doc, paraIndex, runIndex, imageStyle)

  // get last position bottom
  let lastPosBottom = measure.getParaLastPosBottom(body, paraIndex)
 
  // update document paragraph
  lastPosBottom = paraMutation._updatePara(body, paraIndex, lastPosBottom)
 
  // adjust following spacing
  lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)
  
  // adjust parent following spacing
  lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(body, lastPosBottom)
  
  // update page background
  spacingMutation._updatePageBackground(state.document.body.doc, lastPosBottom)

  // update cursor
  cursorProcess.setCursor(body, paraIndex, runIndex, 0, false)

  // update image resizer
  let cib = state.document.cursor.inlineBlock
  imageProcess.showImageResizer(cib.obj)
}

export function deleteFromParaRun(){
  let ci = cursorProcess.cursorBodyIndex()
  let ib = state.document.cursor.inlineBlock
  let front = state.document.cursor.front
  let body = ci.body
  let paraIndex = ci.paraIndex
  let runIndex = ci.runIndex
  let startIndex = ci.startIndex
  let para = body.doc.pts[paraIndex]
  let run = para.runs[runIndex]

  if(!front){
      if(ib.type == 'text'){
          runMutation._deleteRunText(body.doc, paraIndex, runIndex, startIndex)
      
          if(run.text == ''){
              if(runIndex >= 1 || (runIndex == 0 && para.runs.length > 1)){
                  para.runs.splice(runIndex, 1)

                  if(runIndex == 0){
                      startIndex = 0
                      front = true
                  }else{
                      let lastib = convert.getPreviousInlineOfBody(ib)
                      let bi = convert.getInlineBlockBodyIndex(lastib)
                      paraIndex = bi.paraIndex
                      runIndex = bi.runIndex
                      if(lastib.type == 'text'){
                          startIndex = lastib.text.length - 1
                          front = false
                      }else if(lastib.type == 'image'){
                          startIndex = 0
                          front = false
                      }
                  }
              }else{
                  front = true
              }
          }else{
              if(startIndex > 0){
                  startIndex -= 1
              }else{
                  front = true
              }
          }
      }else if(ib.type == 'image'){
          runMutation._deleteRunImage(body.doc, paraIndex, runIndex)
          let runsLen = para.runs.length

          if(runsLen > 0){
              if(runIndex > runsLen - 1){
                  runIndex = runsLen - 1
                  startIndex = para.runs[runIndex].text ? para.runs[runIndex].text.length - 1 : 0
                  front = false
              }else{
                  front = true
              }
          }else{
              // add empty text run to para
              let emptyRun = {
                  type: 'text',
                  text: '',
                  textStyle: toolbarProcess.cloneToolbarTextStyle(),
              }

              para.runs.splice(0, 0, emptyRun)
              runIndex = 0
              startIndex = 0
              front = true
          }
          
      }
      
  }else{
      if(startIndex > 0){
          if(ib.type == 'text'){
              startIndex -= 1
              runMutation._deleteRunText(body.doc, paraIndex, runIndex, startIndex)
          }
      }else{
          if(runIndex == 0){
              if(paraIndex > 0){
                  // merge to previous paragraph
                  let pi = paraIndex - 1
                  let pt = body.doc.pts[pi]
                  if(pt.type == 'para'){
                      let ri = pt.runs.length - 1
                      let preParaRun = pt.runs[ri]

                      paraMutation._mergePreviousPara(body, paraIndex)
                      paraIndex = pi
                      runIndex = ri
                      
                      if(preParaRun.type == 'text'){
                          let si = preParaRun.text.length - 1
                          startIndex = si
                          if(startIndex < 0){
                              startIndex = 0
                          }
                          front = false
                          if(si < 0){
                              front = true
                          }
                      }else if(preParaRun.type == 'image'){
                          startIndex = 0
                          front = false
                      }
                  }
              }
          }else{
              let preRun = body.doc.pts[paraIndex].runs[runIndex-1]
              if(preRun.type == 'text'){
                  startIndex = preRun.text.length - 1

                  // delete previous inline block's text
                  runMutation._deleteRunText(body.doc, paraIndex, runIndex-1, startIndex)

                  runIndex -= 1
                  startIndex -= 1
                  front = false
              }else if(preRun.type == 'image'){
                  // delete previous inline block's image
                  runMutation._deleteRunImage(body.doc, paraIndex, runIndex-1)

                  runIndex -= 1
                  startIndex = 0
                  front = true
              }
              
          }
      }
  }

  // get last position bottom
  let lastPosBottom = measure.getParaLastPosBottom(body, paraIndex)

  // update document paragraph
  lastPosBottom = paraMutation._updatePara(body, paraIndex, lastPosBottom)

  // adjust following spacing
  lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)

  // adjust parent following spacing
  lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(body, lastPosBottom)
      
  // update page background
  spacingMutation._updatePageBackground(state.document.body.doc, lastPosBottom)

  // update cursor
  cursorProcess.setCursor(body, paraIndex, runIndex, startIndex, front)

  // update image resizer
  imageProcess.updateImageResizer()
}

export function splitParaRun(){
  let ci = cursorProcess.cursorBodyIndex()
  let body = ci.body
  let paraIndex = ci.paraIndex
  let runIndex = ci.runIndex
  let startIndex = ci.startIndex
  let front = state.document.cursor.front
  let textStyle = toolbarProcess.cloneToolbarTextStyle()
  let paraStyle = toolbarProcess.cloneToolbarParaStyle()

  let lastPosBottom = paraMutation._splitPara(body, paraIndex, runIndex, startIndex, front, textStyle, paraStyle)

  // adjust following page paragraph spacing
  lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)
  
  // adjust parent following spacing
  lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(body, lastPosBottom)
  
  // update page background
  spacingMutation._updatePageBackground(state.document.body.doc, lastPosBottom)

  // update cursor
  cursorProcess.setCursor(body, paraIndex+1, 0, 0, true)

  // update image resizer
  imageProcess.updateImageResizer()
}