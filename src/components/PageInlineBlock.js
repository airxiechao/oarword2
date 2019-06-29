import { createElement } from '../utils/renderer'
import { buildTextStyleCss } from '../utils/convert'
import { measureFontTextWH, measureElePageXY, measureEleDocXY } from '../utils/measure.js'

import state from '../utils/state'

class PageInlineBlock{
    constructor(ib){
        this.ib = ib
    }

    render(){
        if(this.ib.type == 'text'){
            let text = this.ib.text
            let textStyle = this.ib.textStyle
    
            let t = window.goog.dom.createTextNode(text)
            let textStyleCss = buildTextStyleCss(textStyle)
            textStyleCss['display'] = 'inline-block'
            textStyleCss['height'] = this.ib.inlineHeight + 'px'
            this.el = createElement('div', {
                class: 'page-inline-block-text',
                style: textStyleCss
            }, [
                t
            ])

            window.goog.events.listen(this.el, window.goog.events.EventType.CLICK, this.clickTextHandler.bind(this));
        }else if(this.ib.type == 'image'){
            let image = this.ib.image
            let imageStyle = this.ib.imageStyle

            let img = createElement('img', {
                attrs: {
                    src: image,
                },
                style: {
                    display: 'inline-block',
                    width: imageStyle.width + 'px',
                    height: imageStyle.height + 'px',
                    cursor: 'text',
                }
            })

            this.el = createElement('div', {
                class: 'page-inline-block-image',
                style: {
                    display: 'inline-block',
                    height: this.ib.inlineHeight + 'px',
                    verticalAlign: 'bottom',
                }
            }, [
                img
            ])

            window.goog.events.listen(this.el, window.goog.events.EventType.CLICK, this.clickImageHandler.bind(this));
        }
        

        return this.el
    }

    clickTextHandler(e){
        let docXY = measureElePageXY(document.getElementsByClassName('doc')[0])
        let elXY = measureEleDocXY(this.el)
        let pointLeft = e.clientX - docXY.x - elXY.x
        
        let front = false
        let lastw = 0
        for(var i = 1; i <= this.ib.text.length; ++i){
            let t = this.ib.text.substr(0, i)
            let wh = measureFontTextWH(t, this.ib.textStyle)

            if(wh.w > pointLeft){
                let cw = wh.w - lastw

                if(pointLeft < lastw + cw / 2){
                    front = true
                }

                break
            }

            lastw = wh.w
        }
        
        // update cursor
        state.mutations.setCursorInlineBlock({
                inlineBlock: this.ib,
                inlineStartIndex: i-1,
                front: front,
            }
        )

    }

    clickImageHandler(e){
        let docXY = measureElePageXY(document.getElementsByClassName('doc')[0])
        let elXY = measureEleDocXY(this.el)
        let pointLeft = e.clientX - docXY.x - elXY.x
        
        let front = true
        if(this.ib.imageStyle.width / 2 < pointLeft){
            front = false
        }
        
        state.mutations.setCursorInlineBlock({
                inlineBlock: this.ib,
                inlineStartIndex: 0,
                front: front,
            }
        )
    }
}

export default PageInlineBlock