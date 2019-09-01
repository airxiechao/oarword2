import { measureFontTextWH, measureElePageXY, measureEleDocXY } from '../utils/measure.js'
import PageInlineBlockImage from './PageInlineBlockImage'
import PageInlineBlockText from './PageInineBlockText'

import state from '../utils/state'

class PageInlineBlock{
    constructor(ib){
        this.ib = ib
    }

    render(){
        if(this.ib.type == 'text'){
            let img = new PageInlineBlockText(this.ib)
            this.el = img.render()

            //window.goog.events.listen(this.el, window.goog.events.EventType.CLICK, this.clickTextHandler.bind(this));
        }else if(this.ib.type == 'image'){
            let img = new PageInlineBlockImage(this.ib)
            this.el = img.render()

            //window.goog.events.listen(this.el, window.goog.events.EventType.CLICK, this.clickImageHandler.bind(this));
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

            if(wh.w >= pointLeft){
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