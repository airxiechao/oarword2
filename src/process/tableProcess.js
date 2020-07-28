import state from '../state'
import * as measure from '../measure'
import * as convert from '../convert'

import * as paraMutation from '../mutation/paraMutation'
import * as spacingMutation from '../mutation/spacingMutation'
import * as tableMutation from '../mutation/tableMutation'

import * as cursorProcess from '../process/cursorProcess'
import * as imageProcess from '../process/imageProcess'
import * as runProcess from '../process/runProcess'

export function addTableToBody(payload){
  if(!cursorProcess.cursorInlineBlock){
      return
  }
  
  let rows = payload.height
  let cols = payload.width

  runProcess.splitParaRun()

  let ci = cursorProcess.cursorBodyIndex()
  let body = ci.body
  let paraIndex = ci.paraIndex
  let lastPosBottom = tableMutation._addTableAfter(body, paraIndex-1, rows, cols)
  
  // adjust following page paragraph spacing
  lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(body, paraIndex, lastPosBottom)
  
  // adjust parent following spacing
  lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(body, lastPosBottom)

  // update page background
  spacingMutation._updatePageBackground(state.document.body.doc, lastPosBottom)

  // update cursor
  body = body.pts[paraIndex].cells[0][0]
  cursorProcess.setCursor(body, 0, 0, 0, true)

  // update image resizer
  imageProcess.updateImageResizer()
}

export function mergeTableCell(payload){
  let cells = payload
  let table = cells[0].parent

  // get cells grid border
  let r0 = -1
  let c0 = -1
  let r1 = -1
  let c1 = -1
  let area = {}
  let cellsRowCol = {}
  let cell0 = null
  for(let ci = 0; ci < cells.length; ++ci){
      let cell = cells[ci]
      let {rowGrid0, colGrid0, rowGrid1, colGrid1} = convert.getRowColGridOfTableCell(cell)
      let cr = cellsRowCol[rowGrid0]
      if(cr){
          cr[colGrid0] = cell
      }else{
          cr = {}
          cr[colGrid0] = cell
          cellsRowCol[rowGrid0] = cr
      }
      
      for(let i = rowGrid0; i <= rowGrid1; ++i){
          for(let j = colGrid0; j <= colGrid1; ++j){
              area[i+"_"+j] = 1
          }
      }

      r0 = r0 < 0 ? rowGrid0 : Math.min(r0, rowGrid0)
      c0 = c0 < 0 ? colGrid0 : Math.min(c0, colGrid0)
      r1 = Math.max(r1, rowGrid1)
      c1 = Math.max(c1, colGrid1)

      if(rowGrid0 == r0 && colGrid0 == c0){
          cell0 = cell
      }
  }

  let rowIndex = -1
  let colIndex = -1
  for(let i = 0; i < table.cells.length; ++i){
      let row = table.cells[i]
      for(let j = 0; j < row.length; ++j){
          let col = row[j]
          if(col == cell0){
              rowIndex = i
              colIndex = j

              i = table.cells.length
              break
          }
      }
  }

  // check if cells grid is fully covered
  for(let i = r0; i <= r1; ++i){
      for(let j = c0; j <= c1; ++j){
          if(area[i+"_"+j] === undefined){
              return
          }
      }
  }

  // collect cell pts
  let allPts = cell0.doc.pts
  for(let i = r0; i <= r1; ++i){
      let cr = cellsRowCol[i]
      if(!cr){
          continue
      }

      for(let j = c0; j <= c1; ++j){
          let cc = cr[j]
          if(!cc || cc === cell0){
              continue
          }
          
          allPts = allPts.concat(cc.doc.pts)
      }
  }
  cell0.doc.pts = allPts

  // remove other cell
  let otherCells = cells.filter(c=>c!==cell0)
  for(let i = 0; i < table.cells.length; ++i){
      let row = table.cells[i]
      let rowDoc = table.doc.cells[i]
      
      let newRowDoc = []
      row.forEach((c,ri)=>{
          let ci = otherCells.indexOf(c)
          if(ci < 0){
              newRowDoc.push(rowDoc[ri])
          }
      })
      table.doc.cells[i] = newRowDoc
  }

  // change cell0 rowspan and colspan
  cell0.doc.rowspan = r1 - r0 + 1
  cell0.doc.colspan = c1 - c0 + 1

  // update table
  let body = table.parent
  let ptIndex = body.pts.indexOf(table)

  // get last position bottom
  let lastPosBottom = measure.getParaLastPosBottom(body, ptIndex-1)
              
  // update document paragraph
  lastPosBottom = tableMutation._updateTable(body, ptIndex, lastPosBottom)

  // adjust following spacing
  lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(body, ptIndex+1, lastPosBottom)

  // adjust parent following spacing
  lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(body, lastPosBottom)

  // update page background
  spacingMutation._updatePageBackground(state.document.body.doc, lastPosBottom)

  // update cursor
  let cbody = body.pts[ptIndex].cells[rowIndex][colIndex]
  cursorProcess.setCursor(cbody, 0, 0, 0, true)

  // update image resizer
  imageProcess.updateImageResizer()
}

