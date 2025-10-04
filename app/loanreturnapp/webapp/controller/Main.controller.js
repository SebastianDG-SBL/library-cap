sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("loanreturnapp.controller.Main", {
        onInit() {

        },

        onReturnBooksPress: function () {

            console.log("Going to returns portal!");
            this.getOwnerComponent().getRouter().navTo("Return");

        },

        onCreateLoanPress: function () {

            console.log("going to loans portal!");
            this.getOwnerComponent().getRouter().navTo("Borrow");
        }
    });
});