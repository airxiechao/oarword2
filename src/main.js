import Vue from 'vue'
import App from './App.vue'

import state from './utils/state'

Vue.config.productionTip = false

var defaultTextStyle = {
    fontFamily: '宋体',
    fontSize: 14,
    color: '#000',
    backgroundColor: 'unset',
    fontWeight: 'unset',
    fontStyle: 'unset',
    textDecoration: 'unset',
    verticalAlign: 'unset',
}

var doc = {
    type: 'body',
    grid: {
        pageWidth: 800,
        pageHeight: 400 * Math.sqrt(2),
        pageSpacingHeight: 5,
        marginTop: 100,
        marginRight: 100,
        marginBottom: 100,
        marginLeft: 100,
    },
    pts: [
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'aaa',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'bbb',
                    textStyle: {
                        fontFamily: 'arial',
                        fontSize: 26,
                        color: '#f00',
                        backgroundColor: '#00f',
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        textDecoration: 'underline',
                        verticalAlign: 'unset',
                    },
                },
                {
                    type: 'image',
                    image: 'http://www.xinhuanet.com/photo/2019-05/31/1124569534_15593006741411n.jpg',
                    imageStyle: {
                        width: 100,
                        height: 50,
                    },
                },
                {
                    type: 'text',
                    text: 'ccc',
                    textStyle: defaultTextStyle,
                },
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'aaa',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'bbb',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'image',
                    image: 'http://www.xinhuanet.com/photo/2019-05/31/1124569534_15593006741411n.jpg',
                    imageStyle: {
                        width: 100,
                        height: 50,
                    },
                },
                {
                    type: 'text',
                    text: 'ccc',
                    textStyle: defaultTextStyle,
                },
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'ccc',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'ddd',
                    textStyle: defaultTextStyle,
                }
            ],
        },
        {
            type: 'table',
            grid: [200, 200],
            cells: [
                [ // row 0
                    {
                        type: 'body',
                        rowspan: 1,
                        colspan: 1,
                        grid: {},
                        pts: [
                            {
                                type: 'para',
                                runs: [
                                    {
                                        type: 'text',
                                        text: '111',
                                        textStyle: defaultTextStyle,
                                    },
                                    {
                                        type: 'text',
                                        text: '222',
                                        textStyle: defaultTextStyle,
                                    }
                                ],
                            },
                        ],
                    },
                    {
                        type: 'body',
                        rowspan: 1,
                        colspan: 1,
                        grid: {},
                        pts: [
                            {
                                type: 'para',
                                runs: [
                                    {
                                        type: 'text',
                                        text: 'aaa',
                                        textStyle: defaultTextStyle,
                                    },
                                    {
                                        type: 'text',
                                        text: 'bbb',
                                        textStyle: defaultTextStyle,
                                    }
                                ],
                            },
                        ],
                    }
                ],
                [ // row 1
                    {
                        type: 'body',
                        rowspan: 1,
                        colspan: 1,
                        grid: {},
                        pts: [
                            {
                                type: 'para',
                                runs: [
                                    {
                                        type: 'text',
                                        text: '333',
                                        textStyle: defaultTextStyle,
                                    },
                                    {
                                        type: 'text',
                                        text: '444',
                                        textStyle: defaultTextStyle,
                                    }
                                ],
                            },
                        ],
                    },
                    {
                        type: 'body',
                        rowspan: 1,
                        colspan: 1,
                        grid: {},
                        pts: [
                            {
                                type: 'para',
                                runs: [
                                    {
                                        type: 'text',
                                        text: 'ccc',
                                        textStyle: defaultTextStyle,
                                    },
                                    {
                                        type: 'text',
                                        text: 'ddd',
                                        textStyle: defaultTextStyle,
                                    }
                                ],
                            },
                        ],
                    }
                ]
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: defaultTextStyle,
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: defaultTextStyle,
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: defaultTextStyle,
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: defaultTextStyle,
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: defaultTextStyle,
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: defaultTextStyle,
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: defaultTextStyle,
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: defaultTextStyle,
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: defaultTextStyle,
                }
            ],
        },
    ],
}

state.mutations.setDocument(doc)

new Vue({
    render: h => h(App),
}).$mount('#app')
