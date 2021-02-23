/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/util/createPromise","sap/ui/integration/designtime/baseEditor/propertyEditor/PropertyEditorFactory","sap/ui/integration/designtime/baseEditor/validator/ValidatorRegistry","sap/ui/integration/designtime/baseEditor/PropertyEditors","sap/ui/integration/designtime/baseEditor/util/binding/resolveBinding","sap/ui/integration/designtime/baseEditor/util/binding/ObjectBinding","sap/ui/integration/designtime/baseEditor/util/hasTag","sap/ui/integration/designtime/baseEditor/util/cleanupDesigntimeMetadata","sap/ui/core/Control","sap/ui/model/resource/ResourceModel","sap/base/util/ObjectPath","sap/base/util/each","sap/base/util/deepClone","sap/base/util/deepEqual","sap/base/util/values","sap/base/util/includes","sap/base/util/isPlainObject","sap/base/util/isEmptyObject","sap/base/util/restricted/_intersection","sap/base/util/restricted/_mergeWith","sap/base/util/restricted/_merge","sap/base/util/restricted/_omit","sap/base/util/restricted/_union","sap/base/util/restricted/_isNil","sap/base/util/restricted/_castArray","sap/ui/model/json/JSONModel","sap/base/i18n/ResourceBundle","sap/base/Log","sap/ui/integration/designtime/baseEditor/util/unset"],function(c,P,V,a,r,O,h,b,C,R,d,f,g,i,v,j,k,l,_,m,n,o,p,q,s,J,t,L,u){"use strict";var w="customProperty--";var B=C.extend("sap.ui.integration.designtime.baseEditor.BaseEditor",{metadata:{library:"sap.ui.integration",properties:{"json":{type:"object"},"config":{type:"object",defaultValue:{"i18n":["sap/ui/integration/designtime/baseEditor/i18n/i18n.properties"]}},"designtimeMetadata":{type:"object"},"layout":{type:"string",defaultValue:"list"}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true}},events:{jsonChange:{parameters:{json:{type:"object"}}},designtimeMetadataChange:{parameters:{designtimeMetadata:{type:"object"}}},configChange:{parameters:{config:{type:"object"}}},propertyEditorsReady:{parameters:{propertyEditors:{type:"array"}}}}},constructor:function(){this._oSetConfigPromise=Promise.resolve();this._mObservableConfig={};this._mPropertyEditors={};this._aCancelHandlers=[];this._oDataModel=this._createModel();this._oDesigntimeMetadataModel=this._createModel();this._bInitFinished=false;this._bValidatorsReady=false;this._setReady(false);C.prototype.constructor.apply(this,arguments);this._oDataModel.setData(this._prepareData(this.getJson()));this.attachJsonChange(function(e){var A=e.getParameter("json");this._oDataModel.setData(this._prepareData(A));this._checkReady();},this);},renderer:function(e,A){var D=A.getContent();e.openStart("div",A);e.openEnd();if(D.length){D.forEach(function(E){e.renderControl(E);});}else{A.getPropertyEditorsSync().forEach(function(E){e.renderControl(E);});}e.close("div");}});B.prototype.init=function(){};B.prototype.exit=function(){this._reset();this._oDataModel.destroy();this._oDesigntimeMetadataModel.destroy();};B.prototype._prepareData=function(e){var A=g(e);f(this._mObservableConfig,function(D,E){var F=E.path;if(F[0]==="/"){F=F.substr(1);}if(typeof d.get(F.split("/"),A)==="undefined"&&typeof E.defaultValue!=="undefined"){d.set(F.split("/"),g(E.defaultValue),A);}});return A;};B.prototype.setJson=function(A){var D;if(typeof A==="string"){try{D=JSON.parse(A);}catch(e){L.error("sap.ui.integration.designtime.baseEditor.BaseEditor: invalid JSON string is specified");}}else if(k(A)){D=n({},A);}else{L.error("sap.ui.integration.designtime.baseEditor.BaseEditor: unsupported data type specified in setJson()");}if(D&&JSON.stringify(this.getProperty("json"))!==JSON.stringify(D)){this.setProperty("json",D);this.fireJsonChange({json:D});}};B.prototype.setPreventInitialization=function(e){this._bPreventInitialization=e;};B.prototype.setConfig=function(e,I){this._bIsDefaultConfig=I;e=e||{};this._oSetConfigPromise=this._oSetConfigPromise.then(this._registerPropertyEditorTypes.bind(this,e.propertyEditors)).then(this._setConfig.bind(this,e,I));return this._oSetConfigPromise;};B.prototype._registerPropertyEditorTypes=function(e){P.deregisterAllTypes();return P.registerTypes(e||{});};B.prototype._setConfig=function(e,I,A){this._initValidators(e.validators||{});var T={propertyEditors:{},properties:{}};var N=x(T,e);if(this._oSpecificConfig){N=I?this._oSpecificConfig:z(N,this._oSpecificConfig,A);}N.i18n=p(N.i18n&&s(N.i18n),this.getMetadata().getProperty("config").getDefaultValue().i18n);this.setProperty("config",N,false);this.fireConfigChange({config:g(N)});this.initialize();};B.prototype.addConfig=function(e,I){this._bIsDefaultConfig=I;this._oSetConfigPromise=this._oSetConfigPromise.then(function(){e=x(this.getConfig(),e);return e.propertyEditors;}.bind(this)).then(this._registerPropertyEditorTypes).then(function(A){this._setConfig(e,I,A);}.bind(this));return this._oSetConfigPromise;};function x(T,e){var A=n({},T,e);A.i18n=[].concat(T.i18n||[],e.i18n||[]);return A;}B.prototype._addSpecificConfig=function(S){var e;this._oSetConfigPromise=this._oSetConfigPromise.then(function(){this._oSpecificConfig=S;e=n({},this.getConfig());e.propertyEditors=y(e,S);return e.propertyEditors;}.bind(this)).then(this._registerPropertyEditorTypes).then(function(A){this._setConfig(e,this._bIsDefaultConfig,A);}.bind(this));return this._oSetConfigPromise;};function y(e,S){var A={};var D=e.propertyEditors||{};var E=S.propertyEditors||{};p(Object.keys(D),Object.keys(E)).forEach(function(F){A[F]=E[F]||D[F];});return A;}function z(e,S,A){e.i18n=p(e.i18n,S.i18n);var N=Object.assign({},e,o(S,["properties","i18n","propertyEditors"]),o(e,["properties","i18n","propertyEditors"]));N.properties={};f(e.properties,function(D,E){var F=e.propertyEditors[E.type]&&e.propertyEditors[E.type].split("/").join(".");var G=F&&A[F].configMetadata;if(G&&S.properties[D]){f(E,function(K,T){var H;var M=G[K]&&G[K].mergeStrategy;if(M){if(M==="mostRestrictiveWins"){var I=G[K].mostRestrictiveValue||false;if(T===I){H=I;}else{H=S.properties[D][K];}}else if(M==="intersection"){H=_(T,S.properties[D][K]);}}else{H=T;}N.properties[D]=N.properties[D]||{};N.properties[D][K]=H;});}});return N;}B.prototype.setDesigntimeMetadata=function(D,I){var N=g(D);if(!i(N,this.getDesigntimeMetadata())){this.setProperty("designtimeMetadata",N);this._oDesigntimeMetadataModel.setData(N);if(!I){this.fireDesigntimeMetadataChange({designtimeMetadata:this._formatExportedDesigntimeMetadata(N)});}}};B.prototype._formatExportedDesigntimeMetadata=function(M){var F={};var e=function(A,D){Object.keys(A).forEach(function(K){var E=A[K];if(K==="__value"){F[D.join("/")]=E;}else if(k(E)){e(E,[].concat(D,K));}});};e(M||{},[]);return F;};B.prototype._initValidators=function(e){V.deregisterAllValidators();V.registerValidators(e);V.ready().then(function(){this._bValidatorsReady=true;this._checkReady();}.bind(this));};B.prototype._reset=function(){this._bInitFinished=false;this._setReady(false);this._aCancelHandlers.forEach(function(e){e();});if(this._oI18nModel){this._oI18nModel.destroy();delete this._oI18nModel;}if(this._oConfigObserver){this._oConfigObserver.destroy();}f(this._mPropertyEditors,function(e,A){A.forEach(function(D){this.deregisterPropertyEditor(D,e);},this);}.bind(this));if(this._oRootWrapper){this._oRootWrapper.destroy();}};B.prototype.initialize=function(){if(!this._bPreventInitialization){this._initialize();}};B.prototype._initialize=function(){this._reset();var e=this.getConfig();if(typeof this.getProperty("json")==="undefined"){this.attachEventOnce("jsonChange",this._initialize);return;}if(e){this._oConfigObserver=new O();this._loadI18nBundles(e.i18n).then(function(A){this._oI18nModel=this._createI18nModel(A);this.setModel(this._oI18nModel,"i18n");this._oConfigObserver.addToIgnore(["template","itemLabel"]);this._oConfigObserver.setModel(this._oDataModel);this._oConfigObserver.setModel(this._oDesigntimeMetadataModel,"designtimeMetadata");this._oConfigObserver.setModel(this._oI18nModel,"i18n");var D=this._getContextPath();if(D){this._oConfigObserver.setModel(this._oDataModel,"context");this._oConfigObserver.setBindingContext(this._oDataModel.getContext(D),"context");}var E=r(e.properties,{"i18n":this._oI18nModel});this._mObservableConfig=Object.assign(this._mObservableConfig,this._prepareConfig(E));this._oConfigObserver.setObject(this._mObservableConfig);this._oConfigObserver.attachChange(this._onConfigChange,this);var F=this.getContent();if(F.length===0||F.length===1&&F[0]===this._oRootWrapper){this.removeAllContent();this._createEditors(this._oConfigObserver.getObject());}this._bInitFinished=true;this._checkReady();}.bind(this));}};B.prototype._onConfigChange=function(e){var A=e.getParameter("changes").reduce(function(E,F){var G=g(F);G.path=G.path.split("/");G.propertyKey=G.path.shift();if(!E[G.propertyKey]){E[G.propertyKey]=[];}E[G.propertyKey].push(G);return E;},{});var D=Object.keys(A).reduce(function(E,F){var G=(this.getPropertyEditorsByNameSync(F)||[]).map(function(H){return{editor:H,propertyName:F};});E=E.concat(G);return E;}.bind(this),[]);var I=D.filter(function(E){return!this._oRootWrapper||!j(this._oRootWrapper._aEditorWrappers,E.editor);}.bind(this));I.forEach(function(E){var F=E.propertyName;var G=e.getSource().getObject();var H=o(g(G[F]),"value");var K=false;var N=A[F]||[];N.forEach(function(Q){if(Q.path[0]==="value"){E.editor.setValue(Q.value);}else{d.set(Q.path,Q.value,H);K=true;}});if(K){E.editor.setConfig(H);}});if(I.length<D.length){var M=g(this._oRootWrapper.getConfig()).map(function(E){var F=A[E.__propertyName]||[];F.forEach(function(G){d.set(G.path,G.value,E);});return E;});this._oRootWrapper.setConfig(M);}};B.prototype._createModel=function(){var M=new J();M.setDefaultBindingMode("OneWay");return M;};B.prototype.getI18nProperty=function(N,e){if(this.getModel("i18n")){return this.getModel("i18n").getResourceBundle().getText(N,e);}return N;};B.prototype._loadI18nBundles=function(e){return this._createPromise(function(A,D){Promise.all(e.map(function(I){return new Promise(function(A,E){t.create({url:sap.ui.require.toUrl(I),async:true}).then(A,E);});})).then(A,D);});};B.prototype._createI18nModel=function(e){var A=e.slice();var I=new R({bundle:A.shift()});I.setDefaultBindingMode("OneWay");A.forEach(function(D){I.enhance(D);});return I;};B.prototype._prepareConfig=function(e){var A={};f(e,function(K,D){A[K]=Object.assign({},this._preparePropertyConfig(D),{__propertyName:K});}.bind(this));return A;};B.prototype._preparePropertyConfig=function(e){var A=this._getContextPath();if(A&&!A.endsWith("/")){A=A+"/";}var D=e.path;if(!D.startsWith("/")&&A){D=A+D;}return Object.assign({},e,{path:D,value:"{"+D+"}",designtime:"{designtimeMetadata>"+D+"}"});};B.prototype._createEditors=function(e){var A=d.get(["layout",this.getLayout()],this.getConfig());if(k(A)||Array.isArray(A)){A=r(A,{"i18n":this._oI18nModel});}this._oRootWrapper=new a({config:v(e),layout:this.getLayout(),layoutConfig:A});this.addContent(this._oRootWrapper);return(Promise.all(v(this._mPropertyEditors).reduce(function(D,E){return D.concat(E);},[]).map(function(D){return D.ready();})).then(this._checkReady.bind(this)));};B.prototype._getRegistrationKey=function(e,K){if(typeof K!=="string"){if(e.isA("sap.ui.integration.designtime.baseEditor.PropertyEditor")&&!e.getConfig()&&!e.getBindingInfo("config")&&e.getPropertyName()){K=e.getPropertyName();}else{K=w+e.getId();}}return K;};B.prototype._addCustomProperty=function(K,e){var A=Object.assign({},this._mObservableConfig);A[K]=this._preparePropertyConfig(e);this._mObservableConfig=A;this._oConfigObserver.setObject(A);};B.prototype._removeCustomProperty=function(K){var e=o(this._mObservableConfig,K);this._mObservableConfig=e;this._oConfigObserver.setObject(e);};B.prototype.registerPropertyEditor=function(e,K){K=this._getRegistrationKey(e,K);var A=Array.isArray(this._mPropertyEditors[K])?this._mPropertyEditors[K]:[];this._mPropertyEditors[K]=A.concat(e);if(K.startsWith(w)){this._addCustomProperty(K,e.getConfig());}var D=d.get([K],this._oConfigObserver.getObject()).value;e.setValue(D);e.attachValueChange(this._onValueChange,this);e.attachDesigntimeMetadataChange(this._onDesigntimeMetadataChange,this);e.attachReady(this._checkReady,this);};B.prototype.deregisterPropertyEditor=function(e,K){K=this._getRegistrationKey(e,K);var A=this._mPropertyEditors[K];if(K.startsWith(w)){this._removeCustomProperty(K);}e.detachValueChange(this._onValueChange,this);e.detachDesigntimeMetadataChange(this._onDesigntimeMetadataChange,this);if(Array.isArray(A)){this._mPropertyEditors[K]=A.filter(function(I){return e!==I;});if(this._mPropertyEditors[K].length===0){delete this._mPropertyEditors[K];}}};B.prototype._setReady=function(e){var A=this._bIsReady;this._bIsReady=e;if(A!==true&&e===true){this.firePropertyEditorsReady({propertyEditors:this.getPropertyEditorsSync()});}};B.prototype._checkReady=function(){var e=this.getContent().filter(function(E){return(E.isA("sap.ui.integration.designtime.baseEditor.PropertyEditors")||E.isA("sap.ui.integration.designtime.baseEditor.propertyEditor.BasePropertyEditor"));});e.forEach(function(E){if(!sap.ui.base.EventProvider.hasListener(E,"ready",this._checkReady,this)){E.attachReady(this._checkReady,this);}},this);var A=[].concat(e,this.getPropertyEditorsSync());var I=(this._bInitFinished&&this._bValidatorsReady&&A.every(function(E){return E.isReady();}));this._setReady(I);};B.prototype.isReady=function(){return this._bIsReady;};B.prototype.ready=function(){return new Promise(function(e){if(this.isReady()){e();}else{this.attachEventOnce("propertyEditorsReady",e);}}.bind(this));};B.prototype._createPromise=function(e){var A=c(e);this._aCancelHandlers.push(A.cancel);var D=function(E,F){this._aCancelHandlers=this._aCancelHandlers.filter(function(e){return e!==E;});return F;}.bind(this,A.cancel);return A.promise.then(D,D);};B.prototype.getPropertyConfigByName=function(e){return o(d.get([e],this._oConfigObserver.getObject()),"value");};B.prototype.getPropertyEditorsByName=function(e){return new Promise(function(A){if(!this._mPropertyEditors||Object.keys(this._mPropertyEditors).length===0){this.attachEventOnce("propertyEditorsReady",A);}else{A();}}.bind(this)).then(function(){return this.getPropertyEditorsByNameSync(e);}.bind(this));};B.prototype.getPropertyEditorsByNameSync=function(e){var A=this._mPropertyEditors[e];return Array.isArray(A)&&A.slice()||null;};B.prototype.getPropertyEditorsByTag=function(T){return new Promise(function(e){if(!this._mPropertyEditors||Object.keys(this._mPropertyEditors).length===0){this.attachEventOnce("propertyEditorsReady",e);}else{e();}}.bind(this)).then(function(){return this.getPropertyEditorsByTagSync(T);}.bind(this));};B.prototype.getConfigsByTag=function(T){var e=this.getConfig().properties;return Object.keys(e).filter(function(A){return h(e[A],T);}).map(function(A){return e[A];});};B.prototype.getPropertyEditorsByTagSync=function(T){return this.getPropertyEditorsSync().filter(function(e){return h(e.getConfig(),T);});};B.prototype.getPropertyEditorsSync=function(){return v(this._mPropertyEditors).reduce(function(e,A){return e.concat(A);},[]).sort(function(e,A){return parseInt(e.getId().match(/\d+$/))-parseInt(A.getId().match(/\d+$/));});};B.prototype.getJson=function(){return n({},this.getProperty("json"));};B.prototype.getDesigntimeMetadata=function(){return n({},this.getProperty("designtimeMetadata"));};B.prototype._getContextPath=function(){var e=this.getConfig();var A=e&&e.context||null;if(A&&A[0]!=="/"){A="/"+A;}return A;};B.prototype._onValueChange=function(e){var A=e.getSource();var D=e.getParameter("path");var E=this.getJson()||{};var F=e.getParameter("value");if(D[0]==="/"){D=D.substr(1);}else{throw new Error("BaseEditor._onValueChange: unknown relative path - '"+D+"'");}var G=D.split("/");d.set(G,F,E);if(typeof F==="undefined"||i(F,A.getRuntimeConfig().defaultValue)||Array.isArray(F)&&F.length===0||k(F)&&l(F)){u(E,G);}this.setJson(E);};B.prototype._onDesigntimeMetadataChange=function(e){var A=e.getParameter("path");var D=this.getDesigntimeMetadata()||{};var E=e.getParameter("value");if(A[0]==="/"){A=A.substr(1);}else{throw new Error("BaseEditor._onDesigntimeMetadataChange: unknown relative path - '"+A+"'");}var F=A.split("/");d.set(F,E,D);b(D);this.setDesigntimeMetadata(D);};return B;});