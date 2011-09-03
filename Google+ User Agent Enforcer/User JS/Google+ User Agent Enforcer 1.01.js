// ==UserScript==
// @name Google+ User Agent Enforcer
// @version 1.01
// @description Forces the Opera user agent so that Google+'s JavaScript will properly detect Opera, even when spoofing the "User-Agent" HTTP header.
// @author XP1
// @namespace https://github.com/XP1/Google--for-Opera/
// @include http*://plus.google.*/*
// @include http*://*.plus.google.*/*
// ==/UserScript==

/*jslint browser: true, vars: true, white: true, maxerr: 50, indent: 4 */
"use strict";

(function ()
{
    var userAgent = "Opera/9.80 (Windows NT 6.0; U; Edition United States Local; en) Presto/2.9.168 Version/11.50"; // Initialized to default.

    window.navigator.__defineGetter__("userAgent", function ()
    {
        if (typeof userAgent === "string")
        {
            window.opera.postError("Returning userAgent: " + userAgent);
            return userAgent;
        }
        else
        {
            throw ("userAgent is not a string.");
        }
    });
}());

(function (topWindow)
{
    if (window.self !== topWindow)
    {
        return;
    }

    var topWindowDocument = topWindow.document;

    var injectCss = function ()
    {
        /* Changes */
        var overlappingContentFix = "#content{z-index: 0 !important;}"; // Fix the content webpage overlapping the floating navigation bar.

        var content = topWindowDocument.getElementById("content");
        var searchNavigationBar = content.previousSibling.previousSibling;
        var topNavigationBar = searchNavigationBar.previousSibling.previousSibling;

        var returnClassSelector = function (classes)
        {
            return ("." + classes.replace(/ /g, "."));
        };

        var overlappingSearchNavigationBarFix = null;
        var overlappingTopNavigationBarFix = null;

        if (searchNavigationBar.hasAttribute("class"))
        {
            overlappingSearchNavigationBarFix = returnClassSelector(searchNavigationBar.getAttribute("class")) + "{z-index: 1 !important;}"; // Fix the search navigation bar overlapping the top navigation bar dropdowns.
        }

        if (topNavigationBar.hasAttribute("class"))
        {
            overlappingTopNavigationBarFix = returnClassSelector(topNavigationBar.getAttribute("class")) + "{z-index: 2 !important;}"; // Correct the order of the z-index.
        }

        var css = (overlappingContentFix + (typeof overlappingSearchNavigationBarFix === "string" ? overlappingSearchNavigationBarFix : "") + (typeof overlappingTopNavigationBarFix === "string" ? overlappingTopNavigationBarFix : ""));

        // Create a new style element, containing the CSS, and append it to the head.
        var heads = topWindowDocument.getElementsByTagName("head");
        if (heads.length > 0)
        {
            var style = document.createElement("style");
            style.appendChild(document.createTextNode(css));
            heads[0].appendChild(style);
        }
    };

    window.addEventListener("DOMContentLoaded", injectCss, false);
}(window.top));