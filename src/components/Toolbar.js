import { createElement } from '../utils/renderer'
import state from '../utils/state'
import InsertImageDialog from './InsertImageDialog';

class Toolbar{
    constructor(){
        state.mutations.setToolbarObj(this)
    }

    mounted(){
        var that = this;

        this.toolbar = new goog.ui.Toolbar();
        this.toolbar.render(this.el);

        var tbSep0 = new goog.ui.ToolbarSeparator();
        this.toolbar.addChild(tbSep0, true);
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
        var fontFamily = '宋体'
        var fontSelector = new goog.ui.ToolbarSelect(fontFamily, fontMenu);
        state.mutations.setToolbarTextStyle('fontFamily', fontFamily)
        this.toolbar.fontSelector = fontSelector
        this.toolbar.addChild(fontSelector, true);
        fontSelector.getElement().getElementsByClassName('goog-toolbar-menu-button-caption')[0].style.width = '70px';
        goog.events.listen(fontSelector, 'change', this.fontFamilyChanged);

        var tbSep1 = new goog.ui.ToolbarSeparator();
        this.toolbar.addChild(tbSep1, true);
        tbSep1.getElement().style.marginLeft = '0px';

        // font size
        var sizeMenu = new goog.ui.Menu();
        goog.array.forEach([8, 9, 10, 11, 12, 14, 18, 24, 36, 48, 58, 70], function(size) {
            var item = new goog.ui.Option(size + '');
            sizeMenu.addChild(item, true);
            item.getElement().style.paddingRight = '3.5em';
            item.getElement().getElementsByClassName('goog-menuitem-content')[0].style.fontSize = size + 'px';
        });
        var fontSize = 14
        var sizeSelector = new goog.ui.ToolbarSelect(fontSize+'', sizeMenu);
        state.mutations.setToolbarTextStyle('fontSize', fontSize)
        this.toolbar.sizeSelector = sizeSelector;
        this.toolbar.addChild(sizeSelector, true);
        sizeSelector.getElement().getElementsByClassName('goog-toolbar-menu-button-caption')[0].style.width = '10px';
        sizeMenu.getElement().style.height = '300px';
        sizeMenu.getElement().style.overflowY = 'scroll';
        goog.events.listen(sizeSelector, 'change', this.fontSizeChanged);

        var tbSep2 = new goog.ui.ToolbarSeparator();
        this.toolbar.addChild(tbSep2, true);
        tbSep2.getElement().style.marginLeft = '0px';

        // font color
        var fontColorSelector = new goog.ui.ColorMenuButton('A', goog.ui.ColorMenuButton.newColorMenu(), goog.ui.ToolbarColorMenuButtonRenderer.getInstance());

        this.toolbar.addChild(fontColorSelector, true);
        this.toolbar.fontColorSelector = fontColorSelector;
        var color = '#000000'
        fontColorSelector.setSelectedColor(color);
        state.mutations.setToolbarTextStyle('color', color)
        var fontColorCap = fontColorSelector.getElement().getElementsByClassName('goog-toolbar-menu-button-caption')[0];
        var fontColorDrop = fontColorSelector.getElement().getElementsByClassName('goog-toolbar-menu-button-dropdown')[0];
        fontColorCap.style.padding = '0px';
        fontColorCap.style.marginLeft = '3px';
        fontColorCap.style.width = '16px';
        fontColorCap.style.textAlign = 'center';
        fontColorDrop.style.marginRight = '1px';
        goog.events.listen(fontColorSelector, goog.ui.Component.EventType.ACTION, this.colorChanged);

        // background color
        var bgColorMenu = goog.ui.ColorMenuButton.newColorMenu();
        var noneBgColorItem = new goog.ui.MenuItem('无填充颜色', goog.ui.ColorMenuButton.NO_COLOR);
        bgColorMenu.addChildAt(noneBgColorItem, 0, true);
        bgColorMenu.addChildAt(new goog.ui.Separator(), 1, true);

        noneBgColorItem.getElement().style.paddingRight = '0px';

        var bgColorSelector = new goog.ui.ColorMenuButton('A', bgColorMenu, goog.ui.ToolbarColorMenuButtonRenderer.getInstance());

        this.toolbar.addChild(bgColorSelector, true);
        this.toolbar.bgColorSelector = bgColorSelector;
        state.mutations.setToolbarTextStyle('backgroundColor', 'unset')
        var bgColorCap = bgColorSelector.getElement().getElementsByClassName('goog-toolbar-menu-button-caption')[0];
        var bgColorDrop = bgColorSelector.getElement().getElementsByClassName('goog-toolbar-menu-button-dropdown')[0];
        bgColorCap.style.padding = '0px';
        bgColorCap.style.marginLeft = '3px';
        bgColorCap.style.width = '16px';
        bgColorCap.style.textAlign = 'center';
        bgColorCap.style.color = '#FFF';
        bgColorCap.style.backgroundColor = '#000';
        bgColorDrop.style.marginRight = '1px';
        goog.events.listen(bgColorSelector, goog.ui.Component.EventType.ACTION, this.backgroundColorChanged);

        // bold toggle
        var boldSet = new goog.ui.ToolbarToggleButton('B');
        this.toolbar.boldSet = boldSet;
        state.mutations.setToolbarTextStyle('fongWeight', 'unset')
        this.toolbar.addChild(boldSet, true);
        boldSet.getElement().style.fontFamily = 'Times New Roman';
        goog.events.listen(boldSet, goog.ui.Component.EventType.ACTION, this.fontWeightChanged.bind(this));

        // italic
        var italicSet = new goog.ui.ToolbarToggleButton('I');
        this.toolbar.italicSet = italicSet;
        state.mutations.setToolbarTextStyle('textStyle', 'unset')
        this.toolbar.addChild(italicSet, true);
        italicSet.getElement().style.fontFamily = 'Times New Roman';
        italicSet.getElement().style.fontStyle = 'italic';
        goog.events.listen(italicSet, goog.ui.Component.EventType.ACTION, this.fontStyleChanged.bind(this));

        // underline
        var underlineSet = new goog.ui.ToolbarToggleButton('U');
        this.toolbar.underlineSet = underlineSet;
        state.mutations.setToolbarTextStyle('textDecoration', 'unset')
        this.toolbar.addChild(underlineSet, true);
        underlineSet.getElement().style.fontFamily = 'Times New Roman';
        underlineSet.getElement().getElementsByClassName('goog-toolbar-button-inner-box')[0].style.textDecoration = 'underline';
        goog.events.listen(underlineSet, goog.ui.Component.EventType.ACTION, this.textDecorationChanged.bind(this));

        // superscript
        var spsIcon = goog.dom.createDom('div');
        spsIcon.style.background = 'url(img/sprite.png) no-repeat -3px -1703px';
        spsIcon.style.width = '14px';
        spsIcon.style.height = '16px';
        var superScriptSet = new goog.ui.ToolbarToggleButton(spsIcon);
        this.toolbar.superScriptSet = superScriptSet;
        state.mutations.setToolbarTextStyle('verticalAlign', 'unset')
        this.toolbar.addChild(superScriptSet, true);
        goog.events.listen(superScriptSet,
            goog.ui.Component.EventType.ACTION,
            function(e) {
                if( this.isChecked() ) {
                    subScriptSet.setChecked(false);
                }
                that.verticalAlignChanged.call(that);
            }
        );

        // subscript
        var sbsIcon = goog.dom.createDom('div');
        sbsIcon.style.background = 'url(img/sprite.png) no-repeat -24px -1914px';
        sbsIcon.style.width = '14px';
        sbsIcon.style.height = '16px';
        var subScriptSet = new goog.ui.ToolbarToggleButton(sbsIcon);
        this.toolbar.subScriptSet = subScriptSet;
        state.mutations.setToolbarTextStyle('verticalAlign', 'unset')
        this.toolbar.addChild(subScriptSet, true);
        goog.events.listen(subScriptSet,
            goog.ui.Component.EventType.ACTION,
            function(e) {
                if( this.isChecked() ) {
                    superScriptSet.setChecked(false);
                }
                that.verticalAlignChanged.call(that);
            }
        );

        var tbSepFont = new goog.ui.ToolbarSeparator();
        this.toolbar.addChild(tbSepFont, true);
        tbSepFont.getElement().style.marginLeft = '0px';

        // paragraph align left
        var alignLeftIcon = goog.dom.createDom('div');
        alignLeftIcon.style.background = 'url(img/sprite.png) no-repeat -3px -2018px';
        alignLeftIcon.style.width = '14px';
        alignLeftIcon.style.height = '16px';
        var alignLeftSet = new goog.ui.ToolbarToggleButton(alignLeftIcon);
        this.toolbar.alignLeftSet = alignLeftSet;
        this.toolbar.addChild(alignLeftSet, true);
        goog.events.listen(alignLeftSet,
            goog.ui.Component.EventType.ACTION,
            function(e) {
                if( this.isChecked() ) {
                    //alignLeftSet.setChecked(false);
                    alignCenterSet.setChecked(false);
                    alignRightSet.setChecked(false);
                }

                if(!alignLeftSet.isChecked() && !alignCenterSet.isChecked() && !alignRightSet.isChecked()){
                    alignLeftSet.setChecked(true)
                }

                that.textAlignChanged.call(that);
            }
        );

        // paragraph align center
        var alignCenterIcon = goog.dom.createDom('div');
        alignCenterIcon.style.background = 'url(img/sprite.png) no-repeat -3px -1787px';
        alignCenterIcon.style.width = '14px';
        alignCenterIcon.style.height = '16px';
        var alignCenterSet = new goog.ui.ToolbarToggleButton(alignCenterIcon);
        this.toolbar.alignCenterSet = alignCenterSet;
        this.toolbar.addChild(alignCenterSet, true);
        goog.events.listen(alignCenterSet,
            goog.ui.Component.EventType.ACTION,
            function(e) {
                if( this.isChecked() ) {
                    alignLeftSet.setChecked(false);
                    //alignCenterSet.setChecked(false);
                    alignRightSet.setChecked(false);
                }
                
                if(!alignLeftSet.isChecked() && !alignCenterSet.isChecked() && !alignRightSet.isChecked()){
                    alignLeftSet.setChecked(true)
                }

                that.textAlignChanged.call(that);
            }
        );

        // paragraph align right
        var alignRightIcon = goog.dom.createDom('div');
        alignRightIcon.style.background = 'url(img/sprite.png) no-repeat -24px -548px';
        alignRightIcon.style.width = '14px';
        alignRightIcon.style.height = '16px';
        var alignRightSet = new goog.ui.ToolbarToggleButton(alignRightIcon);
        this.toolbar.alignRightSet = alignRightSet;
        this.toolbar.addChild(alignRightSet, true);
        goog.events.listen(alignRightSet,
            goog.ui.Component.EventType.ACTION,
            function(e) {
                if( this.isChecked() ) {
                    alignLeftSet.setChecked(false);
                    alignCenterSet.setChecked(false);
                    //alignRightSet.setChecked(false);
                }

                if(!alignLeftSet.isChecked() && !alignCenterSet.isChecked() && !alignRightSet.isChecked()){
                    alignLeftSet.setChecked(true)
                }

                that.textAlignChanged.call(that);
            }
        );

        var tbSepAlign = new goog.ui.ToolbarSeparator();
        this.toolbar.addChild(tbSepAlign, true);
        tbSepAlign.getElement().style.marginLeft = '0px';

        // insert picture button
        var insertImgIcon = goog.dom.createDom('div');
        insertImgIcon.style.background = 'url(img/components-toolbar-icons.png) no-repeat -480px 0';
        insertImgIcon.style.width = '16px';
        insertImgIcon.style.height = '16px';

        var insertImgBtn = new goog.ui.ToolbarButton(insertImgIcon);
        this.toolbar.addChild(insertImgBtn, true);
        goog.events.listen(insertImgBtn.getElement(),
            goog.events.EventType.CLICK,
            function(e) {
                let insertImagedialog = new InsertImageDialog()
            }
        );

        // insert table button
        var tableDimensionMenu = new goog.ui.Menu();
        var dimensionPicker = new goog.ui.DimensionPicker();
        tableDimensionMenu.addChild(dimensionPicker, true);
        
        goog.events.listen(dimensionPicker, goog.ui.Component.EventType.ACTION,
            function(e) {
                var picker = e.target;
                var size = picker.getValue();

                state.mutations.addTableToBody(size)
            }
        );

        var insertTableIcon = goog.dom.createDom('div');
        insertTableIcon.style.background = 'url(img/components-toolbar-icons.png) no-repeat -336px -16px';
        insertTableIcon.style.width = '16px';
        insertTableIcon.style.height = '16px';

        var insertTableBtn = new goog.ui.ToolbarMenuButton(insertTableIcon, tableDimensionMenu);
        this.toolbar.addChild(insertTableBtn, true);
        insertTableBtn.getElement().getElementsByClassName('goog-toolbar-menu-button-caption')[0].style.paddingRight = '0px';
        insertTableBtn.getElement().getElementsByClassName('goog-toolbar-menu-button-dropdown')[0].style.marginRight = '1px';

        var tbSepInsert = new goog.ui.ToolbarSeparator();
        this.toolbar.addChild(tbSepInsert, true);
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

    fontFamilyChanged(){
        let fontFamily = this.getValue()
        state.mutations.setToolbarTextStyle('fontFamily', fontFamily)
        if(state.getters.hasRangeSelectOverlays()){
            state.mutations.setRangeSelectInlineBlocksTextStyleAsToolbar()
            state.mutations.pushToHistory()
        }
        
    }

    fontSizeChanged(){
        let fontSize = this.getValue()
        state.mutations.setToolbarTextStyle('fontSize', Number(fontSize))
        if(state.getters.hasRangeSelectOverlays()){
            state.mutations.setRangeSelectInlineBlocksTextStyleAsToolbar()
            state.mutations.pushToHistory()
        }
    }

    colorChanged(){
        let color = this.getValue()
        state.mutations.setToolbarTextStyle('color', color)
        if(state.getters.hasRangeSelectOverlays()){
            state.mutations.setRangeSelectInlineBlocksTextStyleAsToolbar()
            state.mutations.pushToHistory()
        }
    }

    backgroundColorChanged(){
        let backgroundColor = this.getValue()
        state.mutations.setToolbarTextStyle('backgroundColor', backgroundColor ? backgroundColor : 'unset')
        if(state.getters.hasRangeSelectOverlays()){
            state.mutations.setRangeSelectInlineBlocksTextStyleAsToolbar()
            state.mutations.pushToHistory()
        }
    }

    fontWeightChanged(){
        let fontWeight = "unset";
        if( this.toolbar.boldSet.isChecked() ) {
            fontWeight = 'bold';
        } else {
            fontWeight = 'normal';
        }
        state.mutations.setToolbarTextStyle('fontWeight', fontWeight)
        if(state.getters.hasRangeSelectOverlays()){
            state.mutations.setRangeSelectInlineBlocksTextStyleAsToolbar()
            state.mutations.pushToHistory()
        }
    }

    fontStyleChanged(){
        let fontStyle = "unset";
        if( this.toolbar.italicSet.isChecked() ) {
            fontStyle = 'italic';
        } else {
            fontStyle = 'normal';
        }
        state.mutations.setToolbarTextStyle('fontStyle', fontStyle)
        if(state.getters.hasRangeSelectOverlays()){
            state.mutations.setRangeSelectInlineBlocksTextStyleAsToolbar()
            state.mutations.pushToHistory()
        }
    }

    textDecorationChanged(){
        let textDecoration = "unset";
        if( this.toolbar.underlineSet.isChecked() ) {
            textDecoration =  'underline';
        } else {
            textDecoration = 'none';
        }
        state.mutations.setToolbarTextStyle('textDecoration', textDecoration)
        if(state.getters.hasRangeSelectOverlays()){
            state.mutations.setRangeSelectInlineBlocksTextStyleAsToolbar()
            state.mutations.pushToHistory()
        }
    }

    verticalAlignChanged(){
        let verticalAlign = "unset";
        if( this.toolbar.superScriptSet.isChecked() ) {
            verticalAlign = 'super';
        } else if ( this.toolbar.subScriptSet.isChecked() ) {
            verticalAlign = 'sub';
        }
        state.mutations.setToolbarTextStyle('verticalAlign', verticalAlign)
        if(state.getters.hasRangeSelectOverlays()){
            state.mutations.setRangeSelectInlineBlocksTextStyleAsToolbar()
            state.mutations.pushToHistory()
        }
    }

    textAlignChanged(){
        let textAlign = 'left'
        if(this.toolbar.alignLeftSet.isChecked()){
            textAlign = 'left'
        }else if(this.toolbar.alignCenterSet.isChecked()){
            textAlign = 'center'
        }else if(this.toolbar.alignRightSet.isChecked()){
            textAlign = 'right'
        }

        state.mutations.setToolbarParaStyle({
            textAlign: textAlign
        })

        state.mutations.setCursorParaStyleAsToolbar()
        state.mutations.pushToHistory()
    }

    updateFontFamily(fontFamily){
        this.toolbar.fontSelector.setValue(fontFamily)
    }

    updateFontSize(fontSize){
        this.toolbar.sizeSelector.setValue(fontSize+'')
    }

    updateColor(color){
        this.toolbar.fontColorSelector.setSelectedColor(color)
    }

    updateBackgroundColor(backgroundColor){
        this.toolbar.bgColorSelector.setSelectedColor(backgroundColor)
    }

    updateFontWeight(fontWeight){
        if(fontWeight == 'bold'){
            this.toolbar.boldSet.setChecked(true)
        }else{
            this.toolbar.boldSet.setChecked(false)
        }
    }

    updateFontStyle(fontStyle){
        if(fontStyle == 'italic'){
            this.toolbar.italicSet.setChecked(true)
        }else{
            this.toolbar.italicSet.setChecked(false)
        }
    }

    updateTextDecoration(textDecoration){
        if(textDecoration == 'underline'){
            this.toolbar.underlineSet.setChecked(true)
        }else{
            this.toolbar.underlineSet.setChecked(false)
        }
    }

    updateVerticalAlign(verticalAlign){
        if(verticalAlign == 'super'){
            this.toolbar.superScriptSet.setChecked(true)
            this.toolbar.subScriptSet.setChecked(false)
        }else if(verticalAlign == 'sub'){
            this.toolbar.superScriptSet.setChecked(false)
            this.toolbar.subScriptSet.setChecked(true)
        }else{
            this.toolbar.superScriptSet.setChecked(false)
            this.toolbar.subScriptSet.setChecked(false)
        }
    }

    updateTextAlign(textAlign){
        if(textAlign == 'right'){
            this.toolbar.alignLeftSet.setChecked(false)
            this.toolbar.alignCenterSet.setChecked(false)
            this.toolbar.alignRightSet.setChecked(true)
        }else if(textAlign == 'center'){
            this.toolbar.alignLeftSet.setChecked(false)
            this.toolbar.alignCenterSet.setChecked(true)
            this.toolbar.alignRightSet.setChecked(false)
        }else{
            this.toolbar.alignLeftSet.setChecked(true)
            this.toolbar.alignCenterSet.setChecked(false)
            this.toolbar.alignRightSet.setChecked(false)
        }
    }
}

export default Toolbar