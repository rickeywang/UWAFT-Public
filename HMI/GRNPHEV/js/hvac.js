//		(~   || _  _   /~`|_  _ . _|_  _
//		_)|_|||(/_| |  \_,| |(_)|| |_)(_)\/
//										 /

function initClimateControl() {
	// Initialize vehicle sensor API and attach callback functions
	console.log('UW Initializing HVAC');

	HVAC_UPDATE = "hvacupdate";
	// Attach HVAC change API event handlers
	// Fan temp
	blackberry.event.addEventListener(HVAC_UPDATE, updateClimateControlData);

	/* Fan Speed Controls */
	// Bind vmousedown handler. TODO this guy doesn't even do anything.. time to get rid of it?
	$('#leftFanSpeedControl').tap(function() {
		console.log('fan slider got tapped!!')
		var newSpeed = $(this).val();
		setFanSpeed(newSpeed);
	});

	/* A/C toggle control.. Dude, this thing actually works! */
	//IMPORTANT: OKAY SO LIKE BINDING STUFF IS COOL AND ALL, BUT PUTTING AN ONCHANGE IS A LOT EASIER TO MANAGE AND MORE DIRECT.
	//For the slider thing
	/*
	$("#acEnable").slider({
	stop : function(event, ui) {
	}
	});
	$("#acEnable").on("slidestop", function(event, ui) {
	var newSetting = $(this).val();
	console.log("acEnable was touched. Now it's " + stringToBoolean(newSetting));
	setAirConditioning(stringToBoolean(newSetting));
	});*/

	//Defrost
	/*
	$("#defrostEnable").slider({
	stop : function(event, ui) {
	}
	});
	$("#defrostEnable").on("slidestop", function(event, ui) {
	var newSetting = $(this).val();
	console.log("defrostEnable was touched. Now it's " + stringToBoolean(newSetting));
	setDefrost(stringToBoolean(newSetting));
	});*/

	// We initialize the hvac data
	updateClimateControlData(qnx.hvac.get());
}

/**
 * Gets the current HVAC data from the API, assigns the
 * data to all UI elements and then updates the display.
 */
function updateClimateControlData(hvacData) {
	//console.log('Hey updateClimateControlData got called!');

	if (hvacData == null) {
		console.warn('Unable to update' & HVAC_UPDATE &  '. The input data was NULL. ');
	} else {
		//AC Switch
		onAirConditioningSettingChange(hvacData);

		//SYNC Switch
		onSyncSettingChange(hvacData);

		// Rear defrost
		onRearDefrostSettingChange(hvacData);

		// Fan speed
		if (hvacData.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_SPEED_L) || hvacData.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_SPEED_R)) {
			onFanSpeedChange(hvacData);
		}

		// Temperature
		if (hvacData.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_TEMP_L) || hvacData.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_TEMP_R)) {
			onFanTemperatureChange(hvacData);
		}

		// Fan setting
		if (hvacData.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_SETTING_L) || hvacData.hasOwnProperty(CLIMATE_CONTROL.HVAC_FAN_SETTING_R)) {
			onFanSettingChange(hvacData);
		}

		// Heated seat
		onHeatedSeatLevelChange({
			event : CLIMATE_CONTROL.HVAC_HEATED_SEAT_LEVEL_L,
			data : hvacData[CLIMATE_CONTROL.HVAC_HEATED_SEAT_LEVEL_L]
		});
		onHeatedSeatLevelChange({
			event : CLIMATE_CONTROL.HVAC_HEATED_SEAT_LEVEL_R,
			data : hvacData[CLIMATE_CONTROL.HVAC_HEATED_SEAT_LEVEL_R]
		});

	}
}

