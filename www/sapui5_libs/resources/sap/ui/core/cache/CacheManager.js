/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./LRUPersistentCache','./CacheManagerNOP','sap/ui/Device',"sap/base/Log","sap/ui/performance/Measurement",'sap/ui/performance/trace/Interaction'],function(L,C,D,a,M,I){"use strict";var b={_instance:null,_getInstance:function(){var p,o=d("_getInstance"),t=this;p=new Promise(function(r,e){var f;a.debug("Cache Manager: Initialization...");if(!b._instance){f=t._findImplementation();M.start(c,"CM",S);f.init().then(g,e);M.end(c,"CM");}else{g(b._instance);}function g(h){b._instance=h;o.endAsync();a.debug("Cache Manager initialized with implementation ["+b._instance.name+"], resolving _getInstance promise");r(h);}});o.endSync();return p;},_findImplementation:function(){if(i()&&this._isSupportedEnvironment()){return L;}else{a.warning("UI5 Cache Manager is switched off");return C;}},set:function(k,v){var p,o=d("set",k);a.debug("Cache Manager: Setting value of type["+typeof v+"] with key ["+k+"]");p=this._callInstanceMethod("set",arguments).then(function e(){a.debug("Cache Manager: Setting key ["+k+"] completed successfully");o.endAsync();},function(e){a.error("Cache Manager: Setting key ["+k+"] failed. Error:"+e);o.endAsync();throw e;});o.endSync();return p;},get:function(k){var p,f=I.notifyAsyncStep(),o=d("get",k);a.debug("Cache Manager: Getting key ["+k+"]");p=this._callInstanceMethod("get",arguments).then(function e(v){a.debug("Cache Manager: Getting key ["+k+"] done");o.endAsync();return v;},function(e){a.debug("Cache Manager: Getting key ["+k+"] failed. Error: "+e);o.endAsync();throw e;}).finally(f);o.endSync();return p;},has:function(k){var p,o=d("has",k);a.debug("Cache Manager: has key ["+k+"] called");p=this._callInstanceMethod("has",arguments).then(function e(r){o.endAsync();a.debug("Cache Manager: has key ["+k+"] returned "+r);return r;});o.endSync();return p;},del:function(k){var p,o=d("del",k);a.debug("Cache Manager: del called.");p=this._callInstanceMethod("del",arguments).then(function e(){a.debug("Cache Manager: del completed successfully.");o.endAsync();},function(e){a.debug("Cache Manager: del failed. Error: "+e);o.endAsync();throw e;});o.endSync();return p;},reset:function(){var p,o=d("reset");a.debug("Cache Manager: Reset called.");p=this._callInstanceMethod("reset",arguments).then(function e(){a.debug("Cache Manager: Reset completed successfully.");o.endAsync();},function(e){a.debug("Cache Manager: Reset failed. Error: "+e);o.endAsync();throw e;});o.endSync();return p;},_switchOff:function(){var t=this;return Promise.resolve().then(function(){s(t);sap.ui.getCore().getConfiguration().setUI5CacheOn(false);});},_switchOn:function(){var t=this;return Promise.resolve().then(function(){var o=sap.ui.getCore().getConfiguration();if(!o.isUI5CacheOn()){s(t);sap.ui.getCore().getConfiguration().setUI5CacheOn(true);}return Promise.resolve();});},_callInstanceMethod:function(e,A){var p,f="[sync ] _callInstanceMethod";M.start(f,"CM",S);if(this._instance){a.debug("Cache Manager: calling instance...");return this._instance[e].apply(this._instance,A);}a.debug("Cache Manager: getting instance...");p=this._getInstance().then(function h(g){return g[e].apply(g,A);});M.end(f);return p;},_isSupportedEnvironment:function(){var e=[];if(this._bSupportedEnvironment==undefined){e.push({system:D.system.SYSTEMTYPE.DESKTOP,browserName:D.browser.BROWSER.CHROME,browserVersion:49});e.push({system:D.system.SYSTEMTYPE.DESKTOP,browserName:D.browser.BROWSER.INTERNET_EXPLORER,browserVersion:11});e.push({system:D.system.SYSTEMTYPE.DESKTOP,browserName:D.browser.BROWSER.EDGE,browserVersion:80});e.push({system:D.system.SYSTEMTYPE.DESKTOP,browserName:D.browser.BROWSER.SAFARI,browserVersion:13});e.push({system:D.system.SYSTEMTYPE.TABLET,browserName:D.browser.BROWSER.SAFARI,browserVersion:13});e.push({system:D.system.SYSTEMTYPE.PHONE,browserName:D.browser.BROWSER.SAFARI,browserVersion:13});e.push({system:D.system.SYSTEMTYPE.TABLET,os:D.os.OS.ANDROID,browserName:D.browser.BROWSER.CHROME,browserVersion:80});e.push({system:D.system.SYSTEMTYPE.PHONE,os:D.os.OS.ANDROID,browserName:D.browser.BROWSER.CHROME,browserVersion:80});this._bSupportedEnvironment=e.some(function(o){var f=D.system[o.system],g=o.os?o.os===D.os.name:true,h=o.browserName===D.browser.name,j=D.browser.version>=o.browserVersion;try{return f&&g&&h&&j&&window.indexedDB;}catch(k){return false;}});}return this._bSupportedEnvironment;}};var S="CacheManager",c="[sync ] _initImplementation",m=0;function i(){return sap.ui.getCore().getConfiguration().isUI5CacheOn();}function s(e){if(e._instance){e._instance._destroy();e._instance=null;}}function d(o,k){m++;var e="[async]  "+o+"["+k+"]- #"+(m),f="[sync ]  "+o+"["+k+"]- #"+(m);M.start(e,"CM",[S,o]);M.start(f,"CM",[S,o]);return{sMeasureAsync:e,sMeasureSync:f,endAsync:function(){M.end(this.sMeasureAsync);},endSync:function(){M.end(this.sMeasureSync);}};}return b;});
