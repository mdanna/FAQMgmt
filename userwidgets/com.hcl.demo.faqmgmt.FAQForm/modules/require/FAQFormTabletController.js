define(function() {

  return {
    controller: null,
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this.view.preShow = () => {
        if(!this.initDone){
          const faqFormCommon = require("com/hcl/demo/faqmgmt/FAQForm/FAQFormCommon");
          this.view.verticalMenu.onItemSelected = (itemKey) => faqFormCommon.onItemSelected(itemKey);
          this.initDone = true;
        }
      };
    },
    initGettersSetters: function() {

    }
  };
});