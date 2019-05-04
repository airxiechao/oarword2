import { createElement, updateElement } from '../utils/renderer'
import state from '../utils/state'

class DocCursor{
    constructor(){
        this.cursorHeight = 0
        this.cursorPosX = 0
        this.cursorPoxY = 0
        this.imeStatus = false

        state.mutations.setCursorObj(this)
    }

    render(){
        this.el = createElement('div', {
            class: 'doc-cursor',
            style: {
                width: '0px',
                height: this.cursorHeight + 'px',
                borderLeft: '1.5px solid #555',
                position: 'absolute',
                left: this.cursorPosX + 'px',
                top: this.cursorPoxY + 'px',
                opacity: 1,
                visibility: this.imeStatus ? 'hidden' : 'visible',
            }
        })

        setInterval(function() {
            this.el.style.opacity = this.el.style.opacity ^ 1
        }.bind(this), 500);

        return this.el
    }

    updatePos(cursorPosX, cursorPosY, cursorHeight){
        this.cursorHeight = cursorHeight
        this.cursorPosX = cursorPosX
        this.cursorPoxY = cursorPosY
        updateElement(this.el, {
            style: {
                height: this.cursorHeight + 'px',
                left: this.cursorPosX + 'px',
                top: this.cursorPoxY + 'px',
                visibility: this.imeStatus ? 'hidden' : 'visible',
            }
        })
    }
}

export default DocCursor