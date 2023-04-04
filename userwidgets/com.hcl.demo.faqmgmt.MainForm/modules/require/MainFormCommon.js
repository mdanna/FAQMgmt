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

    getFaqs(category, status){
      category = category === 'All' ? '' : category;
      status = status === 'All' ? '' : status;

      const promise = new Promise((resolve, reject) => {
        const params = {
          userid: '',
          pwd: ''
        };
        VMXFoundry.getIntegrationService('LEAP_FAQmgt').invokeOperation("list_submission_records", {}, params, (response) => {
          voltmx.print(response.items);
          let faqData = response.items || [];
          const faqs = [];
          category && (faqData = faqData.filter((faq) => faq.F_Category === category));
          status && (faqData = faqData.filter((faq) => faq.flowState === status));
          faqData.forEach((faq) => {
            faqs.push({
              category: faq.F_Category,
              img: faq.F_PictureURL_txt,
              answer: faq.F_Description,
              status: faq.flowState,
              question: faq.F_Title
            });
          });
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
        Promise.all([this.getCategories(), this.getFaqs('', globals.STATUS_APPROVED)]).then((response) => {
          resolve({categories: response[0], faqs: response[1]});
        }).catch((error) => {
          reject(error);
        });
      });
      return promise;
    },

    subscribeMask(form, mask){
      if(form === voltmx.application.getCurrentForm()){
        this.view.flxMask.isVisible = mask;
      }
    },

    subscribeOpenSelector(listKey){
      if(listKey === globals.FILTER_CATEGORY_SELECTOR){
        this.view.listSelector.listKey = listKey;
        this.view.listSelector.setItems(['All', ...globals.categories], this.filterCategory);
        this.view.listSelector.isVisible = true;
      } else if(listKey === globals.FILTER_STATUS_SELECTOR){
        this.view.listSelector.listKey = listKey;
        this.view.listSelector.setItems(['All', ...globals.ALL_STATUSES], this.filterStatus);
        this.view.listSelector.isVisible = true;
      }
    },

    subscribeSelectList(listKey, item){
      if(listKey === globals.FILTER_CATEGORY_SELECTOR){
        this.filterCategory = item;
        this.view.filterCategory.selection = item;
        const filterStatus = this.view.filterStatus.selection === 'All' ? '' : this.view.filterStatus.selection;
        this.getMainFormCommon().getFaqs(item === 'All' ? '' : item, filterStatus).then((faqs) => {
          this.view.segFaqs.setData(faqs);
        }).catch((error) => {
          eventManager.publish(globals.EVT_SHOW_ALERT, {
            form: voltmx.application.getCurrentForm(),
            title: 'Error',
            text: error.message
          });
        });
      } else if(listKey === globals.FILTER_STATUS_SELECTOR){
        this.filterStatus = item;
        this.view.filterStatus.selection = item;
        const filterCategory = this.view.filterCategory.selection === 'All' ? '' : this.view.filterCategory.selection;
        this.getMainFormCommon().getFaqs(filterCategory, item === 'All' ? '' : item).then((faqs) => {
          this.view.segFaqs.setData(faqs);
        }).catch((error) => {
          eventManager.publish(globals.EVT_SHOW_ALERT, {
            form: voltmx.application.getCurrentForm(),
            title: 'Error',
            text: error.message
          });
        });
      }
    },

    subscribeShowAlert(form, title, text){
      if(voltmx.application.getCurrentForm() === form){
        this.view.popupAlert.title = title;
        this.view.popupAlert.text = text;
        this.view.popupAlert.isVisible = true;
      }
    },

    onRowClick(){
      const selection = this.view.segFaqs.selectedRowItems[0];
      this.view.viewFaq.category = selection.category;
      this.view.viewFaq.question = selection.question;
      this.view.viewFaq.answer = selection.answer;
      this.view.viewFaq.toggle(true, false);
    },

    loadData() {
      if(globals.categories.length === 0){
        this.getMainFormCommon().getData().then(({categories, faqs}) => {
          globals.categories = categories;
          this.view.listSelector.setItems(['All', ...categories], 'All');
          this.view.segFaqs.setData(faqs);
        }).catch((error) => {
          eventManager.publish(globals.EVT_SHOW_ALERT, {
            form: voltmx.application.getCurrentForm(),
            title: 'Error',
            text: error.message
          });
        });
      } else {
        this.getMainFormCommon().getFaqs(this.filterCategory, this.filterStatus).then((faqs) => {
          this.view.segFaqs.setData(faqs);
        }).catch((error) => {
          eventManager.publish(globals.EVT_SHOW_ALERT, {
            form: voltmx.application.getCurrentForm(),
            title: 'Error',
            text: error.message
          });
        });
      }
    }
  };
});