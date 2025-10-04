sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("loanreturnapp.controller.Return", {
        onInit() {

            const oTable = this.byId("loanItemsTable");
            oTable.attachSelectionChange(this.onSelectionChange.bind(this));

        },


        onContinuePress: async function () {
            const oView = this.getView();
            const continueButton = oView.byId("continueButton"), returnArea = oView.byId("returnArea"), inputArea = oView.byId("memberIDInput");

            // Disable continue button until after the attempt to load is complete
            continueButton.setEnabled(false);
            inputArea.setEnabled(false);

            const memberID = inputArea.getValue().trim();



            try {
                if (!memberID) {
                    throw new Error("meep");
                }
                const oModel = oView.getModel();

                console.log("trying with memberID = ", memberID);

                console.log("metadataPromise:", oModel.metadataPromise);
                console.log("sServiceUrl:", oModel.sServiceUrl);
                console.log("isBindingMode:", oModel.getDefaultBindingMode());

                //Ensure metadataLoaded
                await oModel.metadataPromise;

                console.log("Metadata loaded.");


                // Correct way in V4: create a context binding
                const oContext = oModel.bindContext(`/Customers(ID='${memberID}')`);

                await oContext.requestObject(); // fetch data

                const oData = oContext.getBoundContext().getObject();


                console.log("Member found: ", oData);

                // Store current member ID
                this.currentMemberID = memberID;

                this.buildTable(memberID);

                // Show return area
                returnArea.setVisible(true);

            }
            catch (error) {
                console.log(error);
                sap.m.MessageToast.show("Member ID not found");
                inputArea.setValue("");
                inputArea.setEnabled(true);
                continueButton.setEnabled(true);
            }

        },

        buildTable: function (memberID) {
            const oView = this.getView();
            const oTable = oView.byId("loanItemsTable");
            const oModel = oView.getModel();
            console.log("Checkpoint1", oModel);
            // Clear any previous binding
            oTable.unbindItems();
            oTable.removeAllItems();
            // Create a template for the ColumnListItem
            const oTemplate = new sap.m.ColumnListItem({
                type: "Active",
                cells: [
                    new sap.m.Text({ text: "{loan/ID}" }),
                    new sap.m.Text({ text: "{book/ID}" }),
                    new sap.m.Text({ text: "{book/title}" }),
                    new sap.m.Text({ text: "{book/author}" }),
                    new sap.m.Text({ text: "{loan/loanDate}" }),
                    new sap.m.Text({ text: "{= ${returnDate} ? ${returnDate} : 'N/A'}" })
                ]
            });

            // Bind aggregation using V4 syntax
            oTable.bindAggregation("items", {
                path: `/LoanItems`,
                parameters: {
                    $expand: "loan,book",
                    $apply: `filter(loan/loanee/ID eq '${memberID}')` // optional filtering in backend
                },
                template: oTemplate,
                sorter: new sap.ui.model.Sorter("returnDate", false)
            });
            console.log("Checkpoint4");

            // Enable returnBooks button only if selection is made
            oTable.attachSelectionChange(() => {
                const aSelected = oTable.getSelectedItems();
                oView.byId("returnBooksBtn").setEnabled(aSelected.length > 0);
            });
            console.log("Checkpoint5");
        },

        destroyTable: function () {
            const oView = this.getView();
            const oTable = oView.byId("loanItemsTable");

            // Unbind items and remove existing rows
            oTable.unbindItems();
            oTable.removeAllItems();

            // Disable Return button
            oView.byId("returnBooksBtn").setEnabled(false);
        },



        onSwitchMember: function () {
            const oView = this.getView();

            // Hide the current member area
            oView.byId("returnArea").setVisible(false);

            // Clear table / header if needed
            oView.byId("memberHeader").setText("");
            oView.byId("loanItemsTable").getBinding("items").filter([]); // clear filters

            // Clear stored memberID
            this.currentMemberID = null;

            this.destroyTable();

            // Re-enable and clear input
            const oMemberInput = oView.byId("memberIDInput");
            oMemberInput.setEnabled(true);
            oMemberInput.setValue("");
            oView.byId("continueButton").setEnabled(true);
        },

        onSelectionChange: function () {
            const oTable = this.byId("loanItemsTable");
            const aSelectedItems = oTable.getSelectedItems();
            this.byId("returnBooksBtn").setEnabled(aSelectedItems.length > 0);
        },

        onReturnBooks: function () {
            const oTable = this.byId("loanItemsTable");
            const selectedItems = oTable.getSelectedItems();

            if (selectedItems.length === 0) {
                MessageToast.show("No selected items. Unable to return.");
                return;
            }

            const allSelectedData = oTable.getSelectedContexts().map(cntx => cntx.getObject());
            const bookIDs = allSelectedData.map(item => item.book);
            const member = this.currentMemberID;


            this.getOwnerComponent().getModel().callFunction("/returnLoanItems", {
                method: "POST",
                urlParameters: {
                    loanee_ID: member,
                    books: bookIDs
                },
                success: () => {
                    sap.m.MessageToast.show("Books returned successfully");
                    oTable.getBinding("items").refresh(); // table will update automatically
                },
                error: (err) => {
                    sap.m.MessageToast.show("Failed to return books");
                    console.error(err);
                }
            });


        },

        onBackToMain: function () {
            this.getOwnerComponent().getRouter().navTo("Main");
        }

    });
});