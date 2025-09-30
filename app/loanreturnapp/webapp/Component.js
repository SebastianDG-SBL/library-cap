sap.ui.define([
    "sap/ui/core/UIComponent",
    "loanreturnapp/model/models",
    "/sap/ui/model/json/JSONModel"
], (UIComponent, models, JSONModel) => {
    "use strict";

    return UIComponent.extend("loanreturnapp.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },



        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            // device model
            this.setModel(models.createDeviceModel(), "device");

            // User model to hold session info
            this.setModel(new JSONModel({ user: null }), "user");

            const oRouter = this.getRouter();
            oRouter.attachBeforeRouteMatched((oEvent) => {
                const sRouteName = oEvent.getParameter("name");
                const bLoginRoute = sRouteName === "Login";
                const bHasSession = !!this.getModel("user").getProperty("/user");

                const pageExists = !!oRouter.getTargets().getTarget('Target' + sRouteName);

                console.log(`At ${sRouteName}.`);
                console.log("Page exists = ", pageExists);


                if (pageExists) {
                    if (bHasSession) {
                        if (!bLoginRoute) {
                            return;
                        }
                        setTimeout(() => oRouter.navTo("Main", {}, true), 0);
                    }
                    else {
                        if (sRouteName === "Login" || sRouteName === "NotFound") {
                            // If one of the non-protected pages, simply do nothing
                            console.log("Non-protected page");
                            return;
                        }
                        else {
                            console.log("Tried to access auth-only page, now go to login ")
                            setTimeout(() => oRouter.navTo("Login", {}, true), 0);
                        }
                    }
                }
                else {
                    setTimeout(() => oRouter.navTo("NotFound", {}, true), 0);
                }
            });

            oRouter.initialize();
        },

        setUserSession: function (oUser) {
            this.getModel("user").setProperty("/user", oUser);
        },

        clearUserSession: function () {
            this.getModel("user").setProperty("/user", null);
        }
    });
});