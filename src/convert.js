import { measureFontTextWH, getPageLeftHeight, getWidthFontTextPos } from './measure'

function paraRunsToLines(runs, paraWidth, posTop, marginTop, marginBottom, pageHeight, pageSpacingHeight){
    let paraLines = []
    let paraHeight = 0

    let runsQueue = []
    for(let i = 0; i < runs.length; ++i){
        let run = runs[i]
        
        if(run.type == 'text'){
            run.startIndex = 0
            runsQueue.push({
                type: 'text',
                doc: run,
                text: run.text,
                textStyle: run.textStyle,
                startIndex: run.startIndex,
            })
        }else if(run.type == 'image'){
            runsQueue.push({
                type: 'image',
                doc: run,
                image: run.image,
            })
        }
        
    }

    while(runsQueue.length > 0){
        let lh = getLineInlineBlocksAndHeightFromQueue(runsQueue, paraWidth)
        let lineHeight = lh.lineHeight
        let line = {
            inlineBlocks: lh.lineInlineBlocks,
            lineHeight: lineHeight,
            lineWidth: paraWidth,
            spacingHeight: 0,
            type: 'line',
        }

        // set parent for inline blocks
        for(let i = 0; i < line.inlineBlocks.length; ++i){
            let ib = line.inlineBlocks[i]
            ib.parent = line
        }

        // check if page has enough space for line
        let leftHeight = getPageLeftHeight(posTop, marginBottom, pageHeight, pageSpacingHeight)
        if(leftHeight < lineHeight){
            // add page spacing
            let spacingHeight = leftHeight + marginBottom + pageSpacingHeight + marginTop

            line.spacingHeight = spacingHeight
            posTop += spacingHeight
            paraHeight += spacingHeight
        }
        
        paraLines.push(line)
        posTop += lineHeight
        paraHeight += lineHeight
    }

    return {
        paraLines: paraLines,
        paraHeight: paraHeight,
    }
}

function getLineInlineBlocksAndHeightFromQueue(runsQueue, lineWidth){
    let totalWidth = 0
    let maxHeight = 0
    let lineInlineBlocks = []
    while(totalWidth < lineWidth && runsQueue.length > 0){
        let run = runsQueue.shift()
        
        if(run.type == 'text'){
            let wh = {w:0,h:0}
            let i = 0
            if(run.text.length == 0){
                wh.h = measureFontTextWH('|', {}).h
                maxHeight = Math.max(maxHeight, wh.h)
            }else{
                let iwh = getWidthFontTextPos(run.text, run.textStyle, lineWidth - totalWidth)
                if(iwh.i < 0){
                    runsQueue.unshift(run)
                    break
                }
    
                i = iwh.i + 1
                wh = iwh.wh
                maxHeight = Math.max(maxHeight, wh.h)
            }
            
            let inlineBlock = {
                doc: run.doc,
                text: run.text,
                textStyle: run.textStyle,
                startIndex: run.startIndex,
            }
            if(i > 0 && i < run.text.length){
                runsQueue.unshift({
                    type: 'text',
                    doc: run.doc,
                    text: run.text.substr(i),
                    textStyle: run.textStyle,
                    startIndex: run.startIndex + i,
                })
    
                inlineBlock = {
                    doc: run.doc,
                    text: run.text.substr(0, i),
                    textStyle: run.textStyle,
                    startIndex: run.startIndex,
                }
            }

            inlineBlock.type = 'text'
            inlineBlock.inlineHeight = wh.h

            lineInlineBlocks.push(inlineBlock)
            totalWidth += wh.w;
        }else if(run.type == 'image'){
            let imageHeight = run.doc.imageStyle.height
            let imageWidth = run.doc.imageStyle.width

            if(imageWidth > lineWidth - totalWidth){
                runsQueue.unshift(run)
                break
            }

            maxHeight = Math.max(maxHeight, imageHeight)

            let inlineBlock = {
                doc: run.doc,
                image: run.image,
                imageStyle: run.doc.imageStyle,
            }

            inlineBlock.type = 'image'
            inlineBlock.inlineHeight = imageHeight

            lineInlineBlocks.push(inlineBlock)
            totalWidth += imageWidth;
        }

        
    }

    return {
        lineInlineBlocks: lineInlineBlocks,
        lineHeight: maxHeight   
    }
}

