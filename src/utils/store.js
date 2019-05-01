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
        ],
        cursorTarget: {
            paraIndex: 0,
            runIndex: 0,
            startIndex: 0,
            inlineStartIndex: 0,
            posX: 0,
            posY: 0,
            height: 0,
        },
    },
    mutations: {
        setCursorTarget(state, payplaod){
            state.cursorTarget.paraIndex = payplaod.paraIndex
            state.cursorTarget.runIndex = payplaod.runIndex
            state.cursorTarget.startIndex = payplaod.startIndex
            state.cursorTarget.inlineStartIndex = payplaod.inlineStartIndex
            state.cursorTarget.posX = payplaod.posX
            state.cursorTarget.posY = payplaod.posY
            state.cursorTarget.height = payplaod.height
        }
    }
})

export default store