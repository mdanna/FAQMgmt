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

      eventManager.subscribe(globals.EVT_OPEN_SELECTOR, (listKey) => {
        if(listKey === globals.ADD_QUESTION_CATEGORY_SELECTOR){
          this.view.categorySelector.listKey = listKey;
          this.view.categorySelector.setItems([...globals.categories], this.view.addQuestion.category);
          this.view.categorySelector.isVisible = true;
        }
      });

      eventManager.subscribe(globals.EVT_SELECT_LIST, ({listKey, item}) => {
        if(listKey === globals.FILTER_CATEGORY_SELECTOR){
          this.filterCategory = item;
          this.view.lblCategory.text = item;
          mainFormCommon.getFaqs(item === 'All' ? '' : item).then((faqs) => {
            this.view.segFaqs.setData(faqs);
          }).catch((error) => alert(JSON.stringify(error)));
        } else if(listKey === globals.ADD_QUESTION_CATEGORY_SELECTOR){
          this.view.addQuestion.category = item;
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

          this.view.buttonAdd.onClickButton = () => this.view.addQuestion.toggle(true, false);

          this.initDone = true;
        }

        mainFormCommon.getData().then(({categories, faqs}) => {
          globals.categories = categories;
          this.view.categorySelector.setItems(['All', ...categories], 'All');
          this.view.segFaqs.setData(faqs);
        }).catch((error) => alert(JSON.stringify(error)));

      };
    },

    initGettersSetters() {}
  };
});