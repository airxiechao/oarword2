import { createElement } from '../utils/renderer'
import state from '../utils/state'

class PageSpacing{
    constructor(posLeft, ls){
        this.posLeft = posLeft
        this.ls = ls
    }

    render(){
        this.el = createElement('div', {
            class: 'page-spacing',
            style: {
                height: this.ls.spacingHeight+'px',
                marginLeft: this.posLeft+'px',
            }
        })

        return this.el
    }
}

export default PageSpacing