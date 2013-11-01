/**
 * Climate Control fan setting control event handlers, data persistence, and
 * display update functions.
 *
 * @author lgreenway@lixar.com
 *
 * $Id: fanSetting.js 4273 2012-09-25 17:51:22Z mlapierre@qnx.com $
 */

/**
 * Fan setting for windshield and feet
 */
CLIMATE_CONTROL.FAN_SETTING_WINDSHIELD_FEET = 0;

/**
 * Fan setting for windshield
 */
CLIMATE_CONTROL.FAN_SETTING_WINDSHIELD = 1;

/**
 * Fan setting for head
 */
CLIMATE_CONTROL.FAN_SETTING_HEAD = 2;

/**
 * Fan setting for head and feet
 */
CLIMATE_CONTROL.FAN_SETTING_HEAD_FEET = 3;

/**
 * Fan setting for feet
 */
CLIMATE_CONTROL.FAN_SETTING_FEET = 4;

/**
 * Object cache for the currently rotating fan setting control
 */
CLIMATE_CONTROL.rotatingFanControl = false;

/**
 * Event handler for fan setting HVAC changes.
 * @param e {Event} HVAC change event
 */
function onFanSettingChange(e) {
	if ( typeof (e) != 'undefined' && typeof (e[CLIMATE_CONTROL.HVAC_FAN_SETTING_L]) != 'undefined') {

		switch(e[CLIMATE_CONTROL.HVAC_FAN_SETTING_L]) {
			case CLIMATE_CONTROL.FAN_SETTING_WINDSHIELD_FEET:
				$("#currACDisp").html("WINDSHIELD_FEET");
				break;
			case CLIMATE_CONTROL.FAN_SETTING_FEET:
				$("#currACDisp").html("FEET");
				break;
			case CLIMATE_CONTROL.FAN_SETTING_HEAD_FEET:
				$("#currACDisp").html("HEAD_FEET");
				break;
			case CLIMATE_CONTROL.FAN_SETTING_HEAD:
				$("#currACDisp").html("HEAD");
				break;
			case CLIMATE_CONTROL.FAN_SETTING_WINDSHIELD:
				$("#currACDisp").html("WINDSHIELD");
				break;
		}

	} else {
		console.warning('Fan speed change event for unknown zone: ' + e);
	}
}

/**
 * Validates the supplied value as a valid
 * fan setting value.
 * @param value {Number} The value to validate
 * @returns {Boolean} True if valid, False if not
 */
function validateFanSetting(value) {
	var isValid = true;

	if ( typeof (value) != 'number' || (value != CLIMATE_CONTROL.FAN_SETTING_WINDSHIELD_FEET && value != CLIMATE_CONTROL.FAN_SETTING_WINDSHIELD && value != CLIMATE_CONTROL.FAN_SETTING_HEAD && value != CLIMATE_CONTROL.FAN_SETTING_HEAD_FEET && value != CLIMATE_CONTROL.FAN_SETTING_FEET)) {
		isValid = false;
		console.error('Unrecognized fan setting HVAC value: ' + value);
	}

	return isValid;
}

/**
 * Tap handler for the fan control buttons. This function contains the logic for determining what setting to go to next based on the current setting.
 * List of Buttons:
 * 1 = front window defrost on/off (visibility is important so it should be the easiet to reach)
 * 2 = blow feet and window OR head and feet toggle (toggle between the two multi-point fan settings)
 * 3 = blow head OR feet toggle (a sort of "boost" for when you really need it -- specific point blowing -- not oft used. )
 *
 * When switching from one button to the other, the state should reset. (i.e. tap button 2 twice to get head and feet if the current setting is not feet and window)
 * @param bID {Integer} The button that was tapped
 */
function fanSettingTap(bID) {
	var currFanSet = sitRep('getFanStat');

	switch(bID) {
		case 1:
			//Always go to windshield no matter what.
			setFanSetting(CLIMATE_CONTROL.FAN_SETTING_WINDSHIELD);
			break;
		case 2:
			if (currFanSet == CLIMATE_CONTROL.FAN_SETTING_WINDSHIELD_FEET) {
				setFanSetting(CLIMATE_CONTROL.FAN_SETTING_HEAD_FEET);
			} else {
				setFanSetting(CLIMATE_CONTROL.FAN_SETTING_WINDSHIELD_FEET);
			}
			break;
		case 3:
			if (currFanSet == CLIMATE_CONTROL.FAN_SETTING_FEET) {
				setFanSetting(CLIMATE_CONTROL.FAN_SETTING_HEAD);
			} else {
				setFanSetting(CLIMATE_CONTROL.FAN_SETTING_FEET);
			}
			break;
	}
}

/**
 * Sets the fan setting for a particular zone (always LEFT for UWAFT ECOKAR)
 * @param setting {String} The fan setting (based on constant)
 */
function setFanSetting(setting) {
	if (validateFanSetting(setting)) {
		// Targeting a specific zone

		try {
			var info = {};
			info[CLIMATE_CONTROL.HVAC_FAN_SETTING_L] = setting;
			qnx.hvac.set(info);
		} catch(ex) {
			console.error('Unable to persist fan setting change to API', ex);
		}

	}
}

/**
 * Updates the UI to reflect the fan control settings
 */
function updateFanControlDisplay() {

}