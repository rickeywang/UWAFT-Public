/*
 * Delay.c
 *
 * Basic routines for blocking delays.
 *
 * Created: 19/07/2015 8:55:24 PM
 *  Author: Brandon E. Walton
 */ 

#include "Delay.h"

unsigned long TimeConstant = 84000000ul / 4;

// Delay for the given number of milliseconds.
void Delay(unsigned int milliseconds)
{
	unsigned long TotalCycles = (TimeConstant / 1000) * milliseconds;
	
	for (unsigned long i = 0; i < TotalCycles; i++);	
}