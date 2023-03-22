define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      eventManager.subscribe(globals.EVT_SELECT_LIST, ({listKey, item}) => {
        if(listKey === this.view.id){
          voltmx.timer.schedule('timerSelectList', () => {
            this.view.isVisible = false;
          }, 0.3, false);
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
    initGettersSetters: function() {},

    setItems(items, selection){
      const listKey = this.view.id;
      this.view.flxList.removeAll();
      items = items || [];
      items.forEach((item) => {
        const listSelectorItem = new com.hcl.demo.faqmgmt.ListSelectorItem({
          id: `item${new Date().valueOf()}`
        }, {}, {});
        listSelectorItem.listKey = listKey;
        listSelectorItem.item = item;
        listSelectorItem.selected = item === selection;
        listSelectorItem.onClickItem = () => {
          eventManager.publish(globals.EVT_SELECT_LIST, {
            listKey,
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