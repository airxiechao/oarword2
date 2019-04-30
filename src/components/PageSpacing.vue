<script>

export default {
    name: 'PageSpacing',
    props: {
        posLeft: Number,
        spacingHeight: Number,
    },
    render: function(createElement){
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