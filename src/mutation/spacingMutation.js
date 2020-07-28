import * as measure from '../measure'

import PageBackground from '../components/PageBackground'

export function _adjustParaLineFollowingSpacing(body, paraIndex, lineIndex, lastPosBottom){
  var pagePara = body.pts[paraIndex]
  var paraHeight = 0

  for(let i = 0; i < lineIndex; ++i){
      var ls = pagePara.lines[i]
      if(ls.type == 'line'){
          paraHeight += ls.spacingHeight + ls.lineHeight
      }
  }
  
  for(let i = lineIndex; i < pagePara.lines.length; ++i){
      let ls = pagePara.lines[i]
      if(ls.type == 'line'){
          // check paragraph height
          var leftHeight = measure.getPageLeftHeight(lastPosBottom, body.doc.grid.marginBottom, body.doc.grid.pageHeight, body.doc.grid.pageSpacingHeight)
          if(ls.lineHeight > leftHeight){
              // create new page spacing
              var spacingHeight = leftHeight + body.doc.grid.marginBottom + body.doc.grid.pageSpacingHeight + body.doc.grid.marginTop
              
              lastPosBottom += spacingHeight
              paraHeight += spacingHeight

              ls.spacingHeight = spacingHeight
              ls.obj.el.style.marginTop = spacingHeight+'px'
          }else{
              ls.spacingHeight = 0
              ls.obj.el.style.marginTop = '0px'
          }
          
          lastPosBottom += ls.lineHeight
          paraHeight += ls.lineHeight
      }
  }

  pagePara.paraHeight = paraHeight

  return lastPosBottom
}

export function _adjustTableRowFollowingSpacing(body, tableIndex, rowIndex, lastPosBottom){
  var pageTable = body.pts[tableIndex]
  var tableHeight = 0
  let tableMultiRowCol = []
  let rowHeights = []

  // adjust row before
  for(let i = 0; i < rowIndex; ++i){
      let row = pageTable.cells[i]
      let colHeights = []
      let tableRow = []
      for(let j = 0; j < row.length; ++j){
          let col = row[j]
          tableRow.push(col)
          let rowspan = col.doc.rowspan
          let mc = {
              r0: i,
              r1: i + rowspan - 1
          }
          if(rowspan > 1){
              tableMultiRowCol.push(mc)
          }
          mc.body = col

          if(rowspan == 1){
              colHeights.push(col.bodyHeight)
          }
      }
      let rowHeight = Math.max(...colHeights)
      rowHeights.push(rowHeight)
      
      // update the last row height of multiple-row cell
      for(let mi = 0; mi < tableMultiRowCol.length; ++mi){
          let mrc = tableMultiRowCol[mi]
          if(i == mrc.r1){
              let mh = 0
              
              for(let ri = mrc.r0; ri <= mrc.r1; ++ri){
                  mh += rowHeights[ri]
              }
              
              if(mh < mrc.body.bodyHeight){
                  let rh = mrc.body.bodyHeight - (mh - rowHeights[mrc.r1])
                  rowHeight = Math.max(rowHeight, rh)
              }else{
                  mrc.body.doc.grid.height = mh
                  let td = window.goog.dom.getParentElement(mrc.body.obj.el)
                  td.style.height = rowHeight+'px'
              }
          }
      }
      
      tableRow.forEach(r=>{
          if(r.doc.rowspan == 1){
              r.doc.grid.height = rowHeight
          }
      })

      for(let j = 0; j < row.length; ++j){
          let col = row[j]
          if(col.doc.rowspan == 1){
              let td = window.goog.dom.getParentElement(col.obj.el)
              td.style.height = rowHeight+'px'
          }
      }

      tableHeight += rowHeight
  }

  // adjust row and after
  for(let i = rowIndex; i < pageTable.cells.length; ++i){
      let row = pageTable.cells[i]
      let colHeights = []
      let tableRow = []
      for(let j = 0; j < row.length; ++j){
          let col = row[j]
          tableRow.push(col)
          let rowspan = col.doc.rowspan
          let mc = {
              r0: i,
              r1: i + rowspan - 1
          }
          if(rowspan > 1){
              tableMultiRowCol.push(mc)
          }

          let lpb = _adjustBodyPtFollowingSpacing(col, 0, lastPosBottom)
          let colHeight = lpb - lastPosBottom
          
          mc.body = col

          if(rowspan == 1){
              colHeights.push(colHeight)
          }
      }
      let rowHeight = Math.max(...colHeights)
      rowHeights.push(rowHeight)

      // update the last row height of multiple-row cell
      for(let mi = 0; mi < tableMultiRowCol.length; ++mi){
          let mrc = tableMultiRowCol[mi]
          
          if(i == mrc.r1){
              let mh = 0
              for(let ri = mrc.r0; ri <= mrc.r1; ++ri){
                  mh += rowHeights[ri]
              }
              
              if(mh < mrc.body.bodyHeight){
                  let rh = mrc.body.bodyHeight - (mh - rowHeights[mrc.r1])
                  rowHeight = Math.max(rowHeight, rh)
              }else{
                  mrc.body.doc.grid.height = mh
                  let td = window.goog.dom.getParentElement(mrc.body.obj.el)
                  td.style.height = rowHeight+'px'
              }
          }
      }
      
      tableRow.forEach(r=>{
          if(r.doc.rowspan == 1){
              r.doc.grid.height = rowHeight
          }
      })

      for(let j = 0; j < row.length; ++j){
          let col = row[j]
          if(col.doc.rowspan == 1){
              let td = window.goog.dom.getParentElement(col.obj.el)
              td.style.height = rowHeight+'px'
          }
      }

      tableHeight += rowHeight
      lastPosBottom += rowHeight
  }

  pageTable.tableHeight = tableHeight

  pageTable.obj.updateResizers()
  
  return lastPosBottom
}

