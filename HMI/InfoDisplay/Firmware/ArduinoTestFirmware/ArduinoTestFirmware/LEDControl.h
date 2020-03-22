/*
 * LEDControl.h
 *
 * Created: 19/07/2015 6:11:00 PM
 *  Author: Brandon E. Walton
 */ 

#include "sam.h"

#ifndef LEDCONTROL_H_
#define LEDCONTROL_H_

void SetupLEDs();
void ExecutePowerOnPattern();
void ExecuteTestPattern();
void UpdateLEDs();


//
// LED Pin Definitions
//

// LED Ready (RGB)
#define LED_Ready_R PIO_PB2
#define LED_Ready_G PIO_PB0
#define LED_Ready_B PIO_PB1
#define LED_Ready_R_Bank PIOB
#define LED_Ready_G_Bank PIOB
#define LED_Ready_B_Bank PIOB

// LED Hybrid (RGB)
#define LED_Hybrid_R PIO_PB20
#define LED_Hybrid_G PIO_PB4
#define LED_Hybrid_B PIO_PB3
#define LED_Hybrid_R_Bank PIOB
#define LED_Hybrid_G_Bank PIOB
#define LED_Hybrid_B_Bank PIOB

// LED Charging (RGB)
#define LED_Charging_R PIO_PB21
#define LED_Charging_G PIO_PB17
#define LED_Charging_B PIO_PB18
#define LED_Charging_R_Bank PIOB
#define LED_Charging_G_Bank PIOB
#define LED_Charging_B_Bank PIOB

// LED Energized (RGB)
#define LED_Energized_R PIO_PB12
#define LED_Energized_G PIO_PA3
#define LED_Energized_B PIO_PA2
#define LED_Energized_R_Bank PIOB
#define LED_Energized_G_Bank PIOA
#define LED_Energized_B_Bank PIOA

// LED Braking (RGB)
#define LED_Braking_R PIO_PA6
#define LED_Braking_G PIO_PA22
#define LED_Braking_B PIO_PA23
#define LED_Braking_R_Bank PIOA
#define LED_Braking_G_Bank PIOA
#define LED_Braking_B_Bank PIOA

// LED Fuel (RGB)
#define LED_Fuel_R PIO_PA24
#define LED_Fuel_G PIO_PB5
#define LED_Fuel_B PIO_PB7
#define LED_Fuel_R_Bank PIOA
#define LED_Fuel_G_Bank PIOB
#define LED_Fuel_B_Bank PIOB

// LED Motor 1 (RGB)
#define LED_Motor1_R PIO_PB9
#define LED_Motor1_G PIO_PB11
#define LED_Motor1_B PIO_PB14
#define LED_Motor1_R_Bank PIOB
#define LED_Motor1_G_Bank PIOB
#define LED_Motor1_B_Bank PIOB

// LED Motor 2 (RGB)
#define LED_Motor2_R PIO_PB10
#define LED_Motor2_G PIO_PA10
#define LED_Motor2_B PIO_PA9
#define LED_Motor2_R_Bank PIOB
#define LED_Motor2_G_Bank PIOA
#define LED_Motor2_B_Bank PIOA

// LED Engine (RGB)
#define LED_Engine_R PIO_PA7
#define LED_Engine_G PIO_PA5
#define LED_Engine_B PIO_PA17
#define LED_Engine_R_Bank PIOA
#define LED_Engine_G_Bank PIOA
#define LED_Engine_B_Bank PIOA

// LED Battery (RGB)
#define LED_Battery_R PIO_PA4
#define LED_Battery_G PIO_PA19
#define LED_Battery_B PIO_PA20
#define LED_Battery_R_Bank PIOA
#define LED_Battery_G_Bank PIOA
#define LED_Battery_B_Bank PIOA

// LED Clutch (RGB)
#define LED_Clutch_R PIO_PB15
#define LED_Clutch_G PIO_PB16
#define LED_Clutch_B PIO_PA18
#define LED_Clutch_R_Bank PIOB
#define LED_Clutch_G_Bank PIOB
#define LED_Clutch_B_Bank PIOA

