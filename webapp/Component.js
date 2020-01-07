sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/upl/GRWRTPO/model/models",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("com.sap.upl.GRWRTPO.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			var oModel = new JSONModel({
				busy: false,
				enablePo: true,
				visiblePoData: false,
				editablePOData: true,
				enablePost: false,
				enableAddLineItem: false,
				enableDeleteLineItem: false,
				lineItemData: [],
				showBatch: false,
				GS1Visible: false,
				GS1Value: "",
				gsPropertyenable: true,
				poquan: ""
			});
			this.setModel(oModel, "settingsModel");
			this.getModel("settingsModel").refresh();
			this.getModel("settingsModel").updateBindings();

			var goodsRecipetData = new JSONModel({
				POSTINGDATE: new Date(),
				PRODUCTDATE: "",
				EBELN: "",
				MATNR: "",
				EBELP: "",
				LGORT: "",
				MENGE: "",
				BATCH: "",
				DESTINATIONBIN: "",
				DESTINATIONSTORAGETYPE: "",
				WERKS: "",
				MEINS: "",
				MAKTX: "",
				DELIERYNOTE: ""
			});
			this.setModel(goodsRecipetData, "goodsRecieptModel");
			this.getModel("goodsRecieptModel").refresh();
			this.getModel("goodsRecieptModel").updateBindings();

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});