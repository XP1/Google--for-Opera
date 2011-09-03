/*jslint browser: true, vars: true, white: true, maxerr: 50, indent: 4 */
"use strict";

(function ()
{
    var userAgent = window.navigator.userAgent;

    var setupConnection = function ()
    {
        var sendUserAgent = function (event)
        {
            event.source.postMessage(userAgent);
        };

        opera.extension.addEventListener("connect", sendUserAgent, false);
    };

    window.addEventListener("DOMContentLoaded", setupConnection, false);
}());