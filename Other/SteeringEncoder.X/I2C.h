/* 
 * File:   I2C.h
 * Author: Brandon E. Walton
 *
 * Created on August 26, 2014, 3:44 PM
 */

#ifndef I2C_H
#define	I2C_H

#ifdef	__cplusplus
extern "C" {
#endif

void i2c_init();
void i2c_waitForIdle();
void i2c_start();
void i2c_repStart();
void i2c_stop();
int i2c_read(unsigned char ack);
unsigned char i2c_write(unsigned char i2cWriteData);

#ifdef	__cplusplus
}
#endif

#endif	/* I2C_H */

