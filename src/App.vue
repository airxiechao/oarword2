<script>
import Document from './components/Document.vue'
import store from './utils/store.js'

export default {
    name: 'app',
    components: {
        Document
    },
    store,
    computed: {
        paras: function(){
            return this.$store.state.paras
        }
    },
    render: function(createElement){
        var doc = createElement('Document', {
            props: {
                paras: this.paras
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
