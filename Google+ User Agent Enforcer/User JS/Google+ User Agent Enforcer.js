// ==UserScript==
// @name Google+ User Agent Enforcer
// @author XP1
// @namespace https://github.com/XP1/Google--for-Opera/
// @version 1.0
// @description Forces the Opera user agent so that Google+'s JavaScript will properly detect Opera, even when spoofing the "User-Agent" HTTP header.
// @include http*://plus.google.*/*
// @include http*://*.plus.google.*/*
// ==/UserScript==

/*jslint browser: true, vars: true, white: true, maxerr: 50, indent: 4 */
(function ()
{
    "use strict";

    window.navigator.__defineGetter__("userAgent", function ()
    {
        return "Opera/9.80 (Windows NT 6.0; U; Edition United States Local; en) Presto/2.9.168 Version/11.50";
    });
}());