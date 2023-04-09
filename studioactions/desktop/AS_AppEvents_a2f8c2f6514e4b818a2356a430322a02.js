function AS_AppEvents_a2f8c2f6514e4b818a2356a430322a02(eventobject) {
    var self = this;
    const user = voltmx.store.getItem('user');
    if (user) {
        const locale = user.locale || 'en';
        voltmx.i18n.setCurrentLocaleAsync(locale, () => {});
    }
}