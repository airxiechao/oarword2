<script>
import Document from './components/Document'
import Toolbar from './components/Toolbar'

import state from './state'
import { defaultDoc } from './convert'

import * as historyProcess from './process/historyProcess'
import * as cursorProcess from './process/cursorProcess'
import * as documentProcess from './process/documentProcess'

export default {
    props: {
        doc: {
            type: Object,
            default: () => defaultDoc,
        },
    },
    created(){
        documentProcess.setDocument(this.doc)
    },
    mounted(){
        // add toolbar
        let toolbar = new Toolbar()
        window.goog.dom.appendChild(this.$el, toolbar.render())
        toolbar.mounted()

        // add doc
        let doc = new Document(state.document.body);   
        window.goog.dom.appendChild(this.$el, doc.render())
        doc.resizeHandler()
        historyProcess.pushToHistory()

        // set cursor
        cursorProcess.resetCursorInlineBlock()
    },
    render(createElement){
        let editor = createElement('div', {
            class: 'editor',
            style: {
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }
        })

        return editor
    }
}
</script>
