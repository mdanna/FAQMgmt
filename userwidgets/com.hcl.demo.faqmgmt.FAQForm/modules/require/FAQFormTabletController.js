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
        faqFormCommon.loadData.call(this, this.view.filterStep.selectionKey);
      });

      eventManager.subscribe(globals.EVT_OPEN_SELECTOR, (listKey) => {
        faqFormCommon.subscribeOpenSelector.call(this, listKey);
      });

      eventManager.subscribe(globals.EVT_SELECT_LIST, ({listKey, item, itemKey}) => {
        faqFormCommon.subscribeSelectList.call(this, listKey, item, itemKey);
      });

      this.view.preShow = () => {
        if(!this.initDone){
          this.view.verticalMenu.onItemSelected = (itemKey) => faqFormCommon.onItemSelected.call(this, itemKey);
          this.view.buttonAdd.onClickButton = () => this.view.addQuestion.toggle(true, false);
          this.view.segFaqs.onRowClick = () => faqFormCommon.onRowClick.call(this);
          this.initDone = true;
        }
      };

      faqFormCommon.loadData.call(this, this.view.filterStep.selectionKey || 'All');
    },
    initGettersSetters: function() {},

    getFaqFormCommon(){
      return faqFormCommon;
    }
  };
});