import { createElement } from '../utils/renderer'

class InsertImageDialog{
    constructor(){
        
    }

    render(){
        this.dialog = new goog.ui.Dialog();
        this.dialog.setBackgroundElementOpacity(0.2);
        let dialogContent = this.dialog.getContentElement();
        dialogContent.style.width = '500px';

        this.el = dialogContent
        
        return this.el
    }

    setVisible(visible){
        this.dialog.setVisible(visible)
    }
}

export default InsertImageDialog