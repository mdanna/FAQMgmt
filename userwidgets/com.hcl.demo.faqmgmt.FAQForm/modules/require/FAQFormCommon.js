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
    },

    getFaqs(status){
      const promise = new Promise((resolve, reject) => {
        var objSvc = voltmx.sdk.getCurrentInstance().getObjectService("FAQmgt", {
          "access": "online"
        });

        var dataObject = new voltmx.sdk.dto.DataObject("FAQ");
        var odataUrl = "$filter=((SoftDeleteFlag ne true) or (SoftDeleteFlag eq null))";
        if(status !== 'All'){
          odataUrl += ` and (workflowStatus eq ${status})`;
        }
        dataObject.odataUrl = odataUrl;
        objSvc.fetch({
          "dataObject": dataObject
        }, (response) => {
          voltmx.print("record: " + response["records"]);
          const faqs = [];
          (response.records || []).forEach((faq) => {
            faqs.push({
              faqId: faq.faqID,
              category: faq.category,
              img: faq.thumbnail,
              answer: faq.answer,
              status: faq.workflowStatus,
              question: faq.question
            });
          });
          resolve(faqs);
        }, (error) => {
          voltmx.print("Failed to fetch: " + JSON.stringify(error));
          reject(error);
        });
      });
      return promise;
    }
  };
});