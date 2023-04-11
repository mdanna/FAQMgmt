define(function() {

  return {
    
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      
      this.view.preShow = () => {
        if(!this.initDone){
          this.view.onClick = () => {
            this.status = !this.status;
          };
          this.initDone = true;
        }
      };

    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineGetter(this, 'status', () => {
        return this._status;
      });
      defineSetter(this, 'status', value => {
        this._status = value;
        this.view.lblOn.isVisible = !!value;
        this.view.lblOff.isVisible = !value;
      });
    }
  };
});