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
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            // set model
            var oModel = new JSONModel();
			this.setModel(oModel);

			// set customers model on this sample
            var oCustomersModel = new JSONModel("/model/customers.json"); 
            //oCustomersModel.loadData("./model/customers.json", false);
			//oCustomersModel = new JSONModel(sap.ui.require.toUrl('sap/ui/demo/mock/products.json'));
			//oCustomersModel.setSizeLimit(1000);
			this.setModel(oCustomersModel, 'customers');

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