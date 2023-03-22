define(function() {
  const mainFormCommon = require("com/hcl/demo/faqmgmt/MainForm/MainFormCommon");
  return {
    categories: [],
    filterCategory: 'All',

    constructor(baseConfig, layoutConfig, pspConfig) {

      eventManager.subscribe(globals.EVT_SELECT_LIST, ({listKey, item}) => {
        if(listKey === this.view.categorySelector.id){
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
            this.view.categorySelector.setItems(['All', ...this.categories], this.filterCategory);
            this.view.categorySelector.isVisible = true;
          };

          this.initDone = true;
        }

        mainFormCommon.getData().then(({categories, faqs}) => {
          this.categories = categories;
          this.view.categorySelector.setItems(['All', ...categories], 'All');
          this.view.segFaqs.setData(faqs);
        }).catch((error) => alert(JSON.stringify(error)));

      };
    },

    initGettersSetters() {}
  };
});