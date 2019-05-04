import { createElement } from '../utils/renderer'
import state from '../utils/state'

class PageSpacing{
    constructor(posLeft, spacingHeight, paraIndex, lineSpacingIndex){
        this.posLeft = posLeft
        this.spacingHeight = spacingHeight
        this.paraIndex = paraIndex
        this.lineSpacingIndex = lineSpacingIndex

        if(this.paraIndex != null){
            state.mutations.setLineSpacingObj(this.paraIndex, this. lineSpacingIndex, this)
        }
    }

    render(){
        this.el = createElement('div', {
            class: 'page-spacing',
            style: {
                height: this.spacingHeight+'px',
                marginLeft: this.posLeft+'px',
            }
        })

        return this.el
    }
}

export default PageSpacing