<script>
export default {
    name: 'DocCursor',
    props: {

    },
    computed: {
        imeStatus: function(){
            return this.$store.state.imeStatus
        },
        cursorPos: function(){
            return this.$store.getters.cursorPos
        },
    },
    mounted: function(){
        setInterval(function() {
            this.$el.style.opacity = this.$el.style.opacity ^ 1
        }.bind(this), 500);
    },
    render: function(createElement){
        var cursorPos = this.cursorPos
        var cursorPosX = cursorPos.cursorPosX
        var cursorPoxY = cursorPos.cursorPoxY
        var cursorHeight = cursorPos.cursorHeight

        return createElement('div', {
            class: 'doc-cursor',
            style: {
                width: '0px',
                height: cursorHeight + 'px',
                borderLeft: '1.5px solid #555',
                position: 'absolute',
                left: cursorPosX + 'px',
                top: cursorPoxY + 'px',
                opacity: 1,
                visibility: this.imeStatus ? 'hidden' : 'visible',
            }
        })
    },
    methods: {
    }
}

</script>