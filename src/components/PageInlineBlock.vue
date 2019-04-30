<script>
export default {
    name: 'PageInlineBlock',
    props: {
        text: String,
        textStyle: Object,
        paraIndex: Number,
        runIndex: Number,
        startPos: Number
    },
    render: function(createElement){
        return createElement('div', {
            class: 'page-inline-block',
            style: {
                display: 'inline-block'
            },
            on: {
                click: this.onClick
            },
        }, this.text)
    },
    methods: {
        onClick: function(){
            this.$store.commit('test', {
                paraIndex: this.paraIndex, 
                runIndex: this.runIndex, 
                startPos: this.startPos}
            )
        }
    }
}

</script>