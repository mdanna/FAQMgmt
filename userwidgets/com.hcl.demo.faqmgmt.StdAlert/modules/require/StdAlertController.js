define(function() {

  return {
    constructor(baseConfig, layoutConfig, pspConfig) {
      eventManager.subscribe(globals.EVT_SET_LOCALE, () => {
        this.view.buttonClose.label = voltmx.i18n.getLocalizedString('i18n.close');
      });
      
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