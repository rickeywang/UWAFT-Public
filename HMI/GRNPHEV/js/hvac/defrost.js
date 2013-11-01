
/**
 * Changes the setting to the other one
 */
function changeRearDefrostSetting() {
	var currRDefrost = sitRep("isRearDefrostOn");
	console.log("Okay Imma change currRDefrost to the other one: "+!currRDefrost);

	if (currRDefrost) {
		setRearDefrost(false);
	} else {
		setRearDefrost(true);
	}
}

/**
 * Event handler for zone link HVAC changes.
 * @param e {Event} HVAC change event
 */
function onRearDefrostSettingChange(e) {
	var currRDefrost = e[CLIMATE_CONTROL.HVAC_REAR_DEFROST_ENABLED];
	
	if ( typeof (e) != 'undefined' && typeof (currRDefrost) != 'undefined') {
		if (validateRearDefrostSetting(currRDefrost)) {
			console.log("update Defrost Display to " + currRDefrost);

			if (currRDefrost) {
				$("#defrostEnable").val("on").slider("refresh");
			} else {
				$("#defrostEnable").val("off").slider("refresh");
			}
		}
	}
}

/**
 * Validates the supplied value as a valid
 * rear defrost setting value.
 * @param value {Boolean} The value to validate
 * @returns {Boolean} True if valid, False if not
 */
function validateRearDefrostSetting(value)
{
	var isValid = true;
	
	if(typeof(value) != 'boolean')
	{
		isValid = false;
		console.error('Unrecognized rear defrost setting HVAC value: ' + value);			
	}
	
	return isValid;
}

/**
 * Toggles the rear defrost setting on or off and persists to the
 * HVAC API.
 * @param enabled {Boolean} True for ON, False for OFF
 */
function setRearDefrost(enabled)
{
	if(validateRearDefrostSetting(enabled))
	{
		// Persist to API
		try
		{
			var info = {};
			info[CLIMATE_CONTROL.HVAC_REAR_DEFROST_ENABLED] = enabled;			
			qnx.hvac.set(info);
		}
		catch(ex)
		{
			console.error('Unable to persist rear defrost change to API', ex);
		}

	}
}

