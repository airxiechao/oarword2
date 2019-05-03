<script>
import Document from './components/Document.vue'
import store from './utils/store'

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
    render: function(createElement){
        var doc = createElement('Document', {
            props: {
                documentBody: this.documentBody
            }
        })

        var app = createElement('div', {
            class: 'app',
        }, [doc])

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
