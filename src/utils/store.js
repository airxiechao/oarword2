import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        paras: [
            [
                {
                    text: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1aaaaaaaaaaaaaaaaaaaaaaaaaaaa1aaaaaaaaaaaaaaaaaaaaaaaaa',
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
    },
    mutations: {
        test (state, payload) {
            state.paras[payload.paraIndex][payload.runIndex]['text'] = '*'
        },
    }
})

export default store