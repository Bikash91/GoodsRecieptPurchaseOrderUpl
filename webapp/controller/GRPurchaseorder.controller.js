sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (Controller, MessageBox, JSONModel, Device) {
	"use strict";

	return Controller.extend("com.sap.upl.GRWRTPO.controller.GRPurchaseorder", {

		data: [],
		poNumber: "",
		onlyNumber: function (element) {
			element.attachBrowserEvent("keydown", (function (e) {
				var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
				var isCursorMoveOrDeleteAction = ([46, 8, 37, 38, 39, 40, 9].indexOf(e.keyCode) !== -1);
				var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >= 96 && e.keyCode <= 105);
				var vKey = 86,
					cKey = 67,
					aKey = 65;
				switch (true) {
				case isCursorMoveOrDeleteAction:
				case isModifierkeyPressed === false && isNumKeyPressed:
				case (e.metaKey || e.ctrlKey) && ([vKey, cKey, aKey].indexOf(e.keyCode) !== -1):
					break;
				default:
					e.preventDefault();
				}
			}));
		},
		onlyQuantity: function (element) {
			element.attachBrowserEvent("keydown", (function (e) {
				var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
				var isCursorMoveOrDeleteAction = ([46, 8, 37, 38, 39, 40, 9, 190].indexOf(e.keyCode) !== -1);
				var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >= 96 && e.keyCode <= 105);
				var vKey = 86,
					cKey = 67,
					aKey = 65;
				switch (true) {
				case isCursorMoveOrDeleteAction:
				case isModifierkeyPressed === false && isNumKeyPressed:
				case (e.metaKey || e.ctrlKey) && ([vKey, cKey, aKey].indexOf(e.keyCode) !== -1):
					break;
				default:
					e.preventDefault();
				}
			}));
		},
		onAfterRendering: function () {
			jQuery.sap.delayedCall(400, this, function () {
				this.byId("idPo").focus();
			});
			this.onlyNumber(this.byId("idPo"));
			this.onlyQuantity(this.byId("quant"));

			this.byId("manFactureDate").addEventDelegate({
				onAfterRendering: function () {
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#' + oID).attr("disabled", "disabled");
				}
			}, this.byId("manFactureDate"));
			var data = new JSONModel({
				results: []
			});
			this.getOwnerComponent().setModel(data, "poItemData");
			this.getOwnerComponent().getModel("poItemData").refresh();
			this.getOwnerComponent().getModel("poItemData").updateBindings();
			this.byId("manFactureDate").setMaxDate(new Date());
		},
		onInit: function () {
			jQuery.sap.delayedCall(400, this, function () {
				this.byId("idPo").focus();
			});
			this.byId("manFactureDate").addEventDelegate({
				onAfterRendering: function () {
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#' + oID).attr("disabled", "disabled");
				}
			}, this.byId("manFactureDate"));

			/*if (this.getOwnerComponent().getModel("device").getData().system.phone) {
				this.path = "/sap/fiori/zgrwrtpo/" + this.getOwnerComponent().getModel("soundModel").sServiceUrl +
					"/SoundFileSet('sapmsg1.mp3')/$value";
			} else {
				this.path = "https://gwaas-ae7888026.hana.ondemand.com/odata/SAP/ZUPL_SOUND_SRV;v=1/SoundFileSet('sapmsg1.mp3')/$value";
			}*/

			this.path = "/sap/fiori/zgrwrtpo/" + this.getOwnerComponent().getModel("soundModel").sServiceUrl +
				"/SoundFileSet('sapmsg1.mp3')/$value";

			var data = new JSONModel({
				results: []
			});
			this.getOwnerComponent().setModel(data, "poItemData");
			this.getOwnerComponent().getModel("poItemData").refresh();
			this.getOwnerComponent().getModel("poItemData").updateBindings();
			this.byId("manFactureDate").setMaxDate(new Date());
		},

		handleValueHelpRequest: function (oEvent) {
			this.sInputValue = oEvent.getSource();
			this.inputIdMat = oEvent.getSource().getId().split("--")[1];
			var oPath = oEvent.getSource().getBindingInfo("suggestionItems").path;
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"com.sap.upl.GRWRTPO.fragments.SearchHelp",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}
			this._setListBinding(oPath, this.inputIdMat);
			this._valueHelpDialog.open();
		},

		_setListBinding: function (oPath, idInput) {

			switch (idInput) {
			case "storLoc":
				this.id = "storLoc";
				this.title = "STORAGELOCATION";
				this.desc = "DESCRIPTION";
				this.text = "Storage Location";
				break;
			case "destinBin":
				this.id = "destinBin";
				this.title = "DESTINATIONBIN";
				this.desc = "WERKS";
				this.text = "Destination Bin";
				break;
			default:
				return;
			}
			var oTemplate = new sap.m.StandardListItem({
				title: "{" + this.title + "}",
				description: "{" + this.desc + "}"
			});

			var aTempFlter = [];
			aTempFlter.push(new sap.ui.model.Filter([
					new sap.ui.model.Filter("WERKS", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("goodsRecieptModel").getProperty(
						"/WERKS"))
				],
				true));
			this._valueHelpDialog.bindAggregation("items", oPath, oTemplate);
			this._valueHelpDialog.getBinding("items").filter(aTempFlter);

			this._valueHelpDialog.setTitle(this.text);
		},

		onOk: function (oEvent) {
			debugger;
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.sKey = oSelectedItem.getTitle();
				if (this.id === "storLoc") {
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty(
						"/LGORT", this.sKey);
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("destinBin").focus();
					});
				} else if (this.id === "destinBin") {
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty(
						"/DESTINATIONBIN", this.sKey);
					jQuery.sap.delayedCall(400, this, function () {
						document.activeElement.blur();
					});
				}
			}
			this.sInputValue.setValueStateText("");
			this.sInputValue.setValueState("None");

			// var POSTINGDATE = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/POSTINGDATE");
			var BATCH = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/BATCH");
			var MEINS = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/MEINS");
			var POQUANTITY = this.getOwnerComponent().getModel("settingsModel").getProperty("/poquan");
			var MENGE = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/MENGE");
			var LGORT = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/LGORT");
			var WERKS = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/WERKS");
			var MATNR = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/MATNR");
			var EBELP = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/EBELP");
			var DESTINATIONBIN = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/DESTINATIONBIN");
			var EBELN = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/EBELN");
			var PRODUCTDATE = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/PRODUCTDATE");
			if ((MEINS != "" && POQUANTITY != "" && MENGE != "" && LGORT != "" && WERKS !== "" && MATNR != "" &&
					EBELP != "" && DESTINATIONBIN != "" && EBELN != "" && PRODUCTDATE !== "") && (BATCH != "" || BATCH == "")) {
				debugger;
				this.checkAllFields(BATCH, MEINS, POQUANTITY, MENGE, LGORT, WERKS, MATNR, EBELP, DESTINATIONBIN, EBELN);
			}
		},

		_handleValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = [];
			if (sValue) {
				oFilter.push(new sap.ui.model.Filter([
						new sap.ui.model.Filter("WERKS", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("goodsRecieptModel").getProperty(
							"/WERKS")),
						new sap.ui.model.Filter(this.title, sap.ui.model.FilterOperator.Contains, sValue)
					],
					true));
				evt.getSource().getBinding("items").filter(oFilter);
			} else {
				oFilter.push(new sap.ui.model.Filter([
						new sap.ui.model.Filter("WERKS", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("goodsRecieptModel").getProperty(
							"/WERKS"))
					],
					true));
				evt.getSource().getBinding("items").filter(oFilter);
			}

		},

		onmaterialData: function (value) {
			var audio = new Audio(this.path);
			if (value != "") {
				this.byId("materialCode").setValueState("None");
			} else {
				this.byId("materialCode").setValueState("Error");
				return;
			}
			var count = 0;
			var index = 0;
			for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].MATNR != this.byId("materialCode").getValue()) {
					count++;
				} else {
					index = i;
					break;
				}
			}

			if (count == this.data.length) {
				this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
				audio.play();

				if (this.getOwnerComponent().getModel("settingsModel").getProperty("/GS1Value") != "") {
					jQuery.sap.delayedCall(5000, this, function () {
						this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
						MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("materialnotexist"), {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							contentWidth: "100px",
							onClose: function (oAction) {
								if (oAction == "OK" || oAction == "CANCEL" || oAction == "CLOSE") {
									jQuery.sap.delayedCall(400, this, function () {
										this.byId("gs1").focus();
									});

									this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", "");
									this.getOwnerComponent().getModel("settingsModel").setProperty("/gsPropertyenable", true);
									this.getOwnerComponent().getModel("settingsModel").setProperty("/poquan", "");
									this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);

									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/EBELN", this.byId("idPo").getValue());
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MATNR", "");
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/EBELP", "");
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/LGORT", "");
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MAKTX", "");
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/WERKS", "");
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MEINS", "");
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MENGE", "");
								}
							}.bind(this)
						});
					});
				} else {
					jQuery.sap.delayedCall(5000, this, function () {
						this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
						MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("materialnotexist"), {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							contentWidth: "100px",
							onClose: function (oAction) {
								if (oAction == "OK" || oAction == "CANCEL" || oAction == "CLOSE") {
									jQuery.sap.delayedCall(400, this, function () {
										this.byId("materialCode").focus();
									});

									this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", "");
									this.getOwnerComponent().getModel("settingsModel").setProperty("/gsPropertyenable", true);
									this.getOwnerComponent().getModel("settingsModel").setProperty("/poquan", "");
									this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);

									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/EBELN", this.byId("idPo").getValue());
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MATNR", "");
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/EBELP", "");
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/LGORT", "");
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MAKTX", "");
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/WERKS", "");
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MEINS", "");
									this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MENGE", "");
								}
							}.bind(this)
						});
					});
				}

			} else {
				/*jQuery.sap.delayedCall(400, this, function () {
					this.byId("batch").focus();
				});*/
				if (this.getOwnerComponent().getModel("settingsModel").getProperty("/GS1Value") != "") {
					this.checkBatchManagaed(value, index);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/LGORT", this.data[index].LGORT);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/EBELP", this.data[index].EBELP);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/WERKS", this.data[index].WERKS);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MEINS", this.data[index].MEINS);
					this.getOwnerComponent().getModel("settingsModel").setProperty("/poquan", this.data[index].MENGE);
				} else {
					this.checkBatchManagaed(value, index);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MATNR", this.byId("materialCode").getValue());
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/EBELP", this.data[index].EBELP);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/LGORT", this.data[index].LGORT);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MAKTX", this.data[index].MAKTX);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/WERKS", this.data[index].WERKS);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MEINS", this.data[index].MEINS);
					this.getOwnerComponent().getModel("settingsModel").setProperty("/poquan", this.data[index].MENGE);
				}

			}
		},

		onPoFocus: function (oEvt) {
			if (oEvt.getSource().getValue() != "") {
				oEvt.getSource().setValueState("None");
			}
			this.clearField(this.byId("idItem").getContent());
			var count = this.getFormField(this.byId("idPurchase").getContent());
			if (count > 0) {
				MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("fillallmandatory"));
				return;
			}
			this.onClickPoData();

		},

		/*onAfterFetchingPONumber: function (oEvt) {
			if (oEvt.getSource().getValue() != "") {
				this.getOwnerComponent().getModel("settingsModel").setProperty("/visiblePoData", true);
			} else {
				this.getOwnerComponent().getModel("settingsModel").setProperty("/visiblePoData", false);
			}
			for (var key in this.getOwnerComponent().getModel("goodsRecieptModel").getData()) {
				if (key != "POSTINGDATE") {
					this.getOwnerComponent().getModel("goodsRecieptModel").getData()[key] = "";
				}
			}
			this.getOwnerComponent().getModel("poItemData").getData().results = [];
			this.getOwnerComponent().getModel("poItemData").refresh();
			this.getOwnerComponent().getModel("poItemData").updateBindings();

			if (oEvt.getSource().getValue() != "") {
				oEvt.getSource().setValueState("None");
			}
			this.clearField(this.byId("idItem").getContent());
		},*/

		addLineItem: function () {
			debugger;
			var count = 0;
			var goodsRecipetData = null;
			var audio = new Audio(this.path);
			count = this.getFormField(this.byId("idPurchase").getContent());
			if (count > 0) {
				MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("fillallmandatory"));
				return;
			}

			count = this.getFormField(this.byId("idItem").getContent());
			if (count > 0) {
				MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("fillallmandatory"));
				return;
			}

			if (parseFloat(this.getOwnerComponent().getModel(
					"goodsRecieptModel").getData().MENGE) <= 0) {
				/*audio.onloadedmetadata = function () {
					audio.play();
					MessageBox.error("Please provide valid quantity.");
				};*/
				this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
				audio.play();
				jQuery.sap.delayedCall(5000, this, function () {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("providequan"), {
						icon: MessageBox.Icon.ERROR,
						title: "Error",
						contentWidth: "100px",
						onClose: function (oAction) {
							this.byId("quant").focus();
						}.bind(this)
					});

				});
				return;
			}
			var quantity = 0;
			var updatedQuan = 0;
			var length = this.getOwnerComponent().getModel("poItemData").getProperty("/results").length;
			var tableitem = this.getOwnerComponent().getModel("poItemData").getProperty("/results");
			var MATNR = this.getOwnerComponent().getModel(
				"goodsRecieptModel").getData().MATNR;
			var BATCH = this.getOwnerComponent().getModel(
				"goodsRecieptModel").getData().BATCH;
			var DESTINATIONBIN = this.getOwnerComponent().getModel(
				"goodsRecieptModel").getData().DESTINATIONBIN;
			var LGORT = this.getOwnerComponent().getModel(
				"goodsRecieptModel").getData().LGORT;
			var MENGE = this.getOwnerComponent().getModel(
				"goodsRecieptModel").getData().MENGE;
			if (length > 0) {
				for (var i = 0; i < this.data.length; i++) {
					if (MATNR == this.data[i].MATNR) {
						for (var k = 0; k < tableitem.length; k++) {
							if (MATNR == tableitem[k].MATNR && BATCH == tableitem[k].BATCH && DESTINATIONBIN == tableitem[k].DESTINATIONBIN &&
								LGORT == tableitem[k].LGORT) {

								for (var l = 0; l < tableitem.length; l++) {
									if (MATNR == tableitem[l].MATNR) {
										quantity = quantity + parseFloat(tableitem[l].MENGE);
									}
								}
								quantity = quantity + parseFloat(MENGE);
								for (var m = 0; m < tableitem.length; m++) {
									if (MATNR == tableitem[m].MATNR && BATCH == tableitem[m].BATCH && DESTINATIONBIN == tableitem[m].DESTINATIONBIN &&
										LGORT == tableitem[m].LGORT) {
										updatedQuan = updatedQuan + parseFloat(tableitem[m].MENGE);
									}
								}
								updatedQuan = updatedQuan + parseFloat(MENGE);
								if (MATNR == this.data[i].MATNR && quantity <= parseFloat(this.data[i].MENGE)) {
									this.getOwnerComponent().getModel("poItemData").getData().results[k].MENGE = updatedQuan;
									this.getOwnerComponent().getModel("poItemData").refresh();
									this.getOwnerComponent().getModel("poItemData").updateBindings();
									this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);
									this.getOwnerComponent().getModel("settingsModel").setProperty("/poquan", "");

									if (this.getOwnerComponent().getModel("settingsModel").getProperty("/GS1Value") !== "") {
										this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", "");
										this.getOwnerComponent().getModel("settingsModel").setProperty("/gsPropertyenable", true);
										jQuery.sap.delayedCall(400, this, function () {
											this.byId("gs1").focus();
										});
									} else {
										jQuery.sap.delayedCall(400, this, function () {
											this.byId("materialCode").focus();
										});
									}

									goodsRecipetData = new JSONModel({
										POSTINGDATE: new Date(),
										PRODUCTDATE: "",
										EBELN: this.poNumber,
										MATNR: "",
										EBELP: "",
										LGORT: "",
										MENGE: "",
										BATCH: "",
										DESTINATIONBIN: "",
										// DESTINATIONSTORAGETYPE: "",
										WERKS: "",
										MEINS: "",
										MAKTX: "",
										DELIERYNOTE: this.byId("idDelNote").getValue()
									});
									this.getOwnerComponent().setModel(goodsRecipetData, "goodsRecieptModel");
									this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
									this.getOwnerComponent().getModel("goodsRecieptModel").updateBindings();
								} else {
									this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
									audio.play();
									jQuery.sap.delayedCall(5000, this, function () {
										MessageBox.error(MATNR + this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("quanExeed"), {
											icon: MessageBox.Icon.ERROR,
											title: "Error",
											contentWidth: "100px",
											onClose: function (oAction) {
												if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
													this.byId("materialCode").focus();
													goodsRecipetData = new JSONModel({
														POSTINGDATE: new Date(),
														PRODUCTDATE: "",
														EBELN: this.poNumber,
														MATNR: "",
														EBELP: "",
														LGORT: "",
														MENGE: "",
														BATCH: "",
														DESTINATIONBIN: "",
														// DESTINATIONSTORAGETYPE: "",
														WERKS: "",
														MEINS: "",
														MAKTX: "",
														DELIERYNOTE: this.byId("idDelNote").getValue()
													});
													this.getOwnerComponent().setModel(goodsRecipetData, "goodsRecieptModel");
													this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
													this.getOwnerComponent().getModel("goodsRecieptModel").updateBindings();
												}
											}.bind(this)
										});
									});
								}
								return;
							}
						}
						for (var j = 0; j < tableitem.length; j++) {
							if (MATNR != tableitem[j].MATNR || BATCH != tableitem[j].BATCH || DESTINATIONBIN != tableitem[j].DESTINATIONBIN ||
								LGORT != tableitem[j].LGORT) {
								for (var k = 0; k < tableitem.length; k++) {
									if (MATNR == tableitem[k].MATNR) {
										quantity = quantity + parseFloat(tableitem[k].MENGE);
									}
								}
								quantity = quantity + parseFloat(MENGE);

								if (MATNR == this.data[i].MATNR && quantity <= parseFloat(this.data[i].MENGE)) {
									this.getOwnerComponent().getModel("poItemData").getData().results.push(this.getOwnerComponent().getModel("goodsRecieptModel")
										.getData());
									this.getOwnerComponent().getModel("poItemData").refresh();
									this.getOwnerComponent().getModel("poItemData").updateBindings();
									this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);
									this.getOwnerComponent().getModel("settingsModel").setProperty("/poquan", "");
									if (this.getOwnerComponent().getModel("settingsModel").getProperty("/GS1Value") !== "") {
										this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", "");
										this.getOwnerComponent().getModel("settingsModel").setProperty("/gsPropertyenable", true);
										jQuery.sap.delayedCall(400, this, function () {
											this.byId("gs1").focus();
										});
									} else {
										jQuery.sap.delayedCall(400, this, function () {
											this.byId("materialCode").focus();
										});
									}
									goodsRecipetData = new JSONModel({
										POSTINGDATE: new Date(),
										PRODUCTDATE: "",
										EBELN: this.poNumber,
										MATNR: "",
										EBELP: "",
										LGORT: "",
										MENGE: "",
										BATCH: "",
										DESTINATIONBIN: "",
										// DESTINATIONSTORAGETYPE: "",
										WERKS: "",
										MEINS: "",
										MAKTX: "",
										DELIERYNOTE: this.byId("idDelNote").getValue()
									});
									this.getOwnerComponent().setModel(goodsRecipetData, "goodsRecieptModel");
									this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
									this.getOwnerComponent().getModel("goodsRecieptModel").updateBindings();
								} else {
									this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
									audio.play();
									jQuery.sap.delayedCall(5000, this, function () {
										MessageBox.error(MATNR + this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("quanExeed"), {
											icon: MessageBox.Icon.ERROR,
											title: "Error",
											contentWidth: "100px",
											onClose: function (oAction) {
												if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
													this.byId("materialCode").focus();
													goodsRecipetData = new JSONModel({
														POSTINGDATE: new Date(),
														PRODUCTDATE: "",
														EBELN: this.poNumber,
														MATNR: "",
														EBELP: "",
														LGORT: "",
														MENGE: "",
														BATCH: "",
														DESTINATIONBIN: "",
														// DESTINATIONSTORAGETYPE: "",
														WERKS: "",
														MEINS: "",
														MAKTX: "",
														DELIERYNOTE: this.byId("idDelNote").getValue()
													});
													this.getOwnerComponent().setModel(goodsRecipetData, "goodsRecieptModel");
													this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
													this.getOwnerComponent().getModel("goodsRecieptModel").updateBindings();
												}
											}.bind(this)
										});
									});
								}
								return;
							}
						}
					}
				}
			} else {
				var materialValid = false;
				quantity = parseFloat(this.getOwnerComponent().getModel("goodsRecieptModel").getData().MENGE);
				for (var j = 0; j < this.data.length; j++) {
					if (this.data[j].MATNR == MATNR && quantity <= parseFloat(this.data[j].MENGE)) {
						materialValid = true;
					}
				}
				if (materialValid === false) {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
					audio.play();
					jQuery.sap.delayedCall(5000, this, function () {
						MessageBox.error(MATNR + this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("quanExeed"), {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							contentWidth: "100px",
							onClose: function (oAction) {
								this.byId("materialCode").focus();
								this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
								goodsRecipetData = new JSONModel({
									POSTINGDATE: new Date(),
									PRODUCTDATE: "",
									EBELN: this.poNumber,
									MATNR: "",
									EBELP: "",
									LGORT: "",
									MENGE: "",
									BATCH: "",
									DESTINATIONBIN: "",
									// DESTINATIONSTORAGETYPE: "",
									WERKS: "",
									MEINS: "",
									MAKTX: "",
									DELIERYNOTE: this.byId("idDelNote").getValue()
								});
								this.getOwnerComponent().setModel(goodsRecipetData, "goodsRecieptModel");
								this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
								this.getOwnerComponent().getModel("goodsRecieptModel").updateBindings();
							}.bind(this)
						});
					});

				} else {
					this.getOwnerComponent().getModel("poItemData").getData().results.push(this.getOwnerComponent().getModel("goodsRecieptModel").getData());
					this.getOwnerComponent().getModel("poItemData").refresh();
					this.getOwnerComponent().getModel("poItemData").updateBindings();
					this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);
					this.getOwnerComponent().getModel("settingsModel").setProperty("/poquan", "");
					if (this.getOwnerComponent().getModel("settingsModel").getProperty("/GS1Value") !== "") {
						this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", "");
						this.getOwnerComponent().getModel("settingsModel").setProperty("/gsPropertyenable", true);
						jQuery.sap.delayedCall(400, this, function () {
							this.byId("gs1").focus();
						});
					} else {
						jQuery.sap.delayedCall(400, this, function () {
							this.byId("materialCode").focus();
						});
					}
					goodsRecipetData = new JSONModel({
						POSTINGDATE: new Date(),
						PRODUCTDATE: "",
						EBELN: this.poNumber,
						MATNR: "",
						EBELP: "",
						LGORT: "",
						MENGE: "",
						BATCH: "",
						DESTINATIONBIN: "",
						// DESTINATIONSTORAGETYPE: "",
						WERKS: "",
						MEINS: "",
						MAKTX: "",
						DELIERYNOTE: this.byId("idDelNote").getValue()
					});
					this.getOwnerComponent().setModel(goodsRecipetData, "goodsRecieptModel");
					this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
					this.getOwnerComponent().getModel("goodsRecieptModel").updateBindings();
				}
			}

			this.getOwnerComponent()
				.getModel("settingsModel").setProperty("/enableDeleteLineItem", true);

			if (this.getOwnerComponent().getModel("poItemData").getProperty("/results").length > 0) {
				this.getOwnerComponent().getModel("settingsModel").setProperty("/enablePost", true);
			} else {
				this.getOwnerComponent().getModel("settingsModel").setProperty("/enablePost", false);
			}

			/*goodsRecipetData = new JSONModel({
				POSTINGDATE: new Date(),
				PRODUCTDATE: "",
				EBELN: this.poNumber,
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
				DELIERYNOTE: this.byId("idDelNote").getValue()
			});
			this.getOwnerComponent().setModel(goodsRecipetData, "goodsRecieptModel");*/
		},
		onClickPoData: function () {
			var count = this.getFormField(this.byId("idPurchase").getContent());
			if (count > 0) {
				MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("allmandatory"));
				return;
			}
			if (this.byId("idPo").getValue() == "") {
				MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("providepurnumber"), {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					contentWidth: "100px",
					onClose: function (oAction) {
						if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
							jQuery.sap.delayedCall(400, this, function () {
								this.byId("idPo").focus();
							});
						}
					}.bind(this)
				});
				return;
			}

			this.poNumber = this.byId("idPo").getValue();
			var path = "/POHEADERSet('" + this.byId("idPo").getValue() + "')";
			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			this.getOwnerComponent().getModel().read(path, {
				urlParameters: {
					$expand: 'NAVPOHEADERTOITEM'
				},
				success: function (oData, oResponse) {
					this.data = oData.NAVPOHEADERTOITEM.results;

					if (oData.GS1INDICATOR == "X") {
						this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Visible", true);
						jQuery.sap.delayedCall(400, this, function () {
							this.getView().byId("gs1").focus();
						});

					} else {
						this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Visible", false);
						jQuery.sap.delayedCall(400, this, function () {
							this.getView().byId("materialCode").focus();
						});
					}

					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/EBELN", oData.EBELN);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/POSTINGDATE", new Date());

					this.getOwnerComponent().getModel("settingsModel").setProperty("/visiblePoData", true);

					for (var key in this.getOwnerComponent().getModel("goodsRecieptModel").getData()) {
						if (key != "EBELN" && key != "POSTINGDATE" && key != "DELIERYNOTE") {
							this.getOwnerComponent().getModel("goodsRecieptModel").getData()[key] = "";
						}
					}
					this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
					this.getOwnerComponent().getModel("goodsRecieptModel").updateBindings();

					var data = new JSONModel({
						results: []
					});
					this.getOwnerComponent().setModel(data, "poItemData");
					this.getOwnerComponent().getModel("poItemData").refresh();
					this.getOwnerComponent().getModel("poItemData").updateBindings();

					this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);
				}.bind(this),
				error: function (error) {
					jQuery.sap.delayedCall(5000, this, function () {
						jQuery.sap.delayedCall(400, this, function () {
							this.byId("idPo").focus();
						});
						this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
						this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/EBELN", "");
						this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
						this.getOwnerComponent().getModel("goodsRecieptModel").updateBindings();
						this.getOwnerComponent().getModel("settingsModel").setProperty("/visiblePoData", false);
						this.data = [];
					});

					this.getErrorDetails(error, this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("unablepurchaseorder"));

				}.bind(this)
			});
		},

		onDeleteLineItem: function (oEvent) {
			this.getOwnerComponent().getModel("poItemData").getProperty("/results").splice(oEvent.getSource().getId().split("-")[oEvent.getSource()
				.getId().split("-").length - 1], 1);
			this.getOwnerComponent().getModel("poItemData").refresh();
			jQuery.sap.delayedCall(400, this, function () {
				this.getView().byId("materialCode").focus();
			});

			if (this.getOwnerComponent().getModel("poItemData").getProperty("/results").length > 0) {
				this.getOwnerComponent().getModel("settingsModel").setProperty("/enablePost", true);
			} else {
				this.getOwnerComponent().getModel("settingsModel").setProperty("/enablePost", false);
			}
		},

		onChangeManufacturingDate: function (oEvt) {
			if (oEvt.getSource().getValue() != "") {
				oEvt.getSource().setValueState("None");
			}

			var count;
			count = this.getFormField(this.byId("idPurchase").getContent());
			if (count > 0) {
				MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("fillallmandatory"));
				return;
			}

			count = this.getFormField(this.byId("idItem").getContent());
			if (count > 0) {
				MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("fillallmandatory"));
				return;
			} else {
				// var POSTINGDATE = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/POSTINGDATE");
				var BATCH = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/BATCH");
				var MEINS = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/MEINS");
				var POQUANTITY = this.getOwnerComponent().getModel("settingsModel").getProperty("/poquan");
				var MENGE = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/MENGE");
				var LGORT = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/LGORT");
				var WERKS = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/WERKS");
				var MATNR = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/MATNR");
				var EBELP = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/EBELP");
				var DESTINATIONBIN = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/DESTINATIONBIN");
				var EBELN = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/EBELN");
				var PRODUCTDATE = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/PRODUCTDATE");
				if ((MEINS != "" && POQUANTITY != "" && MENGE != "" && LGORT != "" && WERKS !== "" && MATNR != "" &&
						EBELP != "" && DESTINATIONBIN != "" && EBELN != "" && PRODUCTDATE !== "") && (BATCH != "" || BATCH == "")) {
					debugger;
					this.checkAllFields(BATCH, MEINS, POQUANTITY, MENGE, LGORT, WERKS, MATNR, EBELP, DESTINATIONBIN, EBELN);
				}
			}
		},
		onCheckField: function (oEvt) {
			debugger;
			if (oEvt.getSource().getValue() != "") {
				oEvt.getSource().setValueState("None");
			}

			if (oEvt.getSource().getName() == "Batch") {
				this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/BATCH", oEvt.getSource().getValue().toUpperCase());
				if (this.byId("plant").getValue() != "") {
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("quant").focus();
					});
				} else {
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("plant").focus();
					});
				}
			} else if (oEvt.getSource().getName() == "GS1") {
				var qrData = oEvt.getSource().getValue();
				if (oEvt.getSource().getValue() != "") {
					this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", oEvt.getSource().getValue());
					//qrData = qrData.split("(").join("/").split(")").join("/").split("/");
					qrData = qrData.split("(").join("-:-").split(")").join("-:-").split("-:-");
					var obj = {
						"241": "",
						"240": "",
						"30": "",
						"10": ""
					};
					for (var i = 0; i < qrData.length; i++) {
						if (qrData[i] == '241') {
							obj["241"] = qrData[i + 1];
						} else if (qrData[i] == '240') {
							obj["240"] = qrData[i + 1];
						} else if (qrData[i] == '30') {
							obj["30"] = qrData[i + 1];
						} else if (qrData[i] == '10' && qrData[i - 2] == '30') {
							if (qrData[i + 1] == undefined) {
								obj["10"] = "";
							} else {
								obj["10"] = qrData[i + 1];
							}

						}
					}
					if (obj["241"] == "" || obj["30"] == "") {
						jQuery.sap.delayedCall(400, this, function () {
							MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("invalidQRCode"), {
								icon: MessageBox.Icon.ERROR,
								title: "Error",
								contentWidth: "100px",
								onClose: function (oAction) {
									if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
										this.byId("gs1").focus();
										this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", "");
										this.getOwnerComponent().getModel("settingsModel").refresh();
									}
								}.bind(this)
							});
						});
						return;
					}
					this.QRmaterial = obj["241"];
					this.QRquantity = obj["30"];
					this.QRmatDes = obj["240"];
					this.QRbatch = obj["10"];

					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MATNR", this.QRmaterial);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/BATCH", this.QRbatch);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MENGE", this.QRquantity);
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MAKTX", this.QRmatDes);
					this.getOwnerComponent().getModel("settingsModel").setProperty("/gsPropertyenable", false);
					this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
					this.getOwnerComponent().getModel("goodsRecieptModel").updateBindings();
					this.onmaterialData(this.QRmaterial);
				} else {
					this.QRmaterial = "";
					this.QRquantity = "";
					this.QRmatDes = "";
					this.QRbatch = "";
					this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", oEvt.getSource().getValue());
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MATNR", "");
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/BATCH", "");
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MENGE", "");
					this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MAKTX", "");
					this.getOwnerComponent().getModel("settingsModel").setProperty("/gsPropertyenable", true);
					this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
					this.getOwnerComponent().getModel("goodsRecieptModel").updateBindings();
				}
			} else if (oEvt.getSource().getName() == "DestinationBin") {
				this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/DESTINATIONBIN", oEvt.getSource().getValue().toUpperCase());
				jQuery.sap.delayedCall(400, this, function () {
					document.activeElement.blur();
				});
			} else if (oEvt.getSource().getName() == "storageLocation") {
				this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/LGORT", oEvt.getSource().getValue().toUpperCase());
				jQuery.sap.delayedCall(400, this, function () {
					this.byId("destinBin").focus();
				});
			} else if (oEvt.getSource().getName() == "plant") {
				this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/WERKS", oEvt.getSource().getValue().toUpperCase());
				jQuery.sap.delayedCall(400, this, function () {
					this.byId("quant").focus();
				});
			} else if (oEvt.getSource().getName() == "ItemNo") {
				/*jQuery.sap.delayedCall(400, this, function () {
					this.byId("batch").focus();
				});*/
			} else if (oEvt.getSource().getName() == "Quantity") {
				if (this.byId("storLoc").getValue() != "") {
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("destinBin").focus();
					});
				} else {
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("storLoc").focus();
					});
				}
			} else if (oEvt.getSource().getName() == "MatNo") {
				this.onmaterialData(oEvt.getSource().getValue());
			}
			this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
			debugger;
			// var POSTINGDATE = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/POSTINGDATE");
			var BATCH = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/BATCH");
			var MEINS = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/MEINS");
			var POQUANTITY = this.getOwnerComponent().getModel("settingsModel").getProperty("/poquan");
			var MENGE = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/MENGE");
			var LGORT = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/LGORT");
			var WERKS = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/WERKS");
			var MATNR = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/MATNR");
			var EBELP = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/EBELP");
			var DESTINATIONBIN = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/DESTINATIONBIN");
			var EBELN = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/EBELN");
			var PRODUCTDATE = this.getOwnerComponent().getModel("goodsRecieptModel").getProperty("/PRODUCTDATE");
			if ((MEINS != "" && POQUANTITY != "" && MENGE != "" && LGORT != "" && WERKS !== "" && MATNR != "" &&
					EBELP != "" && DESTINATIONBIN != "" && EBELN != "" && PRODUCTDATE !== "") && (BATCH != "" || BATCH == "")) {
				debugger;
				this.checkAllFields(BATCH, MEINS, POQUANTITY, MENGE, LGORT, WERKS, MATNR, EBELP, DESTINATIONBIN, EBELN);
			}
		},

		checkAllFields: function (BATCH, MEINS, POQUANTITY, MENGE, LGORT, WERKS, MATNR, EBELP, DESTINATIONBIN, EBELN) {
			debugger;
			var fieldFilter, filter = [];
			fieldFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("BATCH", sap.ui.model.FilterOperator.EQ, BATCH),
					new sap.ui.model.Filter("MEINS", sap.ui.model.FilterOperator.EQ, MEINS),
					new sap.ui.model.Filter("POQUANTITY", sap.ui.model.FilterOperator.EQ, POQUANTITY),
					new sap.ui.model.Filter("MENGE", sap.ui.model.FilterOperator.EQ, MENGE),
					new sap.ui.model.Filter("LGORT", sap.ui.model.FilterOperator.EQ, LGORT),
					new sap.ui.model.Filter("WERKS", sap.ui.model.FilterOperator.EQ, WERKS),
					new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.EQ, MATNR),
					new sap.ui.model.Filter("EBELP", sap.ui.model.FilterOperator.EQ, EBELP),
					new sap.ui.model.Filter("DESTINATIONBIN", sap.ui.model.FilterOperator.EQ, DESTINATIONBIN),
					new sap.ui.model.Filter("EBELN", sap.ui.model.FilterOperator.EQ, EBELN)
				],
				and: true
			});
			filter.push(fieldFilter);
			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			this.getOwnerComponent().getModel().read("/CHECKFIELDSSet", {
				filters: filter,
				success: function (oData, oResponse) {
					debugger;
					var data = oData.results[0];
					var id;
					var audio = new Audio(this.path);
					if (this.getOwnerComponent().getModel("settingsModel").getProperty("/GS1Value") != "") {
						if (data.ERRORTYPE == 'E') {
							audio.play();
							jQuery.sap.delayedCall(5000, this, function () {
								this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
								MessageBox.error(data.MESSAGE, {
									onClose: function (oAction) {
										if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
											if (data.INDICATOR == 'BATCH') {
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/BATCH", "");
												this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MATNR", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/BATCH", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MENGE", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MAKTX", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/EBELP", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/LGORT", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/DESTINATIONBIN", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/PRODUCTDATE", "");
												this.getOwnerComponent().getModel("settingsModel").setProperty("/gsPropertyenable", true);
												this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);
												this.getOwnerComponent().getModel("settingsModel").setProperty("/poquan", "");
												id = "gs1";
											} else if (data.INDICATOR == 'MENGE') {
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MENGE", "");
												this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MATNR", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/BATCH", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MENGE", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MAKTX", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/EBELP", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/LGORT", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/DESTINATIONBIN", "");
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/PRODUCTDATE", "");
												this.getOwnerComponent().getModel("settingsModel").setProperty("/gsPropertyenable", true);
												this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);
												this.getOwnerComponent().getModel("settingsModel").setProperty("/poquan", "");
												id = "gs1";
											} else if (data.INDICATOR == 'LGORT') {
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/LGORT", "");
												id = "storLoc";
											} else if (data.INDICATOR == 'DESTINATIONBIN') {
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/DESTINATIONBIN", "");
												id = "destinBin";
											}
											jQuery.sap.delayedCall(400, this, function () {
												this.byId(id).focus();
											});
											this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
											this.getOwnerComponent().getModel("goodsRecieptModel").updateBindings();
											this.getOwnerComponent().getModel("settingsModel").refresh();
										}
									}.bind(this)
								});
							});
						} else {
							this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
							this.addLineItem();
						}
					} else {
						if (data.ERRORTYPE == 'E') {
							audio.play();
							jQuery.sap.delayedCall(5000, this, function () {
								this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
								MessageBox.error(data.MESSAGE, {
									onClose: function (oAction) {
										if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
											if (data.INDICATOR == 'BATCH') {
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/BATCH", "");
												id = "batch";
											} else if (data.INDICATOR == 'MENGE') {
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MENGE", "");
												id = "quant";
											} else if (data.INDICATOR == 'LGORT') {
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/LGORT", "");
												id = "storLoc";
											} else if (data.INDICATOR == 'DESTINATIONBIN') {
												this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/DESTINATIONBIN", "");
												id = "destinBin";
											}
											jQuery.sap.delayedCall(400, this, function () {
												this.byId(id).focus();
											});
										}
									}.bind(this)
								});
							});
						} else {
							this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
							this.addLineItem();
						}
					}
				}.bind(this),
				error: function (error) {
					debugger;
					this.getErrorDetails(error, "Error!");
				}.bind(this)
			});
		},

		checkBatchManagaed: function (value, index) {
			debugger;
			var path = "/BATCHMANAGEDSet(EBELN='" + this.byId("idPo").getValue() + "',MATNR='" + value + "')";
			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			this.getOwnerComponent().getModel().read(path, {
				success: function (oData, oResponse) {
					debugger;
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					if (this.getOwnerComponent().getModel("settingsModel").getProperty("/GS1Value") != "") {

						if (oData.INDICATOR == "X" && this.QRbatch == "") {
							MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("matnotbatchManaged"), {
								icon: MessageBox.Icon.ERROR,
								title: "Error",
								contentWidth: "100px",
								onClose: function (oAction) {
									if (oAction == "OK" || oAction == "CANCEL" || oAction == "CLOSE") {
										jQuery.sap.delayedCall(400, this, function () {
											this.byId("gs1").focus();
										});
										this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", "");
										this.getOwnerComponent().getModel("settingsModel").setProperty("/gsPropertyenable", true);
										this.getOwnerComponent().getModel("settingsModel").setProperty("/poquan", "");
										this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MATNR", "");
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/EBELP", "");
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/LGORT", "");
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MAKTX", "");
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/WERKS", "");
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MEINS", "");
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MENGE", "");
									}
								}.bind(this)
							});
							return;
						} else if (oData.INDICATOR == "" && this.QRbatch != "") {
							// MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("matisbatchmanaged"));
							MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("matisbatchmanaged"), {
								icon: MessageBox.Icon.ERROR,
								title: "Error",
								contentWidth: "100px",
								onClose: function (oAction) {
									if (oAction == "OK" || oAction == "CANCEL" || oAction == "CLOSE") {
										jQuery.sap.delayedCall(400, this, function () {
											this.byId("gs1").focus();
										});
										this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", "");
										this.getOwnerComponent().getModel("settingsModel").setProperty("/gsPropertyenable", true);
										this.getOwnerComponent().getModel("settingsModel").setProperty("/poquan", "");
										this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MATNR", "");
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/EBELP", "");
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/LGORT", "");
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MAKTX", "");
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/WERKS", "");
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MEINS", "");
										this.getOwnerComponent().getModel("goodsRecieptModel").setProperty("/MENGE", "");
									}
								}.bind(this)
							});
							return;
						} else {
							if (this.QRbatch != "") {
								this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", true);
							} else {
								this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);
							}
							if (this.byId("storLoc").getValue() != "") {
								jQuery.sap.delayedCall(400, this, function () {
									this.byId("destinBin").focus();
								});
							} else {
								jQuery.sap.delayedCall(400, this, function () {
									this.byId("storLoc").focus();
								});
							}
						}
					} else {
						if (oData.INDICATOR == "X") {
							this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", true);
							jQuery.sap.delayedCall(400, this, function () {
								this.byId("batch").focus();
							});
						} else {
							this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);
							jQuery.sap.delayedCall(400, this, function () {
								this.byId("quant").focus();
							});
						}
						this.getOwnerComponent().getModel("settingsModel").refresh();
					}

				}.bind(this),
				error: function (error) {
					this.getErrorDetails(error, this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("unableToCheckBatchManagaed"));
				}.bind(this)
			});
		},

		addingDelNote: function (oEvt) {
			if (oEvt.getSource().getValue() != "") {
				oEvt.getSource().setValueState("None");
			}
		},

		onPressPost: function () {
			if (this.byId("idDelNote").getValue() == "") {
				MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("provideDelNote"), {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					contentWidth: "100px",
					onClose: function (oAction) {
						if (oAction == "OK" || oAction == "CANCEL" || oAction == "CLOSE") {
							this.byId("goodsReciept").scrollTo(this.byId("idDelNote"), 400);
							this.byId("idDelNote").setValueState("Error");
							this.byId("idDelNote").setValueStateText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
								"delmandatory"));
							jQuery.sap.delayedCall(400, this, function () {
								this.byId("idDelNote").focus();
							});
						}
					}.bind(this)
				});
				return;
			}

			this.clearField(this.byId("idItem"));

			var sData = {
				EBELN: "",
				POSTINGDATE: "",
				DELIERYNOTE: "",
				NAVGRHEADERTOITEM: []
			};

			sData.EBELN = this.byId("idPo").getValue();
			sData.POSTINGDATE = this.dateFormatter(new Date());
			sData.DELIERYNOTE = this.byId("idDelNote").getValue();
			var NAVGRHEADERTOITEM = this.getOwnerComponent().getModel("poItemData").getData().results;
			for (var i = 0; i < NAVGRHEADERTOITEM.length; i++) {
				NAVGRHEADERTOITEM[i].PRODUCTDATE = this.dateFormatter(NAVGRHEADERTOITEM[i].PRODUCTDATE);
			}

			sData.NAVGRHEADERTOITEM = NAVGRHEADERTOITEM;
			for (var i = 0; i < sData.NAVGRHEADERTOITEM.length; i++) {
				if (sData.NAVGRHEADERTOITEM[i].POSTINGDATE != undefined) {
					delete sData.NAVGRHEADERTOITEM[i].POSTINGDATE;
				}
				if (sData.NAVGRHEADERTOITEM[i].DELIERYNOTE != undefined) {
					delete sData.NAVGRHEADERTOITEM[i].DELIERYNOTE;
				}

			}

			for (var i = 0; i < sData.NAVGRHEADERTOITEM.length; i++) {
				// sData.NAVGRHEADERTOITEM[i].DESTINATIONSTORAGETYPE = sData.NAVGRHEADERTOITEM[i].DESTINATIONSTORAGETYPE.trim();
				sData.NAVGRHEADERTOITEM[i].MENGE = sData.NAVGRHEADERTOITEM[i].MENGE.toString();
			}

			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			this.getOwnerComponent().getModel().create("/GRHEADERSet", sData, {
				method: "POST",
				success: function (oData, oResponse) {

					MessageBox.success(oData.MESSAGE, {
						icon: MessageBox.Icon.SUCCESS,
						title: "Success",
						contentWidth: "100px",
						onClose: function (oAction) {
							if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE" || oAction === null) {
								this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
								this.getOwnerComponent().getModel("settingsModel").setProperty("/enablePost", false);
								this.getOwnerComponent().getModel("settingsModel").setProperty("/visiblePoData", false);
								for (var key in this.getOwnerComponent().getModel("goodsRecieptModel").getData()) {
									this.getOwnerComponent().getModel("goodsRecieptModel").getData()[key] = "";
								}

								this.getOwnerComponent().getModel("settingsModel").setProperty("/gsPropertyenable", true);
								this.getOwnerComponent().getModel("settingsModel").setProperty("/GS1Value", "");
								this.getOwnerComponent().getModel("settingsModel").setProperty("/showBatch", false);
								this.getOwnerComponent().getModel("settingsModel").setProperty("/poquan", "");
								this.getOwnerComponent().getModel("goodsRecieptModel").refresh();
								this.getOwnerComponent().getModel("goodsRecieptModel").updateBindings();
								this.getOwnerComponent().getModel("poItemData").getData().results = [];
								this.getOwnerComponent().getModel("poItemData").refresh();
								this.getOwnerComponent().getModel("poItemData").updateBindings();
								jQuery.sap.delayedCall(400, this, function () {
									this.byId("idPo").focus();
								});
							}
						}.bind(this)
					});

				}.bind(this),
				error: function (error) {
					this.getErrorDetails(error, this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("unableGrPosting"));
				}.bind(this)
			});
		},
		getErrorDetails: function (error, data) {
			var audio = new Audio(this.path);
			audio.play();
			jQuery.sap.delayedCall(5000, this, function () {
				this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
			});
			if (JSON.parse(error.responseText).error.innererror.errordetails.length > 1) {
				var x = JSON.parse(error.responseText).error.innererror.errordetails;
				var details = '<ul>';
				var y = '';
				if (x.length > 1) {
					for (var i = 0; i < x.length - 1; i++) {
						y = '<li>' + x[i].message + '</li>' + y;
					}
				}
				details = details + y + "</ul>";

				MessageBox.error(data, {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					details: details,
					contentWidth: "100px",
					onClose: function (oAction) {
						if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {}
					}.bind(this)
				});
			} else {
				MessageBox.error(JSON.parse(error.responseText).error.message.value, {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					details: details,
					contentWidth: "100px",
					onClose: function (oAction) {
						if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {}
					}.bind(this)
				});
			}
		},
		dateFormatter: function (oValue) {
			if (oValue !== null) {
				var date = oValue;
				var m = String(date).slice(4, 15).replace(/ /g, "/").slice(0, 3);
				var d = String(date).slice(4, 15).replace(/ /g, "/").slice(4, 6);
				var y = String(date).slice(4, 15).replace(/ /g, "/").slice(7, 15);
				switch (m) {
				case 'Jan':
					m = "01";
					break;
				case "Feb":
					m = "02";
					break;
				case "Mar":
					m = "03";
					break;
				case "Apr":
					m = "04";
					break;
				case "May":
					m = "05";
					break;
				case "Jun":
					m = "06";
					break;
				case 'Jul':
					m = "07";
					break;
				case "Aug":
					m = "08";
					break;
				case "Sep":
					m = "09";
					break;
				case "Oct":
					m = "10";
					break;
				case "Nov":
					m = "11";
					break;
				case "Dec":
					m = "12";
					break;
				default:
					break;
				}
				return y + m + d;
			}
		},

		getFormField: function (oFormContent) {
			var c = 0;
			for (var i = 0; i < oFormContent.length; i++) {
				if ((oFormContent[i].getMetadata()._sClassName === "sap.m.Input" || oFormContent[i].getMetadata()._sClassName ===
						"sap.m.DatePicker") && oFormContent[i].getVisible() === true && oFormContent[i].getRequired() === true) {
					if (oFormContent[i].getValue() == "") {
						oFormContent[i].setValueState("Error");
						oFormContent[i].setValueStateText(oFormContent[i - 1].getText() + " " + this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText(
								"isX"));
						oFormContent[i].focus();
						c++;
						return c;
					}
				}
			}
		},

		clearField: function (oFormContent) {
			for (var i = 0; i < oFormContent.length; i++) {
				if (oFormContent[i].getMetadata()._sClassName === "sap.m.Input" || oFormContent[i].getMetadata()._sClassName ===
					"sap.m.DatePicker") {
					oFormContent[i].setValueState("None");
				}
			}
		}

	});

});