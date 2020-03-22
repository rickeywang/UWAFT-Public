#include "Config.h"
#include "Encoder.h"

int ReadEncoderValue()
{
    int value = 0;

    value |= IN_EncoderBit0 << 0;
    value |= IN_EncoderBit1 << 1;
    value |= IN_EncoderBit2 << 2;
    value |= IN_EncoderBit3 << 3;
    value |= IN_EncoderBit4 << 4;
    value |= IN_EncoderBit5 << 5;
    value |= IN_EncoderBit6 << 6;
    value |= IN_EncoderBit7 << 7;

    return value;
}
