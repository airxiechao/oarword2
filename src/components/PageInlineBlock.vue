<script>
import { measureFontTextWH, measureElePageXY } from '../utils/measure.js'

export default {
    name: 'PageInlineBlock',
    props: {
        text: String,
        textStyle: Object,
        paraIndex: Number,
        runIndex: Number,
        startIndex: Number
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
        onClick: function(e){
            var InlineBlockLeft = this.$el.offsetLeft
            var InlineBlocktTop = this.$el.offsetTop

            var docXY = measureElePageXY(document.getElementsByClassName('doc')[0])
            var docX = docXY.x
            var docY = docXY.y

            var pointLeft = e.pageX - docX
            //var pointTop = e.pageY - docY
            
            var wh = {w:0, h:0}
            var lastWH = wh
            for(var i = 1; i <= this.text.length; ++i){
                var t = this.text.substr(0,i)
                wh = measureFontTextWH(t, '', '', '')
                if(InlineBlockLeft + wh.w > pointLeft){
                    break
                }

                lastWH = wh
            }
            var cursorInlineStartIndex = i
            var cursorStartIndex = this.startIndex + cursorInlineStartIndex

            var cursorPosX = InlineBlockLeft + lastWH.w
            var cursorPoxY = InlineBlocktTop
            var cursorHeight = wh.h

            this.$store.commit('setCursorTarget', {
                    paraIndex: this.paraIndex, 
                    runIndex: this.runIndex, 
                    startIndex: cursorStartIndex,
                    inlineStartIndex: cursorInlineStartIndex,
                    posX: cursorPosX,
                    posY: cursorPoxY,
                    height: cursorHeight,
                }
            )
        }
    }
}

</script>