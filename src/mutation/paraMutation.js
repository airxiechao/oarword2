import * as measure from '../measure'
import * as convert from '../convert'
import PageParagraph from '../components/PageParagraph'

export function _deletePt(body, ptIndex){
  let lastPosBottom = measure.getParaLastPosBottom(body, ptIndex)

  body.pts[ptIndex].obj.el.remove()
  body.doc.pts.splice(ptIndex, 1)
  body.pts.splice(ptIndex, 1)

  return lastPosBottom
}

export function _mergePreviousPara(body, paraIndex){
  let bodyDoc = body.doc
  if(paraIndex > 0){
      var prePara = bodyDoc.pts[paraIndex-1]
      var para = bodyDoc.pts[paraIndex]

      for(let i = 0; i < para.runs.length; ++i){
          let r = para.runs[i]
          if(r.text != ''){
              prePara.runs.push(para.runs[i])
          }
      }

      if(prePara.runs[0].text == '' && prePara.runs.length > 1){
          prePara.runs.splice(0,1)
      }

      bodyDoc.pts.splice(paraIndex, 1)
      body.pts[paraIndex].obj.el.remove()
      body.pts.splice(paraIndex, 1)
  }
  
}

export function _splitParaInner(body, paraIndex, runIndex, startIndex){
  // skip previous page paragraphs
  var lastPosBottom = body.doc.grid.marginTop
  for(let i = 0 ; i < paraIndex; ++i){
      let pt = body.pts[i]
      if(pt.type == 'para'){
          lastPosBottom += body.pts[i].paraHeight
      }else if(pt.type == 'table'){
          lastPosBottom += body.pts[i].tableHeight
      }
      
  }

  var para = body.doc.pts[paraIndex]
  // split paragraph
  var leftPara = {
      runs: [],
      type: 'para',
      paraStyle: para.paraStyle,
  }
  var rightPara = {
      runs: [],
      type: 'para',
      paraStyle: para.paraStyle,
  }

  var oldRun = para.runs[runIndex]
  var leftRun = null
  var rightRun = null
  if(oldRun.type == 'text'){
      leftRun = {
          type: 'text',
          text: oldRun.text.substr(0, startIndex),
          textStyle : oldRun.textStyle,
      }
      rightRun = {
          type: 'text',
          text: oldRun.text.substr(startIndex),
          textStyle : oldRun.textStyle,
      }
  }else if(oldRun.type == 'image'){
      if(startIndex == 0){
          leftRun = {
              type: 'text',
              text: '',
              textStyle : {},
          }
          rightRun = {
              type: 'image',
              image: oldRun.image,
              imageStyle : oldRun.imageStyle,
          }
      }else{
          leftRun = {
              type: 'image',
              image: oldRun.image,
              imageStyle : oldRun.imageStyle,
          }
          rightRun = {
              type: 'text',
              text: '',
              textStyle : {},
          }
      }
  }

  for(let i = 0; i < para.runs.length; ++i){
      if(i < runIndex){
          leftPara.runs.push(para.runs[i])
      }else if(i == runIndex){
          if(leftRun.type == 'text'){
              if(leftRun.text != ''){
                  leftPara.runs.push(leftRun)
              }
          }else if(leftRun.type == 'image'){
              leftPara.runs.push(leftRun)
          }
          if(rightRun.type == 'text'){
              if(rightRun.text != ''){
                  rightPara.runs.push(rightRun)
              }
          }else if(rightRun.type == 'image'){
              rightPara.runs.push(rightRun)
          }
      }else{
          rightPara.runs.push(para.runs[i])
      }
  }
  
  if(leftPara.runs.length == 0){
      leftPara = rightPara
      rightPara.runs = []
  }
  
  // replace by left paragraph
  body.doc.pts.splice(paraIndex, 1, leftPara)

  var oldPara = body.pts[paraIndex]
  var newPara = convert.getPagePara(body.doc.pts[paraIndex], lastPosBottom,
      body.doc.grid.pageWidth, body.doc.grid.pageHeight, body.doc.grid.pageSpacingHeight, 
      body.doc.grid.marginTop, body.doc.grid.marginRight, body.doc.grid.marginBottom, body.doc.grid.marginLeft)
  newPara.parent = body
  body.pts.splice(paraIndex, 1, newPara)

  var newPagePara = new PageParagraph(body.doc.grid.marginLeft, newPara)
  var oldPagePara = oldPara.obj.el
  newPara.obj = newPagePara
  window.goog.dom.replaceNode(newPagePara.render(), oldPagePara)

  lastPosBottom += newPara.paraHeight

  // add right paragraph
  if(rightPara.runs.length > 0){
      paraIndex += 1
      body.doc.pts.splice(paraIndex, 0, rightPara)

      var newParaRight = convert.getPagePara(body.doc.pts[paraIndex], lastPosBottom,
          body.doc.grid.pageWidth, body.doc.grid.pageHeight, body.doc.grid.pageSpacingHeight, 
          body.doc.grid.marginTop, body.doc.grid.marginRight, body.doc.grid.marginBottom, body.doc.grid.marginLeft)
      newParaRight.parent = body
      body.pts.splice(paraIndex, 0, newParaRight)

      var newPageParaRight = new PageParagraph(body.doc.grid.marginLeft, newParaRight)
      var pageParaLeft = newPagePara.el
      newParaRight.obj = newPageParaRight
      window.goog.dom.insertSiblingAfter(newPageParaRight.render(), pageParaLeft)

      lastPosBottom += newParaRight.paraHeight
  }

  return lastPosBottom
}

