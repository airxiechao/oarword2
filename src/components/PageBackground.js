import { createElement } from '../renderer'

class PageBackground{
    constructor(pageWidth, pageHeight, pageSpacingHeight, marginTop, marginRight, marginBottom, marginLeft, pageIndex){
        this.pageWidth = pageWidth
        this.pageHeight = pageHeight
        this.pageSpacingHeight = pageSpacingHeight
        this.marginTop = marginTop
        this.marginRight = marginRight
        this.marginBottom = marginBottom
        this.marginLeft = marginLeft
        this.pageIndex = pageIndex
        this.w = 30
        this.h = 30
        this.m = 2
    }

    render(){
        // anchors
        let anchors = []
        anchors.push(createElement('div', {
            class: 'bg-anchor-top-left',
            style: {
                width: this.w + 'px',
                height: this.h + 'px',
                borderRight: '1px solid rgb(204, 204, 204)',
                borderBottom: '1px solid rgb(204, 204, 204)',
                position: 'absolute',
                top: (this.marginTop-this.h-this.m)+'px',
                left: (this.marginLeft-this.w-this.m)+'px',
            }
        }))
        anchors.push(createElement('div', {
            class: 'bg-anchor-top-right',
            style: {
                width: this.w + 'px',
                height: this.h + 'px',
                borderLeft: '1px solid rgb(204, 204, 204)',
                borderBottom: '1px solid rgb(204, 204, 204)',
                position: 'absolute',
                top: (this.marginTop-this.h-this.m)+'px',
                left: (this.pageWidth-this.marginRight+this.m)+'px',
            }
        }))
        anchors.push(createElement('div', {
            class: 'bg-anchor-bottom-right',
            style: {
                width: this.w + 'px',
                height: this.h + 'px',
                borderLeft: '1px solid rgb(204, 204, 204)',
                borderTop: '1px solid rgb(204, 204, 204)',
                position: 'absolute',
                top: (this.pageHeight-this.marginBottom+this.m)+'px',
                left: (this.pageWidth-this.marginRight+this.m)+'px',
            }
        }))
        anchors.push(createElement('div', {
            class: 'bg-anchor-bottom-left',
            style: {
                width: this.w + 'px',
                height: this.h + 'px',
                borderRight: '1px solid rgb(204, 204, 204)',
                borderTop: '1px solid rgb(204, 204, 204)',
                position: 'absolute',
                top: (this.pageHeight-this.marginBottom+this.m)+'px',
                left: (this.marginLeft-this.w-this.m)+'px',
            }
        }))

        // masks
        let masks = []
        anchors.push(createElement('div', {
            class: 'bg-mask-top',
            style: {
                width: (this.pageWidth - this.marginLeft - this.marginRight) + 'px',
                height: (this.marginBottom-1) + 'px',
                position: 'absolute',
                top: '0px',
                left: this.marginLeft+'px',
                background: '#fff',
                zIndex: 9,
            }
        }))
        anchors.push(createElement('div', {
            class: 'bg-mask-bottom',
            style: {
                width: (this.pageWidth - this.marginLeft - this.marginRight) + 'px',
                height: (this.marginBottom-1) + 'px',
                position: 'absolute',
                top: (this.pageHeight-this.marginBottom+1)+'px',
                left: this.marginLeft+'px',
                background: '#fff',
                zIndex: 9,
            }
        }))
        anchors.push(createElement('div', {
            class: 'bg-mask-spacing',
            style: {
                width: (this.pageWidth - this.marginLeft - this.marginRight) + 'px',
                height: this.pageSpacingHeight + 'px',
                position: 'absolute',
                top: this.pageHeight+'px',
                left: this.marginLeft+'px',
                background: 'rgb(224 224 224)',
                boxShadow: 'inset 0px 0px 3px #ccc',
                zIndex: 9,
            }
        }))

        this.el = createElement('div', {
            class: 'page-bg',
            style: {
                width: this.pageWidth+'px',
                height: this.pageHeight+'px',
                background: '#fff',
                boxShadow: 'rgb(204, 204, 204) 0px 0px 3px 1px',
                position: 'absolute',
                top: (this.pageHeight+this.pageSpacingHeight)*this.pageIndex + 'px',
                left: '0px',
            }
        }, anchors.concat(masks))

        return this.el
    }

}

export default PageBackground