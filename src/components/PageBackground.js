import { createElement } from '../utils/renderer'

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
    }

    render(){
        var anchors = []
        anchors.push(createElement('div', {
            style: {
                width: '30px',
                height: '30px',
                borderRight: '1px solid rgb(204, 204, 204)',
                borderBottom: '1px solid rgb(204, 204, 204)',
                position: 'absolute',
                top: (this.marginTop-30)+'px',
                left: (this.marginLeft-30)+'px',
            }
        }))
        anchors.push(createElement('div', {
            style: {
                width: '30px',
                height: '30px',
                borderLeft: '1px solid rgb(204, 204, 204)',
                borderBottom: '1px solid rgb(204, 204, 204)',
                position: 'absolute',
                top: (this.marginTop-30)+'px',
                left: (this.pageWidth-this.marginRight)+'px',
            }
        }))
        anchors.push(createElement('div', {
            style: {
                width: '30px',
                height: '30px',
                borderRight: '1px solid rgb(204, 204, 204)',
                borderTop: '1px solid rgb(204, 204, 204)',
                position: 'absolute',
                top: (this.pageHeight-this.marginBottom)+'px',
                left: (this.marginLeft-30)+'px',
            }
        }))
        anchors.push(createElement('div', {
            style: {
                width: '30px',
                height: '30px',
                borderLeft: '1px solid rgb(204, 204, 204)',
                borderTop: '1px solid rgb(204, 204, 204)',
                position: 'absolute',
                top: (this.pageHeight-this.marginBottom)+'px',
                left: (this.pageWidth-this.marginRight)+'px',
            }
        }))

        this.el = createElement('div', {
            class: 'page-bg',
            style: {
                width: this.pageWidth+'px',
                height: this.pageHeight+'px',
                background: '#fff',
                boxShadow: '0px 0px 3px 1px #ccc',
                position: 'absolute',
                top: (this.pageHeight+this.pageSpacingHeight)*this.pageIndex + 'px',
                left: '0px',
            }
        }, anchors)

        return this.el
    }

}

export default PageBackground