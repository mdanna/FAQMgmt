define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this.view.preShow = () => {
        if(!this.initDone){
          this.view.onBreakpointChange = (form, breakpoint) => this.view.verticalMenu.isVisible = breakpoint !== globals.BREAKPOINT_SMALL;
          this.view.mainHeader.onClickLeft = () => {
            this.view.hamburgerMenu.toggle(true); 
          };
          const faqFormCommon = require("com/hcl/demo/faqmgmt/FAQForm/FAQFormCommon");
          this.view.hamburgerMenu.onItemSelected = (itemKey) => faqFormCommon.onItemSelected(itemKey);
          this.view.verticalMenu.onItemSelected = (itemKey) => faqFormCommon.onItemSelected(itemKey);
          this.initDone = true;
        }
      };
    },
    initGettersSetters: function() {

    }
  };
});