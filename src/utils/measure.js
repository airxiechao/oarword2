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

function getCursorPos(cursorInlineBlock, inlineStartIndex){
    var cursorPosX = 0
    var cursorPoxY = 0
    var cursorHeight = 0

    var cb = cursorInlineBlock
    if(cb && cb.vue && cb.vue.$el){
        var InlineBlockLeft = cb.vue.$el.offsetLeft
        var InlineBlocktTop = cb.vue.$el.offsetTop
        
        var text = cb.text
        var si = inlineStartIndex

        var t = text.substr(0, si + 1)
        var h = measureFontTextWH(t, '', '', '').h

        var w = 0
        if( si > 0 ){
            t = text.substr(0, si)
            w = measureFontTextWH(t, '', '', '').w
        }

        cursorPosX = InlineBlockLeft + w
        cursorPoxY = InlineBlocktTop
        cursorHeight = h
    }
    
    return {
        cursorPosX: cursorPosX,
        cursorPoxY: cursorPoxY,
        cursorHeight: cursorHeight,
    }
}

export { measureFontTextWH, measureElePageXY, getCursorPos }