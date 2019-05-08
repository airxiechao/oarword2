import { measureFontTextWH, getPageLeftHeight } from './measure'

function paraRunsToLinesAndSpacings(runs, paraWidth, posTop, marginTop, marginBottom, pageHeight, pageSpacingHeight){
    var paraLinesAndSpacings = []
    var paraHeight = 0

    var runsQueue = []
    for(var i = 0; i < runs.length; ++i){
        var run = runs[i]
        run.startIndex = 0
        runsQueue.push({
            doc: run,
            text: run.text,
            textStyle: run.textStyle,
            startIndex: run.startIndex,
        })
    }

    while(runsQueue.length > 0){
        var lh = getLineInlineBlocksAndHeightFromQueue(runsQueue, paraWidth)
        var lineHeight = lh.lineHeight
        var line = {
            inlineBlocks: lh.lineInlineBlocks,
            lineHeight: lineHeight,
            lineWidth: paraWidth,
            spacingHeight: 0,
            type: 'line',
        }

        // check if page has enough space for line
        var leftHeight = getPageLeftHeight(posTop, marginBottom, pageHeight, pageSpacingHeight)
        if(leftHeight < lineHeight){
            // add page spacing
            var spacingHeight = leftHeight + marginBottom + pageSpacingHeight + marginTop

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
    var totalWidth = 0;
    var maxHeight = 0;
    var lineInlineBlocks = []
    while(totalWidth < lineWidth && runsQueue.length > 0){
        var run = runsQueue.shift()

        var wh = {w:0,h:0}
        if(run.text.length == 0){
            wh.h = measureFontTextWH('|', '', '', '').h
            maxHeight = wh.h
        }
        for(var i = 1; i<=run.text.length; ++i){
            var t = run.text.substr(0,i)
            wh = measureFontTextWH(t, '', '', '')            
            if(totalWidth + wh.w > lineWidth){
                i -= 1
                break
            }

            maxHeight = Math.max(maxHeight, wh.h)
        }
        
        var inlineBlock = {
            doc: run.doc,
            text: run.text,
            textStyle: run.textStyle,
            startIndex: run.startIndex,
        }
        if(i < run.text.length){
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
    var paraWidth = pageWidth-marginLeft-marginRight
    var lh = paraRunsToLinesAndSpacings(para, paraWidth, lastPosBottom, marginTop, marginBottom, pageHeight, pageSpacingHeight)
    var paraLinesAndSpacings = lh.paraLinesAndSpacings
    var paraHeight = lh.paraHeight

    var pagePara = {
        type: 'para',
        doc: para,
        paraHeight: paraHeight,
        paraWidth: paraWidth,
        linesAndSpacings: paraLinesAndSpacings,
    }

    return pagePara
}

function getPageParas(paras, lastPosBottom, 
        pageWidth, pageHeight, pageSpacingHeight, 
        marginTop, marginRight, marginBottom, marginLeft){

    var pageParas = []
    for(let i = 0; i < paras.length; ++i){
        var para = paras[i];
        var pagePara = getPagePara(para, lastPosBottom,
                                    pageWidth, pageHeight, pageSpacingHeight,
                                    marginTop, marginRight, marginBottom, marginLeft)

        pageParas.push(pagePara)
        lastPosBottom += pagePara.paraHeight;
    }

    return pageParas
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
         getPagePara, getPageParas, getDocParaOfRun, getPreviousInlineOfBody, getNextInlineOfBody,
         getPreviousLineOfBody, getNextLineOfBody }