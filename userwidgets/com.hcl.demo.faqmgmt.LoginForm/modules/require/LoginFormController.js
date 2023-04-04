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
              password: this.view.fieldPassword.text
            });
          } else {
            voltmx.store.removeItem('user');
          }
          new voltmx.mvc.Navigation('frmMain'). navigate();
        }, (error) => {
          voltmx.print(error);
          this.view.popupAlert.text = error.message;
          this.view.popupAlert.isVisible = true;
        });
      }, (error) => {
        voltmx.print(error);
          this.view.popupAlert.text = error.message;
          this.view.popupAlert.isVisible = true;
      });
    }
  };
});