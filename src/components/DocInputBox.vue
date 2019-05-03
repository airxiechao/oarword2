<script>

export default {
    name : 'DocInputBox',
    computed: {
        cursorPos: function(){
            return this.$store.getters.cursorPos
        },
    },
    mounted: function(){
        let goog = window.goog

        goog.events.listen(this.$el, goog.events.EventType.INPUT, this.inputHandler);
        goog.events.listen(new goog.events.ImeHandler(this.$el),
            goog.object.getValues(goog.events.ImeHandler.EventType), this.imeHandler);
    },
    updated: function(){
        this.$el.focus()
    },
    render: function(createElement){
        var cursorPos = this.cursorPos
        var cursorPosX = cursorPos.cursorPosX
        var cursorPoxY = cursorPos.cursorPoxY
        var cursorHeight = cursorPos.cursorHeight

        return createElement('div', {
            class: 'inputbox',
            attrs: {
                contentEditable: true,
            },
            style: {
                position: 'absolute',
                left: cursorPosX + 'px',
                top: cursorPoxY + 'px',
                opacity: 0,
                pointerEvents: 'none',
                outline: 'none',
            }
        })
    },
    methods: {
        inputHandler: function(e){
            this.$store.commit('addOrUpdateParaRun', {
                text: this.$el.textContent,
                textStyle: {},
            })
            this.$el.textContent = ''
        },
        imeHandler: function(e){
            if(e.type == 'startIme' ) {
                this.$store.commit('setImeStatus', true)

            } else if(e.type == 'endIme' ) {
                this.$store.commit('setImeStatus', false)

            } else if(e.type == 'updateIme') {
            }
        },
    },
}
</script>
