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

state.mutations.setDocument(paras)

new Vue({
    render: h => h(App),
}).$mount('#app')
