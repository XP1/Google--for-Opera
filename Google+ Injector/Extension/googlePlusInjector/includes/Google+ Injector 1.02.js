// ==UserScript==
// @name Google+ Injector
// @author XP1
// @namespace https://github.com/XP1/Google--for-Opera/
// @version 1.02
// @description Injects the missing CSS, HTML, and JavaScript code into Google+, which will show the web toolbar buttons and may, by the addition of more JavaScript, increase usability or the number of features.
// @include https://plus.google.*/*
// @include https://*.plus.google.*/*
// ==/UserScript==

(function ()
{
    "use strict";

    var avatarLink = null; // Example link: "//lh5.googleusercontent.com/-0000000000/AAAAAAAAAAI/AAAAAAAAAAA/0000000/000-0/photo.jpg".

    function getAvatarLink()
    {
        avatarLink = window.OZ_initData["2"][1][3] + "?sz=96"; // Get the avatar link from the data arrays and then limit avatar size to 96 pixels.
    }

    function injectCss()
    {
        /* Changes */
        // !important overrides (current sprite causes small white dot to appear).
        var cssChanges = ".gbtb .gbts,#gbi4id,#gbmpid,#gbi5,.gbmpmtc,.gbp0i{background:url(//ssl.gstatic.com/gb/images/h_bedf916a.png)!important;_background:url(//ssl.gstatic.com/gb/images/h8_3dd87cd8.png)!important;}";
        var smallWhiteDotCssFix = ".gbtb .gbts{width:0px!important;}"; // Used to be "width:1px;".
        /* Additions */
        var cssAdditions = "#gbd1 .gbmc,#gbd3 .gbmc{padding:0}#gbgs1{text-align:center}#gbi1{color:#fff;display:block;font-size:11px;font-weight:bold;position:relative;width:21px}#gbi1a{background:url(//ssl.gstatic.com/gb/images/h_bedf916a.png);_background:url(//ssl.gstatic.com/gb/images/h8_3dd87cd8.png);background-position:0 -274px;position:absolute;right:5px;top:3px;height:20px;width:21px}.gbto #gbi1a{_background-position:-52px -274px}#gbi1a.gbid{background-position:-26px -274px}.gbto #gbi1a.gbid{_background-position:-78px -274px}#gbi1.gbids{color:#999}.gbto #gbi1a{top:5px}#gbg3 .gbts{line-height:20px}.gbgsc{padding-bottom:7px;position:relative;top:3px}.gbgsca,.gbgscb{background:url(//ssl.gstatic.com/gb/images/h_bedf916a.png) no-repeat;_background:url(//ssl.gstatic.com/gb/images/h8_3dd87cd8.png) no-repeat;height:20px;position:absolute;top:0;width:3px}.gbgsca{left:0;background-position:0 -300px}.gbgscb{right:0;background-position:-153px -300px}.gbgsb{background:url(//ssl.gstatic.com/gb/images/h_bedf916a.png);_background:url(//ssl.gstatic.com/gb/images/h8_3dd87cd8.png);background-position:-3px -300px;height:20px;right:3px;left:3px;position:absolute;top:0}.gbgss{padding:0 6px;visibility:hidden}.gbgst,.gbgsta{color:#666;padding-right:5px;padding-left:3px}.gbgsta{display:none}.gbto .gbgsb,.gbto .gbgsca,.gbto .gbgscb{background:none}.gbto .gbgst{display:none}.gbgsc,.gbgst,.gbto .gbgsta{display:inline-block}.gbgsc,.gbgst,.gbto .gbgsta{*display:inline}#gbns{display:none}.gbmwc,#gbwc{right:0;margin-top:-2px;position:absolute;top:-999px;width:440px;z-index:999}#gbmpi,#gbmpid{margin-right:0;height:96px;width:96px}.gbmsg{display:none;position:absolute;top:0}.gbmsgo .gbmsg{display:block;background:#fff;width:100%;text-align:center;z-index:3;top:30%}#gbd1,#gbd1 .gbmc{width:440px;height:190px}#gbd3,#gbd3 .gbmc{width:440px;height:8em}";

        var css = (cssChanges + smallWhiteDotCssFix + cssAdditions);

        // Create a new style element, containing the CSS changes, and append it to the head.
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0)
        {
            var style = document.createElement("style");
            style.appendChild(document.createTextNode(css));
            heads[0].appendChild(style);
        }
    }

    function injectHtml()
    {
        // Save name, recreate profileNameElement HTML, and fix attributes.
        var profileName = document.getElementById("gbi4m1").innerHTML;
        var profileNameElement = document.getElementById("gbg4");
        profileNameElement.innerHTML = "<span class='gbtb2'></span><span class='gbts'><span id='gbi4t'>" + profileName + "</span></span>";
        profileNameElement.setAttribute("id", "gbg6");
        profileNameElement.setAttribute("onclick", "gbar.tg(event,document.getElementById('gbg4'))");
        profileNameElement.setAttribute("tabindex", "-1");

        var webToolbarButtonsHtml = "<li class=\"gbt gbtb\"><span class=gbts></span></li><li class=gbt><a class=\"gbgt gbgtd\" id=gbg1 href=\"/u/0/notifications/all\" title=\"Notifications\" onclick=\"gbar.tg(event,this)\" aria-haspopup=true aria-owns=gbd1><span class=gbtb2></span><span id=gbgs1 class=gbts><span id=gbi1a class=gbid></span><span id=gbi1 class=gbids>&nbsp;</span></span></a><div id=gbd1 class=\"gbm gbmsgo\" aria-owner=gbg1><div class=gbmc></div><div class=gbmsg></div></div></li><li class=\"gbt gbtb\"><span class=gbts></span></li><li class=gbt><a class=gbgt id=gbg3 href=\"/u/0/stream/all\" onclick=\"gbar.tg(event,this)\" aria-haspopup=true aria-owns=gbd3><span class=gbtb2></span><span id=gbgs3 class=gbts><div class=gbgsc><span class=gbgsb><span id=gbi3 class=gbgst>Share&hellip;</span><span class=gbgsta>Share</span></span><span class=gbgss>Share&hellip;</span><span class=gbgsca></span><span class=gbgscb></span></div></span></a><div class=\"gbm gbmsgo\" id=gbd3 aria-owner=gbg3><div class=gbmc></div><div class=gbmsg></div></div></li><li class=\"gbt gbtb\"><span class=gbts></span></li><li class=gbt><a class=\"gbgt gbg4a\" id=gbg4 href=\"//google.com/profiles\" onclick=\"gbar.tg(event,this)\" aria-haspopup=true aria-owns=gbd4><span class=gbtb2></span><span id=gbgs4 class=gbts><span id=gbi4><span class=gbi4p></span><span id=gbi4id style=\"display:none\"></span><img id=gbi4i width=24 height=24 onerror=\"window.gbar&&gbar.pge?gbar.pge():this.loadError=1;\" src=\"" + avatarLink + " \" alt=\"\"></span></span></a>";

        var gbd4Element = document.getElementById("gbd4");
        var gbmpdvElement = document.getElementById("gbmpdv");
        var gbtElement = gbd4Element.parentNode;
        gbtElement.removeChild(gbd4Element); // Remove and then relocate gbd4Element node.

        var gbmpdvSpanHtml = "<span id='gbmpid' style=\"display:none\"></span><img id='gbmpi' width='96' height='96' onerror=\"window.gbar&&gbar.ppe?gbar.ppe():this.loadError=1;\" src=\"" + avatarLink + "\" alt=\"\">";
        gbmpdvElement.firstChild.insertAdjacentHTML("beforeBegin", gbmpdvSpanHtml); // Insert the span before "<div class=gbpc>".

        // Use a container to append gbd4Element HTML to webToolbarButtonsHtml.
        var container = document.createElement("div");
        container.appendChild(gbd4Element);

        webToolbarButtonsHtml += container.innerHTML; // Relocated gbd4Element HTML to end of webToolbarButtonsHtml.

        gbtElement.insertAdjacentHTML("afterEnd", webToolbarButtonsHtml);
    }

    function injectJs(event)
    {
        if ((event.element.text.length >= 8000 && event.element.text.length <= 9000) && event.element.text.indexOf("window.jstiming.load.tick('ogjl');") !== -1)
        {
            handleException(getAvatarLink);

            var js = "(function(){try{var d=true,i=false;var l=window.gbar=window.gbar||{};function _tvn(a,b){var c=parseInt(a,10);return isNaN(c)?b:c}function _tvf(a,b){var c=parseFloat(a);return isNaN(c)?b:c}function _tvb(a,b){return a==\"true\"?d:a==\"false\"?i:b}function _tvv(a){return!!a}function n(a,b,c){(c||l)[a]=b}l.bv={n:_tvn(\"2\",0),r:\"\",m:_tvn(\"1\",1)};var aa=function(){return l.bv.m==1};n(\"sb\",aa);"
                + "var o=function(){},p=function(){},s=function(a){var b=new Image,c=q;b.onerror=b.onload=b.onabort=function(){try{delete r[c]}catch(e){}};r[c]=b;b.src=a;q=c+1},r=[],q=0;n(\"logger\",{il:p,ml:o});"
                + "var t=window.gbar.logger,u={},ba={},w=[],ca=function(a,b){w.push([a,b])},fa=function(a,b){u[a]=b},ga=function(a){return a in u},x={},y=function(a,b){x[a]||(x[a]=[]);x[a].push(b)},z=function(a){y(\"m\",a)},A=function(a){var b=document.createElement(\"script\");b.src=a;(document.getElementById(\"xjsc\")||document.body).appendChild(b)},C=function(a){for(var b=0,c;c=w[b];++b)if(c[0]==a)break;if(c&&!c[1].l&&!c[1].s){c[1].s=d;B(2,a);A(c[1].url)}},D=function(a){y(\"gc\",a)},E=null,ha=function(a){E=a},B=function(a,"
                + "b,c){if(E){a={t:a,b:b};if(c)for(var e in c)a[e]=c[e];try{E(a)}catch(f){}}};n(\"mdc\",u);n(\"mdi\",ba);n(\"bnc\",w);n(\"qGC\",D);n(\"qd\",x);n(\"lb\",C);n(\"mcf\",fa);n(\"bcf\",ca);n(\"aq\",y);n(\"mdd\",\"\");n(\"has\",ga);n(\"trh\",ha);n(\"tev\",B);var F=_tvf(\"0.001\",1.0E-4),G=0;"
                + "function _mlToken(a,b){try{if(G<1){G++;var c,e=a,f=b||{},g=encodeURIComponent,h=[\"//www.google.com/gen_204?atyp=i&zx=\",(new Date).getTime(),\"&jexpid=\",g(\"31139\"),\"&srcpg=\",g(\"prop=119\"),\"&jsr=\",Math.round(1/F),\"&ogv=\",g(\"1310516002.1310695395\")];if(f._sn)f._sn=\"og.\"+f._sn;for(var m in f){h.push(\"&\");h.push(g(m));h.push(\"=\");h.push(g(f[m]))}h.push(\"&emsg=\");h.push(g(e.name+\":\"+e.message));var j=h.join(\"\");if(H(j))j=j.substr(0,2E3);c=j;var k=window.gbar.logger._aem(a,"
                + "c);s(k)}}catch(v){}}var H=function(a){return a.length>=2E3},ia=function(a,b){return b};function I(a){o=a;n(\"_itl\",H,t);n(\"_aem\",ia,t);n(\"ml\",o,t);a={};u.er=a}if(_tvv(\"\"))I(function(a){throw a;});else _tvv(\"1\")&&Math.random()<F&&I(_mlToken);"
                + "var ja=[\"gb_71\",\"gb_155\"],J=function(){for(var a=[],b=0,c;c=ja[b];++b)(c=document.getElementById(c))&&a.push(c);return a},ka=function(){var a=J();return a.length>0?a[0]:null},la=function(){return document.getElementById(\"gb_70\")},K={},N={},O={},P=undefined,qa=function(a,b){try{var c=document.getElementById(\"gb\");Q(c,\"gbpdjs\");R();ma(document.body)&&Q(c,\"gbrtl\");if(b&&b.getAttribute){var e=b.getAttribute(\"aria-owns\");if(e.length){var f=document.getElementById(e);if(f){var g=b.parentNode;if(P==e){P="
                + "undefined;S(g,\"gbto\")}else{if(P){var h=document.getElementById(P);if(h&&h.getAttribute){var m=h.getAttribute(\"aria-owner\");if(m.length){var j=document.getElementById(m);j&&j.parentNode&&S(j.parentNode,\"gbto\")}}}na(f)&&oa(f);P=e;Q(g,\"gbto\")}}}}z(function(){l.tg(a,b,d)});pa(a)}catch(k){o(k)}},ra=function(a){z(function(){l.close(a)})},Q=function(a,b){var c=a.className;T(a,b)||(a.className+=(c!=\"\"?\" \":\"\")+b)},S=function(a,b){var c=a.className,e=RegExp(\"\\s?\\b\"+b+\"\\b\");if(c&&c.match(e))a.className=c.replace(e,"
                + "\"\")},T=function(a,b){var c=RegExp(\"\\b\"+b+\"\\b\"),e=a.className;return!!(e&&e.match(c))},ma=function(a){var b,c=\"direction\",e=document.defaultView;if(e&&e.getComputedStyle){if(a=e.getComputedStyle(a,\"\"))b=a[c]}else b=a.currentStyle?a.currentStyle[c]:a.style[c];return b==\"rtl\"},sa=function(a,b,c){if(a)try{var e=document.getElementById(\"gbd5\").firstChild,f=e.firstChild,g=document.createElement(\"li\");g.className=b+\" gbmtc\";g.id=c;a.className=\"gbmt\";g.appendChild(a);if(f.hasChildNodes()){c=[[\"gbkc\"],[\"gbf\","
                + "\"gbe\",\"gbn\"],[\"gbkp\"]];e=0;for(var h=f.childNodes.length,m=i,j=-1,k=0,v;v=c[k];k++){for(var da=0,L;L=v[da];da++){for(;e<h&&T(f.childNodes[e],L);)e++;if(L==b){f.insertBefore(g,f.childNodes[e]);m=d;break}}if(m){if(e+1<f.childNodes.length&&T(f.childNodes[e+1],\"gbkp\"))j=e+1;break}if(e>0&&e+1<h)e++;else if(e>0&&e==h-1)j=e}if(j>=0){var M=document.createElement(\"li\"),ea=document.createElement(\"div\");M.className=\"gbmtc\";ea.className=\"gbmt gbmh\";M.appendChild(ea);f.insertBefore(M,f.childNodes[j])}l.addHover&&"
                + "l.addHover(a)}else f.appendChild(g)}catch(Ba){o(Ba)}},ta=function(a,b,c){sa(a,b,c)},ua=function(a,b){sa(a,\"gbe\",b)},va=function(){z(function(){l.pcm&&l.pcm()})},wa=function(a,b,c,e,f,g,h,m){z(function(){l.paa&&l.paa(a,b,c,e,f,g,h,m)})},xa=function(a,b){K[a]||(K[a]=[]);K[a].push(b)},ya=function(a,b){N[a]||(N[a]=[]);N[a].push(b)},za=function(a,b){O[a]||(O[a]=[]);O[a].push(b)},pa=function(a){a.preventDefault&&a.preventDefault();a.returnValue=i;a.cancelBubble=d},U=null,oa=function(a,b){R();if(a){V(a,"
                + "\"Opening&hellip;\");W(a,d);var c=typeof b!=\"undefined\"?b:1E4;U=window.setTimeout(Aa,c)}},Ca=function(a){R();if(a){W(a,i);V(a,\"\")}},Aa=function(a){R();if(a=a||document.getElementById(P)){V(a,\"This service is currently unavailable.%1$sPlease try again later.\",\"%1$s\");W(a,d)}},V=function(a,b,c){if(a&&b){var e=na(a);if(e){if(c){e.innerHTML=\"\";b=b.split(c);c=0;for(var f;f=b[c];c++){var g=document.createElement(\"div\");g.innerHTML=f;e.appendChild(g)}}else e.innerHTML=b;W(a,d)}}},W=function(a,b){var c=b!==undefined?b:d;c?Q(a,\"gbmsgo\"):"
                + "S(a,\"gbmsgo\")},na=function(a){for(var b=0,c;c=a.childNodes[b];b++)if(T(c,\"gbmsg\"))return c},R=function(){U&&window.clearTimeout(U)};n(\"so\",ka);n(\"sos\",J);n(\"si\",la);n(\"tg\",qa);n(\"close\",ra);n(\"addLink\",ta);n(\"addExtraLink\",ua);n(\"pcm\",va);n(\"paa\",wa);n(\"ddld\",oa);n(\"ddrd\",Ca);n(\"dderr\",Aa);n(\"ca\",Q);n(\"cr\",S);n(\"cc\",T);n(\"rtl\",ma);n(\"bh\",K);n(\"abh\",xa);n(\"dh\",N);n(\"adh\",ya);n(\"ch\",O);n(\"ach\",za);n(\"qs\",function(){});var Da={};u.base=Da;n(\"wg\",{rg:{}});"
                + "var Ea={tiw:_tvn(\"15000\",0),tie:_tvn(\"30000\",0)};u.wg=Ea;var Fa={thi:_tvn(\"10000\",0),thp:_tvn(\"180000\",0),tho:_tvn(\"5000\",0)};u.wm=Fa;var Ga=0,Ha=function(a){if(a!=Ga){Ga=a;p(7,{c:a})}},Ia=function(a){var b=document.getElementById(\"gbmpp\");if(b)b.style.display=a?\"block\":\"none\"};w.push([\"m\",{url:\"//ssl.gstatic.com/gb/js/smm_07310c38d3c237229f8fe2558d96c338.js\"}]);"
                + "n(\"logNotificationsCountUpdate\",Ha);n(\"depl\",Ia);var Ja={};u.heavy=Ja;if(_tvv(\"1\")){var Ka=_tvb(\"true\",i);w.push([\"gc\",{auto:Ka,url:\"https://ssl.gstatic.com/gb/js/gcm_b1be572aff2630578d6077ebe3f660a9.js\"}]);var La={version:\"gcm_b1be572aff2630578d6077ebe3f660a9.js\",index:\"0\",lang:\"en\"};u.gc=La;var X=function(a){if(window.googleapis)a&&a();else{a&&D(a);C(\"gc\")}};n(\"lGC\",X);_tvv(\"1\")&&n(\"lPWF\",X)}"
                + "if(_tvv(\"1\")&&_tvv(\"1\")){var Y=function(a){X(function(){y(\"pw\",a);C(\"pw\")})};n(\"lPW\",Y);w.push([\"pw\",{url:\"//ssl.gstatic.com/gb/js/pwm_377e54339fe6909b01c5d023b5297ebb.js\"}]);var Ma=[],Na=function(a){Ma[0]=a},Oa=function(a,b){var c=b||{};c._sn=\"pw\";o(a,c)},Pa={signed:Ma,elog:Oa,base:\"https://plusone.google.com/u/0\",loadTime:(new Date).getTime()};u.pw=Pa;var Qa=function(a,b){for(var c=b.split(\".\"),e=function(){var m=arguments;a(function(){for(var j=l,k=0,v=c.length-1;k<v;++k)j=j[c[k]];j[c[k]].apply(j,m)})},f=l,g=0,h=c.length-"
                + "1;g<h;++g)f=f[c[g]]=f[c[g]]||{};return f[c[g]]=e};Qa(Y,\"pw.clk\");Qa(Y,\"pw.hvr\");n(\"su\",Na,l.pw)}var Ra=function(a){y(\"uf\",a)};w.push([\"uf\",{url:\"//ssl.gstatic.com/gb/js/fm_e6150f2ae3471582f5e836c0e2ecbb3e.js\"}]);var Z={};Z.a=function(a){l.feedback.ds=a};Z.i=function(){Ra(function(){l.feedback.startFeedback()});C(\"uf\")};n(\"feedback\",Z);n(\"startFeedback\",Z.i,Z);n(\"dsc\",Z.a,Z);var Sa={productId:\"sandbar:119\",locale:\"en\"};u.feedback=Sa;"
                + "if(_tvv(\"\")){var $={},Ta=function(a,b){$[a]||($[a]=[]);$[a].push(b)},Ua=function(a){if(a.type)for(var b=$[a.type],c=0;b&&c<b.length;++c)try{b[c](a)}catch(e){o(e)}};n(\"bc\",{subscribe:Ta,dispatch:Ua})}var Va=_tvf(\"0.001\",1.0E-4);"
                + "function Wa(a,b){var c=encodeURIComponent,e=[\"//www.google.com/gen_204?atyp=i&zx=\",(new Date).getTime(),\"&oge=\",a,\"&ogex=\",c(\"31139\"),\"&ogp=\",c(\"119\"),\"&ogsr=\",Math.round(1/Va),\"&ogv=\",c(\"1310516002.1310695395\")];if(b){if(\"ogw\"in b){e.push(\"&ogw=\"+b.ogw);delete b.ogw}var f;f=b;var g=[],h;for(h in f){g.length!=0&&g.push(\",\");g.push(h);g.push(\".\");g.push(f[h])}f=g.join(\"\");if(f!=\"\"){e.push(\"&ogad=\");e.push(c(f))}}s(e.join(\"\"))}"
                + "if(_tvv(\"1\")&&Math.random()<Va){p=Wa;n(\"il\",p,t);var Xa={};u.il=Xa}if(_tvv(\"1\")||_tvv(\"1\")){var Ya={uo:\"\",s:\"/\",h:\"/\",po:\"\",pa:\"/u/0/_/notifications/frame\",q:\"\",f:\"pid=119\",ipd:_tvn(\"5\",5),psec:_tvn(\"\",-1),it:_tvn(\"60\",-1),l:\"en\",sto:_tvn(\"10\",10),mnr:_tvn(\"30\",0)};u.sw=Ya}"
                + "if(_tvv(\"1\")){var Za=[],$a=function(a){Za.push(a)};n(\"nuc\",Za);n(\"anuc\",$a);var ab={ht:_tvn(\"100\",0),n:\"Notifications\"};u.no=ab}if(_tvv(\"1\")){var bb=[],cb=function(a){bb.push(a)};n(\"smc\",bb);n(\"asmc\",cb);var db={ht:_tvn(\"100\",0),n:\"Share\"};u.sb=db}var eb=function(){l.prm&&l.prm()},fb=function(a){y(\"m\",function(){l.spn(a)})},gb=function(a){y(\"m\",function(){l.spp(a)})};n(\"spn\",fb);n(\"spp\",gb);"
                + "xa(\"gbd4\",eb);if(_tvb(\"true\",d)){var hb={g:_tvv(\"\"),d:_tvv(\"\"),e:\"yourEmail@gmail.com\",m:\"gmail.com\",p:\"" + avatarLink + "\",xp:_tvv(\"1\"),mg:\"%1$s (delegated)\",md:\"%1$s (default)\"};u.prf=hb}"
                + "function ib(){function a(){if(document.getElementById(\"gb\")==null)p(27,{_m:\"nogb\"});else{for(var k;k=g[h++];)if(k[0]==\"m\"||k[1].auto)break;if(k){B(2,k[0]);A(k[1].url)}h<g.length&&setTimeout(a,0)}}function b(){f-- >0?setTimeout(b,0):a()}var c=_tvb(\"true\",d),e=_tvb(\"false\",i),f=3,g=w,h=0,m=window.gbarOnReady;if(m)try{m()}catch(j){o(j)}if(e)n(\"ldb\",a);else if(c)window.addEventListener?window.addEventListener(\"load\",b,i):window.attachEvent(\"onload\",b);"
                + "else b()}n(\"rdl\",ib);}catch(e){window.gbar&&gbar.logger&&gbar.logger.ml(e);}})();"
                + "(function(){try{window.gbar.rdl();}catch(e){window.gbar&&gbar.logger&&gbar.logger.ml(e);}})();"
                + "window.jstiming.load.tick('ogjl');";

            event.element.text = js;

            window.opera.removeEventListener("BeforeScript", arguments.callee, false); // Remove event listener after JavaScript injection.
            window.opera.postError("Google+ Injector: Injected JavaScript and then removed event listener.");
        }
    }

    function injectCssAndHtml()
    {
        if (window.frameElement !== null) // Window is inside a frame or is not top-level.
        {
            return; // Do not inject inside of a non-top-level element.
        }

        handleException(getAvatarLink);

        handleException(injectCss);
        handleException(injectHtml);

        window.removeEventListener("DOMContentLoaded", arguments.callee, false); // Remove event listener after CSS and HTML injection.
        window.opera.postError("Google+ Injector: Injected CSS and HTML and then removed event listener.");
    }

    function handleException(theFunction)
    {
        try
        {
            theFunction();
        }
        catch (exception)
        {
            window.opera.postError(exception);
        }
    }

    window.parent.addEventListener("DOMContentLoaded", injectCssAndHtml, false);

    window.opera.addEventListener("BeforeScript", injectJs, false);
}());