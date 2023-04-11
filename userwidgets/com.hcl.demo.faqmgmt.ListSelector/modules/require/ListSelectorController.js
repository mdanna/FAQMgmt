define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      eventManager.subscribe(globals.EVT_SELECT_LIST, ({listKey, item}) => {
        if(listKey === this.listKey){
          voltmx.timer.schedule('timerSelectList', () => {
            this.view.isVisible = false;
          }, 0.25, false);
        }
      });
      this.view.preShow = () => {
        this.view.isVisible = false;
        if(!this.initDone){
          this.view.flxBackground.onClick = () => this.view.isVisible = false;
          this.view.flxClose.onClick = () => this.view.isVisible = false;
          this.initDone = true;
        }
      };

    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineGetter(this, 'listKey', () => {
        return this._listKey;
      });
      defineSetter(this, 'listKey', value => {
        this._listKey = value;
      });
    },

    setItems(items, selection, keys){
      this.view.flxList.removeAll();
      items = items || [];
      items.forEach((item, index) => {
        const listSelectorItem = new com.hcl.demo.faqmgmt.ListSelectorItem({
          id: `item${index}${new Date().valueOf()}`
        }, {}, {});
        listSelectorItem.listKey = this.listKey;
        listSelectorItem.item = item;
        keys && (listSelectorItem.itemKey = keys[index]);
        listSelectorItem.selected = item === selection;
        listSelectorItem.onClickItem = () => {
          eventManager.publish(globals.EVT_SELECT_LIST, {
            listKey: this.listKey,
            item
          });
        };
        this.view.flxList.add(listSelectorItem);
      });
      this.view.flxList.height = `${items.length * 50}dp`;
      this.view.flxPopup.height = `${items.length * 50 + 52}dp`;
    }
  };
});