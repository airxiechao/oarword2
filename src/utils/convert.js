import { measureFontTextWH, getPageLeftHeight, getWidthFontTextPos } from './measure'

function paraRunsToLines(runs, paraWidth, posTop, marginTop, marginBottom, pageHeight, pageSpacingHeight){
    let paraLines = []
    let paraHeight = 0

    let runsQueue = []
    for(let i = 0; i < runs.length; ++i){
        let run = runs[i]
        run.startIndex = 0
        runsQueue.push({
            doc: run,
            text: run.text,
            textStyle: run.textStyle,
            startIndex: run.startIndex,
        })
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
    var totalWidth = 0
    var maxHeight = 0
    var lineInlineBlocks = []
    while(totalWidth < lineWidth && runsQueue.length > 0){
        var run = runsQueue.shift()

        var wh = {w:0,h:0}
        var i = 0
        if(run.text.length == 0){
            wh.h = measureFontTextWH('|', '', '', '').h
            maxHeight = wh.h
        }else{
            var iwh = getWidthFontTextPos(run.text, run.textStyle, lineWidth - totalWidth)
            if(iwh.i < 0){
                runsQueue.unshift(run)
                break
            }

            i = iwh.i + 1
            wh = iwh.wh
            maxHeight = Math.max(maxHeight, wh.h)
        }
        
        var inlineBlock = {
            doc: run.doc,
            text: run.text,
            textStyle: run.textStyle,
            startIndex: run.startIndex,
        }
        if(i > 0 && i < run.text.length){
            runsQueue.unshift({
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

        inlineBlock.type = 'inline-block'
        inlineBlock.inlineHeight = wh.h

        lineInlineBlocks.push(inlineBlock)
        totalWidth += wh.w;
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
    for(let i = 0; i < table.cells.length; ++i){
        let tableRow = []
        tableCells.push(tableRow)
        let row = table.cells[i]
        let rowHeight = 0
        for(let j = 0; j < row.length; ++j){
            let col = row[j]
            let rowspan = col.rowspan
            let colspan = col.colspan

            col.grid.pageWidth = table.grid[j]
            col.grid.pageHeight = doc.grid.pageHeight
            col.grid.pageSpacingHeight = doc.grid.pageSpacingHeight 
            col.grid.marginTop = doc.grid.marginTop
            col.grid.marginRight = 0
            col.grid.marginBottom = doc.grid.marginBottom
            col.grid.marginLeft = 0

            let pb = getPageBody(col, lastPosBottom)
            let pageBody = pb.pageBody
            let bodyHeight = pb.bodyHeight
            rowHeight = Math.max(rowHeight, bodyHeight)

            tableRow.push(pageBody)
        }

        lastPosBottom += rowHeight
        tableHeight += rowHeight
    }

    let pageTable = {
        type: 'table',
        doc: table,
        cells: tableCells,
        tableHeight: tableHeight,
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
        type: 'body',
    }

    // set parent for paragraphs and tables
    for(let i = 0; i < pageBody.pts.length; ++i){
        let pt = pageBody.pts[i]
        pt.parent = pageBody
    }

    return {
        pageBody: pageBody,
        bodyHeight: bodyHeight,
    }
}

function getDocParaOfRun(doc, run){
    for(let i = 0; i < doc.pts.length; ++i){
        let para = doc.pts[i]
        for(let j = 0; j < para.runs.length; ++j){
            let r = para.runs[j]
            if(r === run){
                return para
            }
        }
    }

    return null
}

function getPreviousLineOfBody(inlineBlock){
    let body = inlineBlock.parent.parent.parent
    let lastline = null
    for(let i = 0; i < body.pts.length; ++i){
        let para = body.pts[i]
        for(let j = 0; j < para.lines.length; ++j){
            let line = para.lines[j]
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

    return lastline
}

function getNextLineOfBody(inlineBlock){
    let body = inlineBlock.parent.parent.parent
    let nextline = null
    for(let i = body.pts.length - 1; i >= 0; --i){
        let para = body.pts[i]
        for(let j = para.lines.length - 1; j >= 0 ; --j){
            let line = para.lines[j]
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

    return nextline
}

function getPreviousInlineOfBody(inlineBlock){
    let body = inlineBlock.parent.parent.parent
    let lastib = null
    for(let i = 0; i < body.pts.length; ++i){
        let para = body.pts[i]
        for(let j = 0; j < para.lines.length; ++j){
            let line = para.lines[j]
            for(let k = 0; k < line.inlineBlocks.length; ++k){
                let ib = line.inlineBlocks[k]
                if(ib == inlineBlock){
                    return lastib
                }

                lastib = ib
            }
        }
    }

    return lastib
}

function getNextInlineOfBody(inlineBlock){
    let body = inlineBlock.parent.parent.parent
    let nextib = null
    for(let i = body.pts.length - 1; i >= 0; --i){
        let para = body.pts[i]
        for(let j = para.lines.length - 1; j >= 0 ; --j){
            let line = para.lines[j]
            for(let k = line.inlineBlocks.length - 1; k >= 0 ; --k){
                let ib = line.inlineBlocks[k]
                if(ib == inlineBlock){
                    return nextib
                }

                nextib = ib
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
    let startIndex = ib.startIndex + state.document.cursor.inlineStartIndex

    return {
        body: body,
        paraIndex: paraIndex,
        runIndex: runIndex,
        startIndex: startIndex,
    }
}

export { paraRunsToLines, getLineInlineBlocksAndHeightFromQueue, getPageLeftHeight, 
         getPagePara, getPageBody, getDocParaOfRun, getPreviousInlineOfBody, getNextInlineOfBody,
         getPreviousLineOfBody, getNextLineOfBody, getInlineBlockBodyIndex, getPageTable }