<script>

export default {
    name: 'DocCursor',
    props: {

    },
    computed: {
        posX: function(){
            return this.$store.state.cursorTarget.posX
        },
        posY: function(){
            return this.$store.state.cursorTarget.posY
        },
        height: function(){
            return this.$store.state.cursorTarget.height
        },
    },
    mounted: function(){
        setInterval(function() {
            this.$el.style.opacity = this.$el.style.opacity ^ 1;
        }.bind(this), 500);
    },
    render: function(createElement){
        return createElement('div', {
            class: 'doc-cursor',
            style: {
                width: '0px',
                height: this.height + 'px',
                borderLeft: '1px solid #555',
                position: 'absolute',
                left: this.posX + 'px',
                top: this.posY + 'px',
                opacity: 1,
            }
        })
    },
    methods: {

    }
}

</script>