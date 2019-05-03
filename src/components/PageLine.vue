<script>

import PageInlineBlock from './PageInlineBlock.vue'

export default {
    name: 'PageLine',
    components: {
        PageInlineBlock
    },
    props: {
        lineWidth: Number,
        inlineBlocks: Array,
        paraIndex: Number,
        lineSpacingIndex: Number,
    },
    render: function(createElement){
        this.$store.state.document.body[this.paraIndex].linesAndSpacings[this.lineSpacingIndex].vue = this

        var inlineBlocks = []
        for(var i = 0; i<this.inlineBlocks.length; ++i){
            var ib = this.inlineBlocks[i]
            var inlineBlock = createElement('PageInlineBlock', {
                props: {
                    text: ib.text,
                    textStyle: ib.textStyle,
                    paraIndex: this.paraIndex,
                    lineSpacingIndex: this.lineSpacingIndex,
                    inlineBlockIndex: i,
                }
            })
            inlineBlocks.push(inlineBlock)
        }

        return createElement('div', {
            class: 'page-line',
            style: {
                width: this.lineWidth+'px',
            }
        }, inlineBlocks)
    }
}

</script>

<style scoped>

</style>