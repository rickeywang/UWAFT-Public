/**
 * Minimum heated seat level
 */
CLIMATE_CONTROL.MIN_HEATED_SEAT_LEVEL = 0;

/**
 * Maximum heated seat level
 */
CLIMATE_CONTROL.MAX_HEATED_SEAT_LEVEL = 3;

/**
 * Tap handler for the heated seat control button. This function contains the logic for determining what setting to go to next based on the current setting.
 * List of Buttons:
 * 1 = left
 * 2 = right
 *
 * It will increment current setting by one and loop back to zero if tapped at maximum.
 *
 * @param bID {Integer} The button that was tapped
 */
function heatSeatTap(bID) {
	var currLvl;

	if (bID == 1) {
		currLvl = sitRep('getHeatSeatL');
		if (currLvl == CLIMATE_CONTROL.MAX_HEATED_SEAT_LEVEL) {
			setHeatedSeatLevel(CLIMATE_CONTROL.ZONE_LEFT, CLIMATE_CONTROL.MIN_HEATED_SEAT_LEVEL);
		} else {
			setHeatedSeatLevel(CLIMATE_CONTROL.ZONE_LEFT, ++currLvl);
		}

	} else if (bID == 2) {
		currLvl = sitRep('getHeatSeatR');
		if (currLvl == CLIMATE_CONTROL.MAX_HEATED_SEAT_LEVEL) {
			setHeatedSeatLevel(CLIMATE_CONTROL.ZONE_RIGHT, CLIMATE_CONTROL.MIN_HEATED_SEAT_LEVEL);
		} else {
			setHeatedSeatLevel(CLIMATE_CONTROL.ZONE_RIGHT, ++currLvl);
		}
	}
}

/**
 * Event handler for heated seat HVAC changes.
 * @param e {Event} HVAC change event
 */
function onHeatedSeatLevelChange(e) {
	if ( typeof (e) != 'undefined' && typeof (e.event) != 'undefined' && typeof (e.data) != 'undefined') {
		if (validateHeatedSeatLevel(e.data)) {
			switch(e.event) {
				case CLIMATE_CONTROL.HVAC_HEATED_SEAT_LEVEL_L:
				console.log('update leftHeatSeatDisp');
					$("#leftHeatSeatDisp").html(e.data);
					break;
				case CLIMATE_CONTROL.HVAC_HEATED_SEAT_LEVEL_R:
					$("#rightHeatSeatDisp").html(e.data);
					break;
			}

			updateHeatedSeatDisplay();
		}
	}
}

/**
 * Validates the supplied value as a valid
 * heated seat level value.
 * @param value {Number} The value to validate
 * @returns {Boolean} True if valid, False if not
 */
function validateHeatedSeatLevel(value) {
	var isValid = true;

	if ( typeof (value) != 'number' || isNaN(value) || value < CLIMATE_CONTROL.MIN_HEATED_SEAT_LEVEL || value > CLIMATE_CONTROL.MAX_HEATED_SEAT_LEVEL || value % 1 !== 0) {
		isValid = false;
		console.error('Unrecognized heated seat level HVAC value: ' + value);
	}

	return isValid;
}

/**
 * Sets the heated seat level for the specified zone and persists
 * the change to the HVAC API
 * @param zone {String} The zone to which the heated seat setting will be applied
 * @param level {Number} The heated seat level (0 is off)
 */
function setHeatedSeatLevel(zone, level) {
	if (validateHeatedSeatLevel(level)) {
		try {
			switch(zone) {
				case CLIMATE_CONTROL.ZONE_LEFT:
					console.log('SET heatseat left lvl ' + level);
					var info = {};
					info[CLIMATE_CONTROL.HVAC_HEATED_SEAT_LEVEL_L] = level;
					qnx.hvac.set(info);
					break;
				case CLIMATE_CONTROL.ZONE_RIGHT:
					console.log('SET heatseat right lvl ' + level);
					var info = {};
					info[CLIMATE_CONTROL.HVAC_HEATED_SEAT_LEVEL_R] = level;
					qnx.hvac.set(info);
					break;
			}
		} catch(ex) {
			console.error('Unable to persist heated seat change to API', ex);
		}

	}
}

/**
 * Updates the display of all heated seat controls
 */
function updateHeatedSeatDisplay() {

}
