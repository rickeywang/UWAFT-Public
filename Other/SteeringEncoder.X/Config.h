/* 
 * File:   Config.h
 * Author: Brandon E. Walton
 *
 * Created on August 13, 2014, 3:18 PM
 */

#ifndef CONFIG_H
#define	CONFIG_H

#include <pic16f1826.h>

#ifdef	__cplusplus
extern "C" {
#endif

#define ClockSpeed_Hz 16000000

#define TRIS_EncoderBit0 TRISAbits.TRISA7
#define OUT_EncoderBit0  LATAbits.LATA7
#define IN_EncoderBit0   PORTAbits.RA7

#define TRIS_EncoderBit1 TRISAbits.TRISA6
#define OUT_EncoderBit1  LATAbits.LATA6
#define IN_EncoderBit1   PORTAbits.RA6

#define TRIS_EncoderBit2 TRISAbits.TRISA4
#define OUT_EncoderBit2  LATAbits.LATA4
#define IN_EncoderBit2   PORTAbits.RA4

#define TRIS_EncoderBit3 TRISAbits.TRISA3
#define OUT_EncoderBit3  LATAbits.LATA3
#define IN_EncoderBit3   PORTAbits.RA3

#define TRIS_EncoderBit4 TRISAbits.TRISA2
#define OUT_EncoderBit4  LATAbits.LATA2
#define IN_EncoderBit4   PORTAbits.RA2

#define TRIS_EncoderBit5 TRISAbits.TRISA1
#define OUT_EncoderBit5  LATAbits.LATA1
#define IN_EncoderBit5   PORTAbits.RA1

#define TRIS_EncoderBit6 TRISAbits.TRISA0
#define OUT_EncoderBit6  LATAbits.LATA0
#define IN_EncoderBit6   PORTAbits.RA0

#define TRIS_EncoderBit7 TRISBbits.TRISB0
#define OUT_EncoderBit7  LATBbits.LATB0
#define IN_EncoderBit7   PORTBbits.RB0

#ifdef	__cplusplus
}
#endif

#endif	/* CONFIG_H */

