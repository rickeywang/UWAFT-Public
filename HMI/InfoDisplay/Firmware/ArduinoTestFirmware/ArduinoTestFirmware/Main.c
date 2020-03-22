/*
 * ArduinoTestFirmware.c
 *
 * Created: 18/07/2015 10:09:33 PM
 *  Author: Brandon E. Walton
 */ 

#include <sam.h>
#include <stdbool.h>

#include "LEDControl.h"
#include "Delay.h"

/**
 * \brief Application entry point.
 */
int main(void)
{
	// Fire it up (Take 12MHz source and PLL up to 84MHz)
    SystemInit();
	
	// Disable the watchdog timer
	WDT->WDT_MR = WDT_MR_WDDIS;
	
	// Enable PIOA, PIOB, TC0 clocking
	PMC->PMC_PCER0 = PMC_PCER0_PID11 | PMC_PCER0_PID12 | PMC_PCER0_PID27;
	
	// Enable pin PB27
	PIOB->PIO_PER = PIO_PB27;
	
	// Set PB27 as an output
	PIOB->PIO_OER = PIO_PB27;
	
	// Disable PB27 pull-up
	PIOB->PIO_PUDR = PIO_PB27;
	
	SetupLEDs();
	
	while (true)
	{
		//LEDPattern_SequentialRGB_Bank[0]->PIO_SODR = LEDPattern_SeqeuentialRGB_Pin[0];
		PIOB->PIO_SODR = PIO_PB27;
		Delay(500);
		
		//LEDPattern_SequentialRGB_Bank[0]->PIO_CODR = LEDPattern_SeqeuentialRGB_Pin[0];
		PIOB->PIO_CODR = PIO_PB27;
		Delay(500);
	}
}