export function splitTableCell(payload){
  let cell = payload
  let table = cell.parent

  let rowIndex = -1
  let colIndex = -1
  for(let i = 0; i < table.cells.length; ++i){
      let row = table.cells[i]
      for(let j = 0; j < row.length; ++j){
          let col = row[j]
          if(col == cell){
              rowIndex = i
              colIndex = j

              i = table.cells.length
              break
          }
      }
  }
  
  let {rowGrid0, colGrid0, rowGrid1, colGrid1} = convert.getRowColGridOfTableCell(cell)

  // add cells
  let rowspan = cell.doc.rowspan
  let colspan = cell.doc.colspan
  for(let rs = 0; rs < rowspan; ++rs){
      let row = table.cells[rowIndex + rs]
      let rowDoc = table.doc.cells[rowIndex + rs]
      
      // find start grid col
      let ci = -1
      for(let j = 0; j < row.length; ++j){
          let col = row[j]
          let c0 = convert.getRowColGridOfTableCell(col).colGrid0
          if(c0 == colGrid0){
              ci = j
              break
          }
      }

      for(let cs = 1; cs <= colspan - (rs==0?1:0); ++cs){
          rowDoc.splice(ci + cs, 0, convert.buildEmptyTableCell())
      }
  }

  // change cell rowspan and colspan
  cell.doc.rowspan = 1
  cell.doc.colspan = 1

  // update table
  let body = table.parent
  let ptIndex = body.pts.indexOf(table)

  // get last position bottom
  let lastPosBottom = measure.getParaLastPosBottom(body, ptIndex-1)
              
  // update document paragraph
  lastPosBottom = tableMutation._updateTable(body, ptIndex, lastPosBottom)

  // adjust following spacing
  lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(body, ptIndex+1, lastPosBottom)

  // adjust parent following spacing
  lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(body, lastPosBottom)

  // update page background
  spacingMutation._updatePageBackground(state.document.body.doc, lastPosBottom)

  // update cursor
  let cbody = body.pts[ptIndex].cells[rowIndex][colIndex]
  cursorProcess.setCursor(cbody, 0, 0, 0, true)

  // update image resizer
  imageProcess.updateImageResizer()
}

export function updateTableGrid(payload){
  let table = payload.table
  let columnIndex = payload.columnIndex
  let columnWidth = payload.columnWidth

  table.doc.grid[columnIndex] = columnWidth

  let body = table.parent
  let ptIndex = body.pts.indexOf(table)

  // get last position bottom
  let lastPosBottom = measure.getParaLastPosBottom(body, ptIndex-1)
              
  // update document paragraph
  lastPosBottom = tableMutation._updateTable(body, ptIndex, lastPosBottom)

  // adjust following spacing
  lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(body, ptIndex+1, lastPosBottom)

  // adjust parent following spacing
  lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(body, lastPosBottom)

  // update page background
  spacingMutation._updatePageBackground(state.document.body.doc, lastPosBottom)

  // update cursor
  let ci = cursorProcess.cursorBodyIndex()
  let front = state.document.cursor.front
  let cbody = ci.body
  let newBody = matchTableCell(table, body.pts[ptIndex], cbody)
  if(newBody){
      cbody = newBody
  }
  let paraIndex = ci.paraIndex
  let runIndex = ci.runIndex
  let startIndex = ci.startIndex
  cursorProcess.setCursor(cbody, paraIndex, runIndex, startIndex, front)

  // update image resizer
  imageProcess.updateImageResizer()
}

