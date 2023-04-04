define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {

      this.view.preShow = () => {
        if(!this.initDone){
          this.view.imgClose.onTouchEnd = () => this.toggle(false, false);
          this.view.buttonSendToReview.onClickButton = () => this.update(globals.STEP_ANSWERED);

          this.initDone = true;
        }
      };
    },

    initGettersSetters() {
      defineGetter(this, 'status', () => {
        return this._status;
      });
      defineSetter(this, 'status', value => {
        this.view.lblStatus.text = value;
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
      if(this.answer){
        const objSvc = VMXFoundry.getObjectService("FAQmgt", {
          "access": "online"
        });
        const dataObject = new voltmx.sdk.dto.DataObject("FAQ");
        dataObject.addField("primaryKeyField", "faqID");
        dataObject.addField("faqID", this.faqId);
        dataObject.addField("workflowStatus", status);
        dataObject.addField("answer", this.answer);
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
            title: 'Error',
            text: error.message
          });
        });
      } else {
        eventManager.publish(globals.EVT_SHOW_ALERT, {
          form: voltmx.application.getCurrentForm(),
          title: 'Warning',
          text: 'Please provide an answer'
        });
      }

    }    
  };
});