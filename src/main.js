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
        pageHeight: 300 * Math.sqrt(2),
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
                                        type: 'run',
                                        text: '111',
                                        textStyle: {},
                                    },
                                    {
                                        type: 'run',
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
                                        type: 'run',
                                        text: '333',
                                        textStyle: {},
                                    },
                                    {
                                        type: 'run',
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
                        ],
                    }
                ]
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'run',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'run',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'run',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'run',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'run',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'run',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'run',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'run',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'run',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'run',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'run',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'run',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'run',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'run',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'run',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'run',
                    text: 'fff',
                    textStyle: {},
                }
            ],
        },
        {
            type: 'para',
            runs: [
                {
                    type: 'run',
                    text: 'eee',
                    textStyle: {},
                },
                {
                    type: 'run',
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
