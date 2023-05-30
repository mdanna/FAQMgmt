define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {

      eventManager.subscribe(globals.EVT_SET_LOCALE, () => {
        this.view.fieldCategory.label = voltmx.i18n.getLocalizedString('i18n.category');
        this.view.fieldQuestion.label = voltmx.i18n.getLocalizedString('i18n.question');
        this.view.fieldAnswer.label = voltmx.i18n.getLocalizedString('i18n.answer');
        this.view.buttonReject.label = voltmx.i18n.getLocalizedString('i18n.reject');
        this.view.buttonSendToSquad.label = voltmx.i18n.getLocalizedString('i18n.send.squad');
        this.view.buttonRejectAnswer.label = voltmx.i18n.getLocalizedString('i18n.reject');
        this.view.buttonSendToLeap.label = voltmx.i18n.getLocalizedString('i18n.send.leap');
      });
      
      this.view.preShow = () => {
        if(!this.initDone){
          this.view.imgClose.onTouchEnd = () => this.toggle(false, false);
          
          this.view.buttonReject.onClickButton = () => this.update(globals.STEP_REJECTED);
          this.view.buttonSendToSquad.onClickButton = () => this.update(globals.STEP_SQUAD_REVIEW);
          this.view.buttonRejectAnswer.onClickButton = () => this.update(globals.STEP_ANSWER_REJECTED);
          this.view.buttonSendToLeap.onClickButton = () => {
            this.sendToLeap();
          };

          this.initDone = true;
        }
      };

    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineGetter(this, 'status', () => {
        return this._status;
      });
      defineSetter(this, 'status', value => {
        this.view.lblStatus.text = voltmx.i18n.getLocalizedString(`i18n.step.${value}`);
        this.view.fieldAnswer.isVisible = value !== globals.STEP_SUBMITTED;
        this.view.flxButtonSubmitted.isVisible = value === globals.STEP_SUBMITTED;
        this.view.flxButtonAnswered.isVisible = value === globals.STEP_ANSWERED;
      });
      defineGetter(this, 'faqId', () => {
        return this._faqId;
      });
      defineSetter(this, 'faqId', value => {
        this._faqId = value;
      });
    },

    toggle(open, skipAnimation){
      if(skipAnimation){
        this.view.isVisible = open;
        eventManager.publish(globals.EVT_MASK, {
          form: voltmx.application.getCurrentForm(),
          mask: open
        });
        this.view.bottom = open ? '0' : '-100%';
      } else {
        if(open){
          this.view.isVisible = true;
          eventManager.publish(globals.EVT_MASK, {
            form: voltmx.application.getCurrentForm(),
            mask: true
          });
        }
        this.view.animate(
          voltmx.ui.createAnimation({
            "100": {
              "bottom": open ? "0" : "-100%",
              "stepConfig": {
                "timingFunction": voltmx.anim.EASE
              }
            }
          }), {
            "delay": 0,
            "iterationCount": 1,
            "fillMode": voltmx.anim.FILL_MODE_FORWARDS,
            "duration": 0.5
          }, {
          });

        voltmx.timer.schedule('timerAnimation', () => {
          if(!open){
            this.view.isVisible = false;
            eventManager.publish(globals.EVT_MASK, {
              form: voltmx.application.getCurrentForm(),
              mask: false
            });
          }
        }, 0.5, false);

      }
    },

    update(status){
      const objSvc = VMXFoundry.getObjectService("FAQmgt", {
        "access": "online"
      });
      const dataObject = new voltmx.sdk.dto.DataObject("FAQ");
      dataObject.addField("primaryKeyField", "faqID");
      dataObject.addField("faqID", this.faqId);
      dataObject.addField("workflowStatus", status);
      objSvc.update({
        "dataObject": dataObject
      }, (response) => {
        this.toggle(false, false);
        voltmx.print("Record updated: " + JSON.stringify(response));
        eventManager.publish(globals.EVT_RELOAD_FAQ_LIST);
      }, (error) => {
        voltmx.print("Error while updating record: " + JSON.stringify(error));
        this.toggle(false, false);
          eventManager.publish(globals.EVT_SHOW_ALERT, {
            form: voltmx.application.getCurrentForm(),
            title: voltmx.i18n.getLocalizedString("i18n.error"),
            text: voltmx.i18n.getLocalizedString("i18n.error.update"),
          });
      });
    },
    
    sendToLeap() {
      VMXFoundry.getIntegrationService("LEAP_FAQmgt").invokeOperation("create_submission_record", {}, {
        "userid": "",
        "pwd": "",
        "access-type": "anon",
        "pressedButton": "S_Submit",
        "F_Category": this.category,
        "F_Title": this.question,
        "F_Description": this.answer,
        "F_PictureURL_txt": globals.DEFAULT_THUMBNAIL,
        "F_QuestionUserName": globals.user_profile.firstname,
        "F_QuestionUserEmail": globals.user_profile.email,
        "F_AnswerUserName": globals.user_profile.firstname,
        "F_AnswerUserEmail": globals.user_profile.email
      }, (response) => {
        voltmx.print(JSON.stringify(response));
          eventManager.publish(globals.EVT_SHOW_ALERT, {
            form: voltmx.application.getCurrentForm(),
            title: voltmx.i18n.getLocalizedString("i18n.info"),
            text: voltmx.i18n.getLocalizedString("i18n.msg.leap"),
          });
        this.update(globals.STEP_APPROVED);
      }, (error) => {
        voltmx.print(JSON.stringify(error));
          eventManager.publish(globals.EVT_SHOW_ALERT, {
            form: voltmx.application.getCurrentForm(),
            title: voltmx.i18n.getLocalizedString("i18n.error"),
            text: voltmx.i18n.getLocalizedString("i18n.error.sending"),
          });
      });
    }
  };
});