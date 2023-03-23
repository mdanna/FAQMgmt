define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {

      this.view.preShow = () => {
        if(!this.initDone){
          this.view.flxField.onClick = () => {
            eventManager.publish(globals.EVT_OPEN_SELECTOR, this.listKey);
          };
          this.initDone = true;
        }
      };

    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      /*defineGetter(this, 'listKey', () => {
        return this._listKey;
      });*/
      /*defineSetter(this, 'listKey', value => {
        this._listKey = value;
      });*/
    }
  };
});