function getPagePara(para, lastPosBottom,
        pageWidth, pageHeight, pageSpacingHeight, 
        marginTop, marginRight, marginBottom, marginLeft){

    // conver paragraph to lines and spacings
    let paraWidth = pageWidth-marginLeft-marginRight
    let lh = paraRunsToLines(para.runs, paraWidth, lastPosBottom, marginTop, marginBottom, pageHeight, pageSpacingHeight)
    let paraLines = lh.paraLines
    let paraHeight = lh.paraHeight
    
    let pagePara = {
        type: 'para',
        doc: para,
        paraStyle: para.paraStyle,
        paraHeight: paraHeight,
        paraWidth: paraWidth,
        lines: paraLines,
    }

    // set parent for lines
    for(let i = 0; i < pagePara.lines.length; ++i){
        let ls = pagePara.lines[i]
        ls.parent = pagePara
    }

    return pagePara
}

function getPageTable(doc, table, lastPosBottom){

    let tableCells = []
    let tableHeight = 0
    let tableMultiRowCol = []
    let rowHeights = []
    for(let i = 0; i < table.cells.length; ++i){
        let tableRow = []
        tableCells.push(tableRow)
        let row = table.cells[i]
        let rowHeight = 0
        // numCol is the column index of table grid
        let numCol = 0
        for(let j = 0; j < row.length; ++j){
            let col = row[j]
            let rowspan = col.rowspan
            let colspan = col.colspan

            let mc = {
                r0: i,
                r1: i + rowspan - 1,
                c0: numCol,
                c1: numCol + colspan - 1,
            }

            if(rowspan > 1){
                tableMultiRowCol.push(mc)
            }
            
            // calculate numCol
            for(let mi = 0; mi < tableMultiRowCol.length; ++mi){
                let mrc = tableMultiRowCol[mi]
                if(i > mrc.r0 && i <= mrc.r1){
                    if(numCol >= mrc.c0 && numCol <= mrc.c1){
                        numCol += mrc.c1 - mrc.c0 + 1
                    }
                }
            }

            let colWidth = 0
            for(let cs = 0; cs < colspan; ++cs){
                colWidth += table.grid[numCol+cs]
            }
            numCol += colspan

            col.grid.pageWidth = colWidth
            col.grid.pageHeight = doc.grid.pageHeight
            col.grid.pageSpacingHeight = doc.grid.pageSpacingHeight 
            col.grid.marginTop = doc.grid.marginTop
            col.grid.marginRight = 0
            col.grid.marginBottom = doc.grid.marginBottom
            col.grid.marginLeft = 0

            let pb = getPageBody(col, lastPosBottom)
            let pageBody = pb
            tableRow.push(pageBody)
            let bodyHeight = pb.bodyHeight
            col.grid.width = colWidth
            col.grid.height = bodyHeight

            // record multiple-row cell infomation
            mc.body = pageBody

            if(rowspan == 1){
                rowHeight = Math.max(rowHeight, bodyHeight)
            }

        }

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
                }
            }
        }
        
        tableRow.forEach(r=>{
            if(r.doc.rowspan == 1){
                r.doc.grid.height = rowHeight
            }
        })
        
        lastPosBottom += rowHeight
        tableHeight += rowHeight
    }
    
    let pageTable = {
        type: 'table',
        doc: table,
        cells: tableCells,
        tableHeight: tableHeight,
    }

    // set parent for cells
    for(let i = 0; i < pageTable.cells.length; ++i){
        let row = pageTable.cells[i]
        for(let j = 0; j < row.length; ++j){
            let col = row[j]
            col.parent = pageTable
        }
    }

    return pageTable
}

function getPageBody(doc, lastPosBottom){

    let pageWidth = doc.grid.pageWidth
    let pageHeight = doc.grid.pageHeight
    let pageSpacingHeight = doc.grid.pageSpacingHeight 
    let marginTop = doc.grid.marginTop
    let marginRight = doc.grid.marginRight
    let marginBottom = doc.grid.marginBottom
    let marginLeft = doc.grid.marginLeft
    let bodyHeight = 0

    let pts = []
    for(let i = 0; i < doc.pts.length; ++i){
        let pt = doc.pts[i];
        if(pt.type == 'para'){
            let pagePara = getPagePara(pt, lastPosBottom,
                pageWidth, pageHeight, pageSpacingHeight,
                marginTop, marginRight, marginBottom, marginLeft)

            pts.push(pagePara)
            lastPosBottom += pagePara.paraHeight;
            bodyHeight += pagePara.paraHeight;
        }else if(pt.type == 'table'){
            let pageTable = getPageTable(doc, pt, lastPosBottom)

            pts.push(pageTable)
            lastPosBottom += pageTable.tableHeight;
            bodyHeight += pageTable.tableHeight;
        }
        
    }

    let pageBody = {
        pts: pts,
        doc: doc,
        bodyHeight: bodyHeight,
        type: 'body',
    }

    // set parent for paragraphs and tables
    for(let i = 0; i < pageBody.pts.length; ++i){
        let pt = pageBody.pts[i]
        pt.parent = pageBody
    }

    return pageBody
}

