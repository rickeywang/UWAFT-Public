/**
 * Climate Control fan speed control event handlers, data persistence, and
 * display update functions.
 *
 * @author lgreenway@lixar.com
 *
 * $Id: fanSpeed.js 5136 2012-11-21 20:36:52Z lgreenway@qnx.com $
 */

/**
 * Minimum fan speed
 */
CLIMATE_CONTROL.MIN_FAN_SPEED = 0;

/**
 * Maximum fan speed
 */
CLIMATE_CONTROL.MAX_FAN_SPEED = 6;

// Current Speed (avoids the loop)
var currFanSpd = 0;

/**
 * Event handler for fan speed HVAC changes.
 * @param e {Event} HVAC change event
 */
function onFanSpeedChange(e) {
	console.log("onFanSpeedChange.");

	if ( typeof (e) != 'undefined' && ( typeof (e[CLIMATE_CONTROL.HVAC_FAN_SPEED_L]) != 'undefined' || typeof (e[CLIMATE_CONTROL.HVAC_FAN_SPEED_R]) != 'undefined')) {
		var zoneLinkActive = $('.zoneLinkToggleControl').data('active');

		if (e.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_SPEED_L) && validateFanSpeed(e[CLIMATE_CONTROL.HVAC_FAN_SPEED_L])) {
			console.log("Attempt to update slider leftFanSpeedControl to " + e[CLIMATE_CONTROL.HVAC_FAN_SPEED_L]);

			/*
			 $('#hvac').page();
			 $('#leftFanSpeedControl').val(e[CLIMATE_CONTROL.HVAC_FAN_SPEED_L]);
			 $('#leftFanSpeedControl').slider('refresh');*/

			currFanSpd = e[CLIMATE_CONTROL.HVAC_FAN_SPEED_L];
			$("#leftFanSpeedControl").val(currFanSpd).slider("refresh");

			//$('.fanSpeedControl').data('level', e[CLIMATE_CONTROL.HVAC_FAN_SPEED_L]);
		}

		/*
		 if (e.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_SPEED_R) && validateFanSpeed(e[CLIMATE_CONTROL.HVAC_FAN_SPEED_R])) {
		 $('.fanSpeedControl[data-zone=' + CLIMATE_CONTROL.ZONE_RIGHT + ']').data('level', e[CLIMATE_CONTROL.HVAC_FAN_SPEED_R]);
		 }
		 // Set the fan speed for the other zones
		 if (zoneLinkActive && e.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_SPEED_L) && $('.fanSpeedControl[data-zone=' + CLIMATE_CONTROL.ZONE_RIGHT + ']').data('level') != e[CLIMATE_CONTROL.HVAC_FAN_SPEED_L]) {
		 setFanSpeed(CLIMATE_CONTROL.ZONE_RIGHT, e[CLIMATE_CONTROL.HVAC_FAN_SPEED_L]);
		 }
		 if (zoneLinkActive && e.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_SPEED_R) && $('.fanSpeedControl[data-zone=' + CLIMATE_CONTROL.ZONE_LEFT + ']').data('level') != e[CLIMATE_CONTROL.HVAC_FAN_SPEED_R]) {
		 setFanSpeed(CLIMATE_CONTROL.ZONE_LEFT, e[CLIMATE_CONTROL.HVAC_FAN_SPEED_R]);
		 }

		 * */

	} else {
		console.warning('Fan speed change event for unknown zone: ' + e);
	}
}

/**
 * Validates the supplied value as a valid
 * fan speed value.
 * @param value {Number} The value to validate
 * @returns {Boolean} True if valid, False if not
 */
function validateFanSpeed(value) {
	var isValid = true;

	if (isNaN(value) || value % 1 !== 0) {
		isValid = false;
		console.error('Unrecognized fan speed HVAC value NOT VALID VARAIABLE: ' + value);
	} else if (value < CLIMATE_CONTROL.MIN_FAN_SPEED || value > CLIMATE_CONTROL.MAX_FAN_SPEED) {
		isValid = false;
		console.error('Unrecognized fan speed HVAC value NOT IN RANGE: ' + value);
	}

	return isValid;
}

/**
 * Sets the fan speed level for the specified zone and updates
 * the fan speed control display list
 * @param zone {String} The zone to which the fan speed setting will be applied.
 * If the Zone Link option is set to true, the function will set the specified level
 * on ALL zones.
 * @param level {Number} The fan speed level (0 is off)
 */
function setFanSpeed(level) {
	console.log("setFanSpeed got this " + level);

	var zone = CLIMATE_CONTROL.ZONE_LEFT;
	//TODO Yeah this is sketchy

	//If the new level is same as before, then do nothing (prevents loop)
	if (level != currFanSpd && validateFanSpeed(level)) {
		try {
			// Persist to API
			if (zone == CLIMATE_CONTROL.ZONE_LEFT) {
				var info = {};
				info[CLIMATE_CONTROL.HVAC_FAN_SPEED_L] = level;
				qnx.hvac.set(info);
			} else if (zone == CLIMATE_CONTROL.ZONE_RIGHT) {
				var info = {};
				info[CLIMATE_CONTROL.HVAC_FAN_SPEED_R] = level;
				qnx.hvac.set(info);
			}
		} catch(ex) {
			console.error('Unable to persist fan speed change to API', ex);
		}
	}
}

