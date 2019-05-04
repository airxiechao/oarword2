<script>
import PageParagraph from './PageParagraph.vue'
import PageSpacing from './PageSpacing.vue'
import PageBackground from './PageBackground.vue'
import DocCursor from './DocCursor.vue'
import DocInputBox from './DocInputBox.vue'

import { getPageNo } from '../utils/measure'

export default {
    name: 'Document',
    components: {
        DocCursor,
        DocInputBox,
        PageBackground,
        PageParagraph,
        PageSpacing,
    },
    computed: {
        pageWidth: function(){
            return this.$store.state.document.pageWidth
        },
        pageHeight: function(){
            return this.$store.state.document.pageHeight
        },
        pageSpacingHeight: function(){
            return this.$store.state.document.pageSpacingHeight
        },
        marginTop: function(){
            return this.$store.state.document.marginTop
        },
        marginRight: function(){
            return this.$store.state.document.marginRight
        },
        marginBottom: function(){
            return this.$store.state.document.marginBottom
        },
        marginLeft: function(){
            return this.$store.state.document.marginLeft
        },
        documentBody: function(){
            return this.$store.state.document.body
        },
    },
    render: function (createElement) {
        this.$store.state.document.vue = this

        // render first page spacing
        var firstPageSpacing = createElement('PageSpacing', {
            props: {
                posLeft: this.marginLeft,
                spacingHeight: this.marginTop,
            }
        })

        // render paragraphs
        var lastPosBottom = this.marginTop;
        
        var pageParas = [firstPageSpacing]
        for(let i = 0; i < this.documentBody.length; ++i){
            var para = this.documentBody[i]
            var pagePara = createElement('PageParagraph', {
                props: {
                    posLeft: this.marginLeft,
                    posTop: lastPosBottom,
                    paraWidth: this.pageWidth - this.marginLeft - this.marginRight,
                    linesAndSpacings: para.linesAndSpacings,
                    paraIndex: i,
                }  
            })
            pageParas.push(pagePara)
            lastPosBottom += para.paraHeight;
        }

        var pageNo = getPageNo(lastPosBottom, this.pageHeight, this.pageSpacingHeight)
        var pageParasWrap = createElement('div', {
            class: 'page-paras-wrap',
            style: {
                position: 'absolute',
                top: '0px',
                left: '0px',
                height: (this.pageHeight+this.pageSpacingHeight)*pageNo+'px'
            }
        }, pageParas)

        // render page backgrounds
        var pageBgs = []
        for(let i = 0; i < pageNo; ++i){
            var pageBg = createElement('PageBackground', {
                props: {
                    pageWidth: this.pageWidth,
                    pageHeight: this.pageHeight,
                    marginTop: this.marginTop,
                    marginRight: this.marginRight,
                    marginBottom: this.marginBottom,
                    marginLeft: this.marginLeft,
                    pageSpacingHeight: this.pageSpacingHeight,
                    pageIndex: i
                }
            })
            pageBgs.push(pageBg)
        }
        
        var pageBgsWrap = createElement('div', {
            class: 'page-bgs-wrap',
            style: {
                position: 'absolute',
                top: '0px',
                left: '0px',
                height: (this.pageHeight+this.pageSpacingHeight)*2+'px'
            }
        }, pageBgs)

        // render cursor
        var docCursor = createElement('DocCursor')

        // render inputbox
        var docInputBox = createElement('DocInputBox')

        return createElement('div', {
            class: 'doc',
        }, [ pageBgsWrap, pageParasWrap, docInputBox, docCursor ])
    },
    methods: {
        
    }
}
</script>

<style scoped>

</style>