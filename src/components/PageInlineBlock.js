import PageInlineBlockImage from './PageInlineBlockImage'
import PageInlineBlockText from './PageInineBlockText'

class PageInlineBlock{
    constructor(ib){
        this.ib = ib
    }

    render(){
        if(this.ib.type == 'text'){
            let img = new PageInlineBlockText(this.ib)
            this.el = img.render()
        }else if(this.ib.type == 'image'){
            let img = new PageInlineBlockImage(this.ib)
            this.el = img.render()
        }
        
        return this.el
    }
}

export default PageInlineBlock