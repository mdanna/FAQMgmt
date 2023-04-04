define(function() {
   const faqFormCommon = require("com/hcl/demo/faqmgmt/FAQForm/FAQFormCommon");

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      
      eventManager.subscribe(globals.EVT_SHOW_ALERT, ({form, title, text}) => {
        faqFormCommon.subscribeShowAlert.call(this, form, title, text);
      });
      
      eventManager.subscribe(globals.EVT_MASK, ({form, mask}) => {
        faqFormCommon.subscribeMask.call(this, form, mask);
      });

      eventManager.subscribe(globals.EVT_RELOAD_FAQ_LIST, () => {
        faqFormCommon.loadData.call(this, this.view.filterStep.selection);
      });

      eventManager.subscribe(globals.EVT_OPEN_SELECTOR, (listKey) => {
        faqFormCommon.subscribeOpenSelector.call(this, listKey);
      });

      eventManager.subscribe(globals.EVT_SELECT_LIST, ({listKey, item}) => {
        faqFormCommon.subscribeSelectList.call(this, listKey, item);
      });

      this.view.preShow = () => {
        if(!this.initDone){
          this.view.mainHeader.onClickLeft = () => this.view.hamburgerMenu.toggle(true); 
          this.view.hamburgerMenu.onItemSelected = (itemKey) => faqFormCommon.onItemSelected(itemKey);
          this.view.buttonAdd.onClickButton = () => this.view.addQuestion.toggle(true, false);
          this.view.segFaqs.onRowClick = () => faqFormCommon.onRowClick.call(this);
          this.initDone = true;
        }
        
        faqFormCommon.loadData.call(this, this.view.filterStep.selection || 'All');
      };
    },
    initGettersSetters: function() {},
    
    getFaqFormCommon(){
      return faqFormCommon;
    }
  };
});