// LED Logging (RGB)
#define LED_Logging_R PIO_PB26
#define LED_Logging_G PIO_PA13
#define LED_Logging_B PIO_PA11
#define LED_Logging_R_Bank PIOB
#define LED_Logging_G_Bank PIOA
#define LED_Logging_B_Bank PIOA

// LED Done (RGB)
#define LED_Done_R PIO_PB13
#define LED_Done_G PIO_PB19
#define LED_Done_B PIO_PA21
#define LED_Done_R_Bank PIOB
#define LED_Done_G_Bank PIOB
#define LED_Done_B_Bank PIOA

// LED Performance (G)
#define LED_Performance PIO_PA14
#define LED_Performance_Bank PIOA

// LED Economy (G)
#define LED_Economy PIO_PA15
#define LED_Economy_Bank PIOA

// LED Fault (R)
#define LED_Fault PIO_PB8
#define LED_Fault_Bank PIOB

// LED Ground (R)
#define LED_Ground PIO_PB22
#define LED_Ground_Bank PIOB

// LED Warning (R)
#define LED_Warning PIO_PB23
#define LED_Warning_Bank PIOB

//
// Test Patterns
//

#define LEDPattern_SequentialRGB_Length 44;

extern Pio* LEDPattern_SequentialRGB_Bank[];
extern unsigned int LEDPattern_SeqeuentialRGB_Pin[];

#define LEDPattern_AllRed_BankA (LED_Ready_R * (LED_Ready_R_Bank == PIOA) | LED_Hybrid_R * (LED_Hybrid_R_Bank == PIOA) \
| LED_Charging_R * (LED_Charging_R_Bank == PIOA) | LED_Energized_R * (LED_Energized_R_Bank == PIOA) \
| LED_Braking_R * (LED_Braking_R_Bank == PIOA) | LED_Fuel_R * (LED_Fuel_R_Bank == PIOA) \
| LED_Motor1_R * (LED_Motor1_R_Bank == PIOA) | LED_Motor2_R * (LED_Motor2_R_Bank == PIOA) \
| LED_Engine_R * (LED_Engine_R_Bank == PIOA) | LED_Battery_R * (LED_Battery_R_Bank == PIOA) \
| LED_Clutch_R * (LED_Clutch_R_Bank == PIOA) | LED_Logging_R * (LED_Logging_R_Bank == PIOA) \
| LED_Done_R * (LED_Done_R_Bank == PIOA))
#define LEDPattern_AllRed_BankB (LED_Ready_R * (LED_Ready_R_Bank == PIOB) | LED_Hybrid_R * (LED_Hybrid_R_Bank == PIOB) \
| LED_Charging_R * (LED_Charging_R_Bank == PIOB) | LED_Energized_R * (LED_Energized_R_Bank == PIOB) \
| LED_Braking_R * (LED_Braking_R_Bank == PIOB) | LED_Fuel_R * (LED_Fuel_R_Bank == PIOB) \
| LED_Motor1_R * (LED_Motor1_R_Bank == PIOB) | LED_Motor2_R * (LED_Motor2_R_Bank == PIOB) \
| LED_Engine_R * (LED_Engine_R_Bank == PIOB) | LED_Battery_R * (LED_Battery_R_Bank == PIOB) \
| LED_Clutch_R * (LED_Clutch_R_Bank == PIOB) | LED_Logging_R * (LED_Logging_R_Bank == PIOB) \
| LED_Done_R * (LED_Done_R_Bank == PIOB))

