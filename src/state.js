
var state = {
    document: {
        cursor: {
            inlineBlock: null,
            inlineStartIndex: -1,
            front: false,
        },
        imageResizer: {},
        rangeSelect: {
            dragged: false,
            overlays: [],
            dragger: null,
            start: {
                line: null,
                inlineBlock: null,
                startIndex: null,
            },
            end: {
                line: null,
                inlineBlock: null,
                startIndex: null,
            },
        },
        copy: [],
        history: {
            stack: [],
            top: -1,
        },
        inputBox: {},
        body: null,
    },
    toolbar:{
        textStyle: {
            fontFamily: 'unset',
            fontSize: 'unset',
            color: 'unset',
            backgroundColor: 'unset',
            fontWeight: 'unset',
            fontStyle: 'unset',
            textDecoration: 'unset',
            verticalAlign: 'unset',
        },
        paraStyle: {
            textAlign: 'left',
        },
    },
}

window.state = state

export default state