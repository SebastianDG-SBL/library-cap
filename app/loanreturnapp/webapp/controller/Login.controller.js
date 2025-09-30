sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("loanreturnapp.controller.Login", {
        onInit() {
        },

        onLoginPress: function () {
            const oView = this.getView();
            const username = oView.byId("username").getValue();
            const passwordInputField = oView.byId("password");
            const password = passwordInputField.getValue();


            console.log(`Attempted login with user: ${username}, pass: ${password}`);

            fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Store user session in Component model
                        this.getOwnerComponent().setUserSession({ username });

                        // Navigate to Main page
                        this.getOwnerComponent().getRouter().navTo("Main");
                    } else {
                        sap.m.MessageToast.show(data.message || "Invalid login");

                        // Clear password field
                        passwordInputField.setValue("");
                    }
                })
                .catch(err => {
                    sap.m.MessageToast.show("Login failed");

                    passwordInputField.setValue("");
                });


        },

        onLogout: function () {
            this.getOwnerComponent().clearUserSession();
            this.getOwnerComponent().getRouter().navTo("Login");
        }

    });
});