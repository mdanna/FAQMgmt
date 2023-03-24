define(function() {
  const faqFormCommon = require("com/hcl/demo/faqmgmt/FAQForm/FAQFormCommon");

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      eventManager.subscribe(globals.EVT_MASK, ({form, mask}) => {
        if(form === voltmx.application.getCurrentForm()){
          this.view.flxMask.isVisible = mask;
        }
      });
      
      eventManager.subscribe(globals.EVT_RELOAD_FAQ_LIST, () => {
        this.loadData(this.view.lblStep.text);
      });

      eventManager.subscribe(globals.EVT_OPEN_SELECTOR, (listKey) => {
        if(listKey === globals.EDIT_QUESTION_CATEGORY_SELECTOR){
          this.view.listSelector.listKey = listKey;
          this.view.listSelector.setItems([...globals.categories], this.view.editQuestion.category);
          this.view.listSelector.isVisible = true;
        } else if(listKey === globals.ADD_QUESTION_CATEGORY_SELECTOR){
          this.view.listSelector.listKey = listKey;
          this.view.listSelector.setItems([...globals.categories], this.view.addQuestion.category);
          this.view.listSelector.isVisible = true;
        }
      });

      eventManager.subscribe(globals.EVT_SELECT_LIST, ({listKey, item}) => {
        if(listKey === globals.FILTER_STEP_SELECTOR){
          this.view.lblStep.text = item;
          this.loadData(item);
        } else if(listKey === globals.EDIT_QUESTION_CATEGORY_SELECTOR){
          this.view.editQuestion.category = item;
        } else if(listKey === globals.ADD_QUESTION_CATEGORY_SELECTOR){
          this.view.addQuestion.category = item;
        }
      });
      
      this.view.preShow = () => {
        if(!this.initDone){
          
          this.view.verticalMenu.onItemSelected = (itemKey) => faqFormCommon.onItemSelected(itemKey);
          
          this.view.flxStep.onClick = () => {
            this.view.listSelector.listKey = globals.FILTER_STEP_SELECTOR;
            this.view.listSelector.setItems(globals.ALL_STEPS, this.view.lblStep.text);
            this.view.listSelector.isVisible = true;
          };
          
          this.view.buttonAdd.onClickButton = () => this.view.addQuestion.toggle(true, false);
          
          this.view.segFaqs.onRowClick = () => {
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
          };
          this.initDone = true;
        }
      };
        
        this.loadData('All');
    },
    initGettersSetters: function() {},
    
    loadData(step){
      faqFormCommon.getFaqs(step).then((faqs) => {
        this.view.segFaqs.setData(faqs);
      }).catch((error) => {
        alert(JSON.stringify(error));
      });
    }
  };
});