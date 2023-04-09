define(function() {
  return {
    constructor(baseConfig, layoutConfig, pspConfig) {
      this.view.preShow = () => {
        const user = voltmx.store.getItem('user');
        if(user){
          this.view.fieldRememberMe.status = true;
          this.view.fieldEmail.text = user.userid;
          //todo decrypt encrypted password
          this.view.fieldPassword.text = user.password;
        } 
        if(!this.initDone){
          this.view.buttonLogin.onClickButton = () => this.login();
          this.initDone = true;
        }
      };
    },
    initGettersSetters() {},

    login(){
      const authClient = VMXFoundry.getIdentityService('DHDir');
      voltmx.application.showLoadingScreen(null, '', constants.LOADING_SCREEN_POSITION_FULL_SCREEN, 
                                            true, true, {});
      authClient.login({
        userid: this.view.fieldEmail.text,
        password: this.view.fieldPassword.text
      }, () => {
        authClient.getProfile(true, (profile) => {
          globals.user_profile = profile;
          if(this.view.fieldRememberMe.status){
            voltmx.store.setItem('user', {
              userid: this.view.fieldEmail.text,
              //todo encrypt password
              password: this.view.fieldPassword.text,
              locale: voltmx.i18n.getCurrentLocale()
            });
          } else {
            voltmx.store.removeItem('user');
          }
          voltmx.application.dismissLoadingScreen();
          new voltmx.mvc.Navigation('frmMain'). navigate();
        }, (error) => {
          voltmx.print(error);
          voltmx.application.dismissLoadingScreen();
          this.view.popupAlert.title = voltmx.i18n.getLocalizedString("i18n.error");
          this.view.popupAlert.text = voltmx.i18n.getLocalizedString("i18n.error.profile");
          this.view.popupAlert.isVisible = true;
        });
      }, (error) => {
        voltmx.print(error);
        voltmx.application.dismissLoadingScreen();
        this.view.popupAlert.title = voltmx.i18n.getLocalizedString("i18n.warning");
        this.view.popupAlert.text = voltmx.i18n.getLocalizedString("i18n.warn.credentials");
        this.view.popupAlert.isVisible = true;
      });
    }
  };
});