export function deleteTableFromBody(table){
  let body = table.parent
  let ptIndex = body.pts.indexOf(table)
  let lastPosBottom = paraMutation._deletePt(body, ptIndex)

  // adjust following page paragraph spacing
  lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(body, ptIndex, lastPosBottom)
                              
  // adjust parent following spacing
  lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(body, lastPosBottom)

  // update page background
  spacingMutation._updatePageBackground(state.document.body.doc, lastPosBottom)

  // update cursor
  cursorProcess.setCursor(body, ptIndex, 0, 0, true)

  // update image resizer
  imageProcess.updateImageResizer()
}

export function deleteTableRowCol(payload){
  let table = payload.table

  let rowIndex = payload.rowIndex
  let columnIndex = payload.columnIndex

  if(rowIndex !== undefined){
      if(table.doc.cells.length == 1){
          deleteTableFromBody(table)
          return
      }else{
          table.doc.cells.splice(rowIndex, 1)
      }
      
  }

  if(columnIndex !== undefined){
      if(table.doc.grid.length == 1){
          deleteTableFromBody(table)
          return
      }else{
          table.doc.cells.forEach(r=>r.splice(columnIndex, 1))
          table.doc.grid.splice(columnIndex, 1)
      }
      
  }

  let body = table.parent
  let ptIndex = body.pts.indexOf(table)

  // get last position bottom
  let lastPosBottom = measure.getParaLastPosBottom(body, ptIndex-1)
              
  // update document paragraph
  lastPosBottom = tableMutation._updateTable(body, ptIndex, lastPosBottom)

  // adjust following spacing
  lastPosBottom = spacingMutation._adjustBodyPtFollowingSpacing(body, ptIndex+1, lastPosBottom)

  // adjust parent following spacing
  lastPosBottom = spacingMutation._adjustBodyParentFollowingSpacing(body, lastPosBottom)

  // update page background
  spacingMutation._updatePageBackground(state.document.body.doc, lastPosBottom)

  // update cursor
  let ci = cursorProcess.cursorBodyIndex()
  let front = state.document.cursor.front
  let cbody = ci.body
  let paraIndex = ci.paraIndex
  let runIndex = ci.runIndex
  let startIndex = ci.startIndex
  let newBody = matchTableCell(table, body.pts[ptIndex], cbody, rowIndex, columnIndex)
  if(newBody === false){

  }else if(newBody === null){
      cbody = body
      paraIndex = ptIndex + 1
      runIndex = 0
      startIndex = 0
      front = true
  }else{
      cbody = newBody
  }

  cursorProcess.setCursor(cbody, paraIndex, runIndex, startIndex, front)

  // update image resizer
  imageProcess.updateImageResizer()
}

export function matchTableCell(oldTable, newTable, oldBody, deleteRowIndex, deleteColumnIndex){

    let iterBody = function(body, newBody, oldBody){
        for(let i = 0; i < body.pts.length; ++i){
            let pt = body.pts[i]
            if(pt.type == 'table'){
                let newTable = undefined
                if(newBody){
                    newTable = newBody.pts[i]
                }
                let newBody2 = iterTable(pt, newTable, oldBody)
                if(newBody2 !== false){
                    return newBody2
                }
            }
        }

        return false
    }

    let iterTable = function(oldTable, newTable, oldBody, deleteRowIndex, deleteColumnIndex){
        for(let r = 0; r < oldTable.cells.length; ++r){
            let row = oldTable.cells[r]
            for(let c = 0; c < row.length; ++c ){
                let col = row[c]

                let r2 = r
                let c2 = c

                if(deleteRowIndex !== undefined){
                    if(r == deleteRowIndex){
                        r2 = -1
                    }else if(r > deleteRowIndex){
                        r2 = r - 1
                    }
                }
                
                if(deleteColumnIndex !== undefined){
                    if(c == deleteColumnIndex){
                        c2 = -1
                    }else if(c > deleteColumnIndex){
                        c2 = c - 1
                    }
                }

                if(col == oldBody){
                    if(newTable && newTable.cells[r2] && newTable.cells[r2][c2]){
                        let newBody = newTable.cells[r2][c2]
                        return newBody
                    }else{
                        return null
                    }
                }else{
                    let newCol = undefined
                    if(newTable && newTable.cells[r2] && newTable.cells[r2][c2]){
                        newCol = newTable.cells[r2][c2]
                    }

                    let newBody = iterBody(col, newCol, oldBody)
                    if(newBody !== false){
                        return newBody
                    }
                }
            }
        }

        return false
    }

    return iterTable(oldTable, newTable, oldBody, deleteRowIndex, deleteColumnIndex)
}