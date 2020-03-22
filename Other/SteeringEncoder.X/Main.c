/* 
 * File:   Main.c
 * Author: Brandon E. Walton
 *
 * Created on August 13, 2014, 3:06 PM
 */

#include <pic16f1826.h>
#include "Config.h"
#include "I2C.h"
#include "Encoder.h"

/*
 * 
 */
int main()
{
    // Select the built in 16 MHz oscillator
    OSCCONbits.IRCF = 0b1111;

    // Select 512 ms watchdog timer window
    WDTCONbits.SWDTEN = 0b0;
    WDTCONbits.WDTPS = 0b01001;

    TRIS_EncoderBit0 = 1;
    TRIS_EncoderBit1 = 1;
    TRIS_EncoderBit2 = 1;
    TRIS_EncoderBit3 = 1;
    TRIS_EncoderBit4 = 1;
    TRIS_EncoderBit5 = 1;
    TRIS_EncoderBit6 = 1;
    TRIS_EncoderBit7 = 1;

    unsigned int grinder = 0;

    i2c_init();

    while (1)
    {
        asm("CLRWDT");

        i2c_start();
        i2c_write(ReadEncoderValue());
        i2c_stop();

        while (grinder < 10000) grinder++;
        grinder = 0;
    }

    return 0;
}

