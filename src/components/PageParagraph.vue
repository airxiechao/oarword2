<script>
import PageLine from './PageLine.vue'
import PageSpacing from './PageSpacing.vue'

export default {
    name: 'PageParagraph',
    components: {
        PageLine,
        PageSpacing,
    },
    props: {
        posLeft: Number,
        posTop: Number,
        paraWidth: Number,
        linesAndSpacings: Array,
        paraIndex: Number,
    },
    render: function(createElement) {
        this.$store.state.document.body[this.paraIndex].vue = this

        var pageLinesAndSpacings = []
        for(var i = 0; i < this.linesAndSpacings.length; ++i){
            var ls = this.linesAndSpacings[i]

            if(ls.type == 'spacing'){
                // create a page spacing
                var pageSpacing = createElement('PageSpacing', {
                    props: {
                        posLeft: 0,
                        spacingHeight: ls.spacingHeight,
                        paraIndex: this.paraIndex,
                        lineSpacingIndex: i,
                    }
                })
                pageLinesAndSpacings.push(pageSpacing)
            }else if(ls.type == 'line'){
                // create a line
                var pageLine = createElement('PageLine', {
                    props: {
                        lineWidth: this.paraWidth,
                        inlineBlocks: ls.inlineBlocks,
                        paraIndex: this.paraIndex,
                        lineSpacingIndex: i,
                    }
                })
                pageLinesAndSpacings.push(pageLine)
            }
        }
        
        // create paragraph
        return createElement('div', {
            class: 'page-para',
            style: {
                marginLeft: this.posLeft+'px'
            }
        }, [pageLinesAndSpacings])
    },
    methods: {
        
    },
}
</script>

<style scoped>

</style>
