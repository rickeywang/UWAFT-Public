/**
 * Event handler for ESS info changes.
 * @param e {Event} UWINFO update event
 */

function onESSInfoUpdate(e) {
	console.log("updating ESS info display");

	if ( typeof (e) != 'undefined' && ( typeof (e[CLIMATE_CONTROL.HVAC_FAN_SPEED_L]) != 'undefined' || typeof (e[CLIMATE_CONTROL.HVAC_FAN_SPEED_R]) != 'undefined')) {
		var zoneLinkActive = $('.zoneLinkToggleControl').data('active');

		if (e.hasOwnProperty(ESS_VOLT) && typeof (e[ESS_VOLT]) != 'undefined') {

			$("#essVoltDisp").html(e[ESS_VOLT] & " V");

		}
	}
}