#define LEDPattern_AllGreen_BankA (LED_Ready_G * (LED_Ready_G_Bank == PIOA) | LED_Hybrid_G * (LED_Hybrid_G_Bank == PIOA) \
| LED_Charging_G * (LED_Charging_G_Bank == PIOA) | LED_Energized_G * (LED_Energized_G_Bank == PIOA) \
| LED_Braking_G * (LED_Braking_G_Bank == PIOA) | LED_Fuel_G * (LED_Fuel_G_Bank == PIOA) \
| LED_Motor1_G * (LED_Motor1_G_Bank == PIOA) | LED_Motor2_G * (LED_Motor2_G_Bank == PIOA) \
| LED_Engine_G * (LED_Engine_G_Bank == PIOA) | LED_Battery_G * (LED_Battery_G_Bank == PIOA) \
| LED_Clutch_G * (LED_Clutch_G_Bank == PIOA) | LED_Logging_G * (LED_Logging_G_Bank == PIOA) \
| LED_Done_G * (LED_Done_G_Bank == PIOA))
#define LEDPattern_AllGreen_BankB (LED_Ready_G * (LED_Ready_G_Bank == PIOB) | LED_Hybrid_G * (LED_Hybrid_G_Bank == PIOB) \
| LED_Charging_G * (LED_Charging_G_Bank == PIOB) | LED_Energized_G * (LED_Energized_G_Bank == PIOB) \
| LED_Braking_G * (LED_Braking_G_Bank == PIOB) | LED_Fuel_G * (LED_Fuel_G_Bank == PIOB) \
| LED_Motor1_G * (LED_Motor1_G_Bank == PIOB) | LED_Motor2_G * (LED_Motor2_G_Bank == PIOB) \
| LED_Engine_G * (LED_Engine_G_Bank == PIOB) | LED_Battery_G * (LED_Battery_G_Bank == PIOB) \
| LED_Clutch_G * (LED_Clutch_G_Bank == PIOB) | LED_Logging_G * (LED_Logging_G_Bank == PIOB) \
| LED_Done_G * (LED_Done_G_Bank == PIOB))

#define LEDPattern_AllBlue_BankA (LED_Ready_B * (LED_Ready_B_Bank == PIOA) | LED_Hybrid_B * (LED_Hybrid_B_Bank == PIOA) \
| LED_Charging_B * (LED_Charging_B_Bank == PIOA) | LED_Energized_B * (LED_Energized_B_Bank == PIOA) \
| LED_Braking_B * (LED_Braking_B_Bank == PIOA) | LED_Fuel_B * (LED_Fuel_B_Bank == PIOA) \
| LED_Motor1_B * (LED_Motor1_B_Bank == PIOA) | LED_Motor2_B * (LED_Motor2_B_Bank == PIOA) \
| LED_Engine_B * (LED_Engine_B_Bank == PIOA) | LED_Battery_B * (LED_Battery_B_Bank == PIOA) \
| LED_Clutch_B * (LED_Clutch_B_Bank == PIOA) | LED_Logging_B * (LED_Logging_B_Bank == PIOA) \
| LED_Done_B * (LED_Done_B_Bank == PIOA))
#define LEDPattern_AllBlue_BankB (LED_Ready_B * (LED_Ready_B_Bank == PIOB) | LED_Hybrid_B * (LED_Hybrid_B_Bank == PIOB) \
| LED_Charging_B * (LED_Charging_B_Bank == PIOB) | LED_Energized_B * (LED_Energized_B_Bank == PIOB) \
| LED_Braking_B * (LED_Braking_B_Bank == PIOB) | LED_Fuel_B * (LED_Fuel_B_Bank == PIOB) \
| LED_Motor1_B * (LED_Motor1_B_Bank == PIOB) | LED_Motor2_B * (LED_Motor2_B_Bank == PIOB) \
| LED_Engine_B * (LED_Engine_B_Bank == PIOB) | LED_Battery_B * (LED_Battery_B_Bank == PIOB) \
| LED_Clutch_B * (LED_Clutch_B_Bank == PIOB) | LED_Logging_B * (LED_Logging_B_Bank == PIOB) \
| LED_Done_B * (LED_Done_B_Bank == PIOB))

#define LEDPattern_AllSingleColor_BankA (LED_Economy | LED_Performance)
#define LEDPattern_AllSingleColor_BankB (LED_Fault | LED_Ground | LED_Warning)

#define LEDPattern_AllLEDs_BankA (LEDPattern_AllRed_BankA | LEDPattern_AllGreen_BankA | LEDPattern_AllBlue_BankA | LEDPattern_AllSingleColor_BankA)
#define LEDPattern_AllLEDs_BankB (LEDPattern_AllRed_BankB | LEDPattern_AllGreen_BankB | LEDPattern_AllBlue_BankB | LEDPattern_AllSingleColor_BankB)



#endif /* LEDCONTROL_H_ */