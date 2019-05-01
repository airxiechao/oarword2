<script>

import PageInlineBlock from './PageInlineBlock.vue'

export default {
    name: 'PageLine',
    components: {
        PageInlineBlock
    },
    props: {
        lineWidth: Number,
        runs: Array,
    },
    render: function(createElement){
        var inlineBlocks = []
        for(var i = 0; i<this.runs.length; ++i){
            var run = this.runs[i]
            var inlineBlock = createElement('PageInlineBlock', {
                props: {
                    text: run.text,
                    textStyle: run.textStyle,
                    paraIndex: run.paraIndex,
                    runIndex: run.runIndex,
                    startIndex: run.startIndex,
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