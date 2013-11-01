/**
 * Climate Control fan temperature control event handlers, data persistence, and
 * display update functions.
 *
 * @author lgreenway@lixar.com
 *
 * $Id: fanTemperature.js 4997 2012-11-13 15:42:10Z mlapierre@qnx.com $
 */

/**
 * The minimum temperature for the temperature controls.
 */
CLIMATE_CONTROL.MIN_TEMP = 15;

/**
 * The maximum temperature for the temperature controls
 */
CLIMATE_CONTROL.MAX_TEMP = 26;

//Current Temps. Index 0 is left (driver) , 1 is right.
var currTemp = [0, 0];

/**
 * The temperature controls will display all degrees between the configured
 * min and max temperatures, incrementing by this value for each step.
 */
CLIMATE_CONTROL.TEMP_INCREMENT = 1;

function onFanTemperatureChange(e) {
	if ( typeof (e) != 'undefined' && ( typeof (e[CLIMATE_CONTROL.HVAC_FAN_TEMP_L]) != 'undefined' || typeof (e[CLIMATE_CONTROL.HVAC_FAN_TEMP_R]) != 'undefined')) {
		var currSync = sitRep('isSyncOn');

		if (e.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_TEMP_L) && validateFanTemperature(e[CLIMATE_CONTROL.HVAC_FAN_TEMP_L])) {

			currTemp[0] = e[CLIMATE_CONTROL.HVAC_FAN_TEMP_L];
			$("#leftTemp").val(currTemp[0]).slider("refresh");
			if (currTemp[0] != e[CLIMATE_CONTROL.HVAC_FAN_TEMP_L] && sitRep('isSyncOn'))
				setTemperature(CLIMATE_CONTROL.ZONE_SYNC, currTemp[0]);

		}
		if (e.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_TEMP_R) && validateFanTemperature(e[CLIMATE_CONTROL.HVAC_FAN_TEMP_R])) {

			currTemp[1] = e[CLIMATE_CONTROL.HVAC_FAN_TEMP_R];
			$("#rightTemp").val(currTemp[1]).slider("refresh");
			if (currTemp[1] != e[CLIMATE_CONTROL.HVAC_FAN_TEMP_R] && sitRep('isSyncOn'))
				setTemperature(CLIMATE_CONTROL.ZONE_SYNC, currTemp[1]);

		}
		// Set the temperature for the other zones

		/*
		 if (currSync && e.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_TEMP_L) && $("#rightTemp").val() != e[CLIMATE_CONTROL.HVAC_FAN_TEMP_L]) {
		 console.log("fixing right not equal left");
		 setTemperature(CLIMATE_CONTROL.ZONE_RIGHT, e[CLIMATE_CONTROL.HVAC_FAN_TEMP_L]);
		 }
		 if (currSync && e.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_TEMP_R) && $("#leftTemp").val() != e[CLIMATE_CONTROL.HVAC_FAN_TEMP_R]) {
		 console.log("fixing left no equal right");
		 setTemperature(CLIMATE_CONTROL.ZONE_LEFT, e[CLIMATE_CONTROL.HVAC_FAN_TEMP_R]);
		 }*/

	} else {
		console.warning('Fan temperature change event for unknown zone: ' + e);
	}
}

/**
 * Validates the supplied value as a valid
 * fan temperature value.
 * @param value {Number} The value to validate
 * @returns {Boolean} True if valid, False if not
 */
function validateFanTemperature(value) {
	var isValid = true;

	if (value < CLIMATE_CONTROL.MIN_TEMP || value > CLIMATE_CONTROL.MAX_TEMP) {
		isValid = false;
		console.error('Unrecognized fan temperature HVAC value OUT OF RANGE: ' + value);
	}

	if ( typeof (value) != 'number') {
		isValid = false;
		console.error('Unrecognized fan temperature HVAC value NOT A NUMBER: ' + value);
	}

	return isValid;
}

/**
 * Sets the temperature setting for a particular zone
 * @param zone {String} The zone to which the fan setting will be applied (this
 * 	relates to the data-zone attribute of the temperature control).
 * @param temp {Number} The temperature value
 */
function setTemperature(zone, temp) {
	temp = typeCast('number', temp);

	if (validateFanTemperature(temp) && typeof (zone) != 'undefined' && !isNaN(temp)) {
		if (sitRep('isSyncOn'))
			zone = CLIMATE_CONTROL.ZONE_SYNC;

		var tempType = -1;
		//Temperature Type: <0 = do not proceed. 0 = update LEFT only. 1 = update RIGHT only. 2 = both should sync to new value 3 = left or right independent.
		//Prevents setting the same value over and over.
		if (zone == CLIMATE_CONTROL.ZONE_LEFT && currTemp[0] != temp) {
			tempType = 3;
		} else if (zone == CLIMATE_CONTROL.ZONE_RIGHT && currTemp[1] != temp) {
			tempType = 3;
		} else if (zone == CLIMATE_CONTROL.ZONE_SYNC) {
			if (currTemp[0] != temp)
				tempType = 0;
			if (currTemp[1] != temp)
				tempType = 1;
			if (currTemp[0] != temp && currTemp[1] != temp)
				tempType = 2;
		}

		if (tempType >= 0) {

			// Persist to API
			try {
				console.log("try set new temp of " + temp + " with tempType "+tempType);
				if (zone == CLIMATE_CONTROL.ZONE_LEFT || tempType == 0) {
					var info = {};
					info[CLIMATE_CONTROL.HVAC_FAN_TEMP_L] = temp;
					qnx.hvac.set(info);
				} else if (zone == CLIMATE_CONTROL.ZONE_RIGHT || tempType == 1) {
					var info = {};
					info[CLIMATE_CONTROL.HVAC_FAN_TEMP_R] = temp;
					qnx.hvac.set(info);
				} else if (zone == CLIMATE_CONTROL.ZONE_SYNC && tempType == 2) {//Sync Request. Set PAX temp to same as Driver's
					console.log("try ACTIVATE new SYNCROD temp of " + temp);
					var info = {};
					info[CLIMATE_CONTROL.HVAC_FAN_TEMP_L] = temp;
					info[CLIMATE_CONTROL.HVAC_FAN_TEMP_R] = temp;
					qnx.hvac.set(info);
				}
			} catch(ex) {
				console.error('Unable to persist fan temperature change to API', ex);
			}

		}
	}
}
