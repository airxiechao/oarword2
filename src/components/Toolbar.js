import { createElement } from '../utils/renderer'

class Toolbar{
    constructor(){

    }

    render(){
        this.el = createElement('div', {
            class: 'toolbar',
            style: {
                height: '20px',
                background: 'red',
            }
        })
        
        return this.el
    }
}

export default Toolbar