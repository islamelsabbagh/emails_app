sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/f/library"
], (Controller, Filter, FilterOperator, Sorter, fioriLibrary) => {
    "use strict";

    return Controller.extend("test.app.emailapp.controller.Master", {
        onInit: function () {
			this.oView = this.getView();
			this._bDescendingSort = false;
			this.oCustomersTable = this.oView.byId("customersTable");
			this.oRouter = this.getOwnerComponent().getRouter();
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("accountName", FilterOperator.Contains, sQuery)];
			}

			this.oCustomersTable.getBinding("items").filter(oTableSearchState, "Application");
		},

		onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oCustomersTable.getBinding("items"),
				oSorter = new Sorter("accountName", this._bDescendingSort);

			oBinding.sort(oSorter);
		},

		onListItemPress: function (oEvent) {
			var oCustomer = oEvent.getSource();
			var sCustomerPath = oCustomer.getBindingContext("customers").getPath();
			var sCustomerID = sCustomerPath.split("/").slice(-1).pop();

			this.oRouter.navTo("detail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, customer: sCustomerID});
		}
    });
});