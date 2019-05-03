<script>
import { measureFontTextWH, measureElePageXY } from '../utils/measure.js'

export default {
    name: 'PageInlineBlock',
    props: {
        text: String,
        textStyle: Object,
        paraIndex: Number,
        lineSpacingIndex: Number,
        inlineBlockIndex: Number,
    },
    updated: function(){
        if(this.$store.state.cursorIndex.paraIndex == this.paraIndex &&
            this.$store.state.cursorIndex.lineIndex == this.lineSpacingIndex &&
            this.$store.state.cursorIndex.inlineBlockIndex == this.inlineBlockIndex
        ){
            this.$store.commit('setCursorIndex', {
                    paraIndex: this.paraIndex,
                    lineIndex: this.lineSpacingIndex,
                    inlineBlockIndex: this.inlineBlockIndex,
                    inlineStartIndex: this.$store.state.cursorIndex.inlineStartIndex,
                }
            )
        }
    },
    render: function(createElement){
        this.$store.state.document.body[this.paraIndex].linesAndSpacings[this.lineSpacingIndex].inlineBlocks[this.inlineBlockIndex].vue = this

        return createElement('div', {
            class: 'page-inline-block',
            style: {
                display: 'inline-block'
            },
            on: {
                click: this.clickHandler
            },
        }, this.text)
    },
    methods: {
        clickHandler: function(e){
            var docXY = measureElePageXY(document.getElementsByClassName('doc')[0])
            var docX = docXY.x
            var pointLeft = e.pageX - docX - this.$el.offsetLeft

            for(var i = 1; i <= this.text.length; ++i){
                var t = this.text.substr(0, i)
                var wh = measureFontTextWH(t, '', '', '')

                if(wh.w > pointLeft){
                    break
                }
            }

            this.$store.commit('setCursorIndex', {
                    paraIndex: this.paraIndex,
                    lineIndex: this.lineSpacingIndex,
                    inlineBlockIndex: this.inlineBlockIndex,
                    inlineStartIndex: i-1,
                }
            )
        }
    }
}

</script>