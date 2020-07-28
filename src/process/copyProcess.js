import state from '../state'

import * as measure from '../measure'

import * as runMutation from '../mutation/runMutation'
import * as paraMutation from '../mutation/paraMutation'
import * as spacingMutation from '../mutation/spacingMutation'
import * as cursorProcess from '../process/cursorProcess'
import * as rangeProcess from '../process/rangeProcess'
import * as imageProcess from '../process/imageProcess'
import * as toolbarProcess from '../process/toolbarProcess'

export function setCopy(docPts){
  state.document.copy = docPts
}

export function pasteCopy(){
  if(state.document.copy.length == 0){
      return
  }

  if(!cursorProcess.cursorInlineBlock){
      return
  }

  let ib = state.document.cursor.inlineBlock
  let ci = cursorProcess.cursorBodyIndex()
  let body = ci.body
  let paraIndex = ci.paraIndex
  let runIndex = ci.runIndex
  let startIndex = ci.startIndex
  let front = state.document.cursor.front

  // split run
  let splited = false
  if(ib.type == 'text'){
      splited = runMutation._splitRunText(body.doc, paraIndex, runIndex, 0, front ? Math.max(0, startIndex-1) : startIndex)
  }
  if(splited){
      runIndex += 1
  }

  for(let i = 0; i < state.document.copy.length; ++i){
      let docPt = state.document.copy[i]

      if(i > 0){
          paraIndex += 1
          runIndex = 0
      }

      // add runs to para
      for(let j = 0; j < docPt.runs.length; ++j){
          let run = docPt.runs[j]

          if(j > 0){
              runIndex += 1
          }

          if(run.type == 'text'){
              runMutation._addRunTextAfter(body.doc, paraIndex, runIndex, run.text, run.textStyle)
          }else if(ib.type == 'image'){
              runMutation._addRunImageAfter(body.doc, paraIndex, runIndex, run.image, run.imageStyle)
          }
          
          startIndex = run.type == 'text' ? run.text.length - 1 : 0
      }

      // break para
      
      if(state.document.copy.length > 1){
          let textStyle = toolbarProcess.cloneToolbarTextStyle()
          let paraStyle = toolbarProcess.cloneToolbarParaStyle()
          let lastPosBottom = paraMutation._splitPara(body, paraIndex, runIndex, startIndex, false, textStyle, paraStyle)
          
          // adjust following page paragraph spacing
          lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(body, paraIndex+1, lastPosBottom)
          
          // adjust parent following spacing
          lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(body, lastPosBottom)
      }

      // update para

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
  }

  // update range select
  rangeProcess.updateRangeSelectStart(null)
  rangeProcess.updateRangeSelectEnd(null)
  rangeProcess.clearRangeSelectOverlays()

  // update cursor
  cursorProcess.setCursor(body, paraIndex, runIndex, startIndex, false)
  cursorProcess.updateCursorAndInputBoxPos()

  // update image resizer
  imageProcess.updateImageResizer()

}