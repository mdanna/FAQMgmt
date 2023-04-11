define(function() {
  const mainFormCommon = require("com/hcl/demo/faqmgmt/MainForm/MainFormCommon");
  return {
    filterCategory: 'All',
    filterStatus: globals.STATUS_APPROVED,

    constructor(baseConfig, layoutConfig, pspConfig) {
      
      eventManager.subscribe(globals.EVT_SHOW_ALERT, ({form, title, text}) => {
        mainFormCommon.subscribeShowAlert.call(this, form, title, text);
      });
      
      eventManager.subscribe(globals.EVT_MASK, ({form, mask}) => {
        mainFormCommon.subscribeMask.call(this, form, mask);
      });
      
      eventManager.subscribe(globals.EVT_OPEN_SELECTOR, (listKey) => {
        mainFormCommon.subscribeOpenSelector.call(this, listKey);
      });
      
      eventManager.subscribe(globals.EVT_SELECT_LIST, ({listKey, item, itemKey}) => {
        mainFormCommon.subscribeSelectList.call(this, listKey, item, itemKey);
      });

      this.view.preShow = () => {
        if(!this.initDone){
          this.view.onBreakpointChange = (form, breakpoint) => {
            this.view.verticalMenu.isVisible = breakpoint !== globals.BREAKPOINT_SMALL;
            this.view.filterCategory.selection = this.filterCategory;
            this.view.filterStatus.selectionKey = this.filterStatus;
            this.view.filterStatus.selection = voltmx.i18n.getLocalizedString(`i18n.status.${this.filterStatus}`);
          };
          
          this.view.mainHeader.onClickLeft = () => this.view.hamburgerMenu.toggle(true);
          this.view.hamburgerMenu.onItemSelected = (itemKey) => mainFormCommon.onItemSelected.call(this, itemKey);
          this.view.verticalMenu.onItemSelected = (itemKey) => mainFormCommon.onItemSelected.call(this, itemKey);

          this.view.segFaqs.onRowClick = () => mainFormCommon.onRowClick.call(this);

          this.initDone = true;
        }

        mainFormCommon.loadData.call(this);

      };
    },

    initGettersSetters() {},
    
    getMainFormCommon() {
      return mainFormCommon;
    }
  };
});