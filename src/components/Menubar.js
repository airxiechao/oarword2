import { createElement } from '../renderer'

class Menubar {
  constructor() {

  }

  mounted() {
    var that = this;

    this.menubar = window.goog.ui.menuBar.create();
    this.menubar.render(this.el);

    var menuNames = ["文件", "编辑", "插入", "表格"];

    var menuOptions = [];
    menuOptions[0] = ['新建', '打开', null, '导出'];
    menuOptions[1] = ['撤销', '重做', null, '复制', '粘贴', '剪切'];
    menuOptions[2] = ['表格', '图片'];
    menuOptions[3] = ['在上方插入', '在下方插入', '在左侧插入', '在右侧插入', null,
      '合并单元格', '拆分单元格', null, '删除行', '删除列', '删除表格'];

    var menuAcce = [];
    menuAcce[0] = [];
    menuAcce[1] = ['Ctrl+Z', 'Ctrl+Y', null, 'Ctrl+C', 'Ctrl+V', 'Ctrl+X'];

    for (var i in menuNames) {
      // Create the drop down menu with a few suboptions.
      var menu = new window.goog.ui.Menu();
      var j = -1;
      window.goog.array.forEach(menuOptions[i],
        function (label) {
          var item;
          j++;
          if (label) {
            if ((i == 2 && label == '表格')) {
              var dimensionPicker = new window.goog.ui.DimensionPicker();

              window.goog.events.listen(dimensionPicker, goog.ui.Component.EventType.ACTION,
                function (e) {

                });

              item = new window.goog.ui.SubMenu(label);
              item.addItem(dimensionPicker);
              item.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
              menu.addChild(item, true);
            } else {
              item = new window.goog.ui.MenuItem(label + '');
              item.setId(label);
              item.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
              menu.addChild(item, true);

              if (menuAcce[i] && menuAcce[i][j]) {
                var acc = window.goog.dom.createDom('span');
                acc.textContent = menuAcce[i][j];
                acc.className = 'goog-menuitem-accel';
                item.getContentElement().appendChild(acc);
              }
            }
          } else {
            item = new window.goog.ui.MenuSeparator();
            item.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
            menu.addChild(item, true);
          }


          window.goog.events.listen(item, goog.ui.Component.EventType.ACTION, function (e) {
            var id = this.getId();
          });
        });

      // Create menu button
      var btn = new goog.ui.MenuButton(menuNames[i], menu);
      btn.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
      this.menubar.addChild(btn, true);
    }
  }

  render() {
    this.el = createElement('div', {
      class: 'menubar',
      style: {
        width: '100%',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        overflowY: 'hidden',
      }
    })

    return this.el
  }
}

export default Menubar