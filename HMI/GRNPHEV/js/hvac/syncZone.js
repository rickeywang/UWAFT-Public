
/**
 * Changes the setting to the other one
 */
function changeSyncSetting() {
	var currSync = sitRep("isSyncOn");
	console.log("Okay Imma change sync to the other one: "+!currSync);

	if (currSync) {
		setSync(false);
	} else {
		setSync(true);
	}
}

/**
 * Event handler for zone link HVAC changes.
 * @param e {Event} HVAC change event
 */
function onSyncSettingChange(e) {
	var currSync = e[CLIMATE_CONTROL.HVAC_ZONE_LINK_ENABLED];
	
	if ( typeof (e) != 'undefined' && typeof (currSync) != 'undefined') {
		if (validateSyncSetting(currSync)) {
			console.log("update Sync Display to " + currSync);

			if (currSync) {
				//$("#syncEnable").val("on").slider("refresh");
				 $("#syncEnable").buttonMarkup({
				 theme : "b"
				 });
				 $("#syncEnable").buttonMarkup({
				 icon : "check"
				 });
				setTemperature(CLIMATE_CONTROL.ZONE_SYNC,sitRep('getLeftTemp'));
			} else {
				$("#syncEnable").buttonMarkup({
				 theme : "d"
				 });
				 $("#syncEnable").buttonMarkup({
				 icon : "delete"
				 });
				//$("#syncEnable").val("off").slider("refresh");
			}

			//Sets the fan temperature, speed, and setting for all zones to that of the
			// first (driver-side) zone.
			//if (currSync) {
				
				//doesnt exist setFanSpeed(undefined, parseInt($('.fanSpeedControl:first').data('level')));
				//doesnt exist setFanSetting(undefined, parseInt($('.fanControl:first').data('setting')));
			//}
		}
	}
}

/**
 * Validates the supplied value as a valid
 * zone link setting value.
 * @param value {Boolean} The value to validate
 * @returns {Boolean} True if valid, False if not
 */
function validateSyncSetting(value) {
	var isValid = true;

	if ( typeof (value) != 'boolean') {
		isValid = false;
		console.error('Unrecognized zone link setting HVAC value: ' + value);
	}

	return isValid;
}

/**
 * Sets the zone link (All) setting and persists to the HVAC API.
 * This will also equalize the data between zones if setting to ON,
 * using the zone of the first temperature and fan speed controls
 * found in the DOM as the baseline.
 * @param enabled {Boolean} True for ON, False for OFF
 */
function setSync(enabled) {
	if (validateSyncSetting(enabled)) { //No loop avoiding needed here. 
		// Persist to API
		try {
			var info = {};
			info[CLIMATE_CONTROL.HVAC_ZONE_LINK_ENABLED] = enabled;
			qnx.hvac.set(info);

		} catch(ex) {
			console.error('Unable to persist zone link change to API', ex);
		}

	}
}

