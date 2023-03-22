define(function() {
  const MENU_LEFT = -250;

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {

      this.view.preShow = () => {
        
        if(!this.initDone){
          this.onInit();
          this.initDone = true;
        }
        
        this.onPreShow();
      };

    },

    onInit(){
      this.view.flxBackground.onClick = () => this.toggle(false);

      this.view.flxClose.onClick = () => {
        this.toggle(false);
      };

      this.view.menu.onItemSelected = (itemKey) => {
        this.toggle(false, true);
        this.onItemSelected(itemKey);
      };

    },
    
    onPreShow(){},

    initGettersSetters() {},

    toggle(open, skipAnimation){
      if(skipAnimation){
        this.view.isVisible = open;
        this.view.flxBackground.isVisible = open;
        this.view.flxMenu.left = open ? 0 : MENU_LEFT;
      } else {
        const self = this;
        open && (self.view.isVisible = true);
        this.view.flxMenu.animate(voltmx.ui.createAnimation({
          "0": {
            left: open ? MENU_LEFT : 0
          },
          "100": {
            left: open ? 0 : MENU_LEFT
          }
        }), {
          "duration": 0.5,
          "iterationCount": 1,
          "delay": 0,
          "fillMode": kony.anim.FILL_MODE_FORWARDS
        }, {
          animationStart: function() {
            open && (self.view.flxBackground.isVisible = true);
          },
          animationEnd: function() {}
        });
        
        voltmx.timer.schedule('timerAnimation', () => {
            open || (self.view.isVisible = false);
            open || (self.view.flxBackground.isVisible = false);
        }, 0.5, false);
      } 
    },

    onItemSelected(key){
      voltmx.print(`Selected menu item ${key}`);
    }

  };
});