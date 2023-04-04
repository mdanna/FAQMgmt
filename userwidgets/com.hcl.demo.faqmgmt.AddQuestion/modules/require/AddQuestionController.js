define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {

      this.view.preShow = () => {
        if(!this.initDone){
          this.view.imgClose.onTouchEnd = () => this.toggle(false, false);

          this.view.buttonSubmit.onClickButton = () => {
            const category = this.view.fieldCategory.selection;
            const question = this.view.fieldQuestion.text;
            if(category && question){
              const objSvc = VMXFoundry.getObjectService("FAQmgt", {
                "access": "online"
              });
              const dataObject = new voltmx.sdk.dto.DataObject("FAQ");
              dataObject.addField("question", question);
              dataObject.addField("answer", "");
              dataObject.addField("category", category);
              dataObject.addField("workflowStatus", "submitted");
              dataObject.addField("questionUserName", globals.user_profile.firstname);
              dataObject.addField("questionUserEmail", globals.user_profile.email);
              dataObject.addField("thumbnail", globals.DEFAULT_THUMBNAIL);
              objSvc.create({
                "dataObject": dataObject
              }, (response) => {
                this.toggle(false, false);
                eventManager.publish(globals.EVT_RELOAD_FAQ_LIST);
                voltmx.print("Record created: " + JSON.stringify(response));
                eventManager.publish(globals.EVT_SHOW_ALERT, {
                  form: voltmx.application.getCurrentForm(),
                  title: 'Info',
                  text: 'Question submitted successfully.'
                });
              }, (error) => {
                voltmx.print("Error in record creation: " + JSON.stringify(error));
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
                  text: 'Fields Category and Question are required.'
                });
            }
          };

          this.initDone = true;
        }
      };

    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {

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
    }
  };
});