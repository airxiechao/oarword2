import { createElement } from '../utils/renderer'

class Toolbar{
    constructor(){

    }

    mounted(){
        var toolbar = new goog.ui.Toolbar();
        toolbar.render(this.el);

        var tbSep0 = new goog.ui.ToolbarSeparator();
        toolbar.addChild(tbSep0, true);
        tbSep0.getElement().style.height = '100%';

        // font family
        var fontMenu = new goog.ui.Menu();
        goog.array.forEach(['宋体','楷体','黑体', null, 'Arial', 'Courier New','Times New Roman'], function(font) {
            if( font ) {
                var item = new goog.ui.Option(font);
                fontMenu.addChild(item, true);
                item.getElement().getElementsByClassName('goog-menuitem-content')[0].style.fontFamily = font;
            } else {
                fontMenu.addChild(new goog.ui.MenuSeparator(), true);
            }
        });
        var fontSelector = new goog.ui.ToolbarSelect('宋体', fontMenu);
        toolbar.addChild(fontSelector, true);
        fontSelector.getElement().getElementsByClassName('goog-toolbar-menu-button-caption')[0].style.width = '70px';
        //goog.events.listen(fontSelector, 'change', toolbar.fontChange);

        var tbSep1 = new goog.ui.ToolbarSeparator();
        toolbar.addChild(tbSep1, true);
        tbSep1.getElement().style.marginLeft = '0px';

        // font size
        var sizeMenu = new goog.ui.Menu();
        goog.array.forEach([8, 9, 10, 11, 12, 14, 18, 24, 36, 48, 58, 70], function(size) {
            var item = new goog.ui.Option(size + '');
            sizeMenu.addChild(item, true);
            item.getElement().style.paddingRight = '3.5em';
            item.getElement().getElementsByClassName('goog-menuitem-content')[0].style.fontSize = size + 'px';
        });
        var sizeSelector = new goog.ui.ToolbarSelect('14', sizeMenu);
        toolbar.sizeSelector = sizeSelector;
        toolbar.addChild(sizeSelector, true);
        sizeSelector.getElement().getElementsByClassName('goog-toolbar-menu-button-caption')[0].style.width = '10px';
        sizeMenu.getElement().style.height = '300px';
        sizeMenu.getElement().style.overflowY = 'scroll';
        //goog.events.listen(sizeSelector, 'change', toolbar.sizeChange);

        var tbSep2 = new goog.ui.ToolbarSeparator();
        toolbar.addChild(tbSep2, true);
        tbSep2.getElement().style.marginLeft = '0px';

        // font color
        var fontColorSelector = new goog.ui.ColorMenuButton('A', goog.ui.ColorMenuButton.newColorMenu(), goog.ui.ToolbarColorMenuButtonRenderer.getInstance());

        toolbar.addChild(fontColorSelector, true);
        toolbar.fontColorSelector = fontColorSelector;
        fontColorSelector.setSelectedColor('#000000');
        var fontColorCap = fontColorSelector.getElement().getElementsByClassName('goog-toolbar-menu-button-caption')[0];
        var fontColorDrop = fontColorSelector.getElement().getElementsByClassName('goog-toolbar-menu-button-dropdown')[0];
        fontColorCap.style.padding = '0px';
        fontColorCap.style.marginLeft = '3px';
        fontColorCap.style.width = '16px';
        fontColorCap.style.textAlign = 'center';
        fontColorDrop.style.marginRight = '1px';

        //goog.events.listen(fontColorSelector, goog.ui.Component.EventType.ACTION, toolbar.colorChange);

        // background color
        var bgColorMenu = goog.ui.ColorMenuButton.newColorMenu();
        var noneBgColorItem = new goog.ui.MenuItem('无填充颜色', goog.ui.ColorMenuButton.NO_COLOR);
        bgColorMenu.addChildAt(noneBgColorItem, 0, true);
        bgColorMenu.addChildAt(new goog.ui.Separator(), 1, true);

        noneBgColorItem.getElement().style.paddingRight = '0px';

        var bgColorSelector = new goog.ui.ColorMenuButton('A', bgColorMenu, goog.ui.ToolbarColorMenuButtonRenderer.getInstance());

        toolbar.addChild(bgColorSelector, true);
        toolbar.bgColorSelector = bgColorSelector;
        var bgColorCap = bgColorSelector.getElement().getElementsByClassName('goog-toolbar-menu-button-caption')[0];
        var bgColorDrop = bgColorSelector.getElement().getElementsByClassName('goog-toolbar-menu-button-dropdown')[0];
        bgColorCap.style.padding = '0px';
        bgColorCap.style.marginLeft = '3px';
        bgColorCap.style.width = '16px';
        bgColorCap.style.textAlign = 'center';
        bgColorCap.style.color = '#FFF';
        bgColorCap.style.backgroundColor = '#000';
        bgColorDrop.style.marginRight = '1px';

        //goog.events.listen(bgColorSelector, goog.ui.Component.EventType.ACTION, toolbar.bgColorChange);

        // bold toggle
        var boldSet = new goog.ui.ToolbarToggleButton('B');
        toolbar.boldSet = boldSet;
        toolbar.addChild(boldSet, true);
        boldSet.getElement().style.fontFamily = 'Times New Roman';
        //goog.events.listen(boldSet, goog.ui.Component.EventType.ACTION, toolbar.WSDSChange);

        // italic
        var italicSet = new goog.ui.ToolbarToggleButton('I');
        toolbar.italicSet = italicSet;
        toolbar.addChild(italicSet, true);
        italicSet.getElement().style.fontFamily = 'Times New Roman';
        italicSet.getElement().style.fontStyle = 'italic';
        //goog.events.listen(italicSet, goog.ui.Component.EventType.ACTION, toolbar.WSDSChange);

        // underline
        var underlineSet = new goog.ui.ToolbarToggleButton('U');
        toolbar.underlineSet = underlineSet;
        toolbar.addChild(underlineSet, true);
        underlineSet.getElement().style.fontFamily = 'Times New Roman';
        underlineSet.getElement().getElementsByClassName('goog-toolbar-button-inner-box')[0].style.textDecoration = 'underline';
        //goog.events.listen(underlineSet, goog.ui.Component.EventType.ACTION, toolbar.WSDSChange);

        // superscript
        var spsIcon = goog.dom.createDom('div');
        spsIcon.style.background = 'url(img/sprite.png) no-repeat -3px -1703px';
        spsIcon.style.width = '14px';
        spsIcon.style.height = '16px';
        var superScriptSet = new goog.ui.ToolbarToggleButton(spsIcon);
        toolbar.superScriptSet = superScriptSet;
        toolbar.addChild(superScriptSet, true);
        /*
        goog.events.listen(superScriptSet,
            goog.ui.Component.EventType.ACTION,
            function(e) {
                if( this.isChecked() ) {
                    subScriptSet.setChecked(false);
                }
                toolbar.WSDSChange(e);
            }
        );*/

        // subscript
        var sbsIcon = goog.dom.createDom('div');
        sbsIcon.style.background = 'url(img/sprite.png) no-repeat -24px -1914px';
        sbsIcon.style.width = '14px';
        sbsIcon.style.height = '16px';
        var subScriptSet = new goog.ui.ToolbarToggleButton(sbsIcon);
        toolbar.subScriptSet = subScriptSet;
        toolbar.addChild(subScriptSet, true);
        /*
        goog.events.listen(subScriptSet,
            goog.ui.Component.EventType.ACTION,
            function(e) {
                if( this.isChecked() ) {
                    superScriptSet.setChecked(false);
                }
                toolbar.WSDSChange(e);
            }
        );*/

        var tbSepFont = new goog.ui.ToolbarSeparator();
        toolbar.addChild(tbSepFont, true);
        tbSepFont.getElement().style.marginLeft = '0px';

        // paragraph align left
        var alignLeftIcon = goog.dom.createDom('div');
        alignLeftIcon.style.background = 'url(img/sprite.png) no-repeat -3px -2018px';
        alignLeftIcon.style.width = '14px';
        alignLeftIcon.style.height = '16px';
        var alignLeftSet = new goog.ui.ToolbarToggleButton(alignLeftIcon);
        toolbar.alignLeftSet = alignLeftSet;
        toolbar.addChild(alignLeftSet, true);
        /*
        goog.events.listen(alignLeftSet,
            goog.ui.Component.EventType.ACTION,
            function(e) {
                if( this.isChecked() ) {
                    //alignLeftSet.setChecked(false);
                    alignCenterSet.setChecked(false);
                    alignRightSet.setChecked(false);

                    toolbar.paraAlignChange(e);
                    G.cursor.refreshTarget();
                }
                G.inputbox.focus();
            }
        );*/

        // paragraph align center
        var alignCenterIcon = goog.dom.createDom('div');
        alignCenterIcon.style.background = 'url(img/sprite.png) no-repeat -3px -1787px';
        alignCenterIcon.style.width = '14px';
        alignCenterIcon.style.height = '16px';
        var alignCenterSet = new goog.ui.ToolbarToggleButton(alignCenterIcon);
        toolbar.alignCenterSet = alignCenterSet;
        toolbar.addChild(alignCenterSet, true);
        /*
        goog.events.listen(alignCenterSet,
            goog.ui.Component.EventType.ACTION,
            function(e) {
                if( this.isChecked() ) {
                    alignLeftSet.setChecked(false);
                    //alignCenterSet.setChecked(false);
                    alignRightSet.setChecked(false);

                    toolbar.paraAlignChange(e);
                    G.cursor.refreshTarget();
                }
                G.inputbox.focus();
            }
        );*/

        // paragraph align right
        var alignRightIcon = goog.dom.createDom('div');
        alignRightIcon.style.background = 'url(img/sprite.png) no-repeat -24px -548px';
        alignRightIcon.style.width = '14px';
        alignRightIcon.style.height = '16px';
        var alignRightSet = new goog.ui.ToolbarToggleButton(alignRightIcon);
        toolbar.alignRightSet = alignRightSet;
        toolbar.addChild(alignRightSet, true);
        /*
        goog.events.listen(alignRightSet,
            goog.ui.Component.EventType.ACTION,
            function(e) {
                if( this.isChecked() ) {
                    alignLeftSet.setChecked(false);
                    alignCenterSet.setChecked(false);
                    //alignRightSet.setChecked(false);

                    toolbar.paraAlignChange(e);
                    G.cursor.refreshTarget();
                }
                G.inputbox.focus();
            }
        );*/

        var tbSepAlign = new goog.ui.ToolbarSeparator();
        toolbar.addChild(tbSepAlign, true);
        tbSepAlign.getElement().style.marginLeft = '0px';

        // insert picture button
        var insertImgIcon = goog.dom.createDom('div');
        insertImgIcon.style.background = 'url(img/components-toolbar-icons.png) no-repeat -480px 0';
        insertImgIcon.style.width = '16px';
        insertImgIcon.style.height = '16px';

        var insertImgBtn = new goog.ui.ToolbarButton(insertImgIcon);
        toolbar.addChild(insertImgBtn, true);
        /*
        goog.events.listen(insertImgBtn.getElement(),
            goog.events.EventType.CLICK,
            function(e) {
                var insertImgDialog = new InsertImgDialog();
                insertImgDialog.setVisible(true);
            }
        );*/

        // insert table button
        var tableDimensionMenu = new goog.ui.Menu();
        var dimensionPicker = new goog.ui.DimensionPicker();
        tableDimensionMenu.addChild(dimensionPicker, true);
        /*
        goog.events.listen(dimensionPicker, goog.ui.Component.EventType.ACTION,
            function(e) {
                var picker = e.target;
                var size = picker.getValue();

                G.cursor.addTable(size);
            });*/

        var insertTableIcon = goog.dom.createDom('div');
        insertTableIcon.style.background = 'url(img/components-toolbar-icons.png) no-repeat -336px -16px';
        insertTableIcon.style.width = '16px';
        insertTableIcon.style.height = '16px';

        var insertTableBtn = new goog.ui.ToolbarMenuButton(insertTableIcon, tableDimensionMenu);
        toolbar.addChild(insertTableBtn, true);
        insertTableBtn.getElement().getElementsByClassName('goog-toolbar-menu-button-caption')[0].style.paddingRight = '0px';
        insertTableBtn.getElement().getElementsByClassName('goog-toolbar-menu-button-dropdown')[0].style.marginRight = '1px';

        var tbSepInsert = new goog.ui.ToolbarSeparator();
        toolbar.addChild(tbSepInsert, true);
        tbSepInsert.getElement().style.marginLeft = '0px';
    }

    render(){
        this.el = createElement('div', {
            class: 'toolbar',
            style: {
                width: '100%',
                height: '35px',
                margin: 0,
                padding: 0,
                backgroundColor: '#e2e2e2',
                overflowX: 'hidden',
                overflowY: 'hidden',
                borderBottom: '1px solid #e1e1e1',
            }
        })
        
        return this.el
    }
}

export default Toolbar