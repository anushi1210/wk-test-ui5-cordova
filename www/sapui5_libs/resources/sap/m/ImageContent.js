/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Control','sap/m/Image','sap/ui/core/IconPool','sap/ui/Device','./ImageContentRenderer',"sap/ui/events/KeyCodes"],function(l,C,I,a,D,b,K){"use strict";var c=C.extend("sap.m.ImageContent",{metadata:{library:"sap.m",properties:{src:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},description:{type:"string",group:"Accessibility",defaultValue:null}},defaultAggregation:"_content",aggregations:{_content:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},events:{press:{}}}});c.prototype.onBeforeRendering=function(){var i,u,d;i=this.getAggregation("_content");u=this.getSrc();d=this.getDescription();if(!i||u!==i.getSrc()||d!==i.getAlt()){if(i){i.destroy();i=null;}i=a.createControlByURI({id:this.getId()+"-icon-image",src:u,alt:d,decorative:true},I);this.setAggregation("_content",i,true);this._setPointerOnImage();}if(d){this.setTooltip(d.trim());}};c.prototype._setPointerOnImage=function(){var i=this.getAggregation("_content");if(i&&this.hasListeners("press")){i.addStyleClass("sapMPointer");}else if(i&&i.hasStyleClass("sapMPointer")){i.removeStyleClass("sapMPointer");}};c.prototype.ontap=function(e){if(D.browser.msie){this.$().trigger("focus");}this.firePress();};c.prototype.onkeydown=function(e){if(e.which===K.ENTER||e.which===K.SPACE){this.firePress();e.preventDefault();}};c.prototype.attachEvent=function(e,d,f,g){C.prototype.attachEvent.call(this,e,d,f,g);if(this.hasListeners("press")){this.$().attr("tabindex",0).addClass("sapMPointer");this._setPointerOnImage();}return this;};c.prototype.detachEvent=function(e,f,d){C.prototype.detachEvent.call(this,e,f,d);if(!this.hasListeners("press")){this.$().removeAttr("tabindex").removeClass("sapMPointer");this._setPointerOnImage();}return this;};c.prototype.getAltText=function(){var o=this.getAggregation("_content");if(o&&o.getAlt()!==""){return o.getAlt();}else if(o&&o.getAccessibilityInfo()){return o.getAccessibilityInfo().description;}else{return"";}};return c;});
