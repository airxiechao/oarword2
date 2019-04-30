<script>
import PageParagraph from './PageParagraph.vue'
import PageSpacing from './PageSpacing.vue'
import PageBackground from './PageBackground.vue'

import { measureFontTextWH } from '../utils/measure'

export default {
    name: 'Document',
    components: {
        PageParagraph,
        PageSpacing,
        PageBackground,
    },
    props: {
        pageWidth: {
            type: Number,
            default: 500
        },
        pageHeight: {
            type: Number,
            default: 300
        },
        pageSpacingHeight: {
            type: Number,
            default: 10
        },
        marginTop: {
            type: Number,
            default: 100
        },
        marginRight: {
            type: Number,
            default: 100
        },
        marginBottom: {
            type: Number,
            default: 100
        },
        marginLeft: {
            type: Number,
            default: 100
        },
        paras: Array,
    },
    render: function (createElement) {

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
        for(let i = 0; i < this.paras.length; ++i){
            var para = this.paras[i];

            // conver paragraph to lines and spacings
            var paragraphWidth = this.pageWidth-this.marginLeft-this.marginRight
            var lh = this.paraRunsToLinesAndSpacings(para, paragraphWidth, lastPosBottom, i)
            var paraLinesAndSpacings = lh.paraLinesAndSpacings
            var paraHeight = lh.paraHeight

            var pagePara = createElement('PageParagraph', {
                props: {
                    posLeft: this.marginLeft,
                    posTop: lastPosBottom,
                    paragraphWidth: paragraphWidth,
                    linesAndSpacings: paraLinesAndSpacings,
                    paraIndex: i,
                }
            })
            pageParas.push(pagePara)
            lastPosBottom += paraHeight;
        }

        var pageNo = this.getPageNo(lastPosBottom)
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

        return createElement('div', [pageBgsWrap, pageParasWrap])
    },
    methods: {
        paraRunsToLinesAndSpacings: function(runs, paragraphWidth, posTop, paraIndex){
            var paraLinesAndSpacings = []
            var paraHeight = 0

            var runsQueue = []
            for(var i = 0; i < runs.length; ++i){
                var run = runs[i]
                run.paraIndex = paraIndex
                run.runIndex = i
                run.startPos = 0
                runsQueue.push(run)
            }

            while(runsQueue.length > 0){
                var rh = this.getLineRunsAndHeight(runsQueue, paragraphWidth)
                var lineRuns = rh.lineRuns
                var lineHeight = rh.lineHeight

                // check if page has enough space for line
                var leftHeight = this.getPageLeftHeight(posTop)
                if(leftHeight < lineHeight){
                    // add page spacing
                    var spacingHeight = leftHeight + this.marginBottom + this.pageSpacingHeight + this.marginTop
                    var pageSpacing = {
                        spacingHeight: spacingHeight
                    }
                    paraLinesAndSpacings.push(pageSpacing)
                    posTop += spacingHeight
                    paraHeight += spacingHeight
                }
                
                paraLinesAndSpacings.push(lineRuns)
                posTop += lineHeight
                paraHeight += lineHeight
            }

            return {
                paraLinesAndSpacings: paraLinesAndSpacings,
                paraHeight: paraHeight,
            }
        },
        getLineRunsAndHeight: function(runsQueue, lineWidth){
            var totalWidth = 0;
            var maxHeight = 0;
            var lineRuns = []
            while(totalWidth < lineWidth && runsQueue.length > 0){
                var run = runsQueue.shift()

                for(var i = 1; i<=run.text.length; ++i){
                    var text = run.text.substr(0,i)
                    var wh = measureFontTextWH(text, '', '', '')
                    
                    if(totalWidth + wh.w > lineWidth){
                        i -= 1
                        break
                    }

                    maxHeight = Math.max(maxHeight, wh.h)
                }
                
                if(i < run.text.length){
                    runsQueue.unshift({
                        text: run.text.substr(i),
                        textStyle: run.textStyle,
                        paraIndex: run.paraIndex,
                        runIndex: run.runIndex,
                        startPos: i
                    })

                    run = {
                        text: run.text.substr(0, i),
                        textStyle: run.textStyle,
                        paraIndex: run.paraIndex,
                        runIndex: run.runIndex,
                        startPos: 0
                    }
                }

                lineRuns.push(run)
                totalWidth += wh.w;
            }

            return {
                lineRuns: lineRuns,
                lineHeight: maxHeight
            }
        },
        getPageNo: function(posY){
            var pageNo = parseInt(posY/(this.pageHeight+this.pageSpacingHeight)) + 1
            return pageNo
        },
        getPageLeftHeight: function(posTop){
            var pageNo = this.getPageNo(posTop)
            var leftHeight = pageNo*(this.pageHeight+this.pageSpacingHeight) - posTop - this.marginBottom - this.pageSpacingHeight
            return leftHeight
        }
    }
}
</script>

<style scoped>

</style>