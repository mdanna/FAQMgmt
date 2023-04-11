define(function() {
  const MENU_ITEMS = ['itemFAQList', 'itemFAQMgmt', 'itemProfile', 'itemSettings', 'itemLogout'];
  const MENU_ITEMS_I18NKEYS = ['i18n.faq.list', 'i18n.faq.management', 'i18n.profile', 'i18n.settings', 'i18n.logout'];

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      eventManager.subscribe(globals.EVT_SET_LOCALE, () => {
        MENU_ITEMS.forEach((menuItem, index) => {
          this.view[menuItem].item = voltmx.i18n.getLocalizedString(MENU_ITEMS_I18NKEYS[index]);
        });
      });
      
      this.view.preShow = () => {
        this.view.lblName.text = globals.user_profile.firstname;
        this.view.lblEmail.text = globals.user_profile.email;
        
        if(!this.initDone){
          MENU_ITEMS.forEach((item) => {
            this.view[item].onItemClick = () => this.onItemSelected(this.view[item].itemKey);
          });
          this.initDone = true;
        }
      };

    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {

    },

    onItemSelected(){}
  };
});