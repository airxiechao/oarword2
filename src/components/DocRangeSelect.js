import { createElement } from "../renderer"
import { measureEleDocXY, measureInlineBlockSpanX } from "../measure"

class DocRangeSelect {
    constructor(range){
        this.range = range
    }

    render(){
        let overlays = []
        for(let i = 0; i < this.range.length; ++i){
            let { inlineBlock, startIndex, endIndex } = this.range[i]

            let {startX, endX} = measureInlineBlockSpanX(inlineBlock, startIndex, endIndex)
            let x = measureEleDocXY(inlineBlock.obj.el).x + startX
            let y = measureEleDocXY(inlineBlock.obj.el).y
            let w = endX - startX
            let h = inlineBlock.obj.el.offsetHeight
            
            let overlay = createElement('div', {
                class: 'range-select-overlay',
                style: {
                    position: 'absolute',
                    width: w+'px',
                    height: h+'px',
                    left: x+'px',
                    top: y+'px',
                    backgroundColor: '#0096fd',
                    opacity: .3,
                    pointerEvents: 'none',
                }
            })

            overlays.push(overlay)
        }

        this.el = createElement('div', {
            class: 'range-select'
        }, overlays)

        window.goog.dom.appendChild(state.document.obj.docEl, this.el)
    }

    remove(){
        this.el.remove()
    }
}

export default DocRangeSelect