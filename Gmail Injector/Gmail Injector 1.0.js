// ==UserScript==
// @name Gmail Injector
// @version 1.0
// @description Restores the missing HTML, CSS, and JavaScript code for Gmail, which will show the Google+ web toolbar buttons.
// @author XP1; Niels Avonds ("nielsavonds")
// @namespace https://github.com/XP1/Google--for-Opera/
// @include http*://mail.google.*/*
// @include http*://*.mail.google.*/*
// ==/UserScript==

/*jslint browser: true, vars: true, white: true, maxerr: 50, indent: 4 */
(function (opera, topWindow)
{
    "use strict";

    if (window.self !== topWindow)
    {
        return;
    }

    var handleException = function (theFunction)
    {
        try
        {
            theFunction();
        }
        catch (exception)
        {
            opera.postError(exception);
        }
    };

    /**
     * Index discovery.
     *
     * Code container array: window.GLOBALS[17][18]
     * HTML: window.GLOBALS[17][18][2]
     * JavaScript: window.GLOBALS[17][18][3]
     * CSS: window.GLOBALS[17][18][4]
     */
//    topWindow.addEventListener("DOMContentLoaded", function ()
//    {
//        var string = "";
//
//        var i = null;
//        for (i = 0; i < window.GLOBALS[17][18]; i += 1)
//        {
//            string += i + ": " + window.GLOBALS[17][18][i] + "\n";
//        }
//
//        alert(string);
//    }, false);

    var codeArray = null;

    /**
     * Store the locale settings.
     * Store the text depending on the language set in Google+.
     * Use the "find" functions to find the user data in the document first before calling the "get" functions to return the private variable.
     * If a "find" function fails to find the text in the document, then the default value stored in the private variable will be returned.
     */
    var locale = (function ()
    {
        var notificationText = "Notifications"; // Default: "Notifications".
        var shareText = "Share"; // Default: "Share".

        var languageRegex = /lang:\"(.+?)\"/g;
        var language = "en"; // Default: "en".

        var publicMembers =
        {
            findNotificationText: function ()
            {
                throw ("Not implemented.");
            },
            getNotificationText: function ()
            {
                return notificationText;
            },
            findShareText: function ()
            {
                throw ("Not implemented.");
            },
            getShareText: function ()
            {
                return shareText;
            },
            findLanguage: function (text)
            {
                handleException(function ()
                {
                    language = languageRegex.exec(text)[1];
                });
            },
            getLanguage: function ()
            {
                return language;
            }
        };

        return publicMembers;
    }());

    /**
     * Store the user data.
     * Depending on the signed-in user on Google+, the user-specific data will differ.
     * Use the "find" functions to find the user data in the document first before calling the "get" functions to return the private variable.
     * If a "find" function fails to find the text in the document, then the default value stored in the private variable will be returned.
     */
    var user = (function ()
    {
        var numberRegex = /base:".+?\/u\/(.+?)"/g;
        var number = "0"; // For each account in a multilogin account, the account will have its own user number. The default is "0" if there is only one, non-multilogin account. Examples: "/u/0/me?tab=Xh" and "/u/0/notifications/all".

        var avatarLink = "//lh5.googleusercontent.com/-0000000000/AAAAAAAAAAI/AAAAAAAAAAA/0000000/000-0/photo.jpg"; // Default: "//lh5.googleusercontent.com/-0000000000/AAAAAAAAAAI/AAAAAAAAAAA/0000000/000-0/photo.jpg".

        var dataRegex = /\=\{(.*?e:".+?",.*?m:".+?",.*?p:".+?".*?)\}/g;
        var data = "g:_tvv(\"\"),d:_tvv(\"\"),e:\"yourEmail@gmail.com\",m:\"gmail.com\",p:\"" + avatarLink + "\",xp:_tvv(\"1\"),mg:\"%1$s (delegated)\",md:\"%1$s (default)\"";

        var publicMembers =
        {
            findNumber: function (text)
            {
                if (typeof text === "string") // Search argument.
                {
                    handleException(function ()
                    {
                        number = numberRegex.exec(text)[1];
                    });
                }
            },
            getNumber: function ()
            {
                return number;
            },
            findAvatarLink: function ()
            {
                throw ("Not implemented.");
            },
            getAvatarLink: function ()
            {
                return avatarLink;
            },
            findData: function (text)
            {
                handleException(function ()
                {
                    data = dataRegex.exec(text)[1];
                });
            },
            getData: function ()
            {
                return data;
            }
        };

        return publicMembers;
    }());

    var modifyHtml = function ()
    {
        var html = codeArray[2];

        // Find the start index of the web toolbar HTML and then insert the notifications and share HTML after the start index.
        var webToolbarHtml = "<ol class=gbtc>";
        var webToolbarIndex = html.lastIndexOf(webToolbarHtml);
        if (webToolbarIndex !== -1)
        {
            webToolbarIndex = (webToolbarIndex + webToolbarHtml.length);
            var injection = "<li class=\"gbt gbtb\"><span class=gbts></span></li><li class=gbt><a class=\"gbgt gbgtd\" id=gbg1 href=\"https://plus.google.com/u/" + user.getNumber() + "/notifications/all\" title=\"" + locale.getNotificationText() + "\" onclick=\"gbar.tg(event,this)\" aria-haspopup=true aria-owns=gbd1><span class=gbtb2></span><span id=gbgs1 class=gbts><span id=gbi1a class=gbid></span><span id=gbi1 class=gbids>&nbsp;</span></span></a><div id=gbd1 class=\"gbm gbmsgo\" aria-owner=gbg1><div class=gbmc></div><div class=gbmsg></div></div></li><li class=\"gbt gbtb\"><span class=gbts></span></li><li class=gbt><a class=gbgt id=gbg3 href=\"https://plus.google.com/u/" + user.getNumber() + "/stream/all\" onclick=\"gbar.tg(event,this)\" aria-haspopup=true aria-owns=gbd3><span class=gbtb2></span><span id=gbgs3 class=gbts><div class=gbgsc><span class=gbgsb><span id=gbi3 class=gbgst>" + locale.getShareText() + "&hellip;</span><span class=gbgsta>" + locale.getShareText() + "</span></span><span class=gbgss>" + locale.getShareText() + "&hellip;</span><span class=gbgsca></span><span class=gbgscb></span></div></span></a><div class=\"gbm gbmsgo\" id=gbd3 aria-owner=gbg3><div class=gbmc></div><div class=gbmsg></div></div></li><li class=\"gbt gbtb\"><span class=gbts></span></li>";

            html = html.substring(0, webToolbarIndex) + injection + html.substring(webToolbarIndex);
        }

        codeArray[2] = html;
    };

    var modifyJs = function ()
    {
        var js = codeArray[3];

        locale.findLanguage(js);

        user.findNumber(js);
        user.findData(js);

        js = "(function(){try{var d=true,i=false;var l=window.gbar=window.gbar||{};function _tvn(a,b){var c=parseInt(a,10);return isNaN(c)?b:c}function _tvf(a,b){var c=parseFloat(a);return isNaN(c)?b:c}function _tvb(a,b){return a==\"true\"?d:a==\"false\"?i:b}function _tvv(a){return!!a}function n(a,b,c){(c||l)[a]=b}l.bv={n:_tvn(\"2\",0),r:\"\",m:_tvn(\"1\",1)};var aa=function(){return l.bv.m==1};n(\"sb\",aa);\nvar o=function(){},p=function(){},t=function(a){var b=new Image,c=q;b.onerror=b.onload=b.onabort=function(){try{delete r[c]}catch(e){}};r[c]=b;b.src=a;q=c+1},r=[],q=0;n(\"logger\",{il:p,ml:o});\nvar u=window.gbar.logger,v={},ba={},w=[],ca=function(a,b){w.push([a,b])},fa=function(a,b){v[a]=b},ia=function(a){return a in v},x={},y=function(a,b){x[a]||(x[a]=[]);x[a].push(b)},z=function(a){y(\"m\",a)},A=function(a){var b=document.createElement(\"script\");b.src=a;(document.getElementById(\"xjsc\")||document.body).appendChild(b)},C=function(a){for(var b=0,c;c=w[b];++b)if(c[0]==a)break;if(c&&!c[1].l&&!c[1].s){c[1].s=d;B(2,a);A(c[1].url)}},D=function(a){y(\"gc\",a)},E=null,ja=function(a){E=a},B=function(a,\nb,c){if(E){a={t:a,b:b};if(c)for(var e in c)a[e]=c[e];try{E(a)}catch(f){}}};n(\"mdc\",v);n(\"mdi\",ba);n(\"bnc\",w);n(\"qGC\",D);n(\"qd\",x);n(\"lb\",C);n(\"mcf\",fa);n(\"bcf\",ca);n(\"aq\",y);n(\"mdd\",\"\");n(\"has\",ia);n(\"trh\",ja);n(\"tev\",B);var F=_tvf(\"0.001\",1.0E-4),G=0;\nfunction _mlToken(a,b){try{if(G<1){G++;var c,e=a,f=b||{},g=encodeURIComponent,h=[\"//www.google.com/gen_204?atyp=i&zx=\",(new Date).getTime(),\"&jexpid=\",g(\"30315\"),\"&srcpg=\",g(\"prop=23\"),\"&jsr=\",Math.round(1/F),\"&ogv=\",g(\"1314760973.1314123632\")];if(f._sn)f._sn=\"og.\"+f._sn;for(var m in f){h.push(\"&\");h.push(g(m));h.push(\"=\");h.push(g(f[m]))}h.push(\"&emsg=\");h.push(g(e.name+\":\"+e.message));var j=h.join(\"\");if(H(j))j=j.substr(0,2E3);c=j;var k=window.gbar.logger._aem(a,\nc);t(k)}}catch(s){}}var H=function(a){return a.length>=2E3},ka=function(a,b){return b};function I(a){o=a;n(\"_itl\",H,u);n(\"_aem\",ka,u);n(\"ml\",o,u);a={};v.er=a}if(_tvv(\"\"))I(function(a){throw a;});else _tvv(\"1\")&&Math.random()<F&&I(_mlToken);\nvar la=[\"gb_71\",\"gb_155\"],ma=function(){for(var a=[],b=0,c;c=la[b];++b)(c=document.getElementById(c))&&a.push(c);return a},na=function(){var a=ma();return a.length>0?a[0]:null},oa=function(){return document.getElementById(\"gb_70\")},J={},K={},L={},O=undefined,sa=function(a,b){try{var c=document.getElementById(\"gb\");P(c,\"gbpdjs\");Q();R(document.body)&&P(c,\"gbrtl\");if(b&&b.getAttribute){var e=b.getAttribute(\"aria-owns\");if(e.length){var f=document.getElementById(e);if(f){var g=b.parentNode;if(O==e){O=\nundefined;S(g,\"gbto\")}else{if(O){var h=document.getElementById(O);if(h&&h.getAttribute){var m=h.getAttribute(\"aria-owner\");if(m.length){var j=document.getElementById(m);j&&j.parentNode&&S(j.parentNode,\"gbto\")}}}pa(f)&&qa(f);O=e;P(g,\"gbto\")}}}}z(function(){l.tg(a,b,d)});ra(a)}catch(k){o(k)}},ta=function(a){z(function(){l.close(a)})},P=function(a,b){var c=a.className;T(a,b)||(a.className+=(c!=\"\"?\" \":\"\")+b)},S=function(a,b){var c=a.className,e=RegExp(\"\\\\s?\\\\b\"+b+\"\\\\b\");if(c&&c.match(e))a.className=c.replace(e,\n\"\")},T=function(a,b){var c=RegExp(\"\\\\b\"+b+\"\\\\b\"),e=a.className;return!!(e&&e.match(c))},R=function(a){var b,c=\"direction\",e=document.defaultView;if(e&&e.getComputedStyle){if(a=e.getComputedStyle(a,\"\"))b=a[c]}else b=a.currentStyle?a.currentStyle[c]:a.style[c];return b==\"rtl\"},va=function(a,b,c){if(a)try{var e=document.getElementById(\"gbd5\").firstChild,f=e.firstChild,g=document.createElement(\"li\");g.className=b+\" gbmtc\";g.id=c;a.className=\"gbmt\";g.appendChild(a);if(f.hasChildNodes()){c=[[\"gbkc\"],[\"gbf\",\n\"gbe\",\"gbn\"],[\"gbkp\"],[\"gbnd\"]];e=0;for(var h=f.childNodes.length,m=i,j=-1,k=0,s;s=c[k];k++){for(var da=0,M;M=s[da];da++){for(;e<h&&T(f.childNodes[e],M);)e++;if(M==b){f.insertBefore(g,f.childNodes[e]||null);m=d;break}}if(m){if(e+1<f.childNodes.length){var ea=f.childNodes[e+1];if(!T(ea.firstChild,\"gbmh\")&&!ua(ea,s))j=e+1}else if(e-1>=0){var ga=f.childNodes[e-1];if(!T(ga.firstChild,\"gbmh\")&&!ua(ga,s))j=e}break}e>0&&e+1<h&&e++}if(j>=0){var N=document.createElement(\"li\"),ha=document.createElement(\"div\");"
            + "\nN.className=\"gbmtc\";ha.className=\"gbmt gbmh\";N.appendChild(ha);f.insertBefore(N,f.childNodes[j])}l.addHover&&l.addHover(a)}else f.appendChild(g)}catch(Fa){o(Fa)}},ua=function(a,b){for(var c=b.length,e=0;e<c;e++)if(T(a,b[e]))return d;return i},wa=function(a,b,c){va(a,b,c)},xa=function(a,b){va(a,\"gbe\",b)},ya=function(){z(function(){l.pcm&&l.pcm()})},za=function(a,b,c,e,f,g,h,m){z(function(){l.paa&&l.paa(a,b,c,e,f,g,h,m)})},Aa=function(a,b){J[a]||(J[a]=[]);J[a].push(b)},Ba=function(a,b){K[a]||(K[a]=\n[]);K[a].push(b)},Ca=function(a,b){L[a]||(L[a]=[]);L[a].push(b)},ra=function(a){a.preventDefault&&a.preventDefault();a.returnValue=i;a.cancelBubble=d},U=null,qa=function(a,b){Q();if(a){V(a,\"Opening&hellip;\");W(a,d);var c=typeof b!=\"undefined\"?b:1E4,e=function(){Da(a)};U=window.setTimeout(e,c)}},Ea=function(a){Q();if(a){W(a,i);V(a,\"\")}},Da=function(a){try{Q();var b=a||document.getElementById(O);if(b){V(b,\"This service is currently unavailable.%1$sPlease try again later.\",\"%1$s\");W(b,d)}}catch(c){o(c)}},V=function(a,b,c){if(a&&\nb){var e=pa(a);if(e){if(c){e.innerHTML=\"\";b=b.split(c);c=0;for(var f;f=b[c];c++){var g=document.createElement(\"div\");g.innerHTML=f;e.appendChild(g)}}else e.innerHTML=b;W(a,d)}}},W=function(a,b){var c=b!==undefined?b:d;c?P(a,\"gbmsgo\"):S(a,\"gbmsgo\")},pa=function(a){for(var b=0,c;c=a.childNodes[b];b++)if(T(c,\"gbmsg\"))return c},Q=function(){U&&window.clearTimeout(U)},Ga=function(){var a=document.getElementById(\"gb\");a&&R(document.body)&&P(a,\"gbrtl\")};n(\"so\",na);n(\"sos\",ma);n(\"si\",oa);n(\"tg\",sa);\nn(\"close\",ta);n(\"addLink\",wa);n(\"addExtraLink\",xa);n(\"pcm\",ya);n(\"paa\",za);n(\"ddld\",qa);n(\"ddrd\",Ea);n(\"dderr\",Da);n(\"ca\",P);n(\"cr\",S);n(\"cc\",T);n(\"rtl\",R);n(\"ar\",Ga);n(\"bh\",J);n(\"abh\",Aa);n(\"dh\",K);n(\"adh\",Ba);n(\"ch\",L);n(\"ach\",Ca);n(\"qs\",function(){});var Ha={};v.base=Ha;n(\"wg\",{rg:{}});var Ia={tiw:_tvn(\"15000\",0),tie:_tvn(\"30000\",0)};v.wg=Ia;\nvar Ja={thi:_tvn(\"10000\",0),thp:_tvn(\"180000\",0),tho:_tvn(\"5000\",0)};v.wm=Ja;var Ka=0,Ma=function(a){if(a!=Ka){Ka=a;p(La.i,{c:a})}},Na=function(a){var b=document.getElementById(\"gbmpp\");if(b)b.style.display=a?\"block\":\"none\"};w.push([\"m\",{url:\"//ssl.gstatic.com/gb/js/smm_4e7ed55e11b990b80650522c8d97e615.js\"}]);n(\"logNotificationsCountUpdate\",Ma);n(\"depl\",Na);var Oa={};v.heavy=Oa;\nif(_tvv(\"1\")){var Pa=_tvb(\"false\",i);w.push([\"gc\",{auto:Pa,url:\"https://ssl.gstatic.com/gb/js/gcm_b83996bbc33bcd01855a9e817615014a.js\"}]);var Qa={version:\"gcm_b83996bbc33bcd01855a9e817615014a.js\",index:\"0\",lang:\"" + locale.getLanguage() + "\"};v.gc=Qa;var X=function(a){if(window.googleapis)a&&a();else{a&&D(a);C(\"gc\")}};n(\"lGC\",X);_tvv(\"1\")&&n(\"lPWF\",X)}\nif(_tvv(\"1\")&&_tvv(\"1\")){var Y=function(a){X(function(){y(\"pw\",a);C(\"pw\")})};n(\"lPW\",Y);w.push([\"pw\",{url:\"//ssl.gstatic.com/gb/js/pwm_0e44f32cbac2196df4c324ca3ab2ecf7.js\"}]);var Ra=[],Sa=function(a){Ra[0]=a},Ta=function(a,b){var c=b||{};c._sn=\"pw\";o(a,c)},Ua={signed:Ra,elog:Ta,base:\"https://plusone.google.com/u/" + user.getNumber() + "\",loadTime:(new Date).getTime()};v.pw=Ua;var Va=function(a,b){for(var c=b.split(\".\"),e=function(){var m=arguments;a(function(){for(var j=l,k=0,s=c.length-1;k<s;++k)j=j[c[k]];j[c[k]].apply(j,m)})},f=l,g=0,h=c.length-\n1;g<h;++g)f=f[c[g]]=f[c[g]]||{};return f[c[g]]=e};Va(Y,\"pw.clk\");Va(Y,\"pw.hvr\");n(\"su\",Sa,l.pw)}var Wa=function(a){y(\"uf\",a)};w.push([\"uf\",{url:\"//ssl.gstatic.com/gb/js/fm_e6150f2ae3471582f5e836c0e2ecbb3e.js\"}]);var Z={};Z.j=function(a){l.feedback.ds=a};Z.k=function(){Wa(function(){l.feedback.startFeedback()});C(\"uf\")};n(\"feedback\",Z);n(\"startFeedback\",Z.k,Z);n(\"dsc\",Z.j,Z);var Xa={productId:\"sandbar:23\",locale:\"" + locale.getLanguage() + "\"};v.feedback=Xa;\nif(_tvv(\"1\")){var $={},Ya=function(a,b){$[a]||($[a]=[]);$[a].push(b)},Za=function(a){if(a.type)for(var b=$[a.type],c=0;b&&c<b.length;++c)try{b[c](a)}catch(e){o(e)}};n(\"bc\",{subscribe:Ya,dispatch:Za})}var $a={w:1,A:2,O:3,o:4,N:5,D:6,i:7,F:8,S:9,M:10,C:11,L:12,K:13,G:14,J:15,I:16,Q:17,v:18,H:19,R:20,P:21,u:22,z:23,U:24,V:25,T:26,a:27,B:500},ab=_tvf(\"0.001\",1.0E-4),La=$a;\nfunction bb(a,b){var c=encodeURIComponen"
            + "t,e=[\"//www.google.com/gen_204?atyp=i&zx=\",(new Date).getTime(),\"&oge=\",a,\"&ogex=\",c(\"30315\"),\"&ogp=\",c(\"23\"),\"&ogsr=\",Math.round(1/ab),\"&ogv=\",c(\"1314760973.1314123632\")];if(b){if(\"ogw\"in b){e.push(\"&ogw=\"+b.ogw);delete b.ogw}var f;f=b;var g=[],h;for(h in f){g.length!=0&&g.push(\",\");g.push(h);g.push(\".\");g.push(f[h])}f=g.join(\"\");if(f!=\"\"){e.push(\"&ogad=\");e.push(c(f))}}t(e.join(\"\"))}\nif(_tvv(\"1\")&&Math.random()<ab){p=bb;n(\"il\",p,u);var cb={};v.il=cb}if(_tvv(\"1\")||_tvv(\"1\")){var db={uo:\"\",s:\"https\",h:\"plus.google.com\",po:\"\",pa:\"/u/" + user.getNumber() + "/_/notifications/frame\",q:\"\",f:\"pid=23\",ipd:_tvn(\"5\",5),psec:_tvn(\"\",-1),it:_tvn(\"60\",-1),l:\"" + locale.getLanguage() + "\",sto:_tvn(\"10\",10),mnr:_tvn(\"0\",0),co:_tvv(\"\")};v.sw=db}\nif(_tvv(\"1\")){var eb=[],fb=function(a){eb.push(a)};n(\"nuc\",eb);n(\"anuc\",fb);var gb={ht:_tvn(\"100\",0),n:\"" + locale.getNotificationText() + "\",es:_tvn(\"1\",0)};v.no=gb}if(_tvv(\"1\")){var hb=[],ib=function(a){hb.push(a)};n(\"smc\",hb);n(\"asmc\",ib);var jb={ht:_tvn(\"100\",0),n:\"" + locale.getShareText() + "\"};v.sb=jb}var kb=function(){l.prm&&l.prm()},lb=function(a){y(\"m\",function(){l.spn(a)})},mb=function(a){y(\"m\",function(){l.spp(a)})};\nn(\"spn\",lb);n(\"spp\",mb);Aa(\"gbd4\",kb);if(_tvb(\"true\",d)){var nb={" + user.getData() + "};v.prf=nb}\nfunction ob(){function a(){if(document.getElementById(\"gb\")==null)p(La.a,{_m:\"nogb\"});else{for(var k;k=g[h++];)if(k[0]==\"m\"||k[1].auto)break;if(k){B(2,k[0]);A(k[1].url)}h<g.length&&setTimeout(a,0)}}function b(){f-- >0?setTimeout(b,0):a()}var c=_tvb(\"false\",d),e=_tvb(\"true\",i),f=3,g=w,h=0,m=window.gbarOnReady;if(m)try{m()}catch(j){o(j)}if(e)n(\"ldb\",a);else if(c)window.addEventListener?window.addEventListener(\"load\",b,i):window.attachEvent(\"onload\",\nb);else b()}n(\"rdl\",ob);}catch(e){window.gbar&&gbar.logger&&gbar.logger.ml(e);}})();\n(function(){try{window.gbar.rdl();}catch(e){window.gbar&&gbar.logger&&gbar.logger.ml(e);}})();\n";

        codeArray[3] = js;
    };

    var modifyCss = function ()
    {
        var css = codeArray[4];

        /* Changes */
        // !important overrides (current sprite causes small white dot to appear).
        var smallWhiteDotCssFix = ".gbtb .gbts{width:0px!important;}"; // Used to be "width:1px;".

        /* Additions */
        var cssAdditions = "#gbd1 .gbmc,#gbd3 .gbmc{padding:0;}#gbgs1{padding-top:0;text-align:center;}.gbto #gbi1{padding-top:2px;}#gbi1{color:#fff;display:block;font-size:11px;font-weight:bold;position:relative;width:21px;}#gbi1c{bottom:-4px;color:#fff;display:block;font-size:11px;font-weight:bold;position:absolute;width:21px;}#gbi1a{background:url(//ssl.gstatic.com/gb/images/h_bedf916a.png);background-position:0 -274px;overflow:hidden;position:absolute;right:5px;top:3px;height:20px;width:21px;}#gbi1a.gbid{background-position:-26px -274px;}#gbi1.gbids{color:#999;}.gbto #gbi1a{top:5px;}#gbg3 .gbts{line-height:20px;}.gbgsc{padding-bottom:7px;position:relative;top:3px;}.gbgsca,.gbgscb{background:url(//ssl.gstatic.com/gb/images/h_bedf916a.png) no-repeat;height:20px;position:absolute;top:0;width:3px;}.gbgsca{left:0;background-position:0 -300px;}.gbgscb{right:0;background-position:-153px -300px;}.gbgsb{background:url(//ssl.gstatic.com/gb/images/h_bedf916a.png);background-position:-3px -300px;height:20px;right:3px;left:3px;position:absolute;top:0;}.gbgss{padding:0 6px;visibility:hidden;}.gbgst,.gbgsta{color:#666;padding-right:5px;padding-left:3px;}.gbgsta{display:none;}.gbto .gbgsb,.gbto .gbgsca,.gbto .gbgscb{background:none;}.gbto .gbgst{display:none;}.gbgsc,.gbgst,.gbto .gbgsta{display:inline-block;}#gbns{display:none;}.gbmwc,#gbwc{right:0;margin-top:1px;position:absolute;top:-999px;width:440px;z-index:1000;}.gbmwca{top:29px!important;}#gbmpi,#gbmpid{margin-right:0;height:96px;width:96px;}.gbmsg{display:none;position:absolute;top:0;}.gbmsgo .gbmsg{display:block;background:#fff;width:100%;text-align:center;z-index:3;top:30%;}#gbd1,#gbd1 .gbmc{width:440px;height:190px;}#gbd3,#gbd3 .gbmc{width:440px;height:8em;}";

        css += (smallWhiteDotCssFix + cssAdditions);

        codeArray[4] = css;
    };

    var modifyCodeArray = function ()
    {
        if (!Array.isArray(window.GLOBALS))
        {
            return;
        }

        codeArray = window.GLOBALS[17][18];

        handleException(modifyHtml);
        handleException(modifyJs);
        handleException(modifyCss);

        topWindow.removeEventListener("DOMContentLoaded", modifyCodeArray, false);
        opera.postError("[Gmail Injector] modifyCodeArray(): Modified HTML, JavaScript, and CSS in code array and then removed event listener.");
    };

    topWindow.addEventListener("DOMContentLoaded", modifyCodeArray, false);
}(window.opera, window.top));