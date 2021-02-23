/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/library","../ActionToolbar","sap/m/Title","sap/m/OverflowToolbarButton","sap/m/OverflowToolbarToggleButton","sap/ui/mdc/chart/ChartTypeButton","sap/ui/mdc/chart/ChartSettings"],function(M,A,T,O,a,C,b){"use strict";var c=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");var d={createToolbar:function(o,u){u=u||[];if(!o.getAggregation("_toolbar")){var t=new A(o.getId()+"--toolbar",{design:"Transparent",begin:[new T(o.getId()+"-title",{text:o.getHeader()})],actions:u});o.setAggregation("_toolbar",t);this.updateToolbar(o);}},updateToolbar:function(o){var t=o.getAggregation("_toolbar");if(!t){return;}t.destroyEnd();if(!o.getIgnoreToolbarActions().length||o.getIgnoreToolbarActions().indexOf(M.ChartToolbarActionType.ZoomInOut)){var i=o.getAggregation("_chart"),z,Z;z=new O({tooltip:c.getText("chart.TOOLBAR_ZOOM_IN"),icon:"sap-icon://zoom-in",enabled:"{= ${$mdcChart>/_chart/getZoomInfo/enabled} && ${$mdcChart>/_chart/getZoomInfo/currentZoomLevel} < 1}",press:function f(e){this.handleZoomIn(i,z,Z);}.bind(this)});Z=new O({tooltip:c.getText("chart.TOOLBAR_ZOOM_OUT"),icon:"sap-icon://zoom-out",enabled:"{= ${$mdcChart>/_chart/getZoomInfo/enabled} && ${$mdcChart>/_chart/getZoomInfo/currentZoomLevel} > 0}",press:function f(e){this.handleZoomOut(i,z,Z);}.bind(this)});t.addEnd(z);t.addEnd(Z);if(i){i.attachRenderComplete(function g(e){var f=i.getZoomInfo();this.handleInnerChartRenderCompleted(f,z,Z);},this);}}if(!o.getIgnoreToolbarActions().length||o.getIgnoreToolbarActions().indexOf(M.ChartToolbarActionType.DrillDownUp)<0){o._oDrillDownBtn=new O(o.getId()+"-drillDown",{icon:"sap-icon://drill-down",tooltip:c.getText("chart.CHART_DRILLDOWN_TITLE"),press:[o._showDrillDown,o]});t.addEnd(o._oDrillDownBtn);}if(!o.getIgnoreToolbarActions().length||o.getIgnoreToolbarActions().indexOf(M.ChartToolbarActionType.Legend)<0){t.addEnd(new a({type:"Transparent",text:c.getText("chart.LEGENDBTN_TEXT"),tooltip:c.getText("chart.LEGENDBTN_TOOLTIP"),icon:"sap-icon://legend",pressed:"{$mdcChart>/legendVisible}"}));}var p=o.getP13nMode()||[];if(p.indexOf("Item")>-1){t.addEnd(new O(o.getId()+"-chart_settings",{icon:"sap-icon://action-settings",tooltip:c.getText('chart.PERSONALIZATION_DIALOG_TITLE'),press:function(e){var s=e.getSource();o._getPropertyData().then(function(P){b.showPanel(o,"Chart",s,P);});}}));}if(p.indexOf("Sort")>-1){t.addEnd(new O(o.getId()+"-sort_settings",{icon:"sap-icon://sort",tooltip:c.getText('sort.PERSONALIZATION_DIALOG_TITLE'),press:function(e){var s=e.getSource();o._getPropertyData().then(function(P){b.showPanel(o,"Sort",s,P);});}}));}if(p.indexOf("Type")>-1){t.addEnd(new C(o));}},handleInnerChartRenderCompleted:function(z,Z,o){this.toggleZoomButtonsEnabledState(z,Z,o);},handleZoomIn:function(i,z,Z){i.zoom({direction:"in"});var o=i.getZoomInfo();this.toggleZoomButtonsEnabledState(o,z,Z);},handleZoomOut:function(i,z,Z){i.zoom({direction:"out"});var o=i.getZoomInfo();this.toggleZoomButtonsEnabledState(o,z,Z);},toggleZoomButtonsEnabledState:function(z,Z,o){var v=z.currentZoomLevel;if(v==null){Z.setEnabled(false);o.setEnabled(false);return;}if(v===0){Z.setEnabled(true);o.setEnabled(false);if(o.getFocusDomRef()===document.activeElement){Z.focus();}return;}if(v===1){o.setEnabled(true);Z.setEnabled(false);if(Z.getFocusDomRef()===document.activeElement){o.focus();}return;}Z.setEnabled(true);o.setEnabled(true);}};return d;});
