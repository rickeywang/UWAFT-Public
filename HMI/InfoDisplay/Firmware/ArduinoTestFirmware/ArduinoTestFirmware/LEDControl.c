/*
 * LEDControl.c
 *
 * Created: 19/07/2015 6:10:25 PM
 *  Author: Brandon E. Walton
 */ 

#include "LEDControl.h"
#include "Delay.h"

Pio* LEDPattern_SequentialRGB_Bank[] =
{
	LED_Ready_R_Bank,     LED_Ready_G_Bank,     LED_Ready_B_Bank,
	LED_Hybrid_R_Bank,    LED_Hybrid_G_Bank,    LED_Hybrid_B_Bank,
	LED_Charging_R_Bank,  LED_Charging_G_Bank,  LED_Charging_B_Bank,
	LED_Energized_R_Bank, LED_Energized_G_Bank, LED_Energized_B_Bank,
	LED_Braking_R_Bank,   LED_Braking_G_Bank,   LED_Braking_B_Bank,
	LED_Fuel_R_Bank,      LED_Fuel_G_Bank,      LED_Fuel_B_Bank,
	LED_Motor1_R_Bank,    LED_Motor1_G_Bank,    LED_Motor1_B_Bank,
	LED_Motor2_R_Bank,    LED_Motor2_G_Bank,    LED_Motor2_B_Bank,
	LED_Engine_R_Bank,    LED_Engine_G_Bank,    LED_Engine_B_Bank,
	LED_Battery_R_Bank,   LED_Battery_G_Bank,   LED_Battery_B_Bank,
	LED_Clutch_R_Bank,    LED_Clutch_G_Bank,    LED_Clutch_B_Bank,
	LED_Logging_R_Bank,   LED_Logging_G_Bank,   LED_Logging_B_Bank,
	LED_Done_R_Bank,      LED_Done_G_Bank,      LED_Done_B_Bank,
	LED_Performance_Bank,
	LED_Economy_Bank,
	LED_Fault_Bank,
	LED_Ground_Bank,
	LED_Warning_Bank
};

unsigned int LEDPattern_SeqeuentialRGB_Pin[] =
{
	LED_Ready_R,     LED_Ready_G,     LED_Ready_B,
	LED_Hybrid_R,    LED_Hybrid_G,    LED_Hybrid_B,
	LED_Charging_R,  LED_Charging_G,  LED_Charging_B,
	LED_Energized_R, LED_Energized_G, LED_Energized_B,
	LED_Braking_R,   LED_Braking_G,   LED_Braking_B,
	LED_Fuel_R,      LED_Fuel_G,      LED_Fuel_B,
	LED_Motor1_R,    LED_Motor1_G,    LED_Motor1_B,
	LED_Motor2_R,    LED_Motor2_G,    LED_Motor2_B,
	LED_Engine_R,    LED_Engine_G,    LED_Engine_B,
	LED_Battery_R,   LED_Battery_G,   LED_Battery_B,
	LED_Clutch_R,    LED_Clutch_G,    LED_Clutch_B,
	LED_Logging_R,   LED_Logging_G,   LED_Logging_B,
	LED_Done_R,      LED_Done_G,      LED_Done_B,
	LED_Performance,
	LED_Economy,
	LED_Fault,
	LED_Ground,
	LED_Warning
};


// Sets up the LED PIO registers, configuring the pins as outputs
void SetupLEDs()
{
	// Set as output, disable pullups and enable for bank A
	PIOA->PIO_OER = LEDPattern_AllLEDs_BankA;
	PIOA->PIO_PUDR = LEDPattern_AllLEDs_BankA;
	PIOA->PIO_PER = LEDPattern_AllLEDs_BankA;
	PIOA->PIO_CODR = LEDPattern_AllLEDs_BankA;
	
	// Set as output, disable pullups and enable for bank B
	PIOB->PIO_OER = LEDPattern_AllLEDs_BankB;
	PIOB->PIO_PUDR = LEDPattern_AllLEDs_BankB;
	PIOB->PIO_PER = LEDPattern_AllLEDs_BankB;
	PIOB->PIO_CODR = LEDPattern_AllLEDs_BankB;
}

// Executes the power on test pattern, cycling all R, G, B leds independently
void ExecutePowerOnPattern()
{
	// Enable the single color LEDs
	PIOA->PIO_SODR = LEDPattern_AllSingleColor_BankA;
	PIOB->PIO_SODR = LEDPattern_AllSingleColor_BankB;
	
	// Enable and Disable Red
	PIOA->PIO_SODR = LEDPattern_AllRed_BankA;
	PIOB->PIO_SODR = LEDPattern_AllRed_BankB;
	Delay(1000);
	PIOA->PIO_CODR = LEDPattern_AllRed_BankA;
	PIOB->PIO_CODR = LEDPattern_AllRed_BankB;
	
	// Enable and Disable Green
	PIOA->PIO_SODR = LEDPattern_AllGreen_BankA;
	PIOB->PIO_SODR = LEDPattern_AllGreen_BankB;
	Delay(1000);
	PIOA->PIO_CODR = LEDPattern_AllGreen_BankA;
	PIOB->PIO_CODR = LEDPattern_AllGreen_BankB;
	
	// Enable and Disable Blue
	PIOA->PIO_SODR = LEDPattern_AllBlue_BankA;
	PIOB->PIO_SODR = LEDPattern_AllBlue_BankB;
	Delay(1000);
	PIOA->PIO_CODR = LEDPattern_AllBlue_BankA;
	PIOB->PIO_CODR = LEDPattern_AllBlue_BankB;
	
	// Disable the single color LEDs
	
}