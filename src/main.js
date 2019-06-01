import Vue from 'vue'
import App from './App.vue'

import state from './utils/state'

Vue.config.productionTip = false

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
                    textStyle: {},
                },
                {
                    type: 'text',
                    text: 'bbb',
                    textStyle: {},
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
                    textStyle: {},
                },
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'aaa',
                    textStyle: {},
                },
                {
                    type: 'text',
                    text: 'bbb',
                    textStyle: {},
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
                    textStyle: {},
                },
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'ccc',
                    textStyle: {},
                },
                {
                    type: 'text',
                    text: 'ddd',
                    textStyle: {},
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
                                        textStyle: {},
                                    },
                                    {
                                        type: 'text',
                                        text: '222',
                                        textStyle: {},
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
                                        textStyle: {},
                                    },
                                    {
                                        type: 'text',
                                        text: 'bbb',
                                        textStyle: {},
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
                                        textStyle: {},
                                    },
                                    {
                                        type: 'text',
                                        text: '444',
                                        textStyle: {},
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
                                        textStyle: {},
                                    },
                                    {
                                        type: 'text',
                                        text: 'ddd',
                                        textStyle: {},
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
                    textStyle: {},
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'text',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
    ],
}

state.mutations.setDocument(doc)

new Vue({
    render: h => h(App),
}).$mount('#app')
