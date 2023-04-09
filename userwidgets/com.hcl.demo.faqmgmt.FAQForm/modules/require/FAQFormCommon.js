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
      voltmx.application.showLoadingScreen(null, '', constants.LOADING_SCREEN_POSITION_FULL_SCREEN, 
                                           true, true, {});
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
          voltmx.application.dismissLoadingScreen();
          resolve(faqs);
        }, (error) => {
          voltmx.print("Failed to fetch: " + JSON.stringify(error));
          voltmx.application.dismissLoadingScreen();
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
      if(listKey === globals.EDIT_QUESTION_CATEGORY_SELECTOR){
        this.view.listSelector.listKey = listKey;
        this.view.listSelector.setItems([...globals.categories], this.view.editQuestion.category);
        this.view.listSelector.isVisible = true;
      } else if(listKey === globals.ADD_QUESTION_CATEGORY_SELECTOR){
        this.view.listSelector.listKey = listKey;
        this.view.listSelector.setItems([...globals.categories], this.view.addQuestion.category);
        this.view.listSelector.isVisible = true;
      } else if(listKey === globals.FILTER_STEP_SELECTOR){
        this.view.listSelector.listKey = listKey;
        this.view.listSelector.setItems(['All', ...globals.ALL_STEPS], this.view.filterStep.selection);
        this.view.listSelector.isVisible = true;
      }
    },

    subscribeSelectList(listKey, item){
      if(listKey === globals.FILTER_STEP_SELECTOR){
        this.view.filterStep.selection = item;
        this.getFaqFormCommon().loadData.call(this, item);
      } else if(listKey === globals.EDIT_QUESTION_CATEGORY_SELECTOR){
        this.view.editQuestion.category = item;
      } else if(listKey === globals.ADD_QUESTION_CATEGORY_SELECTOR){
        this.view.addQuestion.category = item;
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
      switch(selection.status) {
        case globals.STEP_REJECTED:
          this.view.editQuestion.category = selection.category;
          this.view.editQuestion.question = selection.question;
          this.view.editQuestion.faqId = selection.faqId;
          this.view.editQuestion.toggle(true, false);
          break;
        case globals.STEP_SUBMITTED:
        case globals.STEP_ANSWERED:
        case globals.STEP_APPROVED:
          this.view.processFaq.category = selection.category;
          this.view.processFaq.question = selection.question;
          this.view.processFaq.answer = selection.answer || '';
          this.view.processFaq.faqId = selection.faqId;
          this.view.processFaq.status = selection.status;
          this.view.processFaq.toggle(true, false);
          break;
        case globals.STEP_SQUAD_REVIEW:
        case globals.STEP_ANSWER_REJECTED:
          this.view.editAnswer.category = selection.category;
          this.view.editAnswer.question = selection.question;
          this.view.editAnswer.answer = selection.answer;
          this.view.editAnswer.faqId = selection.faqId;
          this.view.editAnswer.status = selection.status;
          this.view.editAnswer.toggle(true, false);
          break;
        default: 
          break;
      }

    },

    loadData(step){
      this.getFaqFormCommon().getFaqs(step).then((faqs) => {
        this.view.segFaqs.setData(faqs);
      }).catch((error) => {
        eventManager.publish(globals.EVT_SHOW_ALERT, {
          form: voltmx.application.getCurrentForm(),
          title: voltmx.i18n.getLocalizedString("i18n.error"),
          text: voltmx.i18n.getLocalizedString("i18n.error.loading"),
        });
      });
    },
  };
});