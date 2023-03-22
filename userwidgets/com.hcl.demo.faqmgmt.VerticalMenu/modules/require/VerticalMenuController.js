define(function() {
  const MENU_ITEMS = ['itemFAQList', 'itemFAQMgmt', 'itemProfile', 'itemSettings', 'itemLogout'];

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
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