define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this.view.preShow = () => {
        if(!this.initDone){
          this.view.flxMenuItem.onClick = () => this.onItemClick();
          this.initDone = true;
        }
      };

    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineGetter(this, 'itemKey', () => {
        return this._itemKey;
      });
      defineSetter(this, 'itemKey', value => {
        this._itemKey = value;
      });
    },

    onItemClick(){}
  };
});