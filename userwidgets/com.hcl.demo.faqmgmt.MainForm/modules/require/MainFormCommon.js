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

    getCategories(){
      const promise = new Promise((resolve, reject) => {
        VMXFoundry.getIntegrationService('LEAP_F_Category').invokeOperation('list_categories', {}, {}, (response) => {
          voltmx.print(response.items);
          const catData = response.items || [];
          const categories = [];
          catData.forEach((cat) => categories.push(cat.F_Category));
          categories.sort();
          resolve(categories);
        }, (error) => {
          voltmx.print(error);
          reject(error);
        });
      });
      return promise;
    },

    getFaqs(category){
      const promise = new Promise((resolve, reject) => {
        const operation = category ? 'FAQByCategory' : 'FAQorderStage';
        const params = {
          stage: 'ST_Approved'
        };
        category && (params.category = category);
        VMXFoundry.getIntegrationService('GetFAQLeap').invokeOperation(operation, {}, params, (response) => {
          voltmx.print(response.items);
          const faqData = response.items || [];
          const faqs = [];
          faqData.forEach((faq) => faqs.push({
            category: faq.F_Category,
            img: faq.F_PictureURL_txt,
            answer: faq.F_Description,
            status: faq.flowState,
            question: faq.F_Title
          }));
          resolve(faqs);
        }, (error) => {
          voltmx.print(error);
          reject(error);
        });
      });
      return promise;
    },

    getData(){
      const promise = new Promise((resolve, reject) => {
        Promise.all([this.getCategories(), this.getFaqs()]).then((response) => {
          resolve({categories: response[0], faqs: response[1]});
        }).catch((error) => {
          reject(error);
        });
      });
      return promise;
    }
  };
});