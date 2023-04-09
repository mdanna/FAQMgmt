function AS_AppEvents_a6858cc7230f4099a6a3a9ab675a600a(eventobject) {
    var self = this;
    const user = voltmx.store.getItem('user');
    if (user) {
        const locale = user.locale || 'en';
        voltmx.i18n.setCurrentLocaleAsync(locale, () => {});
    }
}