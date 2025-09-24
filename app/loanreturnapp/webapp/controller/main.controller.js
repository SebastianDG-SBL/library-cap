sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("loanreturnapp.controller.main", {
        onInit() {
        },

        onReturnBooksPress: function () {

            console.log("Going to returns portal!");
        },

        onCreateLoanPress: function () {

            console.log("going to loans portal!");
        }
    });
});