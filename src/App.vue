<script>
import Document from './components/Document'
import Toolbar from './components/Toolbar'

import state from './utils/state'

export default {
    name: 'app',
    mounted: function(){
        // add toolbar
        let toolbar = new Toolbar()
        window.goog.dom.appendChild(this.$el, toolbar.render())
        toolbar.mounted()

        // add doc
        let doc = new Document(state.document.body);   
        window.goog.dom.appendChild(this.$el, doc.render())
        doc.resizeHandler()
        state.mutations.pushToHistory()

        // set cursor
        state.mutations.resetCursorInlineBlock()
    },
    render: function(createElement){
        let app = createElement('div', {
            class: 'app',
            style: {
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }
        })

        return app
    }
}
</script>

<style>
html, body{
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}

</style>
