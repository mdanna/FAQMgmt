function AS_AppEvents_jc37503462354fd2a98f48fe949dd6d8(eventobject) {
    var self = this;
    const user = voltmx.store.getItem('user');
    if (user) {
        const locale = user.locale || 'en';
        voltmx.i18n.setCurrentLocaleAsync(locale, () => {});
    }
}