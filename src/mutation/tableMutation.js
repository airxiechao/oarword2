import PageTable from '../components/PageTable'

import * as convert from '../convert'

export function _addTableAfter(body, paraIndex, rows, cols){

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
  
  // create new table
  var table = {
      type: 'table',
      grid: [],
      cells: [],
  }
  var cw = (body.doc.grid.pageWidth-body.doc.grid.marginLeft-body.doc.grid.marginRight)/cols
  for(let i = 0; i < cols; ++i){
      table.grid.push(cw)
  }
  for(let i = 0; i < rows; ++i){
      let row = []
      table.cells.push(row)
      for(let j = 0; j < cols; ++j){
          let col = convert.buildEmptyTableCell()
          row.push(col)
      }
  }
  
  body.doc.pts.splice(paraIndex+1, 0, table)

  var oldPara = body.pts[paraIndex]
  var newTable = convert.getPageTable(body.doc, body.doc.pts[paraIndex+1], lastPosBottom)
  newTable.parent = body
  body.pts.splice(paraIndex+1, 0, newTable)

  var newPageTable = new PageTable(body.doc.grid.marginLeft, newTable)
  var oldPagePara = oldPara.obj.el
  newTable.obj = newPageTable
  window.goog.dom.insertSiblingAfter(newPageTable.render(), oldPagePara)
  
  return lastPosBottom
}

export function _updateTable(body, ptIndex, lastPosBottom){

  // recreate current page table
  var oldTable = body.pts[ptIndex]
  var newTable = convert.getPageTable(body.doc, body.doc.pts[ptIndex], lastPosBottom)
  newTable.parent = body
  body.pts.splice(ptIndex, 1, newTable)

  var newPageTable = new PageTable(body.doc.grid.marginLeft, newTable)
  var oldPageTable = oldTable.obj.el
  newTable.obj = newPageTable
  window.goog.dom.replaceNode(newPageTable.render(), oldPageTable)
  
  lastPosBottom += newTable.tableHeight
  
  return lastPosBottom
}