function getPreviousLineOfBody(inlineBlock){
    let body = inlineBlock.parent.parent.parent
    let lastline = null
    for(let i = 0; i < body.pts.length; ++i){
        let pt = body.pts[i]
        if(pt.type == 'para'){
            for(let j = 0; j < pt.lines.length; ++j){
                let line = pt.lines[j]
                if(line.type != 'line'){
                    continue
                }
                for(let k = 0; k < line.inlineBlocks.length; ++k){
                    let ib = line.inlineBlocks[k]
                    if(ib == inlineBlock){
                        return lastline
                    }
                }
                lastline = line
            }
        }
    }

    return lastline
}

function getNextLineOfBody(inlineBlock){
    let body = inlineBlock.parent.parent.parent
    let nextline = null
    for(let i = body.pts.length - 1; i >= 0; --i){
        let pt = body.pts[i]
        if(pt.type == 'para'){
            for(let j = pt.lines.length - 1; j >= 0 ; --j){
                let line = pt.lines[j]
                if(line.type != 'line'){
                    continue
                }
                for(let k = line.inlineBlocks.length - 1; k >= 0 ; --k){
                    let ib = line.inlineBlocks[k]
                    if(ib == inlineBlock){
                        return nextline
                    }
                }
                nextline = line
            }
        }
    }

    return nextline
}

function getPreviousInlineOfBody(inlineBlock){
    let body = inlineBlock.parent.parent.parent
    let lastib = null
    for(let i = 0; i < body.pts.length; ++i){
        let pt = body.pts[i]
        if(pt.type == 'para'){
            for(let j = 0; j < pt.lines.length; ++j){
                let line = pt.lines[j]
                for(let k = 0; k < line.inlineBlocks.length; ++k){
                    let ib = line.inlineBlocks[k]
                    if(ib == inlineBlock){
                        return lastib
                    }
    
                    lastib = ib
                }
            }
        }
    }

    return lastib
}

function getNextInlineOfBody(inlineBlock){
    let body = inlineBlock.parent.parent.parent
    let nextib = null
    for(let i = body.pts.length - 1; i >= 0; --i){
        let pt = body.pts[i]
        if(pt.type == 'para'){
            for(let j = pt.lines.length - 1; j >= 0 ; --j){
                let line = pt.lines[j]
                for(let k = line.inlineBlocks.length - 1; k >= 0 ; --k){
                    let ib = line.inlineBlocks[k]
                    if(ib == inlineBlock){
                        return nextib
                    }
    
                    nextib = ib
                }
            }
        }
    }

    return nextib
}

function getInlineBlockBodyIndex(inlineBlock){
    let ib = inlineBlock
    let line = ib.parent
    let para = line.parent
    let body = para.parent
    
    let paraIndex = body.pts.indexOf(para)
    let runIndex = para.doc.runs.indexOf(ib.doc)
    let startIndex = ib.startIndex === undefined ? 0 : ib.startIndex

    return {
        body: body,
        paraIndex: paraIndex,
        runIndex: runIndex,
        startIndex: startIndex,
    }
}

function getInlineBlockByRun(body, paraIndex, runIndex, startIndex){
    let para = body.pts[paraIndex]
    let run = para.doc.runs[runIndex]
    for(let i = 0; i < para.lines.length; ++i){
        let line = para.lines[i]
        for(let j = 0; j < line.inlineBlocks.length; ++j){
            let ib = line.inlineBlocks[j]
            if(ib.doc == run){
                if(ib.startIndex == startIndex){
                    return ib
                }else{
                    if(ib.type == 'text'){
                        if(ib.startIndex > startIndex && startIndex < ib.startIndex+ib.text.length){
                            return ib
                        }
                    }
                }
            }
        }
    }

    return null
}

