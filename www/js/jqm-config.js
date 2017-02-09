
/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery'], function ($) {
    'use strict';
    $(document).bind("mobileinit", function () {
        console.info("mobileinit");
        $.mobile.ajaxEnabled = false;
        $.mobile.linkBindingEnabled = false;
        $.mobile.hashListeningEnabled = false;
        $.mobile.pushStateEnabled = false;
        if (navigator.userAgent.indexOf("Android") != -1)
        {
            $.mobile.defaultPageTransition = 'none';
            $.mobile.defaultDialogTransition = 'none';
        }
    });
});