export function _adjustBodyPtFollowingSpacing(body, ptIndex, lastPosBottom){
  let bodyHeight = 0
  for(let i = 0; i < ptIndex; ++i){
      let pagePt = body.pts[i]
      if(pagePt.type == 'para'){
          bodyHeight += pagePt.paraHeight
      }else if(pagePt.type == 'table'){
          bodyHeight += pagePt.tableHeight
      }
  }

  for(let i = ptIndex; i < body.pts.length; ++i){
      let pagePt = body.pts[i]
      if(pagePt.type == 'para'){
          lastPosBottom = _adjustParaLineFollowingSpacing(body, i, 0, lastPosBottom)
          bodyHeight += pagePt.paraHeight
      }else if(pagePt.type == 'table'){
          lastPosBottom = _adjustTableRowFollowingSpacing(body, i, 0, lastPosBottom)
          bodyHeight += pagePt.tableHeight
      }
  }

  body.bodyHeight = bodyHeight

  return lastPosBottom
}

export function _adjustBodyParentFollowingSpacing(body, lastPosBottom){
  let bodyParent = body.parent
  let tableIndex = -1
  while(bodyParent){
      if(bodyParent.type == 'table'){
          let rowIndex = -1
          for(let i = 0; i < bodyParent.cells.length; ++i){
              let row = bodyParent.cells[i]
              for(let j = 0; j< row.length; ++j){
                  let col = row[j]
                  if(col == body){
                      rowIndex = i
                      break
                  }
              }
          }
          
          if(rowIndex >= 0){
              let tableParent = bodyParent.parent
              tableIndex = tableParent.pts.indexOf(bodyParent)

              lastPosBottom = measure.getParaLastPosBottom(body, 0)
              lastPosBottom = _adjustTableRowFollowingSpacing(tableParent, tableIndex, rowIndex, lastPosBottom)
          }
      }else if(bodyParent.type == 'body'){
          if(tableIndex >= 0){
              lastPosBottom = _adjustBodyPtFollowingSpacing(bodyParent, tableIndex+1, lastPosBottom)
          }

          body = bodyParent
      }

      bodyParent = bodyParent.parent
  }

  return lastPosBottom
}

export function _updatePageBackground(bodyDoc, lastPosBottom){
  let pageNo = measure.getPageNo(lastPosBottom, bodyDoc.grid.pageHeight, bodyDoc.grid.pageSpacingHeight)
  let bgWrap = document.getElementsByClassName('page-bgs-wrap')[0]
  let oldBgs = document.getElementsByClassName('page-bg')
  let OldBgLen = oldBgs.length

  if(pageNo > OldBgLen){
      for(let i = 0; i < pageNo - OldBgLen; ++i){
          var pageBg = new PageBackground(bodyDoc.grid.pageWidth, bodyDoc.grid.pageHeight, bodyDoc.grid.pageSpacingHeight, bodyDoc.grid.marginTop, 
              bodyDoc.grid.marginRight, bodyDoc.grid.marginBottom, bodyDoc.grid.marginLeft, OldBgLen+i)
          window.goog.dom.appendChild(bgWrap, pageBg.render())
      }
  }else if(pageNo < OldBgLen){
      for(let i = OldBgLen; i > pageNo; --i){
          oldBgs[i-1].remove()
      }
  }

  bgWrap.style.height = (bodyDoc.grid.pageHeight+bodyDoc.grid.pageSpacingHeight)*pageNo+'px'
}