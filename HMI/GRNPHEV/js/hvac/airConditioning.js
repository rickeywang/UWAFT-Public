/**
 * Changes the setting to the other one
 */
function changeACSetting() {
	var currAC = sitRep("isACOn");
	console.log("Okay Imma change AC to the other one! " + !currAC);

	if (currAC) {
		setAirConditioning(false);
	} else {
		setAirConditioning(true);
	}
}

/**
 * Event handler for air conditioning HVAC changes.
 * @param e {Event} HVAC change event
 */
function onAirConditioningSettingChange(e) {
	var currAC = e[CLIMATE_CONTROL.HVAC_AIR_CONDITIONING_ENABLED];

	if ( typeof (e) != 'undefined' && typeof (currAC) != 'undefined') {
		if (validateAirConditioningSetting(currAC)) {

			console.log("update AirConditioning Display to " + currAC);

			if (currAC) {
				$("#acEnable").val("on").slider("refresh");
				/*
				 $("#acEnable").buttonMarkup({
				 theme : "b"
				 });
				 $("#acEnable").buttonMarkup({
				 icon : "check"
				 });
				 $("#acEnable").unbind("mouseenter mouseleave");

				 $("#acEnable").hover(function(event) {
				 console.log("power button hovering stopPropagation");
				 event.stopPropagation();
				 $(this).unbind('mouseenter mouseleave');
				 });*/

			} else {
				$("#acEnable").val("off").slider("refresh");
				/*
				 $("#acEnable").buttonMarkup({
				 theme : "d"
				 });
				 $("#acEnable").buttonMarkup({
				 icon : "power"
				 });
				 $("#acEnable").unbind("mouseenter mouseleave");

				 $("#acEnable").hover(function(event) {
				 console.log("power button hovering stopPropagation");
				 event.stopPropagation();
				 $(this).unbind('mouseenter mouseleave');
				 });*/

			}
		}
	}
}

/**
 * Validates the supplied value as a valid
 * air conditioning setting value.
 * @param value {Boolean} The value to validate
 * @returns {Boolean} True if valid, False if not
 */
function validateAirConditioningSetting(value) {
	var isValid = true;

	if ( typeof (value) != 'boolean') {
		isValid = false;
		console.error('Unrecognized air conditioning setting HVAC value: ' + value);
	}

	return isValid;
}

/**
 * Toggles the AC setting on or off and persists to the
 * HVAC API.
 * @param enabled {Boolean} True for ON, False for OFF
 */
function setAirConditioning(enabled) {
	console.log("setAirConditioning to " + enabled);

	if (validateAirConditioningSetting(enabled)) {

		// Persist to API
		try {
			var info = {};
			info[CLIMATE_CONTROL.HVAC_AIR_CONDITIONING_ENABLED] = enabled;
			qnx.hvac.set(info);
		} catch(ex) {
			console.error('Unable to persist air conditioning change to API', ex);
		}

	}
}

