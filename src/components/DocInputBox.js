import { createElement, updateElement } from '../utils/renderer'
import state from '../utils/state'

class DocInputBox{
    constructor(){
        this.cursorPosX = 0
        this.cursorPoxY = 0

        state.mutations.setInputBoxObj(this)
    }

    render(){
        this.el = createElement('div', {
            class: 'inputbox',
            attrs: {
                contentEditable: true,
            },
            style: {
                position: 'absolute',
                left: this.cursorPosX + 'px',
                top: this.cursorPoxY + 'px',
                opacity: 0,
                pointerEvents: 'none',
                outline: 'none',
            }
        })

        window.goog.events.listen(this.el, window.goog.events.EventType.INPUT, this.inputHandler.bind(this));
        window.goog.events.listen(new window.goog.events.ImeHandler(this.el),
            window.goog.object.getValues(window.goog.events.ImeHandler.EventType), this.imeHandler.bind(this));

        return this.el
    }

    updatePos(cursorPosX, cursorPosY){
        this.cursorPosX = cursorPosX
        this.cursorPoxY = cursorPosY
        updateElement(this.el, {
            style: {
                left: this.cursorPosX + 'px',
                top: this.cursorPoxY + 'px',
            }
        })

        this.el.focus()
        this.el.textContent = ''
    }

    inputHandler(){
        state.mutations.addOrUpdateParaRun({
                text: this.el.textContent,
                textStyle: {},
            }   
        )

        this.el.textContent = ''
    }

    imeHandler(){

    }
}

export default DocInputBox