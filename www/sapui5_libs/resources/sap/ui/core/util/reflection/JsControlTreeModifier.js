/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/BindingParser","./BaseTreeModifier","./XmlTreeModifier","sap/base/util/ObjectPath","sap/ui/util/XMLHelper","sap/base/util/merge","sap/ui/core/Fragment"],function(B,a,X,O,b,m,F){"use strict";var J={targets:"jsControlTree",setVisible:function(c,v){if(c.setVisible){this.unbindProperty(c,"visible");c.setVisible(v);}else{throw new Error("Provided control instance has no setVisible method");}},getVisible:function(c){if(c.getVisible){return c.getVisible();}else{throw new Error("Provided control instance has no getVisible method");}},setStashed:function(c,s){s=!!s;if(c.unstash){if(c.isStashed()===true&&s===false){c=c.unstash();}if(c.setVisible){this.setVisible(c,!s);}return c;}else{throw new Error("Provided control instance has no unstash method");}},getStashed:function(c){if(c.isStashed){return c.isStashed()?c.isStashed():!this.getVisible(c);}throw new Error("Provided control instance has no isStashed method");},bindProperty:function(c,p,v){c.bindProperty(p,v);},unbindProperty:function(c,p){if(c){c.unbindProperty(p,true);}},setProperty:function(c,p,P){var M=c.getMetadata().getPropertyLikeSetting(p);var o;var e;this.unbindProperty(c,p);try{o=B.complexParser(P,undefined,true);}catch(d){e=true;}if(M){if(this._isSerializable(P)){if(o&&typeof o==="object"||e){P=this._escapeCurlyBracketsInString(P);}var s=M._sMutator;c[s](P);}else{throw new TypeError("Value cannot be stringified","sap.ui.core.util.reflection.JsControlTreeModifier");}}},getProperty:function(c,p){var M=c.getMetadata().getPropertyLikeSetting(p);if(M){var P=M._sGetter;return c[P]();}},isPropertyInitial:function(c,p){return c.isPropertyInitial(p);},setPropertyBinding:function(c,p,P){this.unbindProperty(c,p);var s={};s[p]=P;c.applySettings(s);},getPropertyBinding:function(c,p){return c.getBindingInfo(p);},createAndAddCustomData:function(c,C,v,A){var o=this.createControl("sap.ui.core.CustomData",A);this.setProperty(o,"key",C);this.setProperty(o,"value",v);this.insertAggregation(c,"customData",o,0);},createControl:function(c,A,v,s,S,d){var e;if(this.bySelector(s,A)){e="Can't create a control with duplicated ID "+(s.id||s);if(d){return Promise.reject(e);}throw new Error(e);}if(d){return new Promise(function(r,R){sap.ui.require([c.replace(/\./g,"/")],function(C){var i=this.getControlIdBySelector(s,A);r(new C(i,S));}.bind(this),function(){R(new Error("Required control '"+c+"' couldn't be created asynchronously"));});}.bind(this));}var C=O.get(c);if(!C){throw new Error("Can't create a control because the matching class object has not yet been loaded. Please preload the '"+c+"' module");}var i=this.getControlIdBySelector(s,A);return new C(i,S);},applySettings:function(c,s){c.applySettings(s);},_byId:function(i){return sap.ui.getCore().byId(i);},getId:function(c){return c.getId();},getParent:function(c){return c.getParent&&c.getParent();},getControlMetadata:function(c){return c&&c.getMetadata();},getControlType:function(c){return c&&c.getMetadata().getName();},setAssociation:function(p,n,i){var M=p.getMetadata().getAssociation(n);M.set(p,i);},getAssociation:function(p,n){var M=p.getMetadata().getAssociation(n);return M.get(p);},getAllAggregations:function(p){return p.getMetadata().getAllAggregations();},getAggregation:function(p,n){var A=this.findAggregation(p,n);if(A){return p[A._sGetter]();}},insertAggregation:function(p,n,o,i){if(n==="customData"){p.insertAggregation(n,o,i,true);}else{var A=this.findAggregation(p,n);if(A){if(A.multiple){var I=i||0;p[A._sInsertMutator](o,I);}else{p[A._sMutator](o);}}}},removeAggregation:function(c,n,o){if(n==="customData"){c.removeAggregation(n,o,true);}else{var A=this.findAggregation(c,n);if(A){c[A._sRemoveMutator](o);}}},removeAllAggregation:function(c,n){if(n==="customData"){c.removeAllAggregation(n,true);}else{var A=this.findAggregation(c,n);if(A){c[A._sRemoveAllMutator]();}}},getBindingTemplate:function(c,A){var o=c.getBindingInfo(A);return o&&o.template;},updateAggregation:function(c,A){var o=this.findAggregation(c,A);if(o){c[o._sDestructor]();c.updateAggregation(A);}},findIndexInParentAggregation:function(c){var p=this.getParent(c),C;if(!p){return-1;}C=this.getAggregation(p,this.getParentAggregationName(c));if(Array.isArray(C)){return C.indexOf(c);}else{return 0;}},getParentAggregationName:function(c){return c.sParentAggregationName;},findAggregation:function(c,A){if(c){if(c.getMetadata){var M=c.getMetadata();var o=M.getAllAggregations();if(o){return o[A];}}}},validateType:function(c,A,p,f){var t=A.type;if(A.multiple===false&&this.getAggregation(p,A.name)&&this.getAggregation(p,A.name).length>0){return false;}return this._isInstanceOf(c,t)||this._hasInterface(c,t);},instantiateFragment:function(f,n,v){var o=b.parse(f);o=this._checkAndPrefixIdsInFragment(o,n);var N;var i=v&&v.getId();var c=v.getController();N=sap.ui.xmlfragment({fragmentContent:o,sId:i},c);if(!Array.isArray(N)){N=[N];}return N;},templateControlFragment:function(f,p,v){return a._templateFragment(f,p).then(function(o){var c=(v&&v.getController())||undefined;return F.load({definition:o,controller:c});});},destroy:function(c,s){c.destroy(s);},_getFlexCustomData:function(c,t){var C=typeof c==="object"&&typeof c.data==="function"&&c.data("sap-ui-custom-settings");return O.get(["sap.ui.fl",t],C);},attachEvent:function(o,e,f,d){var c=O.get(f);if(typeof c!=="function"){throw new Error("Can't attach event because the event handler function is not found or not a function.");}o.attachEvent(e,d,c);},detachEvent:function(o,e,f){var c=O.get(f);if(typeof c!=="function"){throw new Error("Can't attach event because the event handler function is not found or not a function.");}o.detachEvent(e,c);},bindAggregation:function(c,A,o){c.bindAggregation(A,o);},unbindAggregation:function(c,A){c.unbindAggregation(A);},getExtensionPointInfo:function(e,v){var V=(v._xContent)?v._xContent:v;var E=X.getExtensionPointInfo(e,V);if(E){E.index--;E.parent=E.parent&&this._byId(v.createId(E.parent.getAttribute("id")));E.defaultContent=E.defaultContent.map(function(n){var i=v.createId(n.getAttribute("id"));return this._byId(i);}.bind(this)).filter(function(c){return!!c;});}return E;}};return m({},a,J);},true);
