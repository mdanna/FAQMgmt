define(function() {

  return {
    controller: null,
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this.view.preShow = () => {
        if(!this.initDone){
          this.view.flxIconLeft.onClick = () => {
            this.onClickLeft();
          };
          this.initDone = true;
        }
      };
    },
    initGettersSetters: function() {

    },
    onClickLeft(){}
  };
});