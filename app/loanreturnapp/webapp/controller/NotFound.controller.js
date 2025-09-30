sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("loanreturnapp.controller.NotFound", {
        onGoToLogin: function () {
            console.log("pressed");
            this.getOwnerComponent().getRouter().navTo("Login");
        }
    });
});
