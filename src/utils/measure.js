function measureFontTextWH(text, fontFamily, fontSize, fontWeight){
    var dummy = document.createElement('div');
    dummy.style.fontFamily = fontFamily;
    dummy.style.fontSize = fontSize;
    dummy.style.fontWeight = fontWeight;
    dummy.style.visibility = 'hidden';
    dummy.style.display = 'inline-block';
    dummy.textContent = text;

    document.body.appendChild(dummy)
    var w = dummy.offsetWidth;
    var h = dummy.offsetHeight;
    document.body.removeChild(dummy);
    return {w:w, h:h};
}

function measureElePageXY(ele){
    var x = 0, y = 0;

    while( ele ) {
        x += ele.offsetLeft;
        y += ele.offsetTop;
        ele = ele.offsetParent;
        if( ele && ele == document.body ) {
            break;
        }
    }

    return {x:x, y:y};
}

function getCursorPos(cursorInlineBlock, inlineStartIndex, front){
    var cursorPosX = 0
    var cursorPosY = 0
    var cursorHeight = 0
    
    var cb = cursorInlineBlock
    if(cb && cb.obj && cb.obj.el){
        var inlineBlockLeft = cb.obj.el.offsetLeft
        var inlineBlocktTop = cb.obj.el.offsetTop
        
        var text = cb.text
        var h = cb.inlineHeight

        var w = 0
        var w1 = 0
        var w2 = 0
        if( inlineStartIndex > 0 ){
            let t1 = text.substr(0, inlineStartIndex)
            w1 = measureFontTextWH(t1, '', '', '').w

            let t2 = text.substr(0, inlineStartIndex+1)
            w2 = measureFontTextWH(t2, '', '', '').w

            if(front){
                w = w1
            }else{
                w = w2
            }
        }else{
            let t1 = text.substr(0, 1)
            w1 = measureFontTextWH(t1, '', '', '').w

            if(front){
                w = 0
            }else{
                w = w1
            }
        }

        cursorPosX = inlineBlockLeft + w
        cursorPosY = inlineBlocktTop
        cursorHeight = h
    }
    
    return {
        cursorPosX: cursorPosX,
        cursorPosY: cursorPosY,
        cursorHeight: cursorHeight,
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

export { measureFontTextWH, measureElePageXY, getCursorPos, getPageNo, getPageLeftHeight }