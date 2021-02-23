sap.ui.define([
        "sap/ui/core/mvc/Controller"
    ],
    function (AbstractController) {
        "use strict";

        return AbstractController.extend("ui5app.controller.Login", {

            /**
             * @memberOf controller.Login
             */
            onInit: function () {

            },

            handleRouteMatched: function (evt) {
                if (!this._checkRoute(evt, "login"))
                    return;
            },

        });
    });