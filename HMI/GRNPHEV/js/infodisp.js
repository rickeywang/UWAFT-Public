//		(~   || _  _   /~`|_  _ . _|_  _
//		_)|_|||(/_| |  \_,| |(_)|| |_)(_)\/
//										 /

function initInfoDisp() {
	// Initialize vehicle sensor API and attach callback functions
	console.log('UW Initializing infoDisplay');

	var INFO_UPDATE = "uwinfoUpdate";
	// Attach HVAC change API event handlers
	blackberry.event.addEventListener(INFO_UPDATE, updateInfoDispData);

	// We initialize the  data
	updateInfoDispData(uw.info.get());
}

/**
 * Gets the current HVAC data from the API, assigns the
 * data to all UI elements and then updates the display.
 */
function updateInfoDispData(uwinfoData) {
	//console.log('Hey updateClimateControlData got called!');

	if (uwinfoData == null) {
		console.warn("Unable to update " & INFO_UPDATE & " data. The input data was NULL. ");
	} else {
		//Update the ESS info
		onESSInfoUpdate(uwinfoData);

	}
}

