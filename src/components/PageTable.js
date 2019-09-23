import { createElement } from '../utils/renderer'
import PageBody from './PageBody'
import state from '../utils/state'

class PageTable{
    constructor(posLeft, table){
        this.posLeft = posLeft
        this.table = table
    }

    render(){
        // create table rows
        let tableRows = []
        for(let i = 0; i < this.table.cells.length; ++i){
            let tableCols = []
            let row = this.table.cells[i]
            for(let j = 0; j < row.length; ++j){
                let col = row[j]

                let pageBody = new PageBody(0, col)
                col.obj = pageBody
                
                let tableCol = createElement('td', {
                    class: 'page-table-col',
                    attrs: {
                        rowspan: col.doc.rowspan,
                        colspan: col.doc.colspan,
                    },
                    style: {
                        position: 'relative',
                        width: col.doc.grid.pageWidth+'px',
                        height: col.doc.grid.height+'px',
                        border: '1px solid #333',
                    }
                }, [pageBody.render()])
                
                tableCols.push(tableCol)
            }

            let tableRow = createElement('tr', {
                class: 'page-table-row',
                style: {

                }
            }, tableCols)

            tableRows.push(tableRow)
        }

        // create table
        let table =  createElement('table', {
            class: 'page-table',
            attrs: {
                cellpadding: 0,
                cellspacing: 0,
            },
            style: {
                borderCollapse: 'collapse',
            }
        }, tableRows)


        // create table resizers
        this.tableResizers = this.renderResizers()

        this.el = createElement('div', {
            class: 'page-table-wrap',
            style: {
                position: 'relative',
                marginLeft: this.posLeft+'px',
            }
        }, [table, this.tableResizers])

        return this.el
    }

    mouseEnterHandler(e){
        let resizer = e.target
        resizer.style['opacity'] = 1
    }

    mouseLeaveHandler(e){
        let resizer = e.target
        resizer.style['opacity'] = 0
    }

    mouseDownHandler(e){
        let resizer = e.target
        let dragger = new goog.fx.Dragger(resizer)

        let oldX = parseInt(resizer.style['left'])
        let ci = parseInt(resizer.className.split('-').pop())
        let grid = this.table.parent.doc.grid
        let bodyWidth = grid.pageWidth - grid.marginLeft - grid.marginRight
        
        dragger.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {
            let x = Math.max(0, Math.min(bodyWidth, e.left))
            resizer.style['opacity'] = 1
            resizer.style['left'] = x + 'px'
            resizer.style['top'] = '0px'
        }.bind(this))
        
        dragger.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
            let x = Math.max(0, Math.min(bodyWidth, e.left))
            resizer.style['opacity'] = 0
            dragger.dispose();

            let diffX = x - oldX
            let cw = this.table.doc.grid[ci] + diffX
            if(cw < bodyWidth / 20){
                cw = bodyWidth / 20
            }

            let grid = this.table.doc.grid.slice()
            grid[ci] = cw
            let tableWidth = grid.reduce((acc, v)=>acc+v)
            if(tableWidth >= bodyWidth){
                resizer.style['left'] = oldX + 'px'
                resizer.style['top'] = '0px'
                return
            }
            
            state.mutations.updateTableGrid({
                table: this.table,
                columnIndex: ci,
                columnWidth: cw,
            })
        }.bind(this))

        dragger.startDrag(e);
    }

    renderResizers(){
        let resizers = []
        let cw = 0
        for(let i = 0; i < this.table.doc.grid.length; ++i){
            cw += this.table.doc.grid[i]
            let resizer = createElement('div', {
                class: 'page-table-resizer-'+i,
                style: {
                    position: 'absolute',
                    left: cw+'px',
                    width: '1px',
                    height: (this.table.tableHeight+1)+'px',
                    borderRight: '1px solid #0096fd',
                    backgroundColor: '#0096fd',
                    cursor: 'ew-resize',
                    opacity: 0,
                },
            })

            // make resizer draggable
            window.goog.events.listen(resizer, window.goog.events.EventType.MOUSEENTER, this.mouseEnterHandler.bind(this));
            window.goog.events.listen(resizer, window.goog.events.EventType.MOUSELEAVE, this.mouseLeaveHandler.bind(this));
            window.goog.events.listen(resizer, window.goog.events.EventType.MOUSEDOWN, this.mouseDownHandler.bind(this));

            resizers.push(resizer)
        }

        let tableResizers = createElement('div', {
            class: 'page-table-resizer-wrap',
            style: {
                position: 'absolute',
                left: 0,
                top: 0,
            },
        }, resizers)

        return tableResizers
    }

    updateResizers(){
        let oldReiszers = this.tableResizers
        this.tableResizers = this.renderResizers()
        window.goog.dom.replaceNode(this.tableResizers, oldReiszers)
    }
}

export default PageTable