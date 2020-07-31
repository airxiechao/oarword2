import DocRangeSelect from '../components/DocRangeSelect'

import state from '../state'

import * as measure from '../measure'
import * as convert from '../convert'

import * as runMutation from '../mutation/runMutation'
import * as paraMutation from '../mutation/paraMutation'
import * as spacingMutation from '../mutation/spacingMutation'

import * as cursorProcess from '../process/cursorProcess'
import * as imageProcess from '../process/imageProcess'
import * as toolbarProcess from '../process/toolbarProcess'
import * as rangeProcess from '../process/rangeProcess'

export function getRangeSelectInlineBlocks() {
  let startLine = state.document.rangeSelect.start.line
  let startIb = state.document.rangeSelect.start.inlineBlock
  let startSi = state.document.rangeSelect.start.startIndex
  let startPara = startIb.parent.parent
  let startBody = startPara.parent

  let endLine = state.document.rangeSelect.end.line
  let endIb = state.document.rangeSelect.end.inlineBlock
  let endSi = state.document.rangeSelect.end.startIndex
  let endPara = endIb.parent.parent
  let endBody = endPara.parent

  if (!startLine || !endLine) {
    return []
  }

  let pi = startBody.pts.indexOf(startPara)
  let li = startPara.lines.indexOf(startLine)
  let bi = startLine.inlineBlocks.indexOf(startIb)

  let range = []
  ptLoop: for (let i = pi; i < startBody.pts.length; ++i) {
    let para = startBody.pts[i]
    if (para.type == 'table') {
      break ptLoop
    }

    for (let j = 0; j < para.lines.length; ++j) {
      if (i == pi && j == 0) {
        j = li
      }

      let line = para.lines[j]
      for (let k = 0; k < line.inlineBlocks.length; ++k) {
        if (i == pi && j == li && k == 0) {
          k = bi
        }

        let ib = line.inlineBlocks[k]

        let selectInlineBlock = ib
        let selectStartIndex = ib === startIb ? startSi : 0
        let selectEndIndex = ib === endIb ? endSi : (ib.type == 'text' ? ib.text.length - 1 : 0)

        range.push({
          inlineBlock: selectInlineBlock,
          startIndex: selectStartIndex,
          endIndex: selectEndIndex,
        })

        if (ib === endIb) {
          break ptLoop
        }
      }
    }
  }

  return range
}

export function getRangeSelectDocPts() {
  let startLine = state.document.rangeSelect.start.line
  let startIb = state.document.rangeSelect.start.inlineBlock
  let startSi = state.document.rangeSelect.start.startIndex
  let startPara = startIb.parent.parent
  let startBody = startPara.parent

  let endLine = state.document.rangeSelect.end.line
  let endIb = state.document.rangeSelect.end.inlineBlock
  let endSi = state.document.rangeSelect.end.startIndex
  let endPara = endIb.parent.parent
  let endBody = endPara.parent

  if (!startLine || !endLine) {
    return []
  }

  let pi = startBody.pts.indexOf(startPara)
  let li = startPara.lines.indexOf(startLine)
  let bi = startLine.inlineBlocks.indexOf(startIb)

  let range = []
  ptLoop: for (let i = pi; i < startBody.pts.length; ++i) {
    let para = startBody.pts[i]
    if (para.type == 'table') {
      break ptLoop
    }

    let pt = {
      type: 'para',
      paraStyle: para.doc.paraStyle,
      runs: [],
    }
    range.push(pt)

    for (let j = 0; j < para.lines.length; ++j) {
      if (i == pi && j == 0) {
        j = li
      }

      let line = para.lines[j]
      for (let k = 0; k < line.inlineBlocks.length; ++k) {
        if (i == pi && j == li && k == 0) {
          k = bi
        }

        let ib = line.inlineBlocks[k]

        let selectInlineBlock = ib
        let selectStartIndex = ib === startIb ? startSi : 0
        let selectEndIndex = ib === endIb ? endSi : (ib.type == 'text' ? ib.text.length - 1 : 0)

        if (selectInlineBlock.type == 'text') {
          pt.runs.push({
            type: 'text',
            text: selectInlineBlock.doc.text.substring(selectStartIndex, selectEndIndex + 1),
            textStyle: selectInlineBlock.doc.textStyle,
          })
        } else if (selectInlineBlock.type == 'image') {
          pt.runs.push({
            type: 'image',
            image: selectInlineBlock.doc.image,
            imageStyle: selectInlineBlock.doc.imageStyle
          })
        }

        if (ib === endIb) {
          break ptLoop
        }
      }
    }
  }

  return range
}

