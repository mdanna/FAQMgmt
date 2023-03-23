define(function() {
   const faqFormCommon = require("com/hcl/demo/faqmgmt/FAQForm/FAQFormCommon");

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      eventManager.subscribe(globals.EVT_SELECT_LIST, ({listKey, item}) => {
        if(listKey === globals.FILTER_STEP_SELECTOR){
          this.view.lblStep.text = item;
          this.loadData(item);
        } 
      });

      this.view.preShow = () => {
        if(!this.initDone){
          this.view.mainHeader.onClickLeft = () => {
            this.view.hamburgerMenu.toggle(true); 
          };
          this.view.hamburgerMenu.onItemSelected = (itemKey) => faqFormCommon.onItemSelected(itemKey);
          
          this.view.flxStep.onClick = () => {
            this.view.listSelector.listKey = globals.FILTER_STEP_SELECTOR;
            this.view.listSelector.setItems(globals.ALL_STEPS, this.view.lblStep.text);
            this.view.listSelector.isVisible = true;
          };
          
          this.initDone = true;
        }
        
        this.loadData('All');
      };
    },
    initGettersSetters: function() {},
    
    loadData(step){
      faqFormCommon.getFaqs(step).then((faqs) => {
        this.view.segFaqs.setData(faqs);
      }).catch((error) => {
        alert(JSON.stringify(error));
      });
    }
  };
});