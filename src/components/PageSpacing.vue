<script>

export default {
    name: 'PageSpacing',
    props: {
        posLeft: Number,
        spacingHeight: Number,
        paraIndex: {
            type: Number,
            default: -1,
        },
        lineSpacingIndex: {
            type: Number,
            default: -1,
        },
    },
    render: function(createElement){
        if(this.paraIndex >= 0 && this.lineSpacingIndex >= 0){
            this.$store.state.document.body[this.paraIndex].linesAndSpacings[this.lineSpacingIndex].vue = this
        }

        return createElement('div', {
            class: 'page-spacing',
            style: {
                height: this.spacingHeight+'px',
                marginLeft: this.posLeft+'px',
            }
        })
    }
}

</script>