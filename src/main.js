import Vue from 'vue'
import App from './App.vue'

import state from './utils/state'
import { defaultTextStyle, defaultParaStyle } from './utils/convert'

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
            paraStyle:defaultParaStyle,
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
                        fontFamily: '宋体',
                        fontSize: 24,
                        color: '#fff',
                        backgroundColor: '#00f',
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        textDecoration: 'underline',
                        verticalAlign: 'unset',
                    },
                },
                {
                    type: 'image',
                    image: 'https://tse2-mm.cn.bing.net/th?id=OIP.BA5H2AVw2JS8syKy1LIOmwHaEK&w=300&h=168&c=7&o=5&dpr=1.25&pid=1.7',
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
            paraStyle: {
                textAlign: 'center',
            },
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
                    image: 'https://tse3-mm.cn.bing.net/th?id=OIP.kQG710SGTOHsEfVsVqlx8gHaEK&w=295&h=165&c=7&o=5&dpr=1.25&pid=1.7',
                    imageStyle: {
                        width: 100,
                        height: 50,
                    },
                },
                {
                    type: 'image',
                    image: 'https://tse1-mm.cn.bing.net/th?id=OIP.lWx94unPoPI_x1R09pYM6wHaJ8&w=128&h=170&c=7&o=5&dpr=1.25&pid=1.7',
                    imageStyle: {
                        width: 80,
                        height: 100,
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
            paraStyle:defaultParaStyle,
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
            grid: [200, 200, 100],
            cells: [
                [ // row 0
                    {
                        type: 'body',
                        rowspan: 2,
                        colspan: 2,
                        grid: {},
                        pts: [
                            {
                                type: 'para',
                                paraStyle:defaultParaStyle,
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
                            {
                                type: 'para',
                                paraStyle:defaultParaStyle,
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
                            {
                                type: 'para',
                                paraStyle:defaultParaStyle,
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
                            {
                                type: 'para',
                                paraStyle:defaultParaStyle,
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
                            {
                                type: 'para',
                                paraStyle:defaultParaStyle,
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
                                paraStyle:defaultParaStyle,
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
                    },
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
                                paraStyle:defaultParaStyle,
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
                ],
                [ // row 2
                    {
                        type: 'body',
                        rowspan: 1,
                        colspan: 1,
                        grid: {},
                        pts: [
                            {
                                type: 'para',
                                paraStyle:defaultParaStyle,
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
                                paraStyle:defaultParaStyle,
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
                            {
                                type: 'para',
                                paraStyle:defaultParaStyle,
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
                                paraStyle:defaultParaStyle,
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
                ]
            ],
        },
        {
            type: 'para',
            paraStyle:defaultParaStyle,
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'fff1',
                    textStyle: defaultTextStyle,
                }
            ],
        },
        {
            type: 'para',
            paraStyle: {
                textAlign: 'right',
            },
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'fff2',
                    textStyle: defaultTextStyle,
                }
            ],
        },
        {
            type: 'para',
            paraStyle:defaultParaStyle,
            runs: [
                {
                    type: 'text',
                    text: 'eee',
                    textStyle: defaultTextStyle,
                },
                {
                    type: 'text',
                    text: 'fff3',
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
