
/*
 * File:   I2C.c
 * Author: http://electronics.stackexchange.com/a/55547
 *
 * Created on January 24, 2014, 11:37 PM
 */

#include "I2C.h"
#include <pic16f1826.h>

void i2c_init()
{
    SSP1CON1 = 0x36; // set I2C slave mode, 7 bit address
    SSP1CON2 = 0x00;

    SSP1ADD = (0x01 << 1); // 7 bit address (bits 1-7, not bit 0)

    SSP1STATbits.CKE = 0; // use I2C levels      worked also with '0'
    SSP1STATbits.SMP = 1; // disable slew rate control  worked also with '0'

    PIR1bits.SSP1IF = 0; // clear SSPIF interrupt flag
    PIR2bits.BCL1IF = 0; // clear bus collision flag
}

/******************************************************************************************/

void i2c_waitForIdle()
{
    while ((SSP1CON2 & 0x1F) | SSP1STATbits.R_nW)
    {
    }; // wait for idle and not writing
}

/******************************************************************************************/

void i2c_start()
{
    i2c_waitForIdle();
    SEN = 1;
}

/******************************************************************************************/

void i2c_repStart()
{
    i2c_waitForIdle();
    RSEN = 1;
}

/******************************************************************************************/

void i2c_stop()
{
    i2c_waitForIdle();
    PEN = 1;
}

/******************************************************************************************/

int i2c_read(unsigned char ack)
{
    unsigned char i2cReadData;

    i2c_waitForIdle();

    RCEN = 1;

    i2c_waitForIdle();

    i2cReadData = SSPBUF;

    i2c_waitForIdle();

    if (ack)
    {
        ACKDT = 0;
    }
    else
    {
        ACKDT = 1;
    }
    ACKEN = 1; // send acknowledge sequence

    return ( i2cReadData);
}

/******************************************************************************************/

unsigned char i2c_write(unsigned char i2cWriteData)
{
    i2c_waitForIdle();
    SSPBUF = i2cWriteData;
    //if(ACKSTAT)
    //{
       // while(ACKSTAT);
    //}
    return ( !ACKSTAT); // function returns '1' if transmission is acknowledged
}
