define(function() {

  return {
    constructor(baseConfig, layoutConfig, pspConfig) {
      this.view.preShow = () => {
        this.view.isVisible = false;
        if(!this.initDone){
          this.view.flxBackground.onClick = () => this.view.isVisible = false;
          this.view.buttonClose.onClickButton = () => this.view.isVisible = false;
          this.initDone = true;
        }
      };
    },
    
    initGettersSetters() {},
    
  };
});