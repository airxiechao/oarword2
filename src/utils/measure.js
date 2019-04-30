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

export { measureFontTextWH }