export function _addEmptyParaBefore(body, paraIndex, textStyle, paraStyle){

  // skip previous page paragraphs
  var lastPosBottom = body.doc.grid.marginTop
  for(let i = 0 ; i < paraIndex; ++i){
      let pt = body.pts[i]
      if(pt.type == 'para'){
          lastPosBottom += body.pts[i].paraHeight
      }else if(pt.type == 'table'){
          lastPosBottom += body.pts[i].tableHeight
      }
  }
  
  // create new empty paragraph
  var emptyPara = {
      runs: [
          {
              type: 'text',
              text: '',
              textStyle: textStyle,
          },
      ],
      type: 'para',
      paraStyle: paraStyle,
  }

  var oldPara = body.pts[paraIndex]
  body.doc.pts.splice(paraIndex, 0, emptyPara)
  
  var newPara = convert.getPagePara(body.doc.pts[paraIndex], lastPosBottom,
      body.doc.grid.pageWidth, body.doc.grid.pageHeight, body.doc.grid.pageSpacingHeight, 
      body.doc.grid.marginTop, body.doc.grid.marginRight, body.doc.grid.marginBottom, body.doc.grid.marginLeft)
  newPara.parent = body
  body.pts.splice(paraIndex, 0, newPara)

  var newPagePara = new PageParagraph(body.doc.grid.marginLeft, newPara)
  var oldPagePara = oldPara.obj.el
  newPara.obj = newPagePara
  window.goog.dom.insertSiblingBefore(newPagePara.render(), oldPagePara)

  lastPosBottom += newPara.paraHeight

  return lastPosBottom
}

export function _addEmptyParaAfter(body, paraIndex, textStyle, paraStyle){

  // skip previous page paragraphs
  var lastPosBottom = body.doc.grid.marginTop
  for(let i = 0 ; i < paraIndex+1; ++i){
      let pt = body.pts[i]
      if(pt.type == 'para'){
          lastPosBottom += body.pts[i].paraHeight
      }else if(pt.type == 'table'){
          lastPosBottom += body.pts[i].tableHeight
      }
  }
  
  // create new empty paragraph
  var emptyPara = {
      runs: [
          {
              type: 'text',
              text: '',
              textStyle: textStyle,
          }
      ],
      type: 'para',
      paraStyle: paraStyle,
  }
  
  body.doc.pts.splice(paraIndex+1, 0, emptyPara)

  var oldPara = body.pts[paraIndex]
  var newPara = convert.getPagePara(body.doc.pts[paraIndex+1], lastPosBottom,
      body.doc.grid.pageWidth, body.doc.grid.pageHeight, body.doc.grid.pageSpacingHeight, 
      body.doc.grid.marginTop, body.doc.grid.marginRight, body.doc.grid.marginBottom, body.doc.grid.marginLeft)
  newPara.parent = body
  body.pts.splice(paraIndex+1, 0, newPara)

  var newPagePara = new PageParagraph(body.doc.grid.marginLeft, newPara)
  var oldPagePara = oldPara.obj.el
  newPara.obj = newPagePara
  window.goog.dom.insertSiblingAfter(newPagePara.render(), oldPagePara)
  
  return lastPosBottom
}

export function _updatePara(body, paraIndex, lastPosBottom){

  // recreate current page paragraphs
  var oldPara = body.pts[paraIndex]
  var newPara = convert.getPagePara(body.doc.pts[paraIndex], lastPosBottom,
      body.doc.grid.pageWidth, body.doc.grid.pageHeight, body.doc.grid.pageSpacingHeight, 
      body.doc.grid.marginTop, body.doc.grid.marginRight, body.doc.grid.marginBottom, body.doc.grid.marginLeft)
  newPara.parent = body
  body.pts.splice(paraIndex, 1, newPara)

  var newPagePara = new PageParagraph(body.doc.grid.marginLeft, newPara)
  var oldPagePara = oldPara.obj.el
  newPara.obj = newPagePara
  window.goog.dom.replaceNode(newPagePara.render(), oldPagePara)
  
  lastPosBottom += newPara.paraHeight
  
  return lastPosBottom
}

export function _updateParaStyle(body, paraIndex, paraStyle){
  var para = body.pts[paraIndex]
  para.paraStyle = paraStyle
  para.doc.paraStyle = paraStyle
  para.obj.el.style['textAlign'] = paraStyle.textAlign
}

export function _splitPara(body, paraIndex, runIndex, startIndex, front, textStyle, paraStyle){
  let runLen = body.doc.pts[paraIndex].runs.length
  let runDoc = body.doc.pts[paraIndex].runs[runIndex]
  let contentLen = runDoc.type == 'text' ? runDoc.text.length : 1
  
  let lastPosBottom = null
  if(runIndex == 0 && startIndex == 0 && front){
      // add paragraph before
      lastPosBottom = _addEmptyParaBefore(body, paraIndex, textStyle, paraStyle)
  }else if(runIndex == runLen - 1 && startIndex == contentLen - 1 && !front){
      // add paragraph after
      lastPosBottom = _addEmptyParaAfter(body, paraIndex, textStyle, paraStyle)
  }else{
      lastPosBottom = _splitParaInner(body, paraIndex, runIndex, front ? startIndex : startIndex + 1)
  }

  return lastPosBottom
}