/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["test/app/emailapp/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
