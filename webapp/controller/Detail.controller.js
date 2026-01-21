sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/base/util/deepExtend",
	"sap/m/ColumnListItem",
	"sap/m/Input",
	"sap/m/CheckBox",
	"sap/m/MessageBox"
], function (Controller, deepExtend, ColumnListItem, Input, CheckBox, MessageBox) {
	"use strict";

	return Controller.extend("test.app.emailapp.controller.Detail", {
		onInit: function () {
			var oOwnerComponent = this.getOwnerComponent();

			this.oRouter = oOwnerComponent.getRouter();
			this.oModel = oOwnerComponent.getModel("customers");
			this.oTable = this.byId("emailsTable");

			this.oRouter.getRoute("master").attachPatternMatched(this._onCustomerMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onCustomerMatched, this);
		},

		_onCustomerMatched: function (oEvent) {
			// First check if there is no changes left from the previous customer
			if (this.aEmailsList && this.aEmailsList.length !== 0) {
				this.oModel.setProperty(this.sBindingPath, this.aEmailsList);
				this.aEmailsList = [];
			}
			this._customer = oEvent.getParameter("arguments").customer || this._customer || "0";
			this.getView().bindElement({
				path: "/CustomersCollection/" + this._customer,
				model: "customers"
			});
			this.oReadOnlyTemplate ? this.oReadOnlyTemplate : this.oReadOnlyTemplate = this.oTable.removeItem(0);
			this._rebindTable(this.oReadOnlyTemplate, "Navigation");
			this._setEditable(false);
			this.oEditableTemplate = new ColumnListItem({
				cells: [
					new Input({
						value: "{customers>emailAddress}",
						type: "Email"
					}), 
					new CheckBox({
						selected: "{customers>default}",
						select: this.onSelectDefault.bind(this),
						editable: "{=!${customers>default}}"
					}).data("emailID", "{customers>ordinalNumber}"),
					new Input({
						value: "{customers>remark}"
					})
				]
			});
		},

		_rebindTable: function(oTemplate, sKeyboardMode) {
			this.oTable.bindItems({
				path: "customers>emailAddresses",
				template: oTemplate,
				templateShareable: true,
				key: "ordinalNumber"
			});
		},

		_setEditable: function(bIsEditable) {
			this.byId("editButton").setVisible(!bIsEditable);
			this.byId("createButton").setVisible(bIsEditable);
			this.byId("saveButton").setVisible(bIsEditable);
			this.byId("cancelButton").setVisible(bIsEditable);
			var sTableMode = bIsEditable ? "Delete" : "None";
			this.byId("emailsTable").setMode(sTableMode);
		},

		onEdit: function() {
			this._setEditable(true);
			this.sBindingPath = "/CustomersCollection/" + this._customer + "/emailAddresses/";
			this.aEmailsList = deepExtend([], this.oModel.getProperty(this.sBindingPath));
			this._rebindTable(this.oEditableTemplate, "Edit");
		},

		onCreate: function() {
			var emailID = this.aEmailsList.length + 1;
			var aEmailsList = deepExtend([], this.oModel.getProperty(this.sBindingPath));
			aEmailsList.push({
				"ordinalNumber": emailID,
                "default": false,
                "emailAddress": ""
			});
			this.oModel.setProperty(this.sBindingPath, aEmailsList);
			this._rebindTable(this.oEditableTemplate, "Edit");
		},

		onSave: function() {
			this._setEditable(false);
			this._rebindTable(this.oReadOnlyTemplate, "Navigation");
			this.aEmailsList = [];
		},

		onCancel: function() {
			this._setEditable(false);
			this.oModel.setProperty(this.sBindingPath, this.aEmailsList);
			this._rebindTable(this.oReadOnlyTemplate, "Navigation");
			this.aEmailsList = [];
		},

		onSelectDefault: function(oEvent) {
			var bSelected = oEvent.getParameter("selected");
			var oSource = oEvent.getSource();
			var emailID = oSource.data("emailID");
			var aEmailsList = deepExtend([], this.oModel.getProperty(this.sBindingPath));
			// Only one default is allowed
			aEmailsList.map(element => {
				if (element.ordinalNumber != emailID) {
					element.default = !bSelected;
				}
			});
			this.oModel.setProperty(this.sBindingPath, aEmailsList);
			this._rebindTable(this.oEditableTemplate, "Edit");
		},

		onDelete: function(oEvent) {
			var oSource = oEvent.getSource();
			var	oItem = oEvent.getParameter("listItem");
			var oItemData = oItem.getBindingContext("customers").getObject();
			var bIsDefault = oItemData.default;
			if (bIsDefault) {
				MessageBox.information("The default email address cannot be deleted.", {title: "Action Not Allowed"});
			} else {
				var	sPath = oItem.getBindingContext("customers").getPath();
				var sEmailPath = parseInt(sPath.split("/").slice(-1).pop(), 10);

				// After deletion put the focus back to the list
				oSource.attachEventOnce("updateFinished", oSource.focus, oSource);

				// Delete the item from the model
				var aEmailsList = deepExtend([], this.oModel.getProperty(this.sBindingPath));
				aEmailsList.splice(sEmailPath, 1);
				this.oModel.setProperty(this.sBindingPath, aEmailsList);
				this._rebindTable(this.oEditableTemplate, "Edit");
			}
		},

		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onCustomerMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onCustomerMatched, this);
		}
	});
});