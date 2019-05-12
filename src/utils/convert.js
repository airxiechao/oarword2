import { measureFontTextWH, getPageLeftHeight, getWidthFontTextPos } from './measure'

function paraRunsToLinesAndSpacings(runs, paraWidth, posTop, marginTop, marginBottom, pageHeight, pageSpacingHeight){
    let paraLinesAndSpacings = []
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
        
        paraLinesAndSpacings.push(line)
        posTop += lineHeight
        paraHeight += lineHeight
    }

    return {
        paraLinesAndSpacings: paraLinesAndSpacings,
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
    let lh = paraRunsToLinesAndSpacings(para, paraWidth, lastPosBottom, marginTop, marginBottom, pageHeight, pageSpacingHeight)
    let paraLinesAndSpacings = lh.paraLinesAndSpacings
    let paraHeight = lh.paraHeight

    let pagePara = {
        type: 'para',
        doc: para,
        paraHeight: paraHeight,
        paraWidth: paraWidth,
        linesAndSpacings: paraLinesAndSpacings,
    }

    // set parent for lines
    for(let i = 0; i < pagePara.linesAndSpacings.length; ++i){
        let ls = pagePara.linesAndSpacings[i]
        ls.parent = pagePara
    }

    return pagePara
}

function getPageBody(paras, lastPosBottom, 
        pageWidth, pageHeight, pageSpacingHeight, 
        marginTop, marginRight, marginBottom, marginLeft){

    let parasAndTables = []
    for(let i = 0; i < paras.length; ++i){
        let para = paras[i];
        let pagePara = getPagePara(para, lastPosBottom,
                                    pageWidth, pageHeight, pageSpacingHeight,
                                    marginTop, marginRight, marginBottom, marginLeft)

        parasAndTables.push(pagePara)
        lastPosBottom += pagePara.paraHeight;
    }

    let pageBody = {
        parasAndTables: parasAndTables
    }

    // set parent for paragraphs and tables
    for(let i = 0; i < pageBody.parasAndTables.length; ++i){
        let pt = pageBody.parasAndTables[i]
        pt.parent = pageBody
    }

    return pageBody
}

function getDocParaOfRun(doc, run){
    for(let i = 0; i < doc.length; ++i){
        let para = doc[i]
        for(let j = 0; j < para.length; ++j){
            let r = para[j]
            if(r === run){
                return para
            }
        }
    }

    return null
}

function getPreviousLineOfBody(body, inlineBlock){
    let lastline = null
    for(let i = 0; i < body.length; ++i){
        let para = body[i]
        for(let j = 0; j < para.linesAndSpacings.length; ++j){
            let line = para.linesAndSpacings[j]
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

function getNextLineOfBody(body, inlineBlock){
    let nextline = null
    for(let i = body.length - 1; i >= 0; --i){
        let para = body[i]
        for(let j = para.linesAndSpacings.length - 1; j >= 0 ; --j){
            let line = para.linesAndSpacings[j]
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

function getPreviousInlineOfBody(body, inlineBlock){
    let lastib = null
    for(let i = 0; i < body.length; ++i){
        let para = body[i]
        for(let j = 0; j < para.linesAndSpacings.length; ++j){
            let line = para.linesAndSpacings[j]
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

function getNextInlineOfBody(body, inlineBlock){
    let nextib = null
    for(let i = body.length - 1; i >= 0; --i){
        let para = body[i]
        for(let j = para.linesAndSpacings.length - 1; j >= 0 ; --j){
            let line = para.linesAndSpacings[j]
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


export { paraRunsToLinesAndSpacings, getLineInlineBlocksAndHeightFromQueue, getPageLeftHeight, 
         getPagePara, getPageBody, getDocParaOfRun, getPreviousInlineOfBody, getNextInlineOfBody,
         getPreviousLineOfBody, getNextLineOfBody }