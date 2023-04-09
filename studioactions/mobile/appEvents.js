define({
    /*
        This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    AS_AppEvents_a6858cc7230f4099a6a3a9ab675a600a: function AS_AppEvents_a6858cc7230f4099a6a3a9ab675a600a(eventobject) {
        var self = this;
        const user = voltmx.store.getItem('user');
        if (user) {
            const locale = user.locale || 'en';
            voltmx.i18n.setCurrentLocaleAsync(locale, () => {});
        }
    }
});