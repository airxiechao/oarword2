<script>
//import Document from './components/Document.vue'
import store from './utils/store'
import state from './utils/state'

import Document from './components/Document'

export default {
    name: 'app',
    components: {
        Document
    },
    store,
    computed: {
        documentBody: function(){
            return this.$store.state.document.body
        }
    },
    mounted: function(){
        var doc = new Document(500, 300, 10, 100, 100, 100, 100, state.document.body);
        window.goog.dom.appendChild(this.$el, doc.render())
    },
    render: function(createElement){
        /*
        var doc = createElement('Document', {
            props: {
                documentBody: this.documentBody
            }
        })*/

        var app = createElement('div', {
            class: 'app',
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
    background: #ebebeb;
}

.app {
    margin: 10px;
    position: relative;
}
</style>
