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

export { measureFontTextWH, measureElePageXY }