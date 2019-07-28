import { createElement } from '../utils/renderer'
import interact from 'interactjs'

class InsertImageDialog{
    constructor(){
        this.render()
        this.imageType = 'url'
    }

    render(){
        // dialog header
        let dialogClose = createElement('span', {
            class: 'dialog-close',
            style: {
                background: 'url(../../img/close-x.png) no-repeat 0px 2px',
                cursor: 'pointer',
                height: '15px',
                position: 'absolute',
                right: '10px',
                top: '8px',
                width: '15px',
            }
        })
        goog.events.listen(dialogClose,
            goog.events.EventType.CLICK,
            function(e) {
                this.close()
            }.bind(this)
        );
        
        // dialog message bar
        let msg = this.msg = goog.dom.createTextNode('')
        let dialogMessageBar = this.dialogMessageBar = createElement('div', {
            class: 'dialog-messagebar',
            style: {
                display: 'none',
                color: '#000',
                backgroundColor: '#fff1f0',
                borderBottom: '1px solid #ffa39e',
                fontSize: '12px',
                padding: '4px 8px',
            }
        }, [msg])

        // dialog body
        let t = goog.dom.createTextNode('插入图片');
        let dialogTitle = createElement('div', {
            class: 'dialog-title',
            style: {
                color: '#444',
                fontSize: '13px',
                fontFamily: '黑体',
                fontWeight: 'bold',
                padding: '8px 31px 8px 8px',
                borderBottom: '1px solid #ccc',

            }
        }, [t, dialogClose])

        let uploadType = createElement('input', {
            attrs: {
                type: 'radio',
                name: 'image-type',
                id: 'image-type-upload',
            }
        })
        goog.events.listen(uploadType,
            goog.events.EventType.CLICK,
            function(e) {
                this.imageTypeChanged(e)
            }.bind(this)
        );

        let urlType = createElement('input', {
            attrs: {
                type: 'radio',
                name: 'image-type',
                id: 'image-type-url',
                checked: 'true',
            },
        })
        goog.events.listen(urlType,
            goog.events.EventType.CLICK,
            function(e) {
                this.imageTypeChanged(e)
            }.bind(this)
        );

        let imageType = createElement('div', {}, [uploadType, goog.dom.createTextNode('从电脑上传'), urlType, goog.dom.createTextNode('输入图片网址')])

        let file = this.file = createElement('input', {
            style: {
                fontSize: 'inherit',
            },
            attrs: {
                type: 'file'
            }
        })
        let imageUpload = this.imageUpload = createElement('div', {
            style: {
                padding: '8px',
                display: 'none',
            }
        }, [
            createElement('form', {
                attrs: {
                    action: '',
                    method: 'POST',
                    enctype: 'multipart/form-data'
                }
            }, [
                file
            ])
        ])

        let url = this.url = createElement('input', {
            style: {
                fontSize: 'inherit',
                outline: 'none',
                border: '1px solid #aaa',
                width: '400px',
            }
        })
        let imageUrl = this.imageUrl = createElement('div', {
            style: {
                padding: '8px',
                fontSize: 'inherit',
            }
        }, [
            goog.dom.createTextNode('图片网址：'),
            url,
        ])

        let dialogBody = createElement('div', {
            class: 'dialog-body',
            style: {
                padding: '8px',
                fontSize: '12px',
                height: '55px',
            }
        }, [imageType, imageUpload, imageUrl])

        // dialog toolbar
        let btnOk = createElement('button', {
            style: {
                fontWeight: 'bold',
                fontSize: '12px',
            }
        }, [goog.dom.createTextNode('确定')])
        goog.events.listen(btnOk,
            goog.events.EventType.CLICK,
            function(e) {
                this.ok()
            }.bind(this)
        );

        let btnCancle = createElement('button', {
            style: {
                fontSize: '12px',
            }
        }, [goog.dom.createTextNode('取消')])
        goog.events.listen(btnCancle,
            goog.events.EventType.CLICK,
            function(e) {
                this.close()
            }.bind(this)
        );

        let dialogToolbar = createElement('div', {
            class: 'dialog-toolbar',
            style: {
                padding: '0 8px 8px 8px',
                textAlign: 'right',
            }
        }, [btnOk, btnCancle])

        // assemble dialog 
        let dialog = createElement('div', {
            class: 'insert-image-dialog',
            style: {
                width: '500px',
                border: '1px solid #ccc',
                boxShadow: '0px 0px 3px 1px #ddd',
                backgroundColor: '#fff',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            },
        }, [dialogTitle, dialogMessageBar, dialogBody, dialogToolbar])
        let dialogX0, dialogY0
        interact(dialog).draggable({
            onstart(event){
                dialogX0 = dialog.offsetLeft
                dialogY0 = dialog.offsetTop
            },
            onmove(event) {
                dialog.style.left = (dialogX0 + (event.pageX - event.x0)) + 'px'
                dialog.style.top = (dialogY0 + (event.pageY - event.y0)) + 'px'
              }
        })

        let dialogWrap = createElement('div', {
            class: 'insert-image-dialog-background',
            style: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                background: 'rgba(204, 204, 204, 0.2)',
                zIndex: 9,
                overflow: 'hidden',
            },
        }, [dialog])

        goog.dom.appendChild(window.document.body, dialogWrap)

        this.el = dialogWrap

        return this.el
    }

    imageTypeChanged(e){
        switch(e.target.id){
            case 'image-type-upload':
                this.imageUpload.style.display = 'block'
                this.imageUrl.style.display = 'none'
                this.imageType = 'upload'
                break;
            case 'image-type-url':
                this.imageUpload.style.display = 'none'
                this.imageUrl.style.display = 'block'
                this.imageType = 'url'
                break;
        }
    }

    showMessage(text){
        this.msg.data = text
        this.dialogMessageBar.style.display = 'block'
    }

    clearMessage(){
        this.msg.data = ''
        this.dialogMessageBar.style.display = 'none'
    }

    ok(){
        switch(this.imageType){
            case 'upload':
                let file = this.file.value
                if(!file){
                    this.showMessage('请选择图片文件！')
                }else{
                    this.clearMessage()
                }
                break;
            case 'url':
                let url = this.url.value
                if(!url){
                    this.showMessage('请输入图片网址！')
                }else{
                    this.clearMessage()
                }
                break;
        }
    }

    close(){
        this.el.remove()
    }
}

export default InsertImageDialog