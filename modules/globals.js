const globals = {
  STEP_SUBMITTED: 'submitted',
  STEP_SQUAD_REVIEW: 'squadReview',
  STEP_ANSWERED: 'answered',
  STEP_APPROVED: 'approved',
  STEP_REJECTED: 'rejected',
  STEP_ANSWER_REJECTED: 'answerRejected',
  ALL_STEPS: ['submitted', 'rejected', 'squadReview', 'answered', 'answerRejected', 'approved'],

  STATUS_APPROVED: 'ST_Approved',
  STATUS_SUBMITTED: 'ST_Submitted',
  STATUS_REJECTED: 'ST_Rejected',
  ALL_STATUSES: ['ST_Submitted', 'ST_Rejected', 'ST_Approved'],

  DEFAULT_THUMBNAIL: 'https://cdn-icons-png.flaticon.com/512/6486/6486064.png',
  BREAKPOINT_SMALL: 640,

  FAQ_LIST_KEY: 'faqList',
  FAQ_MGMT_KEY: 'faqMgmt',
  PROFILE_KEY: 'profile',
  SETTINGS_KEY: 'settings',
  LOGOUT_KEY: 'logout',

  EVT_SELECT_LIST: 'selectList',
  EVT_OPEN_SELECTOR: 'openSelector',
  EVT_RELOAD_FAQ_LIST: 'reloadFaqList',
  EVT_MASK: 'mask',
  EVT_SHOW_ALERT: 'showAlert',
  EVT_SET_LOCALE: 'setLocale',

  FILTER_CATEGORY_SELECTOR: 'filterCategorySelector',
  FILTER_STATUS_SELECTOR: 'filterStatusSelector',
  FILTER_STEP_SELECTOR: 'filterStepSelector',
  ADD_QUESTION_CATEGORY_SELECTOR: 'addQuestionCategorySelector',
  EDIT_QUESTION_CATEGORY_SELECTOR: 'editQuestionCategorySelector',

  user_profile: null,
  categories: [],

  locales: ['en', 'es', 'it', 'pt', 'ja'],

  getDisplayStatuses(){
    const ret = [];
    globals.ALL_STATUSES.forEach((status) => {
      ret.push(voltmx.i18n.getLocalizedString(`i18n.status.${status}`));
    });
    return ret;
  },
  
  getDisplaySteps(){
    const ret = [];
    globals.ALL_STEPS.forEach((step) => {
      ret.push(voltmx.i18n.getLocalizedString(`i18n.step.${step}`));
    });
    return ret;
  }
};