function isTextStyleEqual(textStyle1, textStyle2){
    let keys = ['fontFamily', 'fontSize', 'color', 'backgroundColor', 'fontWeight', 'fontStyle', 'textDecoration', 'verticalAlign']
    let equal = true
    keys.forEach((key)=>{
        if(textStyle1[key] != textStyle2[key]){
            equal = false
        }
    })

    return equal
}

function buildTextStyleCss(textStyle){
    let styleCss = {
        fontFamily: textStyle.fontFamily ? textStyle.fontFamily : 'unset',
        fontSize: textStyle.fontSize ? textStyle.fontSize + 'px' : 'unset',
        color: textStyle.color ? textStyle.color : 'unset',
        backgroundColor: textStyle.color ? textStyle.backgroundColor : 'unset',
        fontWeight: textStyle.fontWeight ? textStyle.fontWeight : 'unset',
        fontStyle: textStyle.fontStyle ? textStyle.fontStyle : 'unset',
        textDecoration: textStyle.textDecoration ? textStyle.textDecoration : 'unset',
        verticalAlign: textStyle.verticalAlign ? textStyle.verticalAlign : 'unset',
    }

    return styleCss
}

function buildEmptyTableCell(){
    let col = {
        type: 'body',
        rowspan: 1,
        colspan: 1,
        grid: {},
        pts: [
            {
                type: 'para',
                paraStyle: defaultParaStyle,
                runs: [
                    {
                        type: 'text',
                        text: '',
                        textStyle: defaultTextStyle,
                    },
                ],
            },
        ],
    }
    
    return col
}

function getRowColGridOfTableCell(cell){

    let table = cell.parent

    // find row and col index
    let rowIndex = -1
    let colIndex = -1
    for(let i = 0; i < table.cells.length; ++i){
        let row = table.cells[i]
        for(let j = 0; j < row.length; ++j){
            let col = row[j]
            if(col === cell){
                rowIndex = i
                colIndex = j

                i = table.cells.length
                break
            }
        }
    }

    if(rowIndex < 0 || colIndex < 0){
        return {
            rowGrid0: -1,
            colGrid0: -1,
            rowGrid1: -1,
            colGrid1: -1,
        }
    }

    // find row and col grid
    let tableMultiRowCol = []
    for(let i = 0; i < table.cells.length; ++i){
        let row = table.cells[i]

        // numCol is the column index of table grid
        let numCol = 0
        for(let j = 0; j < row.length; ++j){
            let col = row[j]
            let rowspan = col.doc.rowspan
            let colspan = col.doc.colspan

            let mc = {
                r0: i,
                r1: i + rowspan - 1,
                c0: numCol,
                c1: numCol + colspan - 1,
            }

            if(rowspan > 1){
                tableMultiRowCol.push(mc)
            }
            
            // calculate numCol
            for(let mi = 0; mi < tableMultiRowCol.length; ++mi){
                let mrc = tableMultiRowCol[mi]
                if(i > mrc.r0 && i <= mrc.r1){
                    if(numCol >= mrc.c0 && numCol <= mrc.c1){
                        numCol += mrc.c1 - mrc.c0 + 1
                    }
                }
            }

            if(col === cell){
                return {
                    rowGrid0: i,
                    rowGrid1: i + rowspan - 1,
                    colGrid0: numCol,
                    colGrid1: numCol + colspan - 1,
                }
            }

            numCol += colspan
        }
    }

    return {
        rowGrid0: -1,
        colGrid0: -1,
        rowGrid1: -1,
        colGrid1: -1,
    }
}

const defaultTextStyle = {
    fontFamily: '宋体',
    fontSize: 14,
    color: '#000',
    backgroundColor: 'unset',
    fontWeight: 'unset',
    fontStyle: 'unset',
    textDecoration: 'unset',
    verticalAlign: 'unset',
}

const defaultParaStyle = {
    textAlign: 'left',
}

export { paraRunsToLines, getLineInlineBlocksAndHeightFromQueue, getPageLeftHeight, 
         getPagePara, getPageBody, getPreviousInlineOfBody, getNextInlineOfBody,
         getPreviousLineOfBody, getNextLineOfBody, getInlineBlockBodyIndex, getPageTable,
         isTextStyleEqual, buildTextStyleCss, buildEmptyTableCell, getRowColGridOfTableCell,
         defaultTextStyle, defaultParaStyle, getInlineBlockByRun }