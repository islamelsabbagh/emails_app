sap.ui.define([
    "sap/ui/core/UIComponent",
    "test/app/emailapp/model/models",
    "sap/ui/model/json/JSONModel",
	"sap/f/library"
], (UIComponent, models, JSONModel, fioriLibrary) => {
    "use strict";

    return UIComponent.extend("test.app.emailapp.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // Call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // Set the device model
            this.setModel(models.createDeviceModel(), "device");

            // Set model
            var oModel = new JSONModel();
			this.setModel(oModel);

			// Set customers model on this sample
            var oCustomersModel = new JSONModel("/model/customers.json"); 
			this.setModel(oCustomersModel, 'customers');

            // Enable routing
            var oRouter = this.getRouter();
			oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
			oRouter.initialize();
        },
        _onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getModel(),
				sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, set a default layout (normally OneColumn)
			if (!sLayout) {
				sLayout = fioriLibrary.LayoutType.OneColumn;
			}

			oModel.setProperty("/layout", sLayout);
		}
    });
});