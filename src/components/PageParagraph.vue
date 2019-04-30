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
        paragraphWidth: Number,
        linesAndSpacings: Array,
        paraIndex: Number,
    },
    render: function(createElement) {
        var pageLinesAndSpacings = []
        for(var i = 0; i < this.linesAndSpacings.length; ++i){
            var ls = this.linesAndSpacings[i]

            if(ls.spacingHeight){
                // create a page spacing
                var pageSpacing = createElement('PageSpacing', {
                    props: {
                        posLeft: 0,
                        spacingHeight: ls.spacingHeight,
                    }
                })
                pageLinesAndSpacings.push(pageSpacing)
            }else{
                // create a line
                var pageLine = createElement('PageLine', {
                    props: {
                        lineWidth: this.paragraphWidth,
                        runs: ls,
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
        }, pageLinesAndSpacings)
    },
    methods: {
        
    }
}
</script>

<style scoped>

</style>
