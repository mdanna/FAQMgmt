define(function() {

	return {
		constructor: function(baseConfig, layoutConfig, pspConfig) {
          eventManager.subscribe(globals.EVT_SELECT_LIST, ({listKey, item}) => {
            if(listKey === this.listKey && this.view){
              this.selected = item === this.item;
            }
          });
          this.view.preShow = () => {
            if(!this.initDone){
              this.view.flxItem.onClick = () => {
                eventManager.publish(globals.EVT_SELECT_LIST, {
                  listKey: this.listKey,
                  itemKey: this.itemKey,
                  item: this.item
                });
              };
              this.initDone = true;
            }
            
          };

		},
		
		initGettersSetters: function() {
      defineGetter(this, 'listKey', () => {
        return this._listKey;
      });
      defineSetter(this, 'listKey', value => {
        this._listKey = value;
      });
      defineGetter(this, 'selected', () => {
        return this._selected;
      });
      defineSetter(this, 'selected', value => {
        this._selected = value;
        this.view.skin = value ? 'sknFlxWhiteBorderGreenRounded' : 'slFbox';
      });
      defineGetter(this, 'itemKey', () => {
        return this._itemKey;
      });
      defineSetter(this, 'itemKey', value => {
        this._itemKey = value;
      });
    }
	};
});