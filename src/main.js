import Vue from 'vue'
import App from './App.vue'

import state from './utils/state'

Vue.config.productionTip = false

var paras = [
    [
        {
            text: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1aaaaaaaaaaaaaaaaaaaaaaaaaaaa1aaadddddddddddaaaaaaaaaaaaaaaaaaaaaa',
            textStyle: {
                
            }
        },
        {
            text: 'bbbbbbbbbbbb',
            textStyle: {

            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'ccccccccasdfasdfasdfasdfasdfasdfasdfsdfasdfasfdcccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'cccccccccccc',
            textStyle: {
                
            }
        }
    ],
    [
        {
            text: 'ccccccccccccaa',
            textStyle: {
                
            }
        }
    ]
]

var paras2 = [
    [
        {
            text: 'abc',
            textStyle: {
                
            }
        },
        {
            text: 'def',
            textStyle: {
                
            }
        },
    ],
    [
        {
            text: 'ghi',
            textStyle: {
                
            }
        },
        {
            text: 'jkl',
            textStyle: {
                
            }
        },
    ],
]

var doc = {
    type: 'body',
    grid: {
        pageWidth: 800,
        pageHeight: 800 * Math.sqrt(2),
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
                    type: 'run',
                    text: 'aaa',
                    textStyle: {},
                },
                {
                    type: 'run',
                    text: 'bbb',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'run',
                    text: 'ccc',
                    textStyle: {},
                },
                {
                    type: 'run',
                    text: 'ddd',
                    textStyle: {},
                }
            ],
        },
        /*
        {
            type: 'table',
            grid: [],
            cells: [
                [
                    {
                        type: 'body',
                        rowspan: 1,
                        colspan: 1,
                        pts: [],
                    }
                ],
                [
                    {
                        type: 'body',
                        rowspan: 1,
                        colspan: 1,
                        pts: [],
                    }
                ]
            ],
        }*/
    ],
}

state.mutations.setDocument(doc)

new Vue({
    render: h => h(App),
}).$mount('#app')
