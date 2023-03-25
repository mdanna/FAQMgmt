define(function() {
  const mainFormCommon = require("com/hcl/demo/faqmgmt/MainForm/MainFormCommon");
  return {
    filterCategory: 'All',

    constructor(baseConfig, layoutConfig, pspConfig) {

      eventManager.subscribe(globals.EVT_MASK, ({form, mask}) => {
        if(form === voltmx.application.getCurrentForm()){
          this.view.flxMask.isVisible = mask;
        }
      });

      eventManager.subscribe(globals.EVT_SELECT_LIST, ({listKey, item}) => {
        if(listKey === globals.FILTER_CATEGORY_SELECTOR){
          this.filterCategory = item;
          this.view.lblCategory.text = item;
          mainFormCommon.getFaqs(item === 'All' ? '' : item).then((faqs) => {
            this.view.segFaqs.setData(faqs);
          }).catch((error) => alert(JSON.stringify(error)));
        }
      });

      this.view.preShow = () => {
        if(!this.initDone){
          this.view.mainHeader.onClickLeft = () => {
            this.view.hamburgerMenu.toggle(true); 
          };
          this.view.hamburgerMenu.onItemSelected = (itemKey) => mainFormCommon.onItemSelected(itemKey);

          this.view.flxCategory.onClick = () => {
            this.view.categorySelector.listKey = globals.FILTER_CATEGORY_SELECTOR;
            this.view.categorySelector.setItems(['All', ...globals.categories], this.filterCategory);
            this.view.categorySelector.isVisible = true;
          };

          this.view.segFaqs.onRowClick = () => {
            const selection = this.view.segFaqs.selectedRowItems[0];
            this.view.viewFaq.category = selection.category;
            this.view.viewFaq.question = selection.question;
            this.view.viewFaq.answer = selection.answer;
            this.view.viewFaq.toggle(true, false);
          };

          this.initDone = true;
        }

        if(this.filterCategory !== 'All'){
          mainFormCommon.getFaqs(this.filterCategory).then((faqs) => {
            this.view.segFaqs.setData(faqs);
          }).catch((error) => alert(JSON.stringify(error)));
        } else {
          mainFormCommon.getData().then(({categories, faqs}) => {
            globals.categories = categories;
            this.view.categorySelector.setItems(['All', ...categories], 'All');
            this.view.segFaqs.setData(faqs);
          }).catch((error) => alert(JSON.stringify(error)));
        }

      };
    },

    initGettersSetters() {}
  };
});