export function hasRangeSelectOverlays() {
  return state.document.rangeSelect.overlays.length > 0
}

export function setRangeSelectInlineBlocksTextStyleAsToolbar() {
  if (!hasRangeSelectOverlays()) {
    return
  }

  let textStyle = toolbarProcess.cloneToolbarTextStyle()
  adjustRangeSelectInlineBlock(textStyle)
}

export function updateRangeSelectDragged(dragged) {
  state.document.rangeSelect.dragged = dragged
}

export function startRangeSelect(dragger, line, inlineBlock, startIndex) {
  rangeProcess.clearRangeSelectOverlays()

  state.document.rangeSelect.dragger = dragger
  state.document.rangeSelect.start = {
    line: line,
    inlineBlock: inlineBlock,
    startIndex: startIndex,
  }

  let cursor = state.document.cursor.obj
}

export function dragRangeSelect(line, inlineBlock, startIndex) {
  rangeProcess.clearRangeSelectOverlays()

  state.document.rangeSelect.end = {
    line: line,
    inlineBlock: inlineBlock,
    startIndex: startIndex,
  }

  showRangeSelectOverlays()
}

export function endRangeSelect(line, inlineBlock, startIndex) {
  rangeProcess.clearRangeSelectOverlays()

  let dragger = state.document.rangeSelect.dragger
  if (dragger) {
    state.document.rangeSelect.dragger = null
    state.document.rangeSelect.end = {
      line: line,
      inlineBlock: inlineBlock,
      startIndex: startIndex,
    }

    showRangeSelectOverlays()
  }
}

export function showRangeSelectOverlays() {
  let range = rangeProcess.getRangeSelectInlineBlocks()
  let select = new DocRangeSelect(range)
  select.render()

  state.document.rangeSelect.overlays.push(select)

  let cursor = state.document.cursor.obj
  cursor.updateVisibility(false)
}

export function clearRangeSelectOverlays() {
  for (let i = 0; i < state.document.rangeSelect.overlays.length; ++i) {
    let overlay = state.document.rangeSelect.overlays[i]
    overlay.remove()
  }

  state.document.rangeSelect.overlays = []

  let cursor = state.document.cursor.obj
  cursor.updateVisibility(true)
}

export function updateRangeSelectStart(body, paraIndex, lineIndex, inlineBlockIndex, startIndex) {

  if (!body) {
    state.document.rangeSelect.start = {
      line: null,
      inlineBlock: null,
      startIndex: null,
    }
    return
  }

  let para = body.pts[paraIndex]
  let line = para.lines[lineIndex]
  let inlineBlock = line.inlineBlocks[inlineBlockIndex]
  state.document.rangeSelect.start = {
    line: line,
    inlineBlock: inlineBlock,
    startIndex: startIndex,
  }
}

export function updateRangeSelectEnd(body, paraIndex, lineIndex, inlineBlockIndex, startIndex) {

  if (!body) {
    state.document.rangeSelect.end = {
      line: null,
      inlineBlock: null,
      startIndex: null,
    }
    return
  }

  let para = body.pts[paraIndex]
  let line = para.lines[lineIndex]
  let inlineBlock = line.inlineBlocks[inlineBlockIndex]

  if (startIndex == -1) {
    if (inlineBlock.type == 'text') {
      let text = inlineBlock.text
      startIndex = text.length - 1
    } else {
      startIndex = 0
    }
  }

  state.document.rangeSelect.end = {
    line: line,
    inlineBlock: inlineBlock,
    startIndex: startIndex,
  }
}

export function adjustRangeSelectInlineBlock(textStyle) {
  let range = rangeProcess.getRangeSelectInlineBlocks()
  let lastBody = null
  let lastParaIndex = null

  let rangeSelectStartBody = null
  let rangeSelectStartParaIndex = null
  let rangeSelectStartLineIndex = null
  let rangeSelectStartInlineBlockIndex = null
  let rangeSelectStartStartIndex = null
  let rangeSelectStartSplit = false

  let rangeSelectEndBody = null
  let rangeSelectEndParaIndex = null
  let rangeSelectEndLineIndex = null
  let rangeSelectEndInlineBlockIndex = null
  let rangeSelectEndStartIndex = null

  for (let i = 0; i < range.length; ++i) {
    let { inlineBlock, startIndex, endIndex } = range[i]
    let body = inlineBlock.parent.parent.parent
    let bodyDoc = body.doc
    let paraDoc = inlineBlock.parent.parent.doc
    let paraIndex = bodyDoc.pts.indexOf(paraDoc)
    let runIndex = paraDoc.runs.indexOf(inlineBlock.doc)

    if (i == 0) {
      // range select start
      let { line, inlineBlock, startIndex } = state.document.rangeSelect.start
      let para = line.parent
      let lineIndex = para.lines.indexOf(line)
      let inlineBlockIndex = line.inlineBlocks.indexOf(inlineBlock)

      rangeSelectStartBody = body
      rangeSelectStartParaIndex = paraIndex
      rangeSelectStartLineIndex = lineIndex
      if (inlineBlock.type == 'text') {
        if (startIndex == 0) {
          rangeSelectStartInlineBlockIndex = inlineBlockIndex
          rangeSelectStartStartIndex = startIndex
        } else {
          rangeSelectStartInlineBlockIndex = inlineBlockIndex + 1
          rangeSelectStartStartIndex = 0
          rangeSelectStartSplit = true
        }
      } else {
        rangeSelectStartInlineBlockIndex = inlineBlockIndex
        rangeSelectStartStartIndex = startIndex
      }
    }

    if (i == range.length - 1) {
      // range select end
      let { line, inlineBlock, startIndex } = state.document.rangeSelect.end
      let para = line.parent
      let lineIndex = para.lines.indexOf(line)
      let inlineBlockIndex = line.inlineBlocks.indexOf(inlineBlock)

      rangeSelectEndBody = body
      rangeSelectEndParaIndex = paraIndex
      rangeSelectEndLineIndex = lineIndex

      if (state.document.rangeSelect.start.inlineBlock === state.document.rangeSelect.end.inlineBlock && rangeSelectStartSplit) {
        inlineBlockIndex += 1
      }

      if (inlineBlock.type == 'text') {
        rangeSelectEndInlineBlockIndex = inlineBlockIndex
        rangeSelectEndStartIndex = -1
      } else {
        rangeSelectEndInlineBlockIndex = inlineBlockIndex
        rangeSelectEndStartIndex = startIndex
      }
    }

    if (inlineBlock.type == 'text') {
      let text = inlineBlock.text
      if (startIndex > 0 || endIndex < text.length - 1) {
        startIndex += inlineBlock.startIndex
        endIndex += inlineBlock.startIndex

        runMutation._splitRunText(bodyDoc, paraIndex, runIndex, startIndex, endIndex)
        if (i == 0) {
          runIndex += 1
        }
      }

      // change text style
      if (textStyle) {
        bodyDoc.pts[paraIndex].runs[runIndex].textStyle = textStyle
      }

      // paragraph changed
      if (lastBody !== null && lastParaIndex !== null && lastParaIndex != paraIndex) {
        // update para
        let lastPosBottom = measure.getParaLastPosBottom(lastBody, lastParaIndex)
        lastPosBottom = paraMutation._updatePara(lastBody, lastParaIndex, lastPosBottom)

        // adjust following page paragraph spacing
        lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(lastBody, lastParaIndex + 1, lastPosBottom)

        // adjust parent following spacing
        lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(lastBody, lastPosBottom)
      }

      lastBody = body
      lastParaIndex = paraIndex
    }
  }

  // paragraph changed
  if (lastBody !== null && lastParaIndex !== null) {
    let lastPosBottom = measure.getParaLastPosBottom(lastBody, lastParaIndex)
    lastPosBottom = paraMutation._updatePara(lastBody, lastParaIndex, lastPosBottom)

    // adjust following page paragraph spacing
    lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(lastBody, lastParaIndex + 1, lastPosBottom)

    // adjust parent following spacing
    lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(lastBody, lastPosBottom)
  }

  // update range select
  updateRangeSelectStart(
    rangeSelectStartBody,
    rangeSelectStartParaIndex,
    rangeSelectStartLineIndex,
    rangeSelectStartInlineBlockIndex,
    rangeSelectStartStartIndex)

  updateRangeSelectEnd(
    rangeSelectEndBody,
    rangeSelectEndParaIndex,
    rangeSelectEndLineIndex,
    rangeSelectEndInlineBlockIndex,
    rangeSelectEndStartIndex
  )

  // update range select overlay
  rangeProcess.clearRangeSelectOverlays()
  showRangeSelectOverlays()

  // update cursor
  let endIb = state.document.rangeSelect.end.inlineBlock
  state.document.cursor.inlineBlock = endIb
  state.document.cursor.inlineStartIndex = endIb.type == 'text' ? endIb.text.length - 1 : 0
  state.document.cursor.front = false
  cursorProcess.updateCursorAndInputBoxPos()
  imageProcess.updateImageResizer()
}

export function deleteRangeSelectInlineBlock() {
  adjustRangeSelectInlineBlock()

  let range = rangeProcess.getRangeSelectInlineBlocks()
  let lastBody = null
  let lastParaIndex = null

  let rangeSelectStartBody = null
  let rangeSelectStartParaIndex = null
  let rangeSelectStartLineIndex = null
  let rangeSelectStartInlineBlockIndex = null
  let rangeSelectStartRunIndex = null
  let rangeSelectStartStartIndex = null
  let rangeSelectStartSplit = false

  let rangeSelectEndBody = null
  let rangeSelectEndParaIndex = null
  let rangeSelectEndLineIndex = null
  let rangeSelectEndInlineBlockIndex = null
  let rangeSelectEndStartIndex = null

  for (let i = 0; i < range.length; ++i) {
    let { inlineBlock, startIndex, endIndex } = range[i]
    let body = inlineBlock.parent.parent.parent
    let bodyDoc = body.doc
    let paraDoc = inlineBlock.parent.parent.doc
    let paraIndex = bodyDoc.pts.indexOf(paraDoc)
    let runIndex = paraDoc.runs.indexOf(inlineBlock.doc)

    if (i == 0) {
      // range select start
      rangeSelectStartBody = body
      rangeSelectStartParaIndex = paraIndex
      rangeSelectStartRunIndex = runIndex
    }

    if (i == range.length - 1) {
      // range select end
      rangeSelectEndBody = body
      rangeSelectEndParaIndex = paraIndex
    }

    // delete inline block
    runMutation._deleteRun(bodyDoc, paraIndex, runIndex)

    // paragraph changed
    if (lastBody !== null && lastParaIndex !== null && lastParaIndex != paraIndex) {
      if (lastBody.doc.pts[lastParaIndex].runs.length == 0) {
        let lastPosBottom = paraMutation._deletePt(lastBody, lastParaIndex)

        // adjust following page paragraph spacing
        lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(lastBody, lastParaIndex, lastPosBottom)

        // adjust parent following spacing
        lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(lastBody, lastPosBottom)

        body = null
        paraIndex = null
      } else {
        let lastPosBottom = measure.getParaLastPosBottom(lastBody, lastParaIndex)
        lastPosBottom = paraMutation._updatePara(lastBody, lastParaIndex, lastPosBottom)

        // adjust following page paragraph spacing
        lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(lastBody, lastParaIndex + 1, lastPosBottom)

        // adjust parent following spacing
        lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(lastBody, lastPosBottom)
      }
    }

    lastBody = body
    lastParaIndex = paraIndex
  }

  // paragraph changed
  if (lastBody !== null && lastParaIndex !== null) {
    if (lastBody.doc.pts[lastParaIndex].runs.length == 0) {
      let lastPosBottom = paraMutation._deletePt(lastBody, lastParaIndex)

      // adjust following page paragraph spacing
      lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(lastBody, lastParaIndex, lastPosBottom)

      // adjust parent following spacing
      lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(lastBody, lastPosBottom)
    } else {
      if (rangeSelectEndParaIndex != rangeSelectStartParaIndex) {
        paraMutation._mergePreviousPara(lastBody, lastParaIndex)
        lastParaIndex -= 1
      }

      let lastPosBottom = measure.getParaLastPosBottom(lastBody, lastParaIndex)
      lastPosBottom = paraMutation._updatePara(lastBody, lastParaIndex, lastPosBottom)

      // adjust following page paragraph spacing
      lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(lastBody, lastParaIndex + 1, lastPosBottom)

      // adjust parent following spacing
      lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(lastBody, lastPosBottom)
    }
  }

  // update range select
  updateRangeSelectStart(null)

  updateRangeSelectEnd(null)

  // update range select overlay
  clearRangeSelectOverlays()

  // update cursor
  let cib = null
  let csi = 0
  let cft = true
  if (rangeSelectStartBody.doc.pts[rangeSelectStartParaIndex].runs.length - 1 < rangeSelectStartRunIndex) {
    rangeSelectStartRunIndex = rangeSelectStartBody.doc.pts[rangeSelectStartParaIndex].runs.length - 1
    cib = convert.getInlineBlockByRun(rangeSelectStartBody, rangeSelectStartParaIndex, rangeSelectStartRunIndex, 0)
    if (cib.type == 'text') {
      csi = cib.text.length - 1
      cft = false
    }
  } else {
    cib = convert.getInlineBlockByRun(rangeSelectStartBody, rangeSelectStartParaIndex, rangeSelectStartRunIndex, 0)
  }

  state.document.cursor.inlineBlock = cib
  state.document.cursor.inlineStartIndex = csi
  state.document.cursor.front = cft

  cursorProcess.updateCursorAndInputBoxPos()
  imageProcess.updateImageResizer()
}