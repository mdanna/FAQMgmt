define(function () {
  return {
    onItemSelected(itemKey){
      switch(itemKey){
        case globals.FAQ_MGMT_KEY:
          new voltmx.mvc.Navigation('frmFAQ').navigate();
          break;
        case globals.FAQ_LIST_KEY:
          new voltmx.mvc.Navigation('frmMain').navigate();
          break;
        case globals.LOGOUT_KEY:
          new voltmx.mvc.Navigation('frmLogin').navigate();
          break;
        default:
          break;
      }
    }
  };
});