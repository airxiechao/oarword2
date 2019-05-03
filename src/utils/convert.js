import { measureFontTextWH } from './measure'

function paraRunsToLinesAndSpacings(runs, paraIndex, paraWidth, posTop, marginTop, marginBottom, pageHeight, pageSpacingHeight){
    var paraLinesAndSpacings = []
    var paraHeight = 0

    var runsQueue = []
    for(var i = 0; i < runs.length; ++i){
        var run = runs[i]
        run.runIndex = i
        run.startIndex = 0
        run.paraIndex = paraIndex
        runsQueue.push(run)
    }

    while(runsQueue.length > 0){
        var lh = getLineInlineBlocksAndHeightFromQueue(runsQueue, paraWidth)
        var line = {
            inlineBlocks: lh.lineInlineBlocks,
            type: 'line',
        }
        var lineHeight = lh.lineHeight

        // check if page has enough space for line
        var leftHeight = getPageLeftHeight(posTop, marginBottom, pageHeight, pageSpacingHeight)
        if(leftHeight < lineHeight){
            // add page spacing
            var spacingHeight = leftHeight + marginBottom + pageSpacingHeight + marginTop
            var spacing = {
                spacingHeight: spacingHeight,
                type: 'spacing',
            }
            paraLinesAndSpacings.push(spacing)
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

        for(var i = 1; i<=run.text.length; ++i){
            var text = run.text.substr(0,i)
            var wh = measureFontTextWH(text, '', '', '')
            
            if(totalWidth + wh.w > lineWidth){
                i -= 1
                break
            }

            maxHeight = Math.max(maxHeight, wh.h)
        }
        
        var inlineBlock = run
        if(i < run.text.length){
            runsQueue.unshift({
                text: run.text.substr(i),
                textStyle: run.textStyle,
                paraIndex: run.paraIndex,
                runIndex: run.runIndex,
                startIndex: run.startIndex + i,
            })

            inlineBlock = {
                text: run.text.substr(0, i),
                textStyle: run.textStyle,
                paraIndex: run.paraIndex,
                runIndex: run.runIndex,
                startIndex: run.startIndex,
            }
        }

        inlineBlock.type = 'inline-block'
        lineInlineBlocks.push(inlineBlock)
        totalWidth += wh.w;
    }

    return {
        lineInlineBlocks: lineInlineBlocks,
        lineHeight: maxHeight
    }
}

function getPageNo(posY, pageHeight, pageSpacingHeight){
    var pageNo = parseInt(posY/(pageHeight+pageSpacingHeight)) + 1
    return pageNo
}

function getPageLeftHeight(posTop, marginBottom, pageHeight, pageSpacingHeight){
    var pageNo = getPageNo(posTop, pageHeight, pageSpacingHeight)
    var leftHeight = pageNo*(pageHeight+pageSpacingHeight) - posTop - marginBottom - pageSpacingHeight
    return leftHeight
}

function getPagePara(para, lastPosBottom, paraIndex,
        pageWidth, pageHeight, pageSpacingHeight, 
        marginTop, marginRight, marginBottom, marginLeft){

    // conver paragraph to lines and spacings
    var paraWidth = pageWidth-marginLeft-marginRight
    var lh = paraRunsToLinesAndSpacings(para, paraIndex, paraWidth, lastPosBottom, marginTop, marginBottom, pageHeight, pageSpacingHeight)
    var paraLinesAndSpacings = lh.paraLinesAndSpacings
    var paraHeight = lh.paraHeight

    var pagePara = {
        type: 'para',
        paraIndex: paraIndex,
        paraHeight: paraHeight,
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
        var pagePara = getPagePara(para, lastPosBottom, i,
                                    pageWidth, pageHeight, pageSpacingHeight,
                                    marginTop, marginRight, marginBottom, marginLeft)

        pageParas.push(pagePara)
        lastPosBottom += pagePara.paraHeight;
    }

    return pageParas
}


export { paraRunsToLinesAndSpacings, getLineInlineBlocksAndHeightFromQueue, getPageNo, getPageLeftHeight, 
         getPagePara, getPageParas }