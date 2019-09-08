import { createElement } from '../utils/renderer'
import { measureEleDocXY } from '../utils/measure'
import state from '../utils/state'

export default class DocImageResizer{
    constructor(targetObj){
        this.showResizer = false
        this.targetObj = targetObj
        
        this.x = this.targetObj ? measureEleDocXY(this.targetObj.el).x : 0
        this.y = this.targetObj ? measureEleDocXY(this.targetObj.el).y : 0
        this.w = this.targetObj ? this.targetObj.el.offsetWidth : 0
        this.h = this.targetObj ? this.targetObj.el.offsetHeight : 0

        state.mutations.setImageResizerObj(this)
    }

    render(){

        let imgResizerNw = createElement('div', {
            class: 'image-resizer-nw',
            style: {
                display: 'block',
                backgroundColor: 'rgb(0, 150, 253)',
                width: '6px',
                height: '6px',
                position: 'absolute',
                left: (- 3)+'px',
                top: (- 3)+'px',
                cursor: 'nw-resize',
            }
        })

        let imgResizerN = createElement('div', {
            class: 'image-resizer-n',
            style: {
                display: 'block',
                backgroundColor: 'rgb(0, 150, 253)',
                width: '6px',
                height: '6px',
                position: 'absolute',
                left: (this.w/2 - 3) +'px',
                top: (- 3)+'px',
                cursor: 'n-resize',
            }
        })

        let imgResizerNe = createElement('div', {
            class: 'image-resizer-ne',
            style: {
                display: 'block',
                backgroundColor: 'rgb(0, 150, 253)',
                width: '6px',
                height: '6px',
                position: 'absolute',
                left: (this.w - 3) +'px',
                top: (- 3)+'px',
                cursor: 'ne-resize',
            }
        })

        let imgResizerE = createElement('div', {
            class: 'image-resizer-e',
            style: {
                display: 'block',
                backgroundColor: 'rgb(0, 150, 253)',
                width: '6px',
                height: '6px',
                position: 'absolute',
                left: (this.w - 3) +'px',
                top: (this.h/2 - 3) + 'px',
                cursor: 'e-resize',
            }
        })

        let imgResizerSe = createElement('div', {
            class: 'image-resizer-se',
            style: {
                display: 'block',
                backgroundColor: 'rgb(0, 150, 253)',
                width: '6px',
                height: '6px',
                position: 'absolute',
                left: (this.w - 3) +'px',
                top: (this.h - 3) + 'px',
                cursor: 'se-resize',
            }
        })

        let imgResizerS = createElement('div', {
            class: 'image-resizer-s',
            style: {
                display: 'block',
                backgroundColor: 'rgb(0, 150, 253)',
                width: '6px',
                height: '6px',
                position: 'absolute',
                left: (this.w/2 - 3) +'px',
                top: (this.h - 3) + 'px',
                cursor: 's-resize',
            }
        })

        let imgResizerSw = createElement('div', {
            class: 'image-resizer-sw',
            style: {
                display: 'block',
                backgroundColor: 'rgb(0, 150, 253)',
                width: '6px',
                height: '6px',
                position: 'absolute',
                left: (- 3)+'px',
                top: (this.h - 3) + 'px',
                cursor: 'sw-resize',
            }
        })

        let imgResizerW = createElement('div', {
            class: 'image-resizer-w',
            style: {
                display: 'block',
                backgroundColor: 'rgb(0, 150, 253)',
                width: '6px',
                height: '6px',
                position: 'absolute',
                left: (- 3)+'px',
                top: (this.h/2 - 3) + 'px',
                cursor: 'w-resize',
            }
        })

        let imgResizerBorder = createElement('div', {
            class: 'image-resizer-border',
            style: {
                border: '1px solid rgb(0, 150, 253)',
                position: 'absolute',
                top: -1 + 'px',
                left: -1 + 'px',
                width: this.w + 'px',
                height: this.h + 'px',
                pointerEvents: 'none',
            }
        })

        let imgResizer = createElement('div', {
            class: 'doc-image-resizer',
            style: {
                display: 'none',
                border: '1px solid rgb(0, 150, 253)',
                position: 'absolute',
                top: (this.x - 1) + 'px',
                left: (this.y - 1) + 'px',
                width: 0 + 'px',
                height: 0 + 'px',
                zIndex: 9,
            }
        }, [imgResizerBorder, imgResizerNw, imgResizerN, imgResizerNe, imgResizerE, imgResizerSe, imgResizerS, imgResizerSw, imgResizerW])

        this.imgResizerNw = imgResizerNw
        this.imgResizerN = imgResizerN
        this.imgResizerNe = imgResizerNe
        this.imgResizerE = imgResizerE
        this.imgResizerSe = imgResizerSe
        this.imgResizerS = imgResizerS
        this.imgResizerSw = imgResizerSw
        this.imgResizerW = imgResizerW
        this.imgResizerBorder = imgResizerBorder
        this.imgResizer = imgResizer
        this.el = this.imgResizer
        
        window.goog.events.listen(imgResizerNw, window.goog.events.EventType.MOUSEDOWN, this.mouseDownHandler.bind(this));
        window.goog.events.listen(imgResizerN, window.goog.events.EventType.MOUSEDOWN, this.mouseDownHandler.bind(this));
        window.goog.events.listen(imgResizerNe, window.goog.events.EventType.MOUSEDOWN, this.mouseDownHandler.bind(this));
        window.goog.events.listen(imgResizerE, window.goog.events.EventType.MOUSEDOWN, this.mouseDownHandler.bind(this));
        window.goog.events.listen(imgResizerSe, window.goog.events.EventType.MOUSEDOWN, this.mouseDownHandler.bind(this));
        window.goog.events.listen(imgResizerS, window.goog.events.EventType.MOUSEDOWN, this.mouseDownHandler.bind(this));
        window.goog.events.listen(imgResizerSw, window.goog.events.EventType.MOUSEDOWN, this.mouseDownHandler.bind(this));
        window.goog.events.listen(imgResizerW, window.goog.events.EventType.MOUSEDOWN, this.mouseDownHandler.bind(this));

        return this.imgResizer
    }

    mouseDownHandler(e){
        let resizer = e.target
        let dragger = new goog.fx.Dragger(resizer)

        let oldX = this.x
        let oldY = this.y
        let oldW = this.w
        let oldH = this.h
        
        dragger.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {
            let docGrid = this.targetObj.ib.parent.parent.parent.doc.grid

            if(resizer == this.imgResizerNw){
                this.x = Math.max(Math.min(oldX  + e.left, oldX + oldW), docGrid.marginLeft)
                this.y = Math.max(Math.min(oldY + e.top, oldY + oldH), docGrid.marginTop)
                let dx = this.x - oldX
                let dy = this.y - oldY
                this.w = Math.max(oldW - dx, 0)
                this.h = Math.max(oldH - dy, 0)
            }else if(resizer == this.imgResizerN){
                this.y = Math.max(Math.min(oldY + e.top, oldY + oldH), docGrid.marginTop)
                let dy = this.y - oldY
                this.h = Math.max(oldH - dy, 0)
            }else if(resizer == this.imgResizerNe){
                let rx = Math.min(Math.max(oldX + e.left, oldX), docGrid.pageWidth - docGrid.marginRight)
                this.y = Math.max(Math.min(oldY + e.top, oldY + oldH), docGrid.marginTop)
                let dx = rx - (oldX + oldW)
                let dy = this.y - oldY
                this.w = Math.max(oldW + dx, 0)
                this.h = Math.max(oldH - dy, 0)
            }else if(resizer == this.imgResizerE){
                let rx = Math.min(Math.max(oldX + e.left, oldX), docGrid.pageWidth - docGrid.marginRight)
                let dx = rx - (oldX + oldW)
                this.w = Math.max(oldW + dx, 0)
            }else if(resizer == this.imgResizerSe){
                let rx = Math.min(Math.max(oldX + e.left, oldX), docGrid.pageWidth - docGrid.marginRight)
                let ry = Math.min(Math.max(oldY + e.top, oldY), docGrid.pageHeight - docGrid.marginBottom)
                let dx = rx - (oldX + oldW)
                let dy = ry - (oldY + oldH)
                this.w = Math.max(oldW + dx, 0)
                this.h = Math.max(oldH + dy, 0)
            }else if(resizer == this.imgResizerS){
                let ry = Math.min(Math.max(oldY + e.top, oldY), docGrid.pageHeight - docGrid.marginBottom)
                let dy = ry - (oldY + oldH)
                this.h = Math.max(oldH + dy, 0)
            }else if(resizer == this.imgResizerSw){
                this.x = Math.max(Math.min(oldX  + e.left, oldX + oldW), docGrid.marginLeft)
                let ry = Math.min(Math.max(oldY + e.top, oldY), docGrid.pageHeight - docGrid.marginBottom)
                let dx = this.x - oldX
                let dy = ry - (oldY + oldH)
                this.w = Math.max(oldW - dx, 0)
                this.h = Math.max(oldH + dy, 0)
            }else if(resizer == this.imgResizerW){
                this.x = Math.max(Math.min(oldX  + e.left, oldX + oldW), docGrid.marginLeft)
                let dx = this.x - oldX
                this.w = Math.max(oldW - dx, 0)
            }

            this.update()
        }.bind(this))
        
        dragger.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
            dragger.dispose();

            state.mutations.updateImageStyle({
                ib: this.targetObj.ib,
                imageStyle: {
                    width: this.w,
                    height: this.h,
                }
            })
        }.bind(this))

        dragger.startDrag(e);
    }

    updateTarget(targetObj){
        if(targetObj){
            this.targetObj = targetObj
        }

        this.x = this.targetObj ? measureEleDocXY(this.targetObj.el).x : 0
        this.y = this.targetObj ? measureEleDocXY(this.targetObj.el).y : 0
        this.w = this.targetObj ? this.targetObj.el.offsetWidth : 0
        this.h = this.targetObj ? this.targetObj.el.offsetHeight : 0

        if(this.x > 0 && this.y > 0){
            this.update()
        }else{
            this.targetObj = null
            this.hide()
        }
    }

    update(){
        this.imgResizer.style['left'] = (this.x - 1) + 'px'
        this.imgResizer.style['top'] = (this.y - 1) + 'px'
        this.imgResizer.style['width'] = 0 + 'px'
        this.imgResizer.style['height'] = 0 + 'px'

        this.imgResizerBorder.style['left'] = -1 + 'px'
        this.imgResizerBorder.style['top'] = -1 + 'px'
        this.imgResizerBorder.style['width'] = this.w + 'px'
        this.imgResizerBorder.style['height'] = this.h + 'px'

        this.imgResizerNw.style['left'] = (- 3) +'px'
        this.imgResizerNw.style['top'] = (- 3) +'px'
        this.imgResizerN.style['left'] = (this.w/2 - 3) +'px'
        this.imgResizerN.style['top'] = (- 3) +'px'
        this.imgResizerNe.style['left'] = (this.w - 3) +'px'
        this.imgResizerNe.style['top'] = (- 3) +'px'
        this.imgResizerE.style['left'] = (this.w - 3) +'px'
        this.imgResizerE.style['top'] =  (this.h/2 - 3) + 'px'
        this.imgResizerSe.style['left'] = (this.w - 3) +'px'
        this.imgResizerSe.style['top'] =  (this.h - 3) + 'px'
        this.imgResizerS.style['left'] = (this.w/2 - 3) +'px'
        this.imgResizerS.style['top'] =  (this.h - 3) + 'px'
        this.imgResizerSw.style['left'] = (- 3) +'px'
        this.imgResizerSw.style['top'] =  (this.h - 3) + 'px'
        this.imgResizerW.style['left'] = (- 3) +'px'
        this.imgResizerW.style['top'] =  (this.h/2 - 3) + 'px'
        
    }

    show(){
        this.showResizer = true
        this.imgResizer.style['display'] = 'block'
    }

    hide(){
        this.showResizer = false
        this.imgResizer.style['display'] = 'none'
    }
}
