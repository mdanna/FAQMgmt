define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      eventManager.subscribe(globals.EVT_SELECT_LIST, ({listKey, item, itemKey}) => {
        if(listKey === this.listKey){
          voltmx.i18n.setCurrentLocaleAsync(itemKey, () => {
            voltmx.timer.schedule('timerSelectList', () => {
              this.view.isVisible = false;
              const user = voltmx.store.getItem('user');
              user.locale = itemKey;
              voltmx.store.setItem('user', user);
              new voltmx.mvc.Navigation(voltmx.application.getCurrentForm().id).navigate();
            }, 0.25, false);
          }, () => {
            alert('Error setting locale.');
          });
        }
      });
      this.view.preShow = () => {
        this.view.isVisible = false;
        if(!this.initDone){
          this.view.flxBackground.onClick = () => this.view.isVisible = false;
          this.view.flxClose.onClick = () => this.view.isVisible = false;
          this.initDone = true;
        }
      };

    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineGetter(this, 'listKey', () => {
        return this._listKey;
      });
      defineSetter(this, 'listKey', value => {
        this._listKey = value;
      });
    },

    load(){
      this.view.flxList.removeAll();
      const currentLocale = voltmx.i18n.getCurrentLocale();
      globals.locales.forEach((locale, index) => {
        let item = new Intl.DisplayNames([locale], {type: 'language'}).of(locale);
        item = item.substring(0, 1).toUpperCase() + item.substring(1, item.length);
        
        const listSelectorItem = new com.hcl.demo.faqmgmt.ListSelectorItem({
          id: `item${index}${new Date().valueOf()}`
        }, {}, {});
        listSelectorItem.listKey = this.listKey;
        listSelectorItem.itemKey = locale;
        listSelectorItem.item = item;
        listSelectorItem.selected = locale === currentLocale;
        listSelectorItem.onClickItem = () => {
          eventManager.publish(globals.EVT_SELECT_LIST, ({listKey: this.listKey, item, itemKey: locale}));
        };
        this.view.flxList.add(listSelectorItem);
      });      
      this.view.flxList.height = `${globals.locales.length * 50}dp`;
      this.view.flxPopup.height = `${globals.locales.length * 50 + 52}dp`;